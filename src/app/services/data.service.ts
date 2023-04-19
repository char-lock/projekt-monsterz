import { Injectable, OnDestroy } from "@angular/core";
import { PrismaClient, User } from "@prisma/client";
import { pbkdf2 } from "crypto";

/**
 * Angular Service for handling generic database requests.
 */

@Injectable()
export class DataBusService implements OnDestroy {

  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async ngOnDestroy() {
    await this.prisma.$disconnect();
  }

  getUserById(userId: number) {
    let foundUser: User | undefined;
    let finished = false;
    this.prisma.user.findFirstOrThrow({ where: { id: userId } })
      .then((result) => {
        foundUser = result;
        finished = true;
      })
      .catch((reject) => {
        console.log("debug: failed to get user by id - data.service.ts");
        console.log(reject);
        finished = true;
      });
    // Blocking return until the results are available or timeout
    const startTime = Date.now();
    while (!finished) {
      if (Date.now() - startTime >= 30000) {
        console.log("get user by id timed out");
        finished = true;
      }
    }
    return foundUser;
  }

  getUserByUsername(username: string) {
    let foundUser: User | undefined;
    let finished = false;
    this.prisma.user.findFirstOrThrow({ where: { username: username } })
      .then((result) => {
        foundUser = result;
        finished = true;
      })
      .catch((reject) => {
        console.log("debug: failed to get user by id - data.service.ts");
        console.log(reject);
        finished = true;
      });
    // Blocking return until the results are available or timeout
    const startTime = Date.now();
    while (!finished) {
      if (Date.now() - startTime >= 30000) {
        console.log("get user by username timed out");
        finished = true;
      }
    }
    return foundUser;
  }

  authenticate(username: string, password: string) {
    username = username.toLowerCase();
    const currentUser = this.getUserByUsername(username);
    if (currentUser === undefined) return false;
    let authenticated = false;
    let resolved = false;
    this.prisma.userAuth.findFirstOrThrow({ where: { id: currentUser.id } })
      .then((result) => {
        const auth_key = result.auth_key.split('$');
        pbkdf2(
          `${username}${password}${auth_key[0]}`,
          auth_key[0], 
          620000, 512, 
          'sha512', 
          (err, tryHash) => {
            if (err) {
              console.log(err);
              resolved = true;
              return;
            }
            // Timing-safe comparison
            const secretKey = Buffer.from(auth_key[1]);
            let passes = true;
            if (secretKey.length !== tryHash.length) {
              tryHash = secretKey;
              passes = false;
            }
            for (let i = 0; i < secretKey.length; i++) {
              if (secretKey[i] !== tryHash[i]) passes = false;
            }
            authenticated = passes;
            resolved = true;
        });
      })
      .catch((rejectReason) => {
        console.log(`Unable to authenticate ${username}`);
        console.log(rejectReason);
        resolved = true;
      });
      // Stall until result or timeout
      const startTime = Date.now();
      while (!resolved) {
        if (Date.now() - startTime >= 30000) {
          console.log("Authentication timed out");
          resolved = true;
        }
      }
      return authenticated;
  }

  

}
