import { UserModel } from './users.models';
import * as db from '../common/db';

/** Fetches a user from the database. */
export const fetchUser = async (userId: string): Promise<UserModel> => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = '${userId}';`);
  return rows[0];
};

/** Saves a new user to the database. */
export const saveUser = async (user: UserModel) => {
  await db.query(`INSERT INTO users VALUES
    ('${user.id}', '${user.username}',
      ${user.verified}, ${user.verifyMethod}, '${user.verifyValue}');
  `);
}
