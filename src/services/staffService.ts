import apiClient from "./apiClient"
import type { User } from "../types/User"

export interface SignUpResponse {
    _id: string
    name: string
    email: string
    role: "staff" | "librarian" | "admin" | "reader"
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
    role: "staff" | "librarian" | "admin" | "reader"
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

export const getLoggedInUser = async (): Promise<User> => {
    const response = await apiClient.get("/auth/me")
    return response.data
}

export const updateUserProfile = async (userId: string, data: any): Promise<User> => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("phone", data.phone)
    formData.append("address", data.address)
    formData.append("dateOfBirth", data.dateOfBirth)
    if (data.profileImage) {
        formData.append("profileImage", data.profileImage)
    }

    const res = await apiClient.put(`/auth/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data.user
}

// ✅ Staff Management Functions
export const getAllStaff = async (): Promise<User[]> => {
    const response = await apiClient.get("/auth/staff")
    return response.data
}

export const addStaff = async (formData: FormData): Promise<SignUpResponse> => {
    const response = await apiClient.post("/auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const updateStaff = async (userId: string, formData: FormData): Promise<User> => {
    const response = await apiClient.put(`/auth/update/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data.user
}

export const deleteStaff = async (userId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/auth/${userId}`)
    return response.data
}

export const updateStaffRole = async (userId: string, role: string): Promise<User> => {
    const response = await apiClient.put(`/auth/role/${userId}`, { role })
    return response.data.user
}

export const searchUsers = async (query: string): Promise<User[]> => {
    const response = await apiClient.get(`/auth/search?query=${encodeURIComponent(query)}`)
    return response.data
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get("/auth/getAll")
    return response.data
}