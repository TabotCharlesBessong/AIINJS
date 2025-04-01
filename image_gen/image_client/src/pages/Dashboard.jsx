// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchUserImages, fetchUserStats } from "../features/images/imageSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { images, stats, isLoading } = useSelector((state) => state.images);

  useEffect(() => {
    dispatch(fetchUserImages({ limit: 5 }));
    dispatch(fetchUserStats());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to your image generation dashboard
        </p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Total Images
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              All Time
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">
              {isLoading ? "..." : stats?.count || 0}
            </p>
            <p className="mt-1 text-sm text-gray-500">Images generated</p>
          </div>
          <div className="mt-6">
            <Link
              to="/gallery"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all images →
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Average Quality
            </h2>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              All Time
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">
              {isLoading ? "..." : stats?.avgQuality?.toFixed(1) || 0}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Average quality setting
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/generate"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Generate new image →
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Latest Activity
            </h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Recent
            </span>
          </div>
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              {isLoading
                ? "..."
                : stats?.lastCreated
                ? new Date(stats.lastCreated).toLocaleDateString()
                : "No activity yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">Last image generated</p>
          </div>
          <div className="mt-6">
            <Link
              to="/generate"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Generate new image →
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Images</h2>
          <Link
            to="/gallery"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.slice(0, 5).map((image) => (
              <Link
                key={image._id}
                to={`/image/${image._id}`}
                className="relative aspect-square rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={`http://localhost:3000/images/${image._id}`}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-xs truncate">{image.prompt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No images yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by generating your first image.
            </p>
            <div className="mt-6">
              <Link
                to="/generate"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Generate Image
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
