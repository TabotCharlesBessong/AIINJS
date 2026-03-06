import { Box } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/Button";
// import { Link } from 'react-router'

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const userName = "John Doe";
  const handleAuthClick = async () => {
    setIsSignedIn(!isSignedIn);
  };
  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>
        <div className="actions">
          {/* check if user is signed in */}
          {isSignedIn ? (
            <span className="greeting cursor-pointer" onClick={handleAuthClick}>
              Hello, {userName}
            </span>
          ) : (
            <button onClick={handleAuthClick} className="login">
              {" "}
              Log in
            </button>
          )}
          <Button
            variant="primary"
            size="md"
            fullWidth={false}
            className="cta"
            onClick={handleAuthClick}
          >
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
