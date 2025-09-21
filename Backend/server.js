const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use("/currencies", require("./routes/CurrencyRoutes"));
// (later you can add) app.use("/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
