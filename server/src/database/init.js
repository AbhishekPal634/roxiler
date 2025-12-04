const pool = require("./config");

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    // Create index on role for filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
    `);

    // Create stores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on store name for search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_stores_name ON stores(name)
    `);

    // Create index on store address for search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_stores_address ON stores(address)
    `);

    // Create index on owner_id
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id)
    `);

    // Create ratings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);

    // Create index on store_id for faster rating calculations
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id)
    `);

    // Create index on user_id
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id)
    `);

    // Create a view for stores with average ratings
    await client.query(`
      CREATE OR REPLACE VIEW stores_with_ratings AS
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at,
        s.updated_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at
    `);

    // Create invalidated tokens table for logout functionality
    await client.query(`
      CREATE TABLE IF NOT EXISTS invalidated_tokens (
        id SERIAL PRIMARY KEY,
        token VARCHAR(500) UNIQUE NOT NULL,
        invalidated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query("COMMIT");
    console.log("Database tables created successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", error);
    throw error;
  } finally {
    client.release();
  }
};

const seedDefaultAdmin = async () => {
  const bcrypt = require("bcryptjs");
  const client = await pool.connect();

  try {
    // Check if admin exists
    const result = await client.query(
      "SELECT * FROM users WHERE email = 'admin@roxiler.com'"
    );

    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await client.query(
        `INSERT INTO users (name, email, password, address, role) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          "Default Administrator Account",
          "admin@roxiler.com",
          hashedPassword,
          "123 Admin Street, Admin City, Admin State 12345",
          "admin",
        ]
      );
      console.log("Default admin user created");
      console.log("   Email: admin@roxiler.com");
      console.log("   Password: Admin@123");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  } finally {
    client.release();
  }
};

const initDatabase = async () => {
  try {
    console.log("Initializing database...");
    await createTables();
    await seedDefaultAdmin();
    console.log("Database initialization complete");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { createTables, seedDefaultAdmin, initDatabase };
