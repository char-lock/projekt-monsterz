import { UserModel, VerifyMethod } from './users.models';
import * as db from '../common/db';

/** Fetches a user from the database. */
export const fetchUserById = async (userId: string): Promise<UserModel> => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = '${userId}';`);
  return rows[0];
};

/** Fetches a user from the database. */
export const fetchUserByUsername = async (username: string): Promise<UserModel> => {
  const { rows } = await db.query(`SELECT * FROM users WHERE username = '${username}';`);
  return rows[0];
};

/** Saves a new user to the database. */
export const saveUser = async (user: UserModel) => {
  await db.query(`INSERT INTO users VALUES
    ('${user.id}', '${user.username}',
      ${user.verified}, ${user.verifyMethod}, '${user.verifyValue}');
  `)
  return true;
};

export const isUniqueUser = async (user: UserModel) => {
  let queryTxt = '';
  if (user.verifyMethod == VerifyMethod.EMAIL) {
    queryTxt = `SELECT * FROM users
      WHERE id = '${user.id}' OR username = '${user.username}'
        OR verifyValue = '${user.verifyValue}';`;
  } else {
    queryTxt = `SELECT * FROM users
      WHERE id = '${user.id}' OR username = '${user.username}';`;
  }
  return db.query(queryTxt).then((res) => { return !(res.rowCount > 0); });
};

export const dropUserById = async (userId: string) => {
  await db.query(`DELETE FROM users WHERE id = '${userId}';`);
  return true;
};

export const patchUserById = async (srcId: string, user: UserModel) => {
  let queryTxt = 'UPDATE users SET ';
  if (user.id !== '') queryTxt += `id = '${user.id}', `;
  if (user.username !== '') queryTxt += `username = '${user.username}', `;
  if (user.verified) queryTxt += `verified = true, `;
  if (user.verifyMethod > 0) queryTxt += `verifyMethod = ${user.verifyMethod}, `;
  if (user.verifyValue !== '') queryTxt += `verifyValue = '${user.verifyValue}', `;
  queryTxt = queryTxt.substring(0, queryTxt.length - 2);
  queryTxt += ` WHERE id = '${srcId}';`;
  await db.query(queryTxt);
  return true; 
};
