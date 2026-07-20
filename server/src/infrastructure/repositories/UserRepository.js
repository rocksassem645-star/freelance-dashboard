const User = require('../../core/entities/User');
const pool = require('../database');
const bcrypt = require('bcrypt');
const logger = require('../logger');

class UserRepository {
  // Create new user
  async createUser(name, email, password, country) {
    try {
      // Hash password with bcrypt (12+ salt rounds for better security)
      const hashedPassword = await bcrypt.hash(password, 12);

      const query = `
        INSERT INTO users (name, email, password_hash, country, failed_attempts, locked_until)
        VALUES (?, ?, ?, ?, 0, NULL)
      `;
      
      const [result] = await pool.execute(query, [name, email, hashedPassword, country]);

      logger.info(`User created: ${email}`);

      return {
        id: result.insertId,
        name,
        email,
        country,
        createdAt: new Date(),
      };
    } catch (err) {
      logger.error(`Error creating user: ${err.message}`);
      throw new Error("Failed to create user");
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new User(
        row.id,
        row.name,
        row.email,
        row.password_hash,
        row.country,
        row.created_at,
        row.failed_attempts,
        row.locked_until
      );
    } catch (err) {
      logger.error(`Error finding user by email: ${err.message}`);
      throw new Error("Database error");
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new User(
        row.id,
        row.name,
        row.email,
        row.password_hash,
        row.country,
        row.created_at,
        row.failed_attempts,
        row.locked_until
      );
    } catch (err) {
      logger.error(`Error finding user by ID: ${err.message}`);
      throw new Error("Database error");
    }
  }

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      logger.error(`Error verifying password: ${err.message}`);
      return false;
    }
  }

  // Record failed login attempt
  async recordFailedLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET failed_attempts = failed_attempts + 1,
            last_failed_login = NOW()
        WHERE id = ?
      `;
      await pool.execute(query, [userId]);

      // Lock account after 5 failed attempts (30 min lockout)
      const lockQuery = `
        UPDATE users 
        SET locked_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        WHERE id = ? AND failed_attempts >= 5
      `;
      await pool.execute(lockQuery, [userId]);

      logger.warn(`Failed login attempt recorded for user ID: ${userId}`);
    } catch (err) {
      logger.error(`Error recording failed login: ${err.message}`);
    }
  }

  // Record successful login
  async recordSuccessfulLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET failed_attempts = 0,
            locked_until = NULL,
            last_login = NOW()
        WHERE id = ?
      `;
      await pool.execute(query, [userId]);

      logger.info(`Successful login for user ID: ${userId}`);
    } catch (err) {
      logger.error(`Error recording successful login: ${err.message}`);
    }
  }
}

module.exports = new UserRepository();