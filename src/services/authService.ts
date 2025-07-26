import apiClient from "./apiClient"
import type { User } from "../types/User"

export interface SignUpResponse {
    _id: string
    name: string
    email: string
    role: "staff" | "librarian"
    phone: string
    address: string
    dateOfBirth: string
    profileImage: string
    isActive: boolean
    createdAt: string
    memberCode?: string
    nic?: string
}

export interface LoginResponse {
    _id: string
    name: string
    email: string
    role: "staff" | "librarian"
    accessToken: string
}

export interface LogoutResponse {
    message: string
}

// ✅ Signup - FormData includes profileImage (file)
export const signUp = async (formData: FormData): Promise<SignUpResponse> => {
    const response = await apiClient.post("/auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

// ✅ Login
export const login = async (
    loginData: Pick<User, "email" | "password">
): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", loginData)
    return response.data
}

// ✅ Logout
export const logout = async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout")
    return response.data
}

// ✅ Forgot Password - Send OTP
export const forgotPassword = async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email })
    return response.data
}

// ✅ Verify OTP
export const verifyOtp = async (email: string, otp: string) => {
    const response = await apiClient.post("/auth/verify-otp", { email, otp })
    return response.data
}

// ✅ Reset Password - Now includes OTP parameter
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const response = await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword
    })
    return response.data
}