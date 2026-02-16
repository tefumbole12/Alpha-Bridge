import { supabase } from '@/lib/customSupabaseClient';

/**
 * Normalizes phone number to E.164 format (removes spaces, ensures + prefix)
 * @param {string} raw - Raw phone string
 * @returns {string|null} - Normalized phone or null if invalid
 */
const normalizePhone = (raw) => {
  if (!raw) return null;
  // Remove all non-digit and non-plus characters
  let p = String(raw).trim().replace(/[^\d+]/g, '');
  
  // Basic validation: must have digits and length reasonable for international number
  // E.g., +237675321739 is 13 chars.
  if (p.length < 8 || p.length > 16) return null;
  
  return p;
};

/**
 * Fetches the phone number for a user from the profiles table
 * @param {string} userId 
 * @returns {Promise<string>} Normalized phone number
 */
export const getPhoneFromProfiles = async (userId) => {
    if (!userId) throw new Error("User ID is required to fetch phone number.");

    const { data, error } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', userId)
        .single();

    if (error) {
        console.error("Error fetching user phone:", error);
        throw new Error("Could not retrieve your profile information.");
    }

    if (!data?.phone) {
        throw new Error("No phone number found on your profile. Please contact support.");
    }

    const normalized = normalizePhone(data.phone);
    if (!normalized) {
        throw new Error("Invalid phone number format in profile.");
    }

    return normalized;
};

export const otpService = {
  /**
   * Sends an OTP to the user's phone number found in their profile.
   * @param {string} userId - The UUID of the user
   * @returns {Promise<{success: boolean, message: string, maskedPhone?: string}>}
   */
  async sendOTP(userId) {
    try {
      if (!userId) throw new Error("User ID is missing.");

      // 1. Get phone from profile
      const phone = await getPhoneFromProfiles(userId);

      // 2. Call edge function
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { userId, phone }
      });

      if (error) {
        // Try to parse error body if available
        let errorMsg = error.message;
        try {
            const body = error.context ? await error.context.json() : {};
            if(body.error) errorMsg = body.error;
        } catch(e) { /* ignore */ }
        throw new Error(errorMsg || "Failed to communicate with OTP server.");
      }

      if (!data?.success) {
        throw new Error(data?.error || data?.message || "Failed to send OTP.");
      }

      return {
        success: true,
        message: "OTP sent successfully.",
        maskedPhone: data.maskedPhone
      };

    } catch (err) {
      console.error("otpService.sendOTP Error:", err);
      return { 
        success: false, 
        message: err.message || "An unexpected error occurred sending OTP." 
      };
    }
  },

  /**
   * Verifies the OTP entered by the user.
   * @param {string} userId 
   * @param {string} otp - 6 digit code
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async verifyOTP(userId, otp) {
    try {
      if (!userId || !otp) throw new Error("User ID and OTP are required.");

      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { userId, otp }
      });

      if (error) {
         let errorMsg = error.message;
         try {
             const body = error.context ? await error.context.json() : {};
             if(body.error) errorMsg = body.error;
         } catch(e) { /* ignore */ }
         throw new Error(errorMsg || "Verification server error.");
      }

      if (!data?.success) {
        return { success: false, message: data?.error || "Invalid OTP." };
      }

      return { success: true, message: "OTP verified." };

    } catch (err) {
      console.error("otpService.verifyOTP Error:", err);
      return { success: false, message: err.message || "Verification failed." };
    }
  },

  /**
   * Resends OTP (Alias for sendOTP since logic is identical now)
   * @param {string} userId 
   */
  async resendOTP(userId) {
    return this.sendOTP(userId);
  }
};