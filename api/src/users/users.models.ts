export enum VerifyMethod {
  EMAIL = 0,
  EDUCATOR_CODE
}

export type UserModel = {
  id: string,         // User ID is generated via an MD5 hash of their username and verification method.
  username: string,
  verified: boolean,
  verifyMethod: VerifyMethod,
  verifyValue: string
}
