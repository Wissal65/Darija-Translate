import bcrypt from 'bcryptjs';

class User {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    
    // We create admin user for testing
    this.createUser('wissal', 'wissal123', 'wissal@gmail.com');
  }

  async createUser(username, password, email) {
    if (this.users.has(username)) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString()
    };

    this.users.set(username, user);
    return { username, email, createdAt: user.createdAt };
  }

  async validateUser(username, password) {
    const user = this.users.get(username);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? { username: user.username, email: user.email } : null;
  }

  getUserByUsername(username) {
    const user = this.users.get(username);
    if (!user) return null;
    return { username: user.username, email: user.email, createdAt: user.createdAt };
  }

  createSession(username) {
    const sessionId = this.generateSessionId();
    this.sessions.set(sessionId, {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    return sessionId;
  }

  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  deleteSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export default new User();
