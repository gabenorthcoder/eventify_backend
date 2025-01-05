import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email or password format." }),
  password: z.string().min(1, { message: "Invalid password" }),
});

export type SuperAdminLoginInput = z.infer<typeof adminLoginSchema>;

export const isAdminLoginBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: SuperAdminLoginInput } => {
  const validationResult = adminLoginSchema.safeParse(value);
  if (validationResult.success) {
    return {
      success: true,
      data: validationResult.data as SuperAdminLoginInput,
    };
  }
  return { success: false, error: validationResult.error };
};
