export enum VerificationMethod {
  EMAIL = 1,
  EDUCATOR_CODE
}

export enum UserRole {
  INDIVIDUAL = 1,
  STUDENT,
  EDUCATOR,
  ADMIN
}

export interface UserVerificationData {
  verified: boolean;
  method: VerificationMethod;
  value: string;
}

export interface UserVerificationQuery {
  verified?: boolean;
  method?: VerificationMethod;
  value?: string;
}

export interface UserQuery {
  id?: string;
  username?: string;
  authKey?: string;
  role?: UserRole;
  verification?: UserVerificationQuery;
}

export interface User {
  id: string;
  username: string;
  authKey: string;
  role: UserRole;
  verification: UserVerificationData;
}
