import { Request, Response } from 'express';
import md5 from 'crypto-js/md5';
import ApiLogger from '../common/logger';
import { UserModel } from './users.models';
import { dropUserById, patchUserById, fetchUserById, fetchUserByUsername, saveUser, isUniqueUser } from './users.data';
import { defaultBadRequest, defaultCreated, defaultNotExist, defaultSuccess } from '../common/models/response.model';

/** Returns a generated user ID based upon the provided information. */
const generateUserId = (username: string, verifyValue: string) => {
  const checksumString = `${username}::${verifyValue}`;
  const checksumDigest = md5(`${checksumString}::${checksumString.length}`).toString();
  const hashDigest = md5(`${checksumString}::${checksumDigest.substring(checksumDigest.length - 4)}`);
  return hashDigest.toString();
}

class UsersController {

  /** Returns a user from the database as a part of the response. */
  static getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    ApiLogger.info(`Received new GET request for user with ID ${userId}`);
    const user = await fetchUserById(userId);
    if (user) {
      res.status(200).send(defaultSuccess(user));
    } else {
      res.status(404).send(defaultNotExist('Unable to locate user with matching ID.'));
    }
    res.send(defaultSuccess(user));
  };

  /** Returns a user from the database as a part of the response. */
  static getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;
    ApiLogger.info(`Received new GET request for user with username ${username}`);
    const user = await fetchUserByUsername(username);
    if (user) {
      res.status(200).send(defaultSuccess(user));
    } else {
      res.status(404).send(defaultNotExist('Unable to locate user with matching ID.'));
    }
    res.send(defaultSuccess(user));
  };

  /** Saves a user to the database and returns the user object as part of the response. */
  static createUser = async (req: Request, res: Response) => {
    ApiLogger.info(`Received new POST request for a user`);
    const { username, verifyType, verifyValue } = req.body;
    const userId = generateUserId(username, verifyValue);
    const newUser: UserModel = {
      id: userId,
      username: username,
      verified: false, // TODO: How we handle this might change in the future.
      verifyMethod: verifyType,
      verifyValue: verifyValue
    };
    if (await isUniqueUser(newUser)) {
      saveUser(newUser).then(() => {
        res.status(201).send(defaultCreated(newUser, 'Successfully created and saved new user'));
      });
    } else {
      res.status(400).send(defaultBadRequest('Unable to create new user; non-unique values'));
    }
  };

  /** Deletes a specified user from the database. */
  static deleteUser = async (req: Request, res: Response) => {
    ApiLogger.info(`Received new DELETE request for a user`);
    const { userId } = req.params;
    dropUserById(userId).then(() => {
      res.status(200).send(defaultSuccess(null));
    });
  };

  /** Edits a specified user's entry in the database. */
  static editUser = async (req: Request, res: Response) => {
    ApiLogger.info(`Received new PATCH request for a user`);
    const { userId } = req.params;
    const userValues = {
      id: (req.body.userId) ? req.body.userId : '',
      username: (req.body.username) ? req.body.username : '',
      verified: (req.body.verified) ? req.body.verified : false,
      verifyMethod: (req.body.verifyMethod) ? req.body.verifyMethod : 0,
      verifyValue: (req.body.verifyValue) ? req.body.verifyValue : ''
    };
    patchUserById(userId, userValues).then(() => {
      res.status(200).send(defaultSuccess(userValues));
    });
  };

}

export default UsersController;
