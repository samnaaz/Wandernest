const express = require("express");
const bcrypt = require("bcryptjs");
const {
  createUser,
  getUserByEmail,
  listUsers
} = require("../repositories/userRepository");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "firstName, lastName, email and password are required"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      email: normalizedEmail,
      name: `${String(firstName).trim()} ${String(lastName).trim()}`,
      role: "user",
      passwordHash,
      joinedAt: new Date().toISOString(),
      isActive: true
    };

    await createUser(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        joinedAt: user.joinedAt,
        isActive: user.isActive
      }
    });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return res.status(409).json({ message: "Email already registered" });
    }

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        joinedAt: user.joinedAt,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
