import { User } from "./User";

interface UserSession {
  currentToken: string,
  currentUser: User
}

export { UserSession };
