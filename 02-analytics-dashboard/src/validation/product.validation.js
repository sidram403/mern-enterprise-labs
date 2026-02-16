import { z } from "zod";

/**
 * Product creation validation
 */
export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 charcters"),
  price: z.number().positive("Price must be greater than 0"),
});
