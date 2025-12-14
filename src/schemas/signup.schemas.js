import * as z from 'zod'

// Role IDs
export const ROLES = {
    ADMIN: 1,
    WHOLESALER: 2,
    RESELLER: 3,
    CUSTOMER: 4,
}

// Signup form validation schema
export const signupSchema = z.object({
    first_name: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role_id: z.number().min(1, "Please select a role").max(4, "Invalid role"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// Signin form validation schema
export const signinSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required")
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address")
})

// Reset password schema
export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// OTP verification schema
export const otpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must contain only numbers")
})
