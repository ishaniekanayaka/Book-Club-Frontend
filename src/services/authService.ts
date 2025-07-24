import apiClient from "./apiClient"
import type { User } from "../types/User"

export interface SignUpResponse {
    _id: string
    name: string
    email: string
    role: "admin" | "librarian" | "reader"
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
    role: "admin" | "librarian" | "reader"
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

// ✅ Request OTP to reset password
export const requestPasswordResetOTP = async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/request-reset-otp", { email })
    return response.data
}

// ✅ Verify OTP
export const verifyOTP = async (
    email: string,
    otp: string
): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/verify-otp", { email, otp })
    return response.data
}

// ✅ Reset password using verified OTP
export const resetPassword = async (
    email: string,
    newPassword: string
): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/reset-password", { email, newPassword })
    return response.data
}
