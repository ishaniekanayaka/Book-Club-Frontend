import React, { useState, useEffect } from "react"
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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [otpInputs, setOtpInputs] = useState<string[]>(["", "", "", "", "", ""])
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        feedback: string;
        color: string;
    }>({ score: 0, feedback: "", color: "" })

    useEffect(() => {
        setIsVisible(true)
    }, [])

    useEffect(() => {
        const strength = calculatePasswordStrength(newPassword)
        setPasswordStrength(strength)
    }, [newPassword])

    const calculatePasswordStrength = (password: string) => {
        let score = 0
        let feedback = ""
        let color = ""

        if (password.length === 0) {
            return { score: 0, feedback: "", color: "" }
        }

        if (password.length >= 8) score += 1
        if (/[a-z]/.test(password)) score += 1
        if (/[A-Z]/.test(password)) score += 1
        if (/[0-9]/.test(password)) score += 1
        if (/[^A-Za-z0-9]/.test(password)) score += 1

        switch (score) {
            case 0-1:
                feedback = "Very Weak"
                color = "text-red-500"
                break
            case 2:
                feedback = "Weak"
                color = "text-orange-500"
                break
            case 3:
                feedback = "Fair"
                color = "text-yellow-500"
                break
            case 4:
                feedback = "Good"
                color = "text-blue-500"
                break
            case 5:
                feedback = "Strong"
                color = "text-green-500"
                break
            default:
                feedback = "Very Weak"
                color = "text-red-500"
        }

        return { score, feedback, color }
    }

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter your email address", {
                style: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            })
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address", {
                style: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            })
            return
        }

        setIsLoading(true)
        try {
            await forgotPassword(email)
            toast.success("🚀 OTP sent to your email successfully!", {
                duration: 4000,
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                },
            })
            setStep(2)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to send OTP", {
                    style: {
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '16px 24px',
                    },
                })
            } else {
                toast.error("Failed to send OTP")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtpInputs = [...otpInputs]
        newOtpInputs[index] = value
        setOtpInputs(newOtpInputs)
        setOtp(newOtpInputs.join(''))

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
            if (nextInput) nextInput.focus()
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
            if (prevInput) prevInput.focus()
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter all 6 digits of the OTP", {
                style: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            })
            return
        }

        setIsLoading(true)
        try {
            await verifyOtp(email, otp)
            toast.success("✅ OTP verified successfully!", {
                duration: 3000,
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                },
            })
            setStep(3)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Invalid OTP", {
                    style: {
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '16px 24px',
                    },
                })
            } else {
                toast.error("Invalid OTP")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in both password fields", {
                style: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            })
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters", {
                style: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", {
                style: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            })
            return
        }

        setIsLoading(true)
        try {
            await resetPassword(email, otp, newPassword)
            toast.success("🎉 Password reset successful!", {
                duration: 4000,
                style: {
                    background: 'linear-gradient(135deg, #10ac84 0%, #1dd1a1 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                },
            })
            setTimeout(() => {
                handleClose()
            }, 1000)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to reset password", {
                    style: {
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '16px 24px',
                    },
                })
            } else {
                toast.error("Failed to reset password")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            setStep(1)
            setEmail("")
            setOtp("")
            setNewPassword("")
            setConfirmPassword("")
            setOtpInputs(["", "", "", "", "", ""])
            onClose()
        }, 300)
    }

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter') {
            action()
        }
    }

    const getStepIcon = () => {
        switch (step) {
            case 1:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                )
            case 2:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 3:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                )
        }
    }

    return (
        <div className="relative">
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ${
                isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}>
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-10"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white">
                                {getStepIcon()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {step === 1 && "Reset Password"}
                                    {step === 2 && "Verify OTP"}
                                    {step === 3 && "New Password"}
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Step {step} of 3
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-2 bg-gray-50">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((stepNum) => (
                            <div
                                key={stepNum}
                                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                                    stepNum <= step
                                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2]'
                                        : 'bg-gray-200'
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className={`space-y-6 transition-all duration-500 ${
                            step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Enter your registered email address and we'll send you a verification code
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, handleSendOtp)}
                                        placeholder="your@email.com"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <button
                                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6c5ce7] disabled:opacity-70 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed"
                                onClick={handleSendOtp}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span className="animate-pulse">Sending OTP...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span>Send Verification Code</span>
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <div className={`space-y-6 transition-all duration-500 ${
                            step === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    We've sent a 6-digit verification code to
                                </p>
                                <p className="font-semibold text-[#667eea] text-sm mt-1">
                                    {email}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                                    Enter Verification Code
                                </label>
                                <div className="flex justify-center space-x-3">
                                    {otpInputs.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            maxLength={1}
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6c5ce7] disabled:opacity-70 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed"
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span className="animate-pulse">Verifying...</span>
                                        </div>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </button>
                                <button
                                    className="w-full text-sm text-[#667eea] hover:text-[#764ba2] font-medium transition-colors duration-200 py-2"
                                    onClick={() => setStep(1)}
                                    disabled={isLoading}
                                >
                                    ← Back to email
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <div className={`space-y-6 transition-all duration-500 ${
                            step === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Create a strong new password for your account
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#667eea] transition-colors duration-200"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {newPassword && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-500">Password Strength</span>
                                                <span className={`font-medium ${passwordStrength.color}`}>
                                                    {passwordStrength.feedback}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        passwordStrength.score <= 1 ? 'bg-red-500' :
                                                            passwordStrength.score === 2 ? 'bg-orange-500' :
                                                                passwordStrength.score === 3 ? 'bg-yellow-500' :
                                                                    passwordStrength.score === 4 ? 'bg-blue-500' :
                                                                        'bg-green-500'
                                                    }`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                                            placeholder="Confirm new password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#667eea] transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-70 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed"
                                    onClick={handleResetPassword}
                                    disabled={isLoading || newPassword !== confirmPassword}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span className="animate-pulse">Resetting...</span>
                                        </div>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                                <button
                                    className="w-full text-sm text-[#667eea] hover:text-[#764ba2] font-medium transition-colors duration-200 py-2"
                                    onClick={() => setStep(2)}
                                    disabled={isLoading}
                                >
                                    ← Back to verification
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword