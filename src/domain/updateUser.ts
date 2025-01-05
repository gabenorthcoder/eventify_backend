import { z } from "zod";
import { UserRole } from "../infrastructure/repository/entities/user";

export const userRoleSchema = z
  .union(
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
  )
  .optional();

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^[a-zA-Z0-9]*$/, { message: "Password must be alphanumeric" })
    .optional(),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  lastName: z.string().min(1, { message: "Last name is required" }).optional(),
  role: userRoleSchema,
});

export type UserUpdateInput = z.infer<typeof updateUserSchema>;

export const isUpdateUserBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: UserUpdateInput } => {
  const validationResult = updateUserSchema.safeParse(value);
  if (validationResult.success) {
    return {
      success: true,
      data: validationResult.data as UserUpdateInput,
    };
  }
  return { success: false, error: validationResult.error };
};
