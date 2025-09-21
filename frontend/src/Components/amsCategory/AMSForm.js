import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function AMSForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Department: "",
    Category: "",
    ProposedMargin: "",
    OrderNo: "",
    IsActive: true
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/amscategories/${id}`)
        .then(res => {
          setForm({
            Department: res.data.Department || "",
            Category: res.data.Category || "",
            ProposedMargin: res.data.ProposedMargin || "",
            OrderNo: res.data.OrderNo || "",
            IsActive: !!res.data.IsActive
          });
        })
        .catch(err => { console.error(err); alert("Failed to load"); navigate("/ams"); })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("Department", form.Department);
      data.append("Category", form.Category);
      data.append("ProposedMargin", form.ProposedMargin);
      data.append("OrderNo", form.OrderNo);
      data.append("IsActive", form.IsActive);
      if (file) data.append("file", file);

      if (id) {
        await axios.put(`/amscategories/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }});
        alert("Updated");
      } else {
        await axios.post("/amscategories", data, { headers: { "Content-Type": "multipart/form-data" }});
        alert("Created");
      }
      navigate("/ams");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">{id ? "Edit AMS Category" : "Add AMS Category"}</h3>
      {loading ? <p>Loading...</p> : (
        <form className="form-box" onSubmit={submitForm}>
          <div className="form-group">
            <label>Department</label>
            <input name="Department" value={form.Department} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input name="Category" value={form.Category} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label>Proposed Margin</label>
            <input name="ProposedMargin" value={form.ProposedMargin} onChange={handleChange} className="form-input" type="number" step="0.01" />
          </div>

          <div className="form-group">
            <label>Order</label>
            <input name="OrderNo" value={form.OrderNo} onChange={handleChange} className="form-input" type="number" />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input name="IsActive" type="checkbox" checked={form.IsActive} onChange={handleChange} />
              Is Active
            </label>
          </div>

          <div className="form-group">
            <label>Upload File</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
          </div>

          <div className="btn-group">
            <button type="submit" className="submit-btn">{id ? "Update" : "Save"}</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/ams")}>Back</button>
          </div>
        </form>
      )}
    </div>
  );
}
