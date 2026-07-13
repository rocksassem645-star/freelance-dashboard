const User = require('../../core/entities/User');
const pool = require('../database');
const bcrypt = require('bcrypt');

class UserRepository {
  // Create new user
  async createUser(name, email, password, country) {
    try {
      // Hash password with bcrypt (10 salt rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'INSERT INTO users (name, email, password_hash, country) VALUES (?, ?, ?, ?)';
      const [result] = await pool.execute(query, [name, email, hashedPassword, country]);

      return {
        id: result.insertId,
        name,
        email,
        country,
        createdAt: new Date(),
      };
    } catch (err) {
      throw new Error(`Error creating user: ${err.message}`);
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
      return new User(row.id, row.name, row.email, row.password_hash, row.country, row.created_at);
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
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
      return new User(row.id, row.name, row.email, row.password_hash, row.country, row.created_at);
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
    }
  }

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new UserRepository();