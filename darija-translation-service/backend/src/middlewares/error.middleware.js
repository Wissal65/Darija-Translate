import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

const errorMiddleware = (err, req, res, next) => {
  console.error('Error occurred:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  let status = err.status || HTTP_STATUS.INTERNAL_ERROR;
  let message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
  
  if (err.name === 'ValidationError') {
    status = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  }
  
  if (err.message?.includes('API key')) {
    status = HTTP_STATUS.UNAUTHORIZED;
  }
  
  if (err.message?.includes('quota') || err.status === 429) {
    status = HTTP_STATUS.TOO_MANY_REQUESTS;
    message = 'API quota exceeded. Please try again later.';
  }
  
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };
  
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err;
  }
  
  res.status(status).json(response);
};

export default errorMiddleware;