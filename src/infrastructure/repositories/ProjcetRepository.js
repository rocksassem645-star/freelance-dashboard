const db = require('../../infrastructure/database');
const Project = require('../entities/Project');

class ProjectRepository {
  async create(project) {
    const data = project.toDatabase();
    const sql = `INSERT INTO projects 
      (user_id, client_id, title, description, status, start_date, end_date, budget, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.user_id,
      data.client_id,
      data.title,
      data.description,
      data.status,
      data.start_date,
      data.end_date,
      data.budget,
      data.created_at,
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        else {
          project.id = result.insertId;
          resolve(project);
        }
      });
    });
  }

  async findById(id) {
    const sql = 'SELECT * FROM projects WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.length ? Project.fromDatabase(results[0]) : null);
      });
    });
  }

  async findByUserId(userId) {
    const sql = 'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results.map((row) => Project.fromDatabase(row)));
      });
    });
  }

  async findByClientId(clientId) {
    const sql = 'SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      db.query(sql, [clientId], (err, results) => {
        if (err) reject(err);
        else resolve(results.map((row) => Project.fromDatabase(row)));
      });
    });
  }

  async update(project) {
    const data = project.toDatabase();
    const sql = `UPDATE projects 
      SET user_id = ?, client_id = ?, title = ?, description = ?, status = ?, 
          start_date = ?, end_date = ?, budget = ?, updated_at = NOW() 
      WHERE id = ?`;

    const values = [
      data.user_id,
      data.client_id,
      data.title,
      data.description,
      data.status,
      data.start_date,
      data.end_date,
      data.budget,
      project.id,
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err) => {
        if (err) reject(err);
        else resolve(project);
      });
    });
  }

  async delete(id) {
    const sql = 'DELETE FROM projects WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

module.exports = new ProjectRepository();