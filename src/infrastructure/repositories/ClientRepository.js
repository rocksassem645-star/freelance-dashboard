const db = require('../database');
const Client = require('../../core/entities/Client');
const logger = require('../logger');

class ClientRepository {
  async create(client) {
    try {
      const data = client.toDatabase();
      const [result] = await db.query(
        `INSERT INTO clients (user_id, name, email, phone, address, country, company, industry, rate, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.user_id, data.name, data.email, data.phone, data.address, 
         data.country, data.company, data.industry, data.rate, data.created_at]
      );
      
      return result.insertId;
    } catch (err) {
      logger.error(`Error creating client: ${err.message}`);
      throw new Error("Failed to create client");
    }
  }

  // Find by ID with ownership check
  async findById(id, userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM clients WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (rows.length === 0) return null;
      return Client.fromDatabase(rows[0]);
    } catch (err) {
      logger.error(`Error finding client: ${err.message}`);
      throw new Error("Database error");
    }
  }

  // Find by user with pagination
  async findByUserId(userId, limit = 20, offset = 0) {
    try {
      // Validate pagination
      limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
      offset = Math.max(parseInt(offset) || 0, 0);

      // Get data
      const [rows] = await db.query(
        'SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );

      // Get total count
      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM clients WHERE user_id = ?',
        [userId]
      );

      return {
        data: rows.map(row => Client.fromDatabase(row)),
        total: countResult[0].total,
        limit,
        offset
      };
    } catch (err) {
      logger.error(`Error finding clients by user: ${err.message}`);
      throw new Error("Database error");
    }
  }

  async update(id, clientData) {
    try {
      const [result] = await db.query(
        `UPDATE clients SET 
          name = ?, email = ?, phone = ?, address = ?, 
          country = ?, company = ?, industry = ?, rate = ?
         WHERE id = ?`,
        [clientData.name, clientData.email, clientData.phone, 
         clientData.address, clientData.country, clientData.company, 
         clientData.industry, clientData.rate, id]
      );
      
      return result.affectedRows > 0;
    } catch (err) {
      logger.error(`Error updating client: ${err.message}`);
      throw new Error("Failed to update client");
    }
  }

  async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM clients WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (err) {
      logger.error(`Error deleting client: ${err.message}`);
      throw new Error("Failed to delete client");
    }
  }

  // Search with validation and pagination
  async search(userId, searchTerm, limit = 20, offset = 0) {
    try {
      // Validate search term
      if (!searchTerm || searchTerm.length === 0) {
        return this.findByUserId(userId, limit, offset);
      }

      if (searchTerm.length > 100) {
        throw new Error("Search term too long");
      }

      // Sanitize to prevent LIKE injection
      const safeTerm = searchTerm.replace(/[%_]/g, '\\$&');

      // Validate pagination
      limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
      offset = Math.max(parseInt(offset) || 0, 0);

      // Search with escaped LIKE
      const [rows] = await db.query(
        `SELECT * FROM clients 
         WHERE user_id = ? AND (
           name LIKE ? ESCAPE '\\' OR 
           email LIKE ? ESCAPE '\\' OR 
           company LIKE ? ESCAPE '\\'
         )
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, `%${safeTerm}%`, `%${safeTerm}%`, `%${safeTerm}%`, limit, offset]
      );

      // Get count
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM clients 
         WHERE user_id = ? AND (
           name LIKE ? ESCAPE '\\' OR 
           email LIKE ? ESCAPE '\\' OR 
           company LIKE ? ESCAPE '\\'
         )`,
        [userId, `%${safeTerm}%`, `%${safeTerm}%`, `%${safeTerm}%`]
      );

      return {
        data: rows.map(row => Client.fromDatabase(row)),
        total: countResult[0].total,
        limit,
        offset
      };
    } catch (err) {
      logger.error(`Error searching clients: ${err.message}`);
      throw new Error("Search failed");
    }
  }
}

module.exports = ClientRepository;