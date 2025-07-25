import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "../context/useAuth"
import apiClient from "../services/apiClient"

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login: authenticate } = useAuth()

  // Forgot Password States
  const [showForgotPw, setShowForgotPw] = useState(false)
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1)
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        const user = await login(formData)
        toast.success(`Welcome, ${user.name}!`)
        authenticate(user.accessToken)
        navigate("/librarianDashboard")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message)
        } else {
          toast.error("Something went wrong")
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Sign in to your account
            </h2>
          </div>

          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email address
                </label>
                <input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder='Enter your email'
                />
                {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <input
                    id='password'
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder='Enter your password'
                />
                {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password}</p>}
              </div>
            </div>

            <div>
              <button
                  disabled={isLoading}
                  type='submit'
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {!isLoading ? "Sign in" : "Signing in..."}
              </button>

              <div className='text-center mt-2'>
                <button
                    type='button'
                    onClick={() => setShowForgotPw(true)}
                    className='text-sm text-indigo-600 hover:text-indigo-500 font-medium'
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{" "}
                <Link
                    to='/signup'
                    className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Create new account
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Forgot Password Popup */}
        {showForgotPw && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                <h3 className="text-xl font-semibold text-center mb-2">
                  {forgotStep === 1 && "Reset Your Password"}
                  {forgotStep === 2 && "Enter OTP"}
                  {forgotStep === 3 && "Set New Password"}
                </h3>

                {forgotStep === 1 && (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        Enter your registered email
                      </label>
                      <input
                          type="email"
                          className="w-full px-4 py-2 border rounded-md"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="example@email.com"
                      />
                      <button
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
                          onClick={async () => {
                            try {
                              await apiClient.post("/auth/forgot-password", { email: forgotEmail })
                              toast.success("OTP sent to your email")
                              setForgotStep(2)
                            } catch (error) {
                              toast.error("Failed to send OTP")
                            }
                          }}
                      >
                        Send OTP
                      </button>
                    </>
                )}

                {forgotStep === 2 && (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        Enter OTP sent to {forgotEmail}
                      </label>
                      <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-md"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit OTP"
                      />
                      <button
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
                          onClick={async () => {
                            try {
                              await apiClient.post("/auth/verify-otp", { email: forgotEmail, otp })
                              toast.success("OTP verified")
                              setForgotStep(3)
                            } catch (error) {
                              toast.error("Invalid OTP")
                            }
                          }}
                      >
                        Verify OTP
                      </button>
                    </>
                )}

                {forgotStep === 3 && (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                          type="password"
                          className="w-full px-4 py-2 border rounded-md"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                          type="password"
                          className="w-full px-4 py-2 border rounded-md"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                      />
                      <button
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-2"
                          onClick={async () => {
                            if (newPassword !== confirmPassword) {
                              toast.error("Passwords do not match");
                              return;
                            }
                            try {
                              await apiClient.post("/auth/reset-password", {
                                email: forgotEmail,
                                otp, // ✅ Include the OTP
                                newPassword,
                              });
                              toast.success("Password reset successful!");
                              setShowForgotPw(false);
                              setForgotStep(1);
                            } catch (error) {
                              toast.error("Failed to reset password");
                            }
                          }}
                      >
                        Reset Password
                      </button>

                    </>
                )}

                <button
                    className="w-full text-sm text-gray-500 underline mt-2"
                    onClick={() => {
                      setShowForgotPw(false)
                      setForgotStep(1)
                    }}
                >
                  Cancel
                </button>
              </div>
            </div>
        )}
      </div>
  )
}

export default Login
