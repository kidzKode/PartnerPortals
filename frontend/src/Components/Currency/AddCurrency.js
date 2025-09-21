import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddCurrency() {
  const [currencyType, setCurrencyType] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // ✅ if id exists, we’re in edit mode

  // ✅ Fetch data if id exists (Edit mode)
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`/currencies/${id}`)
        .then((res) => {
          const data = res.data;
          setCurrencyType(data.CurrencyType);
          setOrderNo(data.OrderNo);
          setIsActive(data.IsActive);
        })
        .catch((err) => {
          console.error("Error fetching currency:", err);
          alert("Failed to load currency data");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // ✅ Save or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update
        await axios.put(`/currencies/${id}`, {
          CurrencyType: currencyType,
          OrderNo: parseInt(orderNo),
          IsActive: isActive,
        });
        alert("Currency updated successfully!");
      } else {
        // Create
        await axios.post("/currencies", {
          CurrencyType: currencyType,
          OrderNo: parseInt(orderNo),
          IsActive: isActive,
        });
        alert("Currency saved successfully!");
      }
      navigate("/currencies");
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving currency");
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">{id ? "Edit Currency" : "Add New Currency"}</h3>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <form className="form-box" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Currency Type*:</label>
            <input
              type="text"
              className="form-input"
              value={currencyType}
              onChange={(e) => setCurrencyType(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Order:</label>
            <input
              type="number"
              className="form-input"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Is Active
            </label>
          </div>

          <div className="btn-group">
            <button type="submit" className="submit-btn">
              {id ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/currencies")}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddCurrency;
