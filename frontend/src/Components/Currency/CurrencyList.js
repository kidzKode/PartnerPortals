import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CurrencyList() {
  const [currencies, setCurrencies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/currencies")
      .then((res) => setCurrencies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleRowClick = (id) => {
    navigate(`/edit-currency/${id}`);
  };

  return (
    <div>
      <h3>Currency List</h3>
      <Link to="/add-currency">
        <button style={{ marginBottom: "10px" }}>➕ Add Account Currency</button>
      </Link>

      <table border="1" cellPadding="8" style={{ width: "100%", cursor: "pointer" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Currency Type</th>
            <th>Order</th>
            <th>Is Active</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((c) => (
            <tr key={c.Id} onClick={() => handleRowClick(c.Id)}>
              <td>{c.Id}</td>
              <td>{c.CurrencyType}</td>
              <td>{c.OrderNo}</td>
              <td>{c.IsActive ? "✅ Yes" : "❌ No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrencyList;
