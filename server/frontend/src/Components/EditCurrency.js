import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditCurrency() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currencyType, setCurrencyType] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch existing record
  useEffect(() => {
  axios
    .get(`/currencies/${id}`)
    .then((res) => {
      console.log("Fetched data:", res.data); // 👈 check what comes
      const data = res.data;
      setCurrencyType(data.CurrencyType);
      setOrderNo(data.OrderNo);
      setIsActive(data.IsActive);
    })
    .catch((err) => console.error(err));
}, [id]);

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/currencies/${id}`, {
        CurrencyType: currencyType,
        OrderNo: parseInt(orderNo),
        IsActive: isActive,
      });
      alert("Currency updated successfully!");
      navigate("/currencies");
    } catch (err) {
      console.error(err);
      alert("Error updating currency");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h3>Edit Currency</h3>
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: "10px" }}>
          <label>Currency Type*: </label>
          <input
            type="text"
            value={currencyType}
            onChange={(e) => setCurrencyType(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Order: </label>
          <input
            type="number"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Is Active
          </label>
        </div>
        <button type="submit">Update</button>
        <button
          type="button"
          onClick={() => navigate("/currencies")}
          style={{ marginLeft: "10px" }}
        >
          Back
        </button>
      </form>
    </div>
  );
}

export default EditCurrency;
