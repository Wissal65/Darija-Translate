import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';

class AuthService {
  async register(username, password, email) {
    if (userModel.findByUsername(username)) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString(),
    };

    await userModel.create(user);

    return {
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(username, password) {
    const user = userModel.findByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return { username: user.username, email: user.email };
  }
}

export default new AuthService();
