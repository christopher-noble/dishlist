import { exportJWK, generateKeyPair, importPKCS8, importSPKI } from 'jose';
import type { JWK } from 'jose';

import { appConfig } from '../../../../config/config.default.js';

const KEY_ID = 'dishlist-access-token-v1';

type SigningKeyMaterial = {
  kid: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  publicJwk: JWK;
};

let cachedKeyMaterial: SigningKeyMaterial | null = null;

async function loadOrGenerateKeyMaterial(): Promise<SigningKeyMaterial> {
  if (cachedKeyMaterial) {
    return cachedKeyMaterial;
  }

  const { privateKeyPem, publicKeyPem } = appConfig.jwt;

  let privateKey: CryptoKey;
  let publicKey: CryptoKey;

  if (privateKeyPem && publicKeyPem) {
    privateKey = await importPKCS8(privateKeyPem, 'RS256');
    publicKey = await importSPKI(publicKeyPem, 'RS256');
  } else if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_PRIVATE_KEY_PEM and JWT_PUBLIC_KEY_PEM are required in production',
    );
  } else {
    const generated = await generateKeyPair('RS256');
    privateKey = generated.privateKey;
    publicKey = generated.publicKey;
    console.warn(
      '[jwt] Using ephemeral RS256 keys for development. Set JWT_PRIVATE_KEY_PEM / JWT_PUBLIC_KEY_PEM for stable keys.',
    );
  }

  const publicJwk = await exportJWK(publicKey);
  publicJwk.kid = KEY_ID;
  publicJwk.alg = 'RS256';
  publicJwk.use = 'sig';

  cachedKeyMaterial = {
    kid: KEY_ID,
    privateKey,
    publicKey,
    publicJwk,
  };

  return cachedKeyMaterial;
}

export async function getJwtSigningKeyMaterial(): Promise<SigningKeyMaterial> {
  return loadOrGenerateKeyMaterial();
}

export async function buildJwksDocument(): Promise<{ keys: JWK[] }> {
  const material = await getJwtSigningKeyMaterial();
  return { keys: [material.publicJwk] };
}
