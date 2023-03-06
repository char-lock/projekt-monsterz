import * as dotenv from 'dotenv';
import { sep, resolve } from 'path';
dotenv.config({ path: resolve(__dirname, `..${sep}..${sep}..${sep}.env`)});

/** Returns the boolean value of a provided string. */
export const parseBoolean = (confValue: string) => {
  if (confValue === undefined) {
    dotenv.config({ path: resolve(__dirname, `..${sep}..${sep}..${sep}.env`)});
    return false;
  }
  const value = confValue.trim();
  if (value === '1' || value === 'true') {
    return true;
  } else if (value === '0' || value === 'false' || value === '') {
    return false;
  }
  // This statement is here only to give us the chance to change the default down the line.
  return true; 
};
