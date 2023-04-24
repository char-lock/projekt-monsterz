import { User } from "./api.types";

interface UserSession {
  currentToken: string,
  currentUser: User | undefined
}

export { UserSession };
