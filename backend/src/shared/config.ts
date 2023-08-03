import * as crypto from "crypto";

function generateJwtSecret() {
  const secretSeed = new Uint8Array(64);
  crypto.webcrypto.getRandomValues(secretSeed);
  return Array.from(secretSeed)
    .map((value) => { return value.toString(16); })
    .join("");
}

export const config = {
  debugMode: true,
  enableHttp: true,
  enableHttps: false,
  httpPort: 9696,
  httpsPort: 8888,
  jwtSecret: generateJwtSecret()
};
