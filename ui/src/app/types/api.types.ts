export type ApiResponse = {
  statusCode: number,
  statusShortDesc: string,
  statusLongDesc: string,
  data?: any
};

enum UserType {
  GUEST = -1,
  INDIVIDUAL = 0,
  STUDENT = 1,
  EDUCATOR = 2,
  SUPPORT = 99
};

enum ValidationMethod {
  UNKNOWN = -1,
  EMAIL = 0,
  EDUCATION_CODE = 1
};

export type User = {
  id: number;
  username: string;
  user_type: UserType;
  created_on: string;
  validated: boolean;
  validated_on: string;
  validation_method: ValidationMethod;
  validation_value: string;
  progress_lesson: number;
  progress_content: number;
};

export type NewUser = {
  username: string;
  password: string;
  validation_method: number;
  validation_value: string;
};
