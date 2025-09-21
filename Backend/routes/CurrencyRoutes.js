const express = require("express");
const router = express.Router();
const {
  getCurrencies,
  getCurrencyById,
  addCurrency,
  updateCurrency,
} = require("../Controller/currencyController");

// Define routes
router.get("/", getCurrencies);
router.get("/:id", getCurrencyById);
router.post("/", addCurrency);
router.put("/:id", updateCurrency);

module.exports = router;
