const pool = require("../database/config");

class Store {
  static async create({ name, email, address, owner_id }) {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, address, owner_id]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT * FROM stores_with_ratings WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async findByOwnerId(ownerId) {
    const result = await pool.query(
      "SELECT * FROM stores_with_ratings WHERE owner_id = $1",
      [ownerId]
    );
    return result.rows[0];
  }

  static async getAll({
    name,
    address,
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    let query = "SELECT * FROM stores_with_ratings WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (address) {
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
      paramCount++;
    }

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = [
      "name",
      "email",
      "address",
      "average_rating",
      "created_at",
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";
    const validSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    query += ` ORDER BY ${validSortBy} ${validSortOrder}`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getTotalCount() {
    const result = await pool.query("SELECT COUNT(*) as count FROM stores");
    return parseInt(result.rows[0].count);
  }

  static async getRatingsForStore(storeId) {
    const result = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.updated_at DESC`,
      [storeId]
    );
    return result.rows;
  }
}

module.exports = Store;
