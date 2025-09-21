// backend/Routes/amsRoutes.js
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const connectDB = require("../db");
const multer = require("multer");
const path = require("path");

// ⚡ File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Get all AMS categories
router.get("/", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM AMSCategories");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new AMS category
router.post("/", upload.single("file"), async (req, res) => {
  const { Department, Category, ProposedMargin, OrderNo, IsActive } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("Department", sql.NVarChar, Department)
      .input("Category", sql.NVarChar, Category)
      .input("ProposedMargin", sql.Decimal(5, 2), ProposedMargin)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .input("FilePath", sql.NVarChar, filePath)
      .query(
        "INSERT INTO AMSCategories (Department, Category, ProposedMargin, [Order], IsActive, FilePath) VALUES (@Department, @Category, @ProposedMargin, @OrderNo, @IsActive, @FilePath)"
      );
    res.json({ message: "AMS Category added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM AMSCategories WHERE Id=@Id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "AMS Category not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { Department, Category, ProposedMargin, OrderNo, IsActive } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const pool = await connectDB();
    await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Department", sql.NVarChar, Department)
      .input("Category", sql.NVarChar, Category)
      .input("ProposedMargin", sql.Decimal(5, 2), ProposedMargin)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .input("FilePath", sql.NVarChar, filePath)
      .query(
        "UPDATE AMSCategories SET Department=@Department, Category=@Category, ProposedMargin=@ProposedMargin, [Order]=@OrderNo, IsActive=@IsActive, FilePath=@FilePath WHERE Id=@Id"
      );

    res.send("AMS Category updated successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    await pool.request().input("Id", sql.Int, id).query("DELETE FROM AMSCategories WHERE Id=@Id");
    res.send("AMS Category deleted successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
