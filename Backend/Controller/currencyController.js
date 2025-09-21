const { connectDB, sql } = require("../db");

// ✅ Get all currencies
exports.getCurrencies = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Currency");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get currency by ID
exports.getCurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("SELECT Id, CurrencyType, OrderNo, IsActive FROM Currency WHERE Id = @Id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Currency not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add new currency
exports.addCurrency = async (req, res) => {
  const { CurrencyType, OrderNo, IsActive } = req.body;
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("CurrencyType", sql.NVarChar, CurrencyType)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .query("INSERT INTO Currency (CurrencyType, OrderNo, IsActive) VALUES (@CurrencyType, @OrderNo, @IsActive)");

    res.json({ message: "Currency added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update currency
exports.updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { CurrencyType, OrderNo, IsActive } = req.body;
    const pool = await connectDB();

    await pool
      .request()
      .input("Id", sql.Int, id)
      .input("CurrencyType", sql.NVarChar, CurrencyType)
      .input("OrderNo", sql.Int, OrderNo)
      .input("IsActive", sql.Bit, IsActive)
      .query("UPDATE Currency SET CurrencyType=@CurrencyType, OrderNo=@OrderNo, IsActive=@IsActive WHERE Id=@Id");

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
