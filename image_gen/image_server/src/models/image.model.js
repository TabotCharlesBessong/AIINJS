// models/Image.js
import { Schema, model } from "mongoose";

const imageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  aspectRatio: {
    type: String,
    default: "1:1",
  },
  quality: {
    type: Number,
    default: 80,
  },
  data: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
imageSchema.index({ userId: 1, createdAt: -1 });

const Image = model("Image", imageSchema);

export default Image;
