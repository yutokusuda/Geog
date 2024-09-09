import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/grid");
  };

  return (
    <div>
      <h1>Welcome to the App</h1>
      <button onClick={handleStart}>Start</button>
    </div>
  );
};

export default HomePage;
