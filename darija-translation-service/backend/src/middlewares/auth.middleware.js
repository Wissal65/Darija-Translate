import userModel from '../models/user.model.js';
import { HTTP_STATUS } from '../utils/constants.js';

export const authenticateBasic = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide Authorization header'
      });
    }

    // Check if it's Basic Authentication
    if (authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      if (!username || !password) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid credentials format'
        });
      }

      const user = await userModel.validateUser(username, password);
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid username or password'
        });
      }

      req.user = user;
      next();
    }
    // Check if it's Bearer Token (Session ID)
    else if (authHeader.startsWith('Bearer ')) {
      const sessionId = authHeader.split(' ')[1];
      const session = userModel.validateSession(sessionId);

      if (!session) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid or expired session'
        });
      }

      const user = userModel.getUserByUsername(session.username);
      req.user = user;
      req.sessionId = sessionId;
      next();
    } else {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Unsupported authentication type',
        message: 'Use Basic or Bearer authentication'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};


export const authenticateOptional = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    if (authHeader.startsWith('Bearer ')) {
      const sessionId = authHeader.split(' ')[1];
      const session = userModel.validateSession(sessionId);

      if (session) {
        const user = userModel.getUserByUsername(session.username);
        req.user = user;
        req.sessionId = sessionId;
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error);
  }

  next();
};