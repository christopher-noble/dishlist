import {
  GetRecipeUploadTargetDocument,
  type GetRecipeUploadTargetMutation,
  type GetRecipeUploadTargetMutationVariables,
} from '@/src/shared/api/generated/graphql';
import { apolloClient } from '@/src/shared/api/apollo-client';
import {
  synchronizeAccessTokenWithSession,
} from '@/src/features/auth/services/auth-session.service';
import { accessTokenStore } from '@/src/features/auth/storage/access-token-store';

export interface RecipeImageUploadInput {
  uri: string;
  fileName: string;
  fileType: string;
}

function isRecipeServiceLocalUploadUrl(uploadUrl: string): boolean {
  try {
    const { pathname } = new URL(uploadUrl);
    return pathname.startsWith('/api/uploads/');
  } catch {
    return uploadUrl.includes('/api/uploads/');
  }
}

async function resolveAuthorizationHeader(): Promise<string | null> {
  let accessToken = accessTokenStore.getValidAccessToken();

  if (!accessToken) {
    const refreshed = await synchronizeAccessTokenWithSession();
    accessToken = refreshed ? accessTokenStore.getValidAccessToken() : null;
  }

  return accessToken ? `Bearer ${accessToken}` : null;
}

async function readUploadBody(uri: string): Promise<Blob> {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error('Failed to read the selected image');
  }

  return response.blob();
}

/**
 * Direct-upload flow (binary never touches GraphQL):
 * 1. getRecipeUploadTarget → presigned S3 PUT URL + imageKey
 * 2. HTTP PUT file bytes to uploadUrl (S3 or local-dev fallback)
 * 3. Return imageKey for createRecipe / updateRecipe mutations
 */
export async function uploadRecipeImage(
  input: RecipeImageUploadInput,
): Promise<string> {
  const { data, errors } = await apolloClient.mutate<
    GetRecipeUploadTargetMutation,
    GetRecipeUploadTargetMutationVariables
  >({
    mutation: GetRecipeUploadTargetDocument,
    variables: {
      fileName: input.fileName,
      fileType: input.fileType,
    },
  });

  if (errors?.length) {
    throw new Error(errors[0]?.message ?? 'Failed to request an upload target');
  }

  const uploadTarget = data?.getRecipeUploadTarget;

  if (!uploadTarget) {
    throw new Error('Upload target was not returned by the API');
  }

  const body = await readUploadBody(input.uri);
  const uploadHeaders: Record<string, string> = {
    'Content-Type': input.fileType,
  };

  // Presigned S3 URLs must not receive Authorization — it invalidates the signature.
  if (isRecipeServiceLocalUploadUrl(uploadTarget.uploadUrl)) {
    const authorization = await resolveAuthorizationHeader();

    if (!authorization) {
      throw new Error('Authentication required for local media upload');
    }

    uploadHeaders.Authorization = authorization;
  }

  const uploadResponse = await fetch(uploadTarget.uploadUrl, {
    method: 'PUT',
    headers: uploadHeaders,
    body,
  });

  if (!uploadResponse.ok) {
    const responseText = await uploadResponse.text().catch(() => '');
    throw new Error(
      responseText || `Image upload failed with status ${uploadResponse.status}`,
    );
  }

  return uploadTarget.imageKey;
}
