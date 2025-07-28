import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import ForgotPassword from "./ForgetPassword";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPw, setShowForgotPw] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const user = await login(formData);

        toast.success(`🎉 Welcome back, ${user.name}!`, {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontWeight: "bold",
            borderRadius: "12px",
            padding: "16px 24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#667eea",
          },
        });

        authenticate(user.accessToken);

        setTimeout(() => {
          navigate("/adminDashboard");
        }, 500);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message, {
            style: {
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "12px",
              padding: "16px 24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            },
          });
        } else {
          toast.error("Something went wrong", {
            style: {
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "12px",
              padding: "16px 24px",
            },
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
      <>
        <style>
          {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
        `}
        </style>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#667eea] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full animate-bounce"
                style={{ animationDuration: "3s" }}
            ></div>
            <div
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full animate-ping"
                style={{ animationDuration: "2s" }}
            ></div>
          </div>

          <div
              className={`max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-700 ${
                  isVisible
                      ? "scale-100 opacity-100 translate-y-0"
                      : "scale-95 opacity-0 translate-y-10"
              }`}
          >
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] py-6 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-10"></div>
              <div className="relative z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
                    <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    Welcome Back
                  </h2>
                  <p className="text-white/80 text-sm">
                    Sign in to continue your journey
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className="group">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div
                          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                              focusedField === "email"
                                  ? "text-[#667eea]"
                                  : "text-gray-400"
                          }`}
                      >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={handleBlur}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                              errors.email
                                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                  : focusedField === "email"
                                      ? "border-[#667eea] focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20"
                                      : "border-gray-200 hover:border-gray-300 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20"
                          } focus:outline-none bg-gray-50/50 hover:bg-white`}
                          placeholder="your@email.com"
                      />
                      {errors.email && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <svg
                                className="h-5 w-5 text-red-500 animate-shake"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                              <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                              />
                            </svg>
                          </div>
                      )}
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 animate-slideDown flex items-center">
                          <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                          </svg>
                          {errors.email}
                        </p>
                    )}
                  </div>

                  <div className="group">
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div
                          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                              focusedField === "password"
                                  ? "text-[#667eea]"
                                  : "text-gray-400"
                          }`}
                      >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => handleFocus("password")}
                          onBlur={handleBlur}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                              errors.password
                                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                  : focusedField === "password"
                                      ? "border-[#667eea] focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20"
                                      : "border-gray-200 hover:border-gray-300 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/20"
                          } focus:outline-none bg-gray-50/50 hover:bg-white`}
                          placeholder="••••••••"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#667eea] transition-colors duration-200"
                      >
                        {showPassword ? (
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                        )}
                      </button>
                      {errors.password && (
                          <div className="absolute inset-y-0 right-10 pr-3 flex items-center">
                            <svg
                                className="h-5 w-5 text-red-500 animate-shake"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                              <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                              />
                            </svg>
                          </div>
                      )}
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600 animate-slideDown flex items-center">
                          <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                          </svg>
                          {errors.password}
                        </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center group">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#667eea] focus:ring-[#667eea] border-gray-300 rounded transition-all duration-200 cursor-pointer"
                    />
                    <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700 cursor-pointer group-hover:text-[#667eea] transition-colors duration-200"
                    >
                      Remember me
                    </label>
                  </div>

                  <button
                      type="button"
                      onClick={() => setShowForgotPw(true)}
                      className="text-sm font-medium text-[#667eea] hover:text-[#764ba2] transition-all duration-200 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div>
                  <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6c5ce7] focus:outline-none focus:ring-4 focus:ring-[#667eea]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  >
                    {isLoading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span className="animate-pulse">Signing in...</span>
                        </>
                    ) : (
                        <>
                          <span>Sign in</span>
                          <svg
                              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="font-semibold text-[#667eea] hover:text-[#764ba2] transition-colors duration-200 hover:underline"
                >
                  Sign up now
                </Link>
              </div>
            </div>
          </div>

          {showForgotPw && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                <div className="bg-white rounded-2xl max-w-md w-full transform animate-scaleIn shadow-2xl">
                  <ForgotPassword onClose={() => setShowForgotPw(false)} />
                </div>
              </div>
          )}
        </div>
      </>
  );
};

export default Login;