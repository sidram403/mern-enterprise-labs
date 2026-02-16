import { z } from "zod";

/**
 * User creation validation schema
 * Ensures valid email and required name
 */
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 charcters"),
  email: z.string().email("Invalid email format"),
});
