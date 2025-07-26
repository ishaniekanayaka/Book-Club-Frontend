import React, { useState } from "react"
import { forgotPassword, verifyOtp, resetPassword } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"

interface ForgotPasswordProps {
    onClose: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }

        setIsLoading(true)
        try {
            await forgotPassword(email)
            toast.success("OTP sent to your email")
            setStep(2)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to send OTP")
            } else {
                toast.error("Failed to send OTP")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter the OTP")
            return
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits")
            return
        }

        setIsLoading(true)
        try {
            await verifyOtp(email, otp)
            toast.success("OTP verified successfully")
            setStep(3)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Invalid OTP")
            } else {
                toast.error("Invalid OTP")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in both password fields")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)
        try {
            await resetPassword(email, otp, newPassword)
            toast.success("Password reset successful!")
            handleClose()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to reset password")
            } else {
                toast.error("Failed to reset password")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setStep(1)
        setEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        onClose()
    }

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter') {
            action()
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                        {step === 1 && "Reset Your Password"}
                        {step === 2 && "Enter OTP"}
                        {step === 3 && "Set New Password"}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter your registered email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleSendOtp)}
                                placeholder="example@email.com"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded-md transition-colors disabled:cursor-not-allowed"
                            onClick={handleSendOtp}
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP sent to {email}
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg tracking-widest"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                }}
                                onKeyPress={(e) => handleKeyPress(e, handleVerifyOtp)}
                                placeholder="000000"
                                maxLength={6}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded-md transition-colors disabled:cursor-not-allowed"
                            onClick={handleVerifyOtp}
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            className="w-full text-sm text-indigo-600 hover:text-indigo-500 underline"
                            onClick={() => setStep(1)}
                            disabled={isLoading}
                        >
                            Back to email
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                                placeholder="Confirm new password"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-md transition-colors disabled:cursor-not-allowed"
                            onClick={handleResetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                )}

                <button
                    className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ForgotPassword