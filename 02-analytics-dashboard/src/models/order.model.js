import mongoose from "mongoose";

/**
 * Order Model
 * Stores purchase transations
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types?.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types?.ObjectId,
      ref: "Product",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // critical for revenue analytics
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
