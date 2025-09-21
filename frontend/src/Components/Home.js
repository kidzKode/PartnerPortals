// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Libraries</h1>
      <p className="home-subtitle">Select a library to manage its data</p>

      <div className="card-grid">
        <div className="card" onClick={() => navigate("/currencies")}>
          <h2> Account Currency</h2>
         
        </div>

        <div className="card" onClick={() => navigate("/ams")}>
          <h2> AMS Categories</h2>
        </div>

      </div>
    </div>
  );
};

export default Home;
