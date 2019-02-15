// import packages and routes
const express = require('express');
const router = express.Router();
const productRoutes = require('./api/product');

// use the product routes file at the /api/product route
router.use("/api/product", productRoutes);

module.exports = router;
