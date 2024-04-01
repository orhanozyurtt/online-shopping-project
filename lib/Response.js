import CustomError from '../lib/Error.js';
import { HTTP_CODES } from '../config/Enum.js';
class Response {
  constructor() {}

  static successResponse(data, message = 'ok', code = 200) {
    return {
      code,
      data,
      message,
    };
  }
  static errorResponse(error) {
    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          description: error.description,
        },
      };
    } else if (error.message.includes('E11000 ')) {
      return {
        code: HTTP_CODES.CONFLICT,
        error: {
          message: 'Already exists',
          description: 'Already exists',
        },
      };
    }
    return {
      code: HTTP_CODES.INT_SERVER_ERROR,
      error: {
        message: 'Unknown error',
        description: error.message,
      },
    };
  }
}

export default Response;
