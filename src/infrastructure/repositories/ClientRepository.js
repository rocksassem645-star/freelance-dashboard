    
const db = require('../database');
const Client = require('../../core/entities/Client');

class ClientRepository {
  async create(client) {
    const data = client.toDatabase();
    const [result] = await db.query(
      `INSERT INTO clients (user_id, name, email, phone, address, country, company, industry, rate, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.user_id, data.name, data.email, data.phone, data.address, 
       data.country, data.company, data.industry, data.rate, data.created_at]
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return Client.fromDatabase(rows[0]);
  }

  async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows.map(row => Client.fromDatabase(row));
  }

  async update(id, clientData) {
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
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async search(userId, searchTerm) {
    const [rows] = await db.query(
      `SELECT * FROM clients 
       WHERE user_id = ? AND (
         name LIKE ? OR email LIKE ? OR company LIKE ? OR industry LIKE ?
       )`,
      [userId, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows.map(row => Client.fromDatabase(row));
  }
}

module.exports = ClientRepository;