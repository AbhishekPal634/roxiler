const { verifyToken } = require("../utils/jwt");
const { isTokenInvalidated } = require("../utils/tokenBlacklist");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
    }

    const token = authHeader.substring(7);

    // Check if token is invalidated
    const invalidated = await isTokenInvalidated(token);
    if (invalidated) {
      return res.status(401).json({
        success: false,
        message: "Token has been invalidated. Please login again.",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient permissions.",
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
