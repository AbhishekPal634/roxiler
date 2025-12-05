const pool = require("../database/config");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    // Admin credentials
    const name = "Administrator Account Main"; // 20+ characters required
    const email = "admin@example.com";
    const password = "  "; // 8-16 chars, 1 uppercase, 1 special char
    const address =
      "Admin Office, System Administration Department, Main Building";
    const role = "admin";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, address, role]
    );

    if (result.rows.length > 0) {
      console.log("✅ Admin user created successfully!");
      console.log("📧 Email:", email);
      console.log("🔑 Password:", password);
      console.log("👤 Role:", role);
      console.log("\n⚠️  Please change the password after first login!");
    } else {
      console.log("ℹ️  Admin user already exists with this email.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();
