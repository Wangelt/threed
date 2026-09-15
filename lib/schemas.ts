import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone number must be exactly 10 digits");

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, "Please enter all 6 digits");

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^\d{10}$/, "Valid 10-digit phone number required"),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
});

export type AddressInput = z.infer<typeof addressSchema>;
