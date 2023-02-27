import { FieldDef } from 'pg';
import cryptoJs from 'crypto-js';
import * as db from '../common/db';
import { UserQuery, User, VerificationMethod } from './users.model';
import ApiLogger from '../common/logger';

export default class UserDataBus {
  
  static find = async (queryData: UserQuery) => {
    const uQ = `SELECT * FROM users WHERE data @> '${JSON.stringify(queryData)}';`;
    return db.query(uQ);
  }

  static getColumnIndexByName = (name: string, fields: Array<FieldDef>): number => {
    let index = -1;
    fields.forEach((value: FieldDef, currentIndex: number) => {
      if (index > -1) return;
      if (value.name === name) {
        index = currentIndex;
      }
    });
    return index;
  }

  static findById = async (userId: string): Promise<User[]> => {
    return this.find({ id: userId }).then((result) => {
      if (result.rowCount < 1) return [];
      const returnedUsers: User[] = [];
      const dataIndex = this.getColumnIndexByName('data', result.fields);
      result.rows.forEach((value) => {
        if (value.length > dataIndex) {
          const currentUser = JSON.parse(value[dataIndex]) as User;
          returnedUsers.push(currentUser);
        }
      });
      return returnedUsers;
    });
  }

  static findByEmail = async (email: string): Promise<User[]> => {
    return this.find({ verification: { method: VerificationMethod.EMAIL, value: email } }).then((result) => {
      if (result.rowCount < 1) return [];
      const returnedUsers: User[] = [];
      const dataIndex = this.getColumnIndexByName('data', result.fields);
      result.rows.forEach((value) => {
        if (value.length > dataIndex) {
          const currentUser = JSON.parse(value[dataIndex]) as User;
          returnedUsers.push(currentUser);
        }
      });
      return returnedUsers;
    });
  }

  static findByUsername = async (username: string): Promise<User[]> => {
    return this.find({ username: username }).then((result) => {
      if (result.rowCount < 1) {
        ApiLogger.info(`No rows found with username '${username}'`);
        return [];
      }
      const returnedUsers: User[] = [];
      result.rows.forEach((value) => {
        // ApiLogger.info(JSON.stringify(value));
        // ApiLogger.info(`data indexed at ${dataIndex}; data: ${value.data}`);
        const currentUser = value.data as User;
        returnedUsers.push(currentUser);
      });
      return returnedUsers;
    });
  }

  static generateUserId = (userData: User) => {
    const rawIdData = `${userData.username}::${userData.verification.value}`;
    const idHash = cryptoJs.HmacSHA256(rawIdData, userData.authKey);
    return idHash.toString();
  }

  static createUser = async (userData: User) => {
    userData.id = this.generateUserId(userData);
    const uQ = `INSERT INTO users (data) VALUES ('${JSON.stringify(userData)}');`;
    return db.query(uQ).then(() => { return userData; });
  }

  static patchUser = async (userId: string, userData: User) => {
    return userData;
    // TODO: Create the method for editing and patching a user.
  }

  static removeById = async (userId: string) => {
    return userId === userId;
    // TODO: Create the method for deleting a user.
  }
}
