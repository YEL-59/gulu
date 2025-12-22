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
// WHOLESALER REGISTRATION HOOK (Multi-step onboarding)
// ============================================
export const useWholesalerRegistration = () => {
  const router = useRouter();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (formData) => {
      // Create FormData for file uploads
      const payload = new FormData();

      // Step 1: Basic Info (role_id = 2 for wholesaler)
      payload.append("first_name", formData.profile?.firstName || "");
      payload.append("last_name", formData.profile?.lastName || "");
      payload.append("email", formData.profile?.email || "");
      payload.append("password", formData.profile?.password || "");
      payload.append("password_confirmation", formData.profile?.confirmPassword || "");
      payload.append("role_id", "2"); // Fixed for wholesaler

      // Step 2: Business Info
      const businessType = formData.business?.type === "company" ? "Company" : "Individual";
      payload.append("business[business_type]", businessType);
      payload.append("business[business_name]", formData.business?.name || "");
      
      if (formData.business?.industry) {
        payload.append("business[industry_category_id]", formData.business.industry);
      }
      
      payload.append("business[business_address_country]", formData.business?.address?.country || "");
      payload.append("business[business_address_state]", formData.business?.address?.state || "");
      payload.append("business[business_address_city]", formData.business?.address?.city || "");
      payload.append("business[business_address_zip]", formData.business?.address?.zip || "");
      payload.append("business[business_address_street]", formData.business?.address?.line1 || "");

      // Business documents - document_type is required
      // Types: identity, passport, business_registration, tax_certificate
      if (formData.business?.documents?.[0]) {
        payload.append("business_documents[0][document]", formData.business.documents[0]);
        // Use selected document type or default based on business type
        const docType = formData.business?.documentType || 
          (formData.business?.type === "company" ? "business_registration" : "identity");
        payload.append("business_documents[0][document_type]", docType);
        
        // For company type, add registration number to the document entry
        if (formData.business?.type === "company" && formData.business?.registration) {
          payload.append("business_documents[0][document_name]", formData.business.registration);
        }
      }

      // Step 3: Payment/Payout Info
      payload.append("payout[account_holder_name]", formData.payment?.accountHolder || "");
      payload.append("payout[bank_name]", formData.payment?.bankName || "");
      payload.append("payout[account_number]", formData.payment?.accountNumber || "");
      payload.append("payout[routing_code]", formData.payment?.swift || "");
      
      // Map frequency to API expected values
      const frequencyMap = {
        weekly: "weekly",
        monthly: "monthly",
        ondemand: "on-demand",
      };
      payload.append("payout[payment_preference]", frequencyMap[formData.payment?.frequency] || "weekly");

      // Step 4: Storefront Info
      payload.append("storefront[store_name]", formData.store?.name || "");
      payload.append("storefront[store_description]", formData.store?.description || "");

      // Store contact is optional
      if (formData.store?.contactPhone) {
        payload.append("store_contact", formData.store.contactPhone);
      }

      // Store logo and banner (file uploads) - these are optional
      if (formData.store?.logo?.[0]) {
        payload.append("storefront[logo]", formData.store.logo[0]);
      }
      if (formData.store?.banner?.[0]) {
        payload.append("storefront[banner]", formData.store.banner[0]);
      }

      const res = await axiosPublic.post("/auth/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (response) => {
      const { success, message } = response;
      if (success) {
        toast.success(message || "Wholesaler registration submitted successfully!");
      } else {
        toast.error(message || "Registration failed");
      }
    },
    onError: (error) => {
      console.error("Wholesaler registration error:", error?.response?.data || error);
      
      const responseData = error?.response?.data;
      const statusCode = error?.response?.status || responseData?.code;
      
      // Handle server errors (500)
      if (statusCode === 500) {
        // Check if error is a string (like "Your account is pending approval...")
        if (responseData?.error && typeof responseData.error === 'string') {
          toast.error(responseData.error);
        } else {
          toast.error(responseData?.message || "Server error occurred");
        }
        return;
      }
      
      // Handle validation errors (422)
      if (responseData?.error && typeof responseData.error === 'object') {
        // Show each validation error
        const errors = Object.entries(responseData.error);
        errors.forEach(([field, messages]) => {
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${errorMsg}`);
        });
        return;
      }
      
      const message =
        responseData?.message ||
        error?.message ||
        "Failed to register wholesaler";
      toast.error(message);
    },
  });

  const submitRegistration = (formData) => {
    mutate(formData);
  };

  return { submitRegistration, isPending, isSuccess, isError, error };
};

// ============================================
// RESELLER REGISTRATION HOOK (Multi-step onboarding)
// ============================================
export const useResellerRegistration = () => {
  const router = useRouter();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (formData) => {
      // Create FormData for file uploads
      const payload = new FormData();

      // Step 1: Basic Info (role_id = 3 for reseller)
      payload.append("first_name", formData.profile?.firstName || "");
      payload.append("last_name", formData.profile?.lastName || "");
      payload.append("email", formData.profile?.email || "");
      payload.append("password", formData.profile?.password || "");
      payload.append("password_confirmation", formData.profile?.confirmPassword || "");
      payload.append("role_id", "3"); // Fixed for reseller

      // Step 2: Business Info
      const businessType = formData.business?.type === "company" ? "Company" : "Individual";
      payload.append("business[business_type]", businessType);
      payload.append("business[business_name]", formData.business?.name || "");
      
      if (formData.business?.industry) {
        payload.append("business[industry_category_id]", formData.business.industry);
      }
      
      payload.append("business[business_address_country]", formData.business?.address?.country || "");
      payload.append("business[business_address_state]", formData.business?.address?.state || "");
      payload.append("business[business_address_city]", formData.business?.address?.city || "");
      payload.append("business[business_address_zip]", formData.business?.address?.zip || "");
      payload.append("business[business_address_street]", formData.business?.address?.line1 || "");

      // Business documents - document_type is required
      // Types: identity, passport, business_registration, tax_certificate
      if (formData.business?.documents?.[0]) {
        payload.append("business_documents[0][document]", formData.business.documents[0]);
        // Use selected document type or default based on business type
        const docType = formData.business?.documentType || 
          (formData.business?.type === "company" ? "business_registration" : "identity");
        payload.append("business_documents[0][document_type]", docType);
        
        // For company type, add registration number to the document entry
        if (formData.business?.type === "company" && formData.business?.registration) {
          payload.append("business_documents[0][document_name]", formData.business.registration);
        }
      }

      // Step 3: Payment/Payout Info
      payload.append("payout[account_holder_name]", formData.payment?.accountHolder || "");
      payload.append("payout[bank_name]", formData.payment?.bankName || "");
      payload.append("payout[account_number]", formData.payment?.accountNumber || "");
      payload.append("payout[routing_code]", formData.payment?.swift || "");
      
      // Map frequency to API expected values
      const frequencyMap = {
        weekly: "weekly",
        monthly: "monthly",
        ondemand: "on-demand",
      };
      payload.append("payout[payment_preference]", frequencyMap[formData.payment?.frequency] || "weekly");

      // Step 4: Storefront Info
      payload.append("storefront[store_name]", formData.store?.name || "");
      payload.append("storefront[store_description]", formData.store?.description || "");

      // Store contact is optional
      if (formData.store?.contactPhone) {
        payload.append("store_contact", formData.store.contactPhone);
      }

      // Store logo and banner (file uploads) - these are optional
      if (formData.store?.logo?.[0]) {
        payload.append("storefront[logo]", formData.store.logo[0]);
      }
      if (formData.store?.banner?.[0]) {
        payload.append("storefront[banner]", formData.store.banner[0]);
      }

      const res = await axiosPublic.post("/auth/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (response) => {
      const { success, message } = response;
      if (success) {
        toast.success(message || "Reseller registration submitted successfully!");
      } else {
        toast.error(message || "Registration failed");
      }
    },
    onError: (error) => {
      console.error("Reseller registration error:", error?.response?.data || error);
      
      const responseData = error?.response?.data;
      const statusCode = error?.response?.status || responseData?.code;
      
      // Handle server errors (500)
      if (statusCode === 500) {
        // Check if error is a string (like "Your account is pending approval...")
        if (responseData?.error && typeof responseData.error === 'string') {
          toast.error(responseData.error);
        } else {
          toast.error(responseData?.message || "Server error occurred");
        }
        return;
      }
      
      // Handle validation errors (422)
      if (responseData?.error && typeof responseData.error === 'object') {
        // Show each validation error
        const errors = Object.entries(responseData.error);
        errors.forEach(([field, messages]) => {
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${errorMsg}`);
        });
        return;
      }
      
      const message =
        responseData?.message ||
        error?.message ||
        "Failed to register reseller";
      toast.error(message);
    },
  });

  const submitRegistration = (formData) => {
    mutate(formData);
  };

  return { submitRegistration, isPending, isSuccess, isError, error };
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
        const userRole = data?.user?.role?.toLowerCase();
        const isVerified = data?.verify;
        
        // For Wholesaler and Reseller, check if account is verified by admin
        if ((userRole === "wholesaler" || userRole === "reseller") && !isVerified) {
          // Account not verified yet - show error and don't store credentials
          toast.error("Your account is pending approval. Please wait for admin verification before logging in.");
          return;
        }

        // Account is verified (or is customer/admin who don't need verification)
        toast.success(message || "Sign in successfully");

        // Store token in both localStorage and cookie (expires in 2 hours)
        const tokenExpiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now
        localStorage.setItem("token", data.token);
        localStorage.setItem("tokenExpiry", tokenExpiry.toString());
        setCookie("token", data.token, 2 / 24); // Cookie expires in 2 hours

        // Store user data from response.data.user (include verify status)
        if (data?.user) {
          const userData = { ...data.user, verify: isVerified };
          localStorage.setItem("data", JSON.stringify(userData));
          localStorage.setItem("user", JSON.stringify(userData));
          setCookie("user", JSON.stringify(userData), 2 / 24);
        }

        // Dispatch custom event to notify Navbar of auth change
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-change"));
        }

        // Role-based redirection
        // Wholesalers and resellers should always go to their dashboard after login
        // regardless of any redirect URL (they have their own dashboard to manage)
        switch (userRole) {
          case "wholesaler":
            router.push("/wholesaler/dashboard");
            break;
          case "reseller":
            router.push("/reseller/dashboard");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "customer":
          default:
            // For customers, use redirect URL if available, otherwise go to home
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              router.push("/");
            }
            break;
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

  // Helper function to clear all auth data (localStorage, sessionStorage, cookies)
  const clearAuthData = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    localStorage.removeItem("data");

    // Clear sessionStorage for extra safety
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiry");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("data");

    // Clear cookies
    deleteCookie("token");
    deleteCookie("user");

    // Clear all queries cache
    queryClient.clear();

    // Dispatch auth change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Call logout API endpoint
      try {
        await axiosPrivate.post("/auth/logout");
      } catch {
        // Continue with local logout even if API call fails
        // (token might be expired, etc.)
      }
    },
    onSuccess: () => {
      // Clear all auth data
      clearAuthData();

      toast.success("Signed out successfully");
      router.push("/auth/signin");
    },
    onError: () => {
      // Still logout locally even if API fails
      clearAuthData();

      toast.success("Signed out successfully");
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

