// index.js
import express from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";

import { createUser, enforceAuth, login } from "./auth.js";
import { generateImage, getUserImages, getImageById } from "./image.js";
import { connectToDatabase } from "./db.js";

// Load environment variables
dotenv.config();

// Initialize database connection
connectToDatabase();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
    // Pass the user ID to the generateImage function
    const { image, format, imageId } = await generateImage(
      prompt,
      options,
      req.userId
    );

    // Return both the image and its ID
    res.type(format);
    res.set("X-Image-Id", imageId.toString());
    res.status(201).send(image);
  } catch (error) {
    console.error("Image generation error:", error);
    res
      .status(500)
      .send({ error: error.message || "Failed to generate image" });
  }
});

// Get a list of the user's previously generated images
app.get("/images", enforceAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const images = await getUserImages(req.userId, limit, skip);
    res.status(200).send({ images });
  } catch (error) {
    res
      .status(500)
      .send({ error: error.message || "Failed to retrieve images" });
  }
});

// Get a specific image by ID
app.get("/images/:id", enforceAuth, async (req, res) => {
  try {
    const imageId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(imageId)) {
      return res.status(400).send({ error: "Invalid image ID" });
    }

    const { image, format, prompt, createdAt } = await getImageById(
      imageId,
      req.userId
    );

    // Set appropriate headers
    res.type(format);
    res.set("X-Image-Prompt", prompt);
    res.set("X-Image-Created", createdAt.toISOString());

    res.status(200).send(image);
  } catch (error) {
    if (error.message === "Image not found") {
      return res.status(404).send({ error: "Image not found" });
    }
    res
      .status(500)
      .send({ error: error.message || "Failed to retrieve image" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
