import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Components/Home";
import CurrencyList from "./Components/Currency/CurrencyList";
import AddCurrency from "./Components/Currency/AddCurrency";
import AMSList from "./Components/amsCategory/AMSList";
import AMSForm from "./Components/amsCategory/AMSForm";
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
          
          <Route path="/ams" element={<AMSList />} />
          <Route path="/add-ams" element={<AMSForm />} />
          <Route path="/edit-ams/:id" element={<AMSForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
