import cryptoJs from 'crypto-js';

import ApiLogger from '../common/logger';

import * as db from '../common/db';
import { IUser, IUserQuery, VerificationMethod } from './users.models';
import DummyDb from '../common/db.dummy';

import { parseBoolean } from '../common/config';
const testingData = parseBoolean(process.env.API_TESTING_DATA);


export default class UserDataBus {

  /**
   * 
   * Returns a list of users that matches the provided user attributes.
   *
   * 
   * @param queryData: UserQuery - Search parameters that a user needs to match.
   * 
   * @returns User[] - A list of Users fully matching the provided query data.
   * 
   */
  static find = async (queryData: IUserQuery) => {
    const uQ = `SELECT * FROM users WHERE data @> '${JSON.stringify(queryData)}';`;
    return db.query(uQ);
  };

  static findById = async (userId: string): Promise<IUser[]> => {
    if (testingData) {
      ApiLogger.info('Using dummy data for request ...');
      return DummyDb.loadUserById(userId);
    }
    return this.find({ id: userId }).then((result) => {
      if (result.rowCount < 1) {
        ApiLogger.info(`No rows found with user ID '${userId}'`);
        return [];
      }
      const returnedUsers: IUser[] = result.rows.map((row) => {
        return JSON.parse(row.data) as IUser; 
      });
      return returnedUsers;
    });
  };

  static findByEmail = async (email: string): Promise<IUser[]> => {
    if (testingData) {
      ApiLogger.info('Using dummy data for request ...');
      return DummyDb.loadUserByEmail(email);
    }
    return this.find({ verification: { method: VerificationMethod.EMAIL, value: email } }).then((result) => {
      if (result.rowCount < 1) {
        ApiLogger.info(`No rows found with email '${email}'`);
        return [];
      }
      const returnedUsers: IUser[] = result.rows.map((row) => {
        return JSON.parse(row.data) as IUser;
      });
      return returnedUsers;
    });
  };

  static findByUsername = async (username: string): Promise<IUser[]> => {
    if (testingData) {
      ApiLogger.info('Using dummy data for request ...');
      return DummyDb.loadUserByUsername(username);
    }
    return this.find({ username: username }).then((result) => {
      if (result.rowCount < 1) {
        ApiLogger.info(`No rows found with username '${username}'`);
        return [];
      }
      const returnedUsers: IUser[] = result.rows.map((row) => {
        return JSON.parse(row.data) as IUser;
      });
      return returnedUsers;
    });
  };

  static generateUserId = (userData: IUser) => {
    const rawIdData = `${userData.username}::${userData.verification.value}`;
    const idHash = cryptoJs.HmacSHA256(rawIdData, userData.authKey);
    return idHash.toString();
  };

  static createUser = async (userData: IUser) => {
    userData.id = this.generateUserId(userData);
    if (testingData) {
      ApiLogger.info('Using dummy data for request ...');
      DummyDb.saveUser(userData);
      return userData;
    }
    const uQ = `INSERT INTO users (data) VALUES ('${JSON.stringify(userData)}');`;
    return db.query(uQ).then(() => { return userData; });
  };

  static patchUser = async (userId: string, userData: IUser) => {
    const queryStr = `${userId}${userData}`;
    return db.query(queryStr).then(() => { return true; });
  };

  static removeById = async (userId: string) => {
    const queryStr = `${userId}`;
    return db.query(queryStr).then(() => { return true; });
  };

}
