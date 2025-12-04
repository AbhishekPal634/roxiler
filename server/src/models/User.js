const pool = require("../database/config");
const bcrypt = require("bcryptjs");

class User {
  static async create({ name, email, password, address, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address, role]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT id, name, email, address, role, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async getAll({
    role,
    name,
    email,
    address,
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    let query =
      "SELECT id, name, email, address, role, created_at FROM users WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (email) {
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
      paramCount++;
    }

    if (address) {
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
      paramCount++;
    }

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ["name", "email", "role", "created_at"];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";
    const validSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    query += ` ORDER BY ${validSortBy} ${validSortOrder}`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id",
      [hashedPassword, userId]
    );
    return result.rows[0];
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getTotalCount() {
    const result = await pool.query("SELECT COUNT(*) as count FROM users");
    return parseInt(result.rows[0].count);
  }

  static async getUserWithStoreRating(userId) {
    const result = await pool.query(
      `SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.address, 
        u.role,
        u.created_at,
        s.id as store_id,
        s.name as store_name,
        swr.average_rating as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
      LEFT JOIN stores_with_ratings swr ON s.id = swr.id
      WHERE u.id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = User;
