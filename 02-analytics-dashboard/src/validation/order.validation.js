import { z } from "zod";

/**
 * Order creation validation schema
 */

export const createOrderSchema = z.object({
  user: z.string(),
  product: z.string(),
  amount: z.number().positive("Amount must be positive"),
});
