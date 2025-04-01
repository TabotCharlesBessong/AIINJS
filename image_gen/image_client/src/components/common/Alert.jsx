import React, { useState, useEffect } from "react";

const Alert = ({
  type = "info",
  message,
  duration = 3000,
  showIcon = true,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible || !message) return null;

  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-800",
      icon: (
        <svg
          className="h-5 w-5 text-green-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-800",
      icon: (
        <svg
          className="h-5 w-5 text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.293-5.707a1 1 0 011.414 0l4-4a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-800",
      icon: (
        <svg
          className="h-5 w-5 text-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.246-.45.93-.45 1.176 0l7.517 13.708c.234.427-.068.953-.588.953H2.828c-.52 0-.822-.526-.588-.953l7.517-13.708zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-800",
      icon: (
        <svg
          className="h-5 w-5 text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 11.001 10.001 8 8 0 0118 10zm-9 3a1 1 0 100-2 1 1 0 000 2zm1-9a1 1 0 00-2 0v5a1 1 0 002 0V4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg border ${types[type].bg} ${types[type].border}`}
    >
      {showIcon && <div className="mr-3">{types[type].icon}</div>}
      <div className={`${types[type].text} font-medium`}>{message}</div>
      <button
        className="ml-auto text-gray-400 hover:text-gray-600"
        onClick={() => setIsVisible(false)}
      >
        ✖
      </button>
    </div>
  );
};

export default Alert;
