import { z } from 'zod';

/** Minimum project area (m²) — filters casual price-only inquiries */
export const MIN_PROJECT_AREA_SQM = 50;

export const inquirySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  whatsapp: z.string().trim().min(5),
  projectCountry: z.string().trim().min(2),
  projectAreaSqm: z.coerce
    .number()
    .min(MIN_PROJECT_AREA_SQM, { message: 'minProjectArea' }),
  product: z.string().optional(),
  quantity: z.coerce.number().min(1).optional(),
  message: z.string().optional()
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
