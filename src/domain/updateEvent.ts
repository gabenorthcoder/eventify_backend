import { z } from "zod";

export const updateEventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  address: z.string({ message: "Address is required" }).optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  isActive: z.boolean().optional(),
});

export type updateEventInput = z.infer<typeof updateEventSchema>;

export const isUpdateEventBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: updateEventInput } => {
  const validationResult = updateEventSchema.safeParse(value);
  if (validationResult.success) {
    return { success: true, data: validationResult.data as updateEventInput };
  }
  return { success: false, error: validationResult.error };
};
