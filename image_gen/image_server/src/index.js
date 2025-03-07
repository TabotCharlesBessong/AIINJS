// index.js
import express from "express";
import dotenv from "dotenv";

import { createUser, enforceAuth, login } from "./auth.js";
import { generateImage } from "./image.js";
import { connectToDatabase } from "./db.js";

// Load environment variables
dotenv.config();

// Initialize database connection
connectToDatabase();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const token = await createUser(email, password);
    res.status(201).send({ message: "User created successfully", token });
  } catch (error) {
    res
      .status(400)
      .send({
        error: error.message || "Creating user failed, invalid credentials.",
      });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).send({ error: error.message });
    }
    res
      .status(500)
      .send({ error: "Login failed, please check your credentials." });
  }
});

app.post("/generate-image", enforceAuth, async (req, res) => {
  const { prompt, options } = req.body; // options => aspect_ratio, format, quality

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).send({ error: "Invalid prompt" });
  }

  try {
    const { image, format } = await generateImage(prompt, options);
    res.type(format);
    res.status(201).send(image);
  } catch (error) {
    console.error("Image generation error:", error);
    res
      .status(500)
      .send({ error: error.message || "Failed to generate image" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
