import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"

interface FormErrors {
  [key: string]: string | undefined;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  role: "staff";
  profileImage: File | null;
  nic: string;
  memberCode?: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    role: "staff",
    profileImage: null,
    nic: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth required";
    if (!formData.nic) newErrors.nic = "NIC is required";
    if (!formData.profileImage) newErrors.profileImage = "Profile image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("role", "staff");
      data.append("nic", formData.nic);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      try {
        await signUp(data);
        toast.success("Signup successful! Please login.");
        navigate("/login");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Signup failed");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
      setErrors((prev) => ({
        ...prev,
        profileImage: undefined,
      }));
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        </div>

        <div className="relative w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-xl overflow-hidden sm:px-10 sm:py-12">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="mb-10 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us today and start your journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", name: "name", type: "text", colSpan: "col-span-2" },
                { label: "Email Address", name: "email", type: "email", colSpan: "col-span-2" },
                { label: "Password", name: "password", type: "password", colSpan: "" },
                { label: "Confirm Password", name: "confirmPassword", type: "password", colSpan: "" },
                { label: "Phone", name: "phone", type: "text", colSpan: "" },
                { label: "NIC", name: "nic", type: "text", colSpan: "" },
                { label: "Date of Birth", name: "dateOfBirth", type: "date", colSpan: "" },
                { label: "Address", name: "address", type: "text", colSpan: "col-span-2" },
              ].map(({ label, name, type, colSpan }) => (
                  <div key={name} className={colSpan}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <div className="relative">
                      <input
                          id={name}
                          name={name}
                          type={type}
                          value={formData[name as keyof FormData] as string}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                              errors[name]
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200`}
                      />
                      {errors[name] && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                      )}
                    </div>
                    {errors[name] && (
                        <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
                    )}
                  </div>
              ))}
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="mt-1 flex items-center">
                <label className="group relative flex flex-col items-center justify-center w-full py-6 px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400 group-hover:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-sm text-gray-500 text-center">
                      {formData.profileImage
                          ? formData.profileImage.name
                          : "Click to upload your profile photo"}
                    </p>
                  </div>
                  <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                  />
                </label>
              </div>
              {errors.profileImage && (
                  <p className="mt-1 text-xs text-red-600">{errors.profileImage}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                ) : (
                    "Sign up"
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Add these styles for the animations */}
        <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
  );
};

export default Signup;