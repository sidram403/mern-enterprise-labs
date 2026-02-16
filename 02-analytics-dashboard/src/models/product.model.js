import mongoose from "mongoose";

/**
 * Product Moodel
 * Stores products available for purchase
 */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
