
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

// Add these functions to image.js

// Get all images with pagination and filtering options
export async function getUserImages(userId, options = {}) {
  const { 
    limit = 10, 
    skip = 0, 
    sortBy = 'createdAt', 
    sortOrder = -1,
    fromDate,
    toDate 
  } = options;
  
  // Build query
  const query = { userId };
  
  // Add date filtering if provided
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) query.createdAt.$lte = new Date(toDate);
  }
  
  // Execute query with pagination and sorting
  const images = await Image.find(query)
    .select('-data') // Exclude binary data for performance
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
  
  // Get total count for pagination
  const total = await Image.countDocuments(query);
  
  return { images, total };
}

// Get image statistics for a user
export async function getUserImageStats(userId) {
  const stats = await Image.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    { 
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgQuality: { $avg: '$quality' },
        formatCounts: { 
          $push: '$format' 
        },
        lastCreated: { $max: '$createdAt' },
        firstCreated: { $min: '$createdAt' }
      }
    },
    {
      $project: {
        _id: 0,
        count: 1,
        avgQuality: 1,
        formatCounts: 1,
        lastCreated: 1,
        firstCreated: 1
      }
    }
  ]);
  
  // Process format counts
  const result = stats[0] || { count: 0 };
  if (result.formatCounts) {
    const formatMap = {};
    result.formatCounts.forEach(format => {
      formatMap[format] = (formatMap[format] || 0) + 1;
    });
    result.formatCounts = formatMap;
    delete result.formatCounts;
    result.formats = formatMap;
  }
  
  return result;
}

// For admin use: get all images across users
export async function getAllImages(options = {}) {
  const { 
    limit = 10, 
    skip = 0, 
    userId = null,
    sortBy = 'createdAt', 
    sortOrder = -1
  } = options;
  
  // Build query
  const query = {};
  if (userId) query.userId = userId;
  
  const images = await Image.find(query)
    .select('-data')
    .populate('userId', 'email -_id') // Include user email
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
  
  const total = await Image.countDocuments(query);
  
  return { images, total };
}