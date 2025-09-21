import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AMSList() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetch = () => {
    axios.get("/amscategories")
      .then(res => setRows(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this record?")) return;
    axios.delete(`/amscategories/${id}`)
      .then(() => fetch())
      .catch(err => console.error(err));
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h3 className="list-title">AMS Categories</h3>
        <button className="add-btn" onClick={() => navigate("/add-ams")}>➕ Add AMS Category</button>
      </div>

      <div className="table-container">
        <table className="currency-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Department</th>
              <th>Category</th>
              <th>Proposed Margin</th>
              <th>Order</th>
              <th>File</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.Id} className="clickable-row">
                <td onClick={() => navigate(`/edit-ams/${r.Id}`)}>{r.Id}</td>
                <td onClick={() => navigate(`/edit-ams/${r.Id}`)}>{r.Department}</td>
                <td onClick={() => navigate(`/edit-ams/${r.Id}`)}>{r.Category}</td>
                <td onClick={() => navigate(`/edit-ams/${r.Id}`)}>{r.ProposedMargin}</td>
                <td onClick={() => navigate(`/edit-ams/${r.Id}`)}>{r.OrderNo}</td>
                <td>
                  {r.FileName ? (
                    <a href={`http://localhost:5000/${r.FilePath}`} target="_blank" rel="noreferrer">View</a>
                  ) : "-"}
                </td>
                <td onClick={() => navigate(`/edit-ams/${r.Id}`)}>{r.IsActive ? "✅" : "❌"}</td>
                <td>
                  <button className="edit-btn" onClick={() => navigate(`/edit-ams/${r.Id}`)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(r.Id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
