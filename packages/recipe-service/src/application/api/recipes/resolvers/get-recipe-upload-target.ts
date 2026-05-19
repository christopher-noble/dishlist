import { createUploadTarget } from '../../../../infrastructure/media/asset-storage.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface GetRecipeUploadTargetResolverArgs {
  fileName: string;
  fileType: string;
}

export const getRecipeUploadTargetResolver = {
  async getRecipeUploadTarget(
    _: unknown,
    args: GetRecipeUploadTargetResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);

    return createUploadTarget(userId, args.fileName, args.fileType);
  },
};
