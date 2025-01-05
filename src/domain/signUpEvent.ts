import { z } from "zod";

export const eventSignUpSchema = z.object({
  flag: z.boolean({ message: "must be a bolean" }),
});

export type EventSignUpInput = z.infer<typeof eventSignUpSchema>;

export const isEventSignUpBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: EventSignUpInput } => {
  const validationResult = eventSignUpSchema.safeParse(value);
  if (validationResult.success) {
    return { success: true, data: validationResult.data as EventSignUpInput };
  }
  return { success: false, error: validationResult.error };
};
