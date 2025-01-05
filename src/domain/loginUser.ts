import { z } from "zod";
import { userRoleSchema } from "./registerUser";

export const userLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email or password format." }),
  password: z
    .string()
    .min(6, { message: "Invalid email or password format." })
    .regex(/^[a-zA-Z0-9]*$/, { message: "Invalid email or password format." }),
  role: userRoleSchema,
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

export const isUserLoginBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: UserLoginInput } => {
  const validationResult = userLoginSchema.safeParse(value);
  if (validationResult.success) {
    return { success: true, data: validationResult.data as UserLoginInput };
  }
  return { success: false, error: validationResult.error };
};
