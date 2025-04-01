// src/components/layout/MainLayout.jsx
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../common/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default MainLayout;
