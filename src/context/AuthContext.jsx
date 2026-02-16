
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";
import { logInfo } from "@/utils/debug";
import { otpService } from "@/services/otpService";

const AuthContext = createContext({});
const OTP_VERIFIED_KEY = "alpha_otp_verified_flag";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null); // Normalized lowercase role
  const [loading, setLoading] = useState(true); // Initial auth check loading
  const [isProfileLoading, setIsProfileLoading] = useState(false); // Profile fetch loading
  const [otpVerified, setOtpVerified] = useState(false);

  const normalizeRole = (r) => {
    return String(r || "").trim().toLowerCase() || null;
  };

  const clearSession = useCallback(() => {
    setUser(null);
    setProfile(null);
    setRole(null);
    setOtpVerified(false);
    localStorage.removeItem(OTP_VERIFIED_KEY);
    logInfo("AuthContext", "clearSession", "User session cleared.");
  }, []);

  // Fetch profile from DB, normalize role, update state
  const getProfile = useCallback(
    async (userId) => {
      if (!userId) {
        setProfile(null);
        setRole(null);
        return null;
      }

      setIsProfileLoading(true);
      try {
        // Fetch full profile as requested
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
            // If the row is missing or error occurs, we treat as no profile
            console.error("Profile fetch error:", error);
            setProfile(null);
            setRole(null);
            return null;
        }

        if (data) {
          const normalized = normalizeRole(data.role);
          const normalizedProfile = { ...data, role: normalized };

          setProfile(normalizedProfile);
          setRole(normalized);
          return normalizedProfile;
        }
        
        return null;
      } catch (e) {
        console.error("Unexpected error fetching profile:", e);
        setProfile(null);
        setRole(null);
        toast({
          title: "Profile Error",
          description: "Could not load user profile. Please try logging in again.",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsProfileLoading(false);
      }
    },
    [toast]
  );

  const applySession = useCallback(
    async (session) => {
      if (!session?.user) {
        clearSession();
        return;
      }

      setUser(session.user);

      // Check OTP persistence
      const isVerified = localStorage.getItem(OTP_VERIFIED_KEY) === "true";
      setOtpVerified(isVerified);

      // Fetch profile immediately to ensure role is available
      const freshProfile = await getProfile(session.user.id);
      const userRole = freshProfile?.role ?? "none";

      logInfo(
        "AuthContext",
        "applySession",
        `Session active for ${session.user.email}. Role: ${userRole}`
      );
    },
    [clearSession, getProfile]
  );

  // Initial Auth Check
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
            await applySession(data?.session ?? null);
        }
      } catch (e) {
        console.error("Auth init error:", e);
        if (mounted) clearSession();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          clearSession();
        } else if (session?.user) {
          // If session is refreshed or user signs in, re-apply
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
             await applySession(session);
          }
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, [applySession, clearSession]);

  const loginWithCredentials = useCallback(
    async (identifier, password) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });

        if (error) throw error;

        // Reset OTP state on new login
        setOtpVerified(false);
        localStorage.removeItem(OTP_VERIFIED_KEY);

        if (data?.session?.user) {
          await applySession(data.session);
          return { success: true, user: data.session.user };
        }

        throw new Error("Login succeeded but no session returned.");
      } catch (e) {
        console.error("Login failed:", e);
        return { success: false, error: e.message };
      } finally {
        setLoading(false);
      }
    },
    [applySession]
  );

  const verifyOTP = useCallback(
    async (code) => {
      try {
        // Ensure we have a valid session user first
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();

        if (error || !currentUser?.id) {
          return { success: false, error: "Session expired. Please login again." };
        }

        const result = await otpService.verifyOTP(currentUser.id, code);

        if (result?.success) {
          setOtpVerified(true);
          localStorage.setItem(OTP_VERIFIED_KEY, "true");

          // CRITICAL: Fetch profile immediately after verification
          // This ensures the role is ready for routing
          const p = await getProfile(currentUser.id);

          return { success: true, profile: p };
        }

        return {
          success: false,
          error: result?.error || result?.message || "Invalid OTP",
        };
      } catch (e) {
        return { success: false, error: e.message || "OTP verification failed" };
      }
    },
    [getProfile]
  );

  const resendOTP = useCallback(async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser?.id) return { success: false, error: "No user session found" };
      
      return await otpService.resendOTP(currentUser.id);
    } catch (e) {
      return { success: false, error: e.message || "Could not resend OTP" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Error signing out:", e);
    } finally {
      clearSession();
      toast({ title: "Logged Out", description: "See you next time!" });
    }
  }, [clearSession, toast]);

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      otpVerified,
      loading,
      isProfileLoading,
      loginWithCredentials,
      verifyOTP,
      resendOTP,
      logout,
      getProfile,
      setProfile,
    }),
    [
      user,
      profile,
      role,
      otpVerified,
      loading,
      isProfileLoading,
      loginWithCredentials,
      verifyOTP,
      resendOTP,
      logout,
      getProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
