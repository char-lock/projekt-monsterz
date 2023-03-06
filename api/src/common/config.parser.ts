/** Returns the boolean value of a provided string. */
export const parseBoolean = (confValue: string) => {
  if (confValue === undefined) return false;
  const value = confValue.trim();
  if (value === '1' || value === 'true') {
    return true;
  } else if (value === '0' || value === 'false' || value === '') {
    return false;
  }
  // This statement is here only to give us the chance to change the default down the line.
  return true; 
};
