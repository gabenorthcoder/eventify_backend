import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  address: z.string({ message: "Address is required" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  imageUrl: z.string({ message: "Image URL is required" }) 
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const isCreateEventBody = (
  value: unknown
): { success: boolean; error?: z.ZodError; data?: CreateEventInput } => {
  const validationResult = createEventSchema.safeParse(value);
  if (validationResult.success) {
    return { success: true, data: validationResult.data as CreateEventInput };
  }
  return { success: false, error: validationResult.error };
};
