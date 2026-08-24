/**
 * Firebase Phone Authentication Utilities
 * Handles OTP sending, verification, and user creation
 */

import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { setOtpConfirmation, setUserPhone } from "@/lib/phone-otp-state";

let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initialize reCAPTCHA verifier
 */
export function initializeRecaptcha(containerId: string): RecaptchaVerifier {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA verified");
    },
    "expired-callback": () => {
      console.warn("reCAPTCHA expired");
    },
  });

  return recaptchaVerifier;
}

/**
 * Remove the current reCAPTCHA widget before leaving the phone form.
 */
export function clearRecaptcha(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
}

/**
 * Request OTP for phone number
 * @param phoneNumber - Full phone number with country code (e.g., +91XXXXXXXXXX)
 * @param recaptchaContainerId - ID of the reCAPTCHA container element
 * @returns Promise with ConfirmationResult
 */
export async function requestPhoneOtp(
  phoneNumber: string,
  recaptchaContainerId: string = "recaptcha-container"
): Promise<ConfirmationResult> {
  try {
    // Validate phone number format
    if (!phoneNumber.startsWith("+")) {
      throw new Error("Phone number must include country code (e.g., +91)");
    }

    // Initialize reCAPTCHA
    const recaptchaVerifier = initializeRecaptcha(recaptchaContainerId);

    // Send OTP
    const confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      phoneNumber,
      recaptchaVerifier
    );

    // Store confirmation and phone for later use
    setOtpConfirmation(confirmationResult);
    setUserPhone(phoneNumber);

    console.log("OTP sent successfully to", phoneNumber);
    return confirmationResult;
  } catch (error) {
    clearRecaptcha();
    console.error("Failed to send OTP:", error);
    throw error;
  }
}

/**
 * Verify OTP code and complete authentication
 * @param otpCode - 6-digit OTP code from SMS
 * @param confirmationResult - The ConfirmationResult from requestPhoneOtp
 * @returns Promise with user credential and ID token
 */
export async function verifyPhoneOtp(
  otpCode: string,
  confirmationResult: ConfirmationResult | null
): Promise<{ idToken: string; uid: string; phoneNumber: string | null }> {
  try {
    if (!confirmationResult) {
      throw new Error("No pending OTP confirmation. Request OTP first.");
    }

    // Verify the OTP
    const credential = await confirmationResult.confirm(otpCode);

    // Get ID token for backend session creation
    const idToken = await credential.user.getIdToken();

    return {
      idToken,
      uid: credential.user.uid,
      phoneNumber: credential.user.phoneNumber,
    };
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    throw error;
  }
}

/**
 * Format phone number to E.164 format
 * @param digits - Phone digits (e.g., "9876543210")
 * @param countryCode - Country code (e.g., "91" for India)
 * @returns Formatted phone number (e.g., "+919876543210")
 */
export function formatPhoneNumber(digits: string, countryCode: string = "91"): string {
  // Remove any non-digit characters
  const cleanDigits = digits.replace(/\D/g, "");

  // Remove country code if already included
  let finalDigits = cleanDigits;
  if (cleanDigits.startsWith(countryCode)) {
    finalDigits = cleanDigits.slice(countryCode.length);
  }

  return `+${countryCode}${finalDigits}`;
}

/**
 * Validate phone number
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Basic validation: must start with + and have 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
}
