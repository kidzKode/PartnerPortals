const express = require("express");
const connectDB = require("./db");
const sql = require("mssql");

const app = express();
app.use(express.json());


const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000", // allow React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// multer--------------------------------------
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Test DB connection

app.get("/", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT GETDATE() as CurrentTime");
    res.json({
      message: "Connected to SQL Server",
      serverTime: result.recordset
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// app.get("/users", async (req, res) => {
//   try {
//     const pool = await connectDB();
//     const result = await pool.request().query("SELECT * FROM Users");
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Get all currencies
app.get("/currencies", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Currency");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Add new currency
app.post("/currencies", async (req, res) => {
  const { CurrencyType, OrderNo, IsActive } = req.body;
  try {
    const pool = await connectDB();
    await pool.request()
      .input("CurrencyType", CurrencyType)
      .input("OrderNo", OrderNo)  
      .input("IsActive", IsActive)
      .query("INSERT INTO Currency (CurrencyType, OrderNo, IsActive) VALUES (@CurrencyType, @OrderNo, @IsActive)");
    res.json({ message: "Currency added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get by ID
// Get currency by ID
app.get("/currencies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)  // pass param safely
      .query("SELECT Id, CurrencyType, OrderNo, IsActive FROM Currency WHERE Id = @Id"); // ✅ use @Id

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Currency not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching currency:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put("/currencies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { CurrencyType, OrderNo, IsActive } = req.body;

    const pool = await connectDB(); // 👈 FIXED

    await pool
      .request()
      .input("Id", sql.Int, id)
      .input("CurrencyType", sql.NVarChar, CurrencyType)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .query(
        "UPDATE Currency SET CurrencyType=@CurrencyType, OrderNo=@OrderNo, IsActive=@IsActive WHERE Id=@Id"
      );

    res.send("Updated successfully");
  } catch (err) {
    console.error("Error updating currency:", err);
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------AMS catgory
//Ams

// ------------------ AMS Category CRUD -----------------------------------------------
// Fields: Department, Category, ProposedMargin, OrderNo, IsActive, FilePath

app.get("/amscategories", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM AMSCategory");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/amscategories", upload.single("file"), async (req, res) => {
  const { Department, Category, ProposedMargin, OrderNo, IsActive } = req.body;
  const FilePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const pool = await connectDB();
    await pool.request()
      .input("Department", sql.NVarChar, Department)
      .input("Category", sql.NVarChar, Category)
      .input("ProposedMargin", sql.Decimal(10, 2), ProposedMargin)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .input("FilePath", sql.NVarChar, FilePath)
      .query("INSERT INTO AMSCategory (Department, Category, ProposedMargin, OrderNo, IsActive, FilePath) VALUES (@Department, @Category, @ProposedMargin, @OrderNo, @IsActive, @FilePath)");
    res.json({ message: "AMS Category added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/amscategories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM AMSCategory WHERE Id=@Id");

    if (result.recordset.length === 0) return res.status(404).json({ error: "AMS Category not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/amscategories/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const { Department, Category, ProposedMargin, OrderNo, IsActive } = req.body;
  const FilePath = req.file ? `/uploads/${req.file.filename}` : req.body.FilePath || null;

  try {
    const pool = await connectDB();
    await pool.request()
      .input("Id", sql.Int, id)
      .input("Department", sql.NVarChar, Department)
      .input("Category", sql.NVarChar, Category)
      .input("ProposedMargin", sql.Decimal(10, 2), ProposedMargin)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .input("FilePath", sql.NVarChar, FilePath)
      .query("UPDATE AMSCategory SET Department=@Department, Category=@Category, ProposedMargin=@ProposedMargin, OrderNo=@OrderNo, IsActive=@IsActive, FilePath=@FilePath WHERE Id=@Id");
    res.json({ message: "AMS Category updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/amscategories/:id", async (req, res) => {
  try {
    const pool = await connectDB();
    await pool.request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM AMSCategory WHERE Id=@Id");
    res.json({ message: "AMS Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// hiiiii



app.listen(3000, () => console.log("Server running on port 5000"));
