// import Replicate from "replicate";

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

// export async function generateImage(prompt, options) {
//   const input = {
//     prompt,
//     aspect_ratio: options.aspect_ratio || "1:1",
//     output_format: options.format || "webp",
//     output_quality: +options.quality || 80,
//     safety_tolerance: 2,
//     prompt_upsampling: true,
//   };

//   const output = await replicate.run("black-forest-labs/flux-schnell", {
//     input,
//   });
//   const outputStream = output[0];

//   const imageBlob = await outputStream.blob();
//   const imageBuffer = await imageBlob.arrayBuffer();
//   const image = Buffer.from(imageBuffer);

//   return { image, format: imageBlob.type };
// }

// image.js
import Replicate from "replicate";
import Image from "./models/image.model.js";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(prompt, options, userId) {
  const input = {
    prompt,
    aspect_ratio: options?.aspect_ratio || "1:1",
    output_format: options?.format || "webp",
    output_quality: +(options?.quality) || 80,
    safety_tolerance: 2,
    prompt_upsampling: true,
  };

  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input,
  });
  const outputStream = output[0];

  const imageBlob = await outputStream.blob();
  const imageBuffer = await imageBlob.arrayBuffer();
  const imageData = Buffer.from(imageBuffer);

  // Save image to database
  const savedImage = await Image.create({
    userId,
    prompt,
    format: imageBlob.type,
    aspectRatio: input.aspect_ratio,
    quality: input.output_quality,
    data: imageData
  });

  return { 
    image: imageData, 
    format: imageBlob.type,
    imageId: savedImage._id // Return the image ID for reference
  };
}

// Add function to retrieve user's images
export async function getUserImages(userId, limit = 10, skip = 0) {
  const images = await Image.find({ userId })
    .select('-data') // Exclude the binary data to make queries faster
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  return images;
}

// Add function to get a specific image by ID
export async function getImageById(imageId, userId) {
  const image = await Image.findOne({ 
    _id: imageId,
    userId // Ensure the user can only access their own images
  });
  
  if (!image) {
    throw new Error('Image not found');
  }
  
  return {
    image: image.data,
    format: image.format,
    prompt: image.prompt,
    createdAt: image.createdAt
  };
}