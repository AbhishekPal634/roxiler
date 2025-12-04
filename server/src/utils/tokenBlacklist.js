const pool = require("../database/config");

const invalidatedTokens = new Set();

const invalidateToken = async (token) => {
  try {
    await pool.query(
      "INSERT INTO invalidated_tokens (token) VALUES ($1) ON CONFLICT (token) DO NOTHING",
      [token]
    );
    invalidatedTokens.add(token);
  } catch (error) {
    console.error("Error invalidating token:", error);
    throw error;
  }
};

const isTokenInvalidated = async (token) => {
  // Check in-memory cache first
  if (invalidatedTokens.has(token)) {
    return true;
  }

  // Check database
  try {
    const result = await pool.query(
      "SELECT * FROM invalidated_tokens WHERE token = $1",
      [token]
    );
    const isInvalidated = result.rows.length > 0;

    if (isInvalidated) {
      invalidatedTokens.add(token);
    }

    return isInvalidated;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};

// Clean up old tokens periodically (tokens older than 48 hours)
const cleanupOldTokens = async () => {
  try {
    await pool.query(
      "DELETE FROM invalidated_tokens WHERE invalidated_at < NOW() - INTERVAL '48 hours'"
    );
  } catch (error) {
    console.error("Error cleaning up tokens:", error);
  }
};

// Run cleanup every 6 hours
setInterval(cleanupOldTokens, 6 * 60 * 60 * 1000);

module.exports = { invalidateToken, isTokenInvalidated };
