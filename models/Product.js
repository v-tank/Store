const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define a product schema to keep data in collection organized; data must adhere to this schema
const productSchema = new Schema({
	productName: { type: String, required: true, index:true },
  department: { type: String, required: true, index: true },
	price: { type: Number, required: true }
});

// index productName, department for quick searches
productSchema.index({
	productName: 'text',
	department: 'text'
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
