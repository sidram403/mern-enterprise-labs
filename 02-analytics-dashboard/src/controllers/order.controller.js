import Order from "../models/order.model.js";
import { createOrderSchema } from "../validation/order.validation.js";

/**
 * Create order endpoint
 * Used to generate revenue analytics
 */

export const createOrder = async (req, res) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    const order = await Order.create({
      user: validatedData.user,
      product: validatedData.product,
      amount: validatedData.amount,
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: JSON.parse(error.message)[0].message,
      });
    }

    console.error("Create order error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
