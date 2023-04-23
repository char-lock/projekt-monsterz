import { getRandomValues } from "crypto";

function generateJwtSecret() {
  const secretSeed = new Uint8Array(64);
  getRandomValues(secretSeed);
  let secret = "";
  for (let i = 0; i < secretSeed.length; i++) {
    secret += secretSeed[i].toString(16);
  }
  return secret;
}

export const config = {
  jwtSecret: generateJwtSecret()
};
