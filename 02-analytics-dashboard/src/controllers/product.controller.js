import { createProductSchema } from "../validation/product.validation.js";
import Product from "../models/product.model.js";

/**
 * Create product endpoint
 */
export const createProduct = async (req, res) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    const product = await Product.create(validatedData);

    res.status(201).json(product);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: JSON.parse(error.message)[0].message,
      });
    }

    console.error("Create product error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
