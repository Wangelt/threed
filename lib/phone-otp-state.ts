import type { ConfirmationResult, UserCredential } from "firebase/auth";

/**
 * Stores the phone number OTP confirmation result from Firebase
 * Used across phone auth flow (auth page -> OTP page)
 */
export let otpConfirmation: ConfirmationResult | null = null;

/**
 * Stores the user's phone number during authentication
 */
export let userPhoneNumber: string | null = null;

/**
 * Set the OTP confirmation result
 */
export function setOtpConfirmation(confirmation: ConfirmationResult) {
  otpConfirmation = confirmation;
}

/**
 * Clear OTP confirmation result (after successful auth)
 */
export function clearOtpConfirmation() {
  otpConfirmation = null;
  userPhoneNumber = null;
}

/**
 * Get the stored OTP confirmation result
 */
export function getOtpConfirmation(): ConfirmationResult | null {
  return otpConfirmation;
}

/**
 * Set user phone number
 */
export function setUserPhone(phone: string) {
  userPhoneNumber = phone;
}

/**
 * Get stored user phone number
 */
export function getUserPhone(): string | null {
  return userPhoneNumber;
}