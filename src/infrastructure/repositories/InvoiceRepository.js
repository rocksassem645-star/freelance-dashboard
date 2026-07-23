const db = require('../../infrastructure/database');
const Invoice = require('../../core/entities/Invoice');

class InvoiceRepository {
  async create(invoice) {
    const data = invoice.toDatabase();
    const sql = `INSERT INTO invoices 
      (user_id, client_id, project_id, invoice_number, amount, status, issue_date, due_date, description, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.user_id,
      data.client_id,
      data.project_id,
      data.invoice_number,
      data.amount,
      data.status,
      data.issue_date,
      data.due_date,
      data.description,
      data.created_at,
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        else {
          invoice.id = result.insertId;
          resolve(invoice);
        }
      });
    });
  }

  async findById(id) {
    const sql = 'SELECT * FROM invoices WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.length ? Invoice.fromDatabase(results[0]) : null);
      });
    });
  }

  async findByUserId(userId) {
    const sql = 'SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results.map((row) => Invoice.fromDatabase(row)));
      });
    });
  }

  async findByClientId(clientId) {
    const sql = 'SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      db.query(sql, [clientId], (err, results) => {
        if (err) reject(err);
        else resolve(results.map((row) => Invoice.fromDatabase(row)));
      });
    });
  }

  async update(invoice) {
    const data = invoice.toDatabase();
    const sql = `UPDATE invoices 
      SET user_id = ?, client_id = ?, project_id = ?, invoice_number = ?, amount = ?, status = ?, 
          issue_date = ?, due_date = ?, description = ?, paid_date = ?, updated_at = NOW() 
      WHERE id = ?`;

    const values = [
      data.user_id,
      data.client_id,
      data.project_id,
      data.invoice_number,
      data.amount,
      data.status,
      data.issue_date,
      data.due_date,
      data.description,
      data.paid_date,
      invoice.id,
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err) => {
        if (err) reject(err);
        else resolve(invoice);
      });
    });
  }

  async delete(id) {
    const sql = 'DELETE FROM invoices WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

module.exports = new InvoiceRepository();