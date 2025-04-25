// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserImages } from "../features/images/imageSlice";
import logout from '../features/auth/authServices';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { images, isLoading, isError, message } = useSelector((state) => state.images);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserImages());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleGenerateNew = () => {
    navigate('/generate');
  };

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">AI Image Generator</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={handleGenerateNew}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium mr-4"
              >
                Generate New
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to your image generation dashboard
            </p>
          </header>

          {isLoading ? (
            <div className="text-center">Loading your images...</div>
          ) : isError ? (
            <div className="text-center text-red-500">{message}</div>
          ) : images.length === 0 ? (
            <div className="text-center text-gray-500">
              You haven't generated any images yet. Click "Generate New" to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-64 object-cover"
                  />
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-sm text-gray-500">{image.prompt}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Generated on {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
