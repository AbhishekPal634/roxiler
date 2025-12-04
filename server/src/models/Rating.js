const pool = require("../database/config");

class Rating {
  static async create({ user_id, store_id, rating }) {
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user_id, store_id, rating]
    );
    return result.rows[0];
  }

  static async update({ user_id, store_id, rating }) {
    const result = await pool.query(
      `UPDATE ratings 
       SET rating = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND store_id = $2 
       RETURNING *`,
      [user_id, store_id, rating]
    );
    return result.rows[0];
  }

  static async findByUserAndStore(user_id, store_id) {
    const result = await pool.query(
      "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
      [user_id, store_id]
    );
    return result.rows[0];
  }

  static async upsert({ user_id, store_id, rating }) {
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) 
       DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [user_id, store_id, rating]
    );
    return result.rows[0];
  }

  static async getTotalCount() {
    const result = await pool.query("SELECT COUNT(*) as count FROM ratings");
    return parseInt(result.rows[0].count);
  }

  static async getAverageForStore(store_id) {
    const result = await pool.query(
      "SELECT AVG(rating) as average FROM ratings WHERE store_id = $1",
      [store_id]
    );
    return parseFloat(result.rows[0].average) || 0;
  }
}

module.exports = Rating;
