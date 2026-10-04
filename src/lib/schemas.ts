import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  topic: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please add a few more details").max(5000),
  website: z.string().max(0).optional(), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  job_id: z.string().uuid().nullable(),
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  portfolio_url: z.string().trim().url("Enter a full URL").max(500).optional().or(z.literal("")),
  cover_letter: z.string().trim().max(5000).optional().or(z.literal("")),
  resume_path: z
    .string()
    .regex(/^applications\/[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,120}$/)
    .nullable(),
  website: z.string().max(0).optional(),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;
