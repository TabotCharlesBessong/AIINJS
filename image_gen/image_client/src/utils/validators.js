// src/utils/validators.js
import * as Yup from "yup";

// Login schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
});

// Registration schema
export const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

// Image generation schema
export const imageGenerationSchema = Yup.object().shape({
  prompt: Yup.string()
    .min(3, "Prompt must be at least 3 characters")
    .required("Prompt is required"),
  aspectRatio: Yup.string(),
  format: Yup.string(),
  quality: Yup.number()
    .min(1, "Quality must be at least 1")
    .max(100, "Quality must be at most 100"),
});
