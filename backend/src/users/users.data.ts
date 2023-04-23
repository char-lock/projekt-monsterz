import { PrismaClient } from "@prisma/client";
import { NewUser } from "./users.types";

export default class UsersData {

  static prisma = new PrismaClient();

  static getUserById(userId: number) {
    return UsersData.prisma.user.findFirstOrThrow({ where: { id: userId } })
      .then((result) => {
        return result;
      })
      .catch((reject) => {
        if (reject.code === 'P2025') {
          console.log(`user with id ${userId} not found`);
          return undefined;
        }
        throw(reject);
      });
  }

  static getUserByUsername(username: string) {
    return UsersData.prisma.user.findFirstOrThrow({ where: { username: username } })
      .then((result) => {
        return result;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          console.log(`user with username ${username} not found`);
          return undefined;
        }
        throw(reject);
      })
  }

  static getUsersByValidationValue(value: string) {
    return UsersData.prisma.user.findMany({ where: { validation_value: value } })
      .then((result) => {
        return result;
      });
  }

  static createUser(user: NewUser) {
    return UsersData.prisma.user.create({ data: user })
      .then((result) => {
        return result;
      })
      .catch((reject) => {
        throw(reject);
      });
  }

  static deleteUserById(userId: number) {
    return UsersData.prisma.user.delete({ where: { id: userId } })
      .then((deletedUser) => {
        return deletedUser;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          console.log(`user with userId ${userId} not found`);
          return undefined;
        }
        throw(reject);
      });
  }

}
