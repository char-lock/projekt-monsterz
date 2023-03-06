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

export interface IUserVerificationData {
  verified: boolean;
  method: VerificationMethod;
  value: string;
}

export interface IUserVerificationQuery {
  verified?: boolean;
  method?: VerificationMethod;
  value?: string;
}

export interface IUserQuery {
  id?: string;
  username?: string;
  authKey?: string;
  role?: UserRole;
  verification?: IUserVerificationQuery;
}

export interface IUser {
  id: string;
  username: string;
  authKey: string;
  role: UserRole;
  verification: IUserVerificationData;
}
