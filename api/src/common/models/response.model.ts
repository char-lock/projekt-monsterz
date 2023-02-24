/** Every route should send an API Response. */
export type ApiResponse = {
  status: {
    code: number,
    genericDesc: string,
    details: string
  },
  data: null | object
};

/** Provides a default success response. */
export const defaultSuccess = (data: null | object): ApiResponse => {
  return {
    status: {
      code: 200,
      genericDesc: 'OK',
      details: ''
    },
    data: data
  };
};

/** Provides a default nonexistant resource response. */
export const defaultNotExist = (details: string): ApiResponse => {
  return {
    status: {
      code: 404,
      genericDesc: 'Not Found',
      details: details
    },
    data: null
  };
};

/** Provides a default bad request response.  */
export const defaultBadRequest = (details: string): ApiResponse => {
  return {
    status: {
      code: 400,
      genericDesc: 'Bad Request',
      details: details
    },
    data: null
  };
};

export const defaultCreated = (data: null | object, details: string): ApiResponse => {
  return {
    status: {
      code: 201,
      genericDesc: 'Created',
      details: details
    },
    data: data
  };
};
