import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Passwrod must be at least 6 charcters long"),
});
