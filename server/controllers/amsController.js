const { connectDB, sql } = require("../db");
const connectDB = require("../db");
const path = require("path");
const fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM AMSCategory ORDER BY OrderNo");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM AMSCategory WHERE Id = @Id");
    if (result.recordset.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { Department, Category, ProposedMargin, OrderNo, IsActive } = req.body;
    const file = req.file; // multer puts file here
    const pool = await connectDB();

    const fileName = file ? file.filename : null;
    const filePath = file ? file.path : null;

    await pool
      .request()
      .input("Department", sql.NVarChar, Department)
      .input("Category", sql.NVarChar, Category)
      .input("ProposedMargin", sql.Decimal(10,2), ProposedMargin || null)
      .input("OrderNo", sql.Int, OrderNo || null)
      .input("IsActive", sql.Bit, IsActive === "true" || IsActive === true ? 1 : 0)
      .input("FileName", sql.NVarChar, fileName)
      .input("FilePath", sql.NVarChar, filePath)
      .query(`INSERT INTO AMSCategory (Department, Category, ProposedMargin, OrderNo, IsActive, FileName, FilePath)
              VALUES (@Department, @Category, @ProposedMargin, @OrderNo, @IsActive, @FileName, @FilePath)`);

    res.json({ message: "AMS Category created" });
  } catch (err) {
    console.error("create error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { Department, Category, ProposedMargin, OrderNo, IsActive } = req.body;
    const file = req.file;
    const pool = await connectDB();

    // If file uploaded, update FileName/FilePath; else keep existing values
    if (file) {
      // Optionally: delete old file from server (fetch old record first)
      const old = await pool
        .request()
        .input("Id", sql.Int, id)
        .query("SELECT FilePath FROM AMSCategory WHERE Id=@Id");
      if (old.recordset[0] && old.recordset[0].FilePath) {
        try { fs.unlinkSync(old.recordset[0].FilePath); } catch (e) { /* ignore */ }
      }

      await pool
        .request()
        .input("Id", sql.Int, id)
        .input("Department", sql.NVarChar, Department)
        .input("Category", sql.NVarChar, Category)
        .input("ProposedMargin", sql.Decimal(10,2), ProposedMargin || null)
        .input("OrderNo", sql.Int, OrderNo || null)
        .input("IsActive", sql.Bit, IsActive === "true" || IsActive === true ? 1 : 0)
        .input("FileName", sql.NVarChar, file.filename)
        .input("FilePath", sql.NVarChar, file.path)
        .query(`UPDATE AMSCategory SET Department=@Department, Category=@Category,
                ProposedMargin=@ProposedMargin, OrderNo=@OrderNo, IsActive=@IsActive,
                FileName=@FileName, FilePath=@FilePath WHERE Id=@Id`);
    } else {
      await pool
        .request()
        .input("Id", sql.Int, id)
        .input("Department", sql.NVarChar, Department)
        .input("Category", sql.NVarChar, Category)
        .input("ProposedMargin", sql.Decimal(10,2), ProposedMargin || null)
        .input("OrderNo", sql.Int, OrderNo || null)
        .input("IsActive", sql.Bit, IsActive === "true" || IsActive === true ? 1 : 0)
        .query(`UPDATE AMSCategory SET Department=@Department, Category=@Category,
                ProposedMargin=@ProposedMargin, OrderNo=@OrderNo, IsActive=@IsActive WHERE Id=@Id`);
    }

    res.json({ message: "AMS Category updated" });
  } catch (err) {
    console.error("update error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    // Optionally delete file
    const old = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("SELECT FilePath FROM AMSCategory WHERE Id=@Id");
    if (old.recordset[0] && old.recordset[0].FilePath) {
      try { fs.unlinkSync(old.recordset[0].FilePath); } catch (e) {}
    }

    await pool.request().input("Id", sql.Int, id).query("DELETE FROM AMSCategory WHERE Id=@Id");
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).json({ error: err.message });
  }
};
