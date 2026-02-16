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
      index: true, // improves queries filtering by user
    },
    product: {
      type: mongoose.Schema.Types?.ObjectId,
      ref: "Product",
      required: true,
      index: true, // improves grouping by product
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

/**
 * Compound index for time-based revenue queries
 * Optmizes monthly aggregation performance
 */

orderSchema.index({ createdAt: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
