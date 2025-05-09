import jwt from "jsonwebtoken";
import { connectToDatabase } from "./db.js";
import User from "./models/user.model.js"

const secretKey =
  process.env.JWT_SECRET_KEY

// Ensure database connection
connectToDatabase();

export async function createUser(email, password, isAdmin = false) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const user = new User({ email, password, isAdmin });
    await user.save();

    // Generate JWT token with isAdmin flag
    const token = jwt.sign(
      {
        id: user._id.toString(),
        isAdmin: user.isAdmin,
      },
      secretKey,
      {
        expiresIn: "7d",
      }
    );

    return token;
  } catch (error) {
    throw error;
  }
}

export async function login(email, password) {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      throw error;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      throw error;
    }

    // Generate JWT token with isAdmin flag
    const token = jwt.sign(
      {
        id: user._id.toString(),
        isAdmin: user.isAdmin,
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    throw error;
  }
}

export async function enforceAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Unauthenticated" });
  }

  const token = authHeader.split(" ")[1]; // Bearer XYZ

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin || false;

    // Verify user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Unauthenticated" });
  }
}

// New middleware to check for admin role
export function enforceAdmin(req, res, next) {
  if (!req.isAdmin) {
    return res
      .status(403)
      .send({ error: "Unauthorized: Admin access required" });
  }
  next();
}

// Helper function to create an admin user (for initial setup)
export async function createAdminUser(email, password) {
  return createUser(email, password, true);
}
