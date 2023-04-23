export enum ValidationMethod {
  UNKNOWN = -1,
  EMAIL = 0,
  EDUCATION_CODE = 1
};

export enum UserType {
  GUEST = -1,
  INDIVIDUAL = 0,
  STUDENT = 1,
  EDUCATOR = 2,
  SUPPORT = 99
}

export type NewUser = {
  username: string;
  user_type: number;
  created_on: string;
  validated: boolean;
  validated_on: string;
  validation_method: number;
  validation_value: string;
  progress_lesson: number;
  progress_content: number;
}
