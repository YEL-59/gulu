"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosPublic, axiosPrivate } from "@/lib/api/axios";
import { setCookie, deleteCookie } from "@/lib/utils/cookies";
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  otpSchema,
} from "@/schemas/signup.schemas";

// ============================================
// SIGN UP HOOK
// ============================================
export const useSignUp = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role_id: 4, // Default to Customer
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/auth/register", {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.confirmPassword,
        role_id: payload.role_id,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Account created successfully!");
      router.push("/auth/signin");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to register user";
      if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// ============================================
// SIGN IN HOOK
// ============================================
export const useSignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (credentials) => {
      const res = await axiosPublic.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (response) => {
      console.log("✅ Login response:", response);
      
      // API response structure: { success, code, message, data: { token, verify, user } }
      const { success, message, data } = response;
      
      if (success && data?.token) {
        toast.success(message || "Sign in successfully");

        // Store token in both localStorage and cookie (expires in 2 hours)
        const tokenExpiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now
        localStorage.setItem("token", data.token);
        localStorage.setItem("tokenExpiry", tokenExpiry.toString());
        setCookie("token", data.token, 2 / 24); // Cookie expires in 2 hours

        // Store user data from response.data.user
        if (data?.user) {
          localStorage.setItem("data", JSON.stringify(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
          setCookie("user", JSON.stringify(data.user), 2 / 24);
        }

        // Dispatch custom event to notify Navbar of auth change
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-change"));
        }

        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        toast.error(message || "Failed to sign in");
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sign in";
      toast.error(message);
      if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      }
    },
  });

  return { form, mutate, isPending };
};

// ============================================
// SIGN OUT HOOK
// ============================================
export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Call logout endpoint if your API has one
      try {
        await axiosPrivate.post("/logout");
      } catch {
        // Continue with local logout even if API call fails
      }
    },
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("user");
      localStorage.removeItem("data");

      // Clear cookies
      deleteCookie("token");
      deleteCookie("user");

      // Clear all queries
      queryClient.clear();

      // Dispatch auth change event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      toast.success("Signed out successfully");
      router.push("/auth/signin");
    },
    onError: () => {
      // Still logout locally even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("user");
      localStorage.removeItem("data");
      deleteCookie("token");
      deleteCookie("user");
      queryClient.clear();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      router.push("/auth/signin");
    },
  });

  return { mutate, isPending };
};

// ============================================
// FORGOT PASSWORD HOOK
// ============================================
export const useForgotPassword = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/forgot-password", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset link sent to your email");
      // Navigate to OTP verification or success page
      router.push("/auth/otp-verification");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send reset link";
      if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// ============================================
// VERIFY OTP HOOK
// ============================================
export const useVerifyOtp = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/verify-otp", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verified successfully");
      // Store reset token if provided for password reset
      if (data?.reset_token) {
        sessionStorage.setItem("reset_token", data.reset_token);
      }
      router.push("/auth/reset-password");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid OTP";
      form.setError("otp", { message });
      toast.error(message);
    },
  });

  return { form, mutate, isPending };
};

// ============================================
// RESET PASSWORD HOOK
// ============================================
export const useResetPassword = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const resetToken = sessionStorage.getItem("reset_token");
      const res = await axiosPublic.post("/reset-password", {
        password: payload.password,
        password_confirmation: payload.confirmPassword,
        token: resetToken,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully");
      sessionStorage.removeItem("reset_token");
      router.push("/auth/signin");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password";
      toast.error(message);
    },
  });

  return { form, mutate, isPending };
};

// ============================================
// GET CURRENT USER HOOK
// ============================================
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/user");
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// ============================================
// UPDATE PROFILE HOOK
// ============================================
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.put("/user/profile", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully");
      // Update local storage
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("data", JSON.stringify(data.user));
      }
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // Dispatch auth change event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile";
      toast.error(message);
    },
  });

  return { mutate, isPending };
};

// ============================================
// CHANGE PASSWORD HOOK
// ============================================
export const useChangePassword = () => {
  const form = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.put("/user/password", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully");
      form.reset();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password";
      if (message.toLowerCase().includes("current")) {
        form.setError("current_password", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// ============================================
// VERIFY ACCOUNT HOOK (Email Verification)
// ============================================
export const useVerifyAccount = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (token) => {
      const res = await axiosPublic.post("/verify-email", { token });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Account verified successfully");
      router.push("/auth/success");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed";
      toast.error(message);
    },
  });

  return { mutate, isPending };
};

// ============================================
// RESEND VERIFICATION EMAIL HOOK
// ============================================
export const useResendVerification = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (email) => {
      const res = await axiosPublic.post("/resend-verification", { email });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Verification email sent");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification email";
      toast.error(message);
    },
  });

  return { mutate, isPending };
};

// ============================================
// AUTH HELPER FUNCTIONS
// ============================================

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  
  if (!token || !tokenExpiry) return false;
  
  const isExpired = Date.now() > parseInt(tokenExpiry, 10);
  return !isExpired;
};

/**
 * Get stored user data
 * @returns {object|null}
 */
export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  
  const user = localStorage.getItem("user");
  if (!user) return null;
  
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

/**
 * Get auth token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  
  if (!token || !tokenExpiry) return null;
  
  const isExpired = Date.now() > parseInt(tokenExpiry, 10);
  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return null;
  }
  
  return token;
};

