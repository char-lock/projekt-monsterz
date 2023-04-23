import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, getRandomValues } from "crypto";

export default class AuthData {

  static prisma = new PrismaClient();

  static hashPassword(password: string) {
    const saltValues = new Uint8Array(12);
    getRandomValues(saltValues);
    const salt = "";
    saltValues.forEach((value) => value.toString(16))
    const hashed = pbkdf2Sync(password, salt, 96000, 512, "sha512");
    return `${salt}$${hashed.toString("hex")}`;
  }

  static createAuthEntry(userId: number, password: string) {
    password = AuthData.hashPassword(password);
    return AuthData.prisma.userAuth.create({ 
      data: { 
        user_id: userId, 
        auth_key: password, 
        changed_on: Date.now().toString() 
      } 
    })
      .then((_) => {
        return true;
      })
      .catch((reject) => {
        throw(reject);
      });
  }

  static deleteAuthEntry(userId: number) {
    return AuthData.prisma.userAuth.delete({ where: { user_id: userId } })
      .then((_) => {
        return true;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          console.log(`user with userId ${userId} not found`);
          return true;
        }
        throw(reject);
      });
  }

  static getAuthEntry(userId: number) {
    return AuthData.prisma.userAuth.findFirstOrThrow({where: { user_id: userId } })
      .then((response) => {
        return response;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          console.log(`user with userId ${userId} not found`);
          return undefined;
        }
        throw (reject);
      });
  }

}
