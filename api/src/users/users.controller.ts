import { Request, Response } from 'express';
import md5 from 'crypto-js/md5';
import ApiLogger from '../common/logger';
import { UserModel } from './users.models';
import { fetchUser, saveUser } from './users.data';

/** Returns a generated user ID based upon the provided information. */
const generateUserId = (username: string, verifyValue: string) => {
  const checksumString = `${username}::${verifyValue}`;
  const checksumDigest = md5(`${checksumString}::${checksumString.length}`).toString();
  const hashDigest = md5(`${checksumString}::${checksumDigest.substring(checksumDigest.length - 4)}`);
  return hashDigest.toString();
}

class UsersController {

  /** Returns a user from the database as a part of the response. */
  static getUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    ApiLogger.info(`Received new GET request for user with ID ${userId}`);
    const user = await fetchUser(userId);
    res.send(user);
  };

  /** Saves a user to the database and returns the user object as part of the response. */
  static postUser = async (req: Request, res: Response) => {
    ApiLogger.info(`Received new POST request for a user`);
    const { username, verifyType, verifyValue } = req.body;
    // TODO: Verify that the username is unique.
    // TODO: Verify that the email is unique, if the type is email.
    // TODO: Verify that the educator code is valid.
    const userId = generateUserId(username, verifyValue);
    const newUser: UserModel = {
      id: userId,
      username: username,
      verified: false, // TODO: How we handle this might change in the future.
      verifyMethod: verifyType,
      verifyValue: verifyValue
    };
    saveUser(newUser).then(() => {
      res.status(201).send(newUser);
    })
  };

}

export default UsersController;
