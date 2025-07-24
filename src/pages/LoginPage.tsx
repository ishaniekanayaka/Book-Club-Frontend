import React, { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");
    try {
      await apiClient.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await apiClient.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error("Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      await apiClient.post("/auth/reset-password", { email, newPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to reset password");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>

          {step === 1 && (
              <>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    className="w-full p-2 border rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <button
                    onClick={handleSendOtp}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Send OTP
                </button>
              </>
          )}

          {step === 2 && (
              <>
                <label className="block mb-2 text-sm font-medium text-gray-700">OTP</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                />
                <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Verify OTP
                </button>
              </>
          )}

          {step === 3 && (
              <>
                <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    className="w-full p-2 border rounded mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <button
                    onClick={handleResetPassword}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Reset Password
                </button>
              </>
          )}
        </div>
      </div>
  );
};

export default ForgotPassword;
