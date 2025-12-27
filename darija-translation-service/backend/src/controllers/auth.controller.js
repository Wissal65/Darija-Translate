import userModel from '../models/user.model.js';
import { HTTP_STATUS } from '../utils/constants.js';

class AuthController {
  async register(req, res, next) {
    try {
      const { username, password, email } = req.body;

      // Validation
      if (!username || !password || !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Username, password, and email are required'
        });
      }

      if (username.length < 3) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Username must be at least 3 characters'
        });
      }

      if (password.length < 6) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Password must be at least 6 characters'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      const user = await userModel.createUser(username, password, email);
      const sessionId = userModel.createSession(username);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          sessionId,
          expiresIn: '24 hours'
        }
      });
    } catch (error) {
      if (error.message === 'Username already exists') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Username and password are required'
        });
      }

      const user = await userModel.validateUser(username, password);

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid username or password'
        });
      }

      const sessionId = userModel.createSession(username);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          sessionId,
          expiresIn: '24 hours'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const sessionId = req.sessionId;

      if (sessionId) {
        userModel.deleteSession(sessionId);
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res) {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: req.user
      }
    });
  }

  async validateSession(req, res) {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      valid: true,
      user: req.user
    });
  }
}

export default new AuthController();
