import { z } from "zod";
import { UserRole } from "../infrastructure/repository/entities/user";

export const userRoleSchema = z.union(
  [
    z.literal(UserRole.ADMIN),
    z.literal(UserRole.STAFF),
    z.literal(UserRole.USER),
  ],
  {
    errorMap: () => ({
      message: "Value must be either 0 (ADMIN), 1 (STAFF) or 2 (USER)",
    }),
  }
);

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^[a-zA-Z0-9]*$/, { message: "Password must be alphanumeric" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }).optional(),
  role: userRoleSchema,
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

export const isUserRegistrationBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: UserRegistrationInput } => {
  const validationResult = userRegistrationSchema.safeParse(value);
  if (validationResult.success) {
    return {
      success: true,
      data: validationResult.data as UserRegistrationInput,
    };
  }
  return { success: false, error: validationResult.error };
};
