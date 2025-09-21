import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Components/Home";
import CurrencyList from "./Components/CurrencyList";
import AddCurrency from "./Components/AddCurrency";
import "./App.css";


function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h2>Currency Management</h2>
       

        <Routes>
          <Route path="/" element={<Home />} />  
          <Route path="/currencies" element={<CurrencyList />} />
          <Route path="/add-currency" element={<AddCurrency />} />
          <Route path="/edit-currency/:id" element={<AddCurrency />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
