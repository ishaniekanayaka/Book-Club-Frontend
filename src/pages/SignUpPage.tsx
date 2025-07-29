import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
import Swal from "sweetalert2";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
}

const Signup: React.FC = () => {
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: string, value: string | File | null) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        else if (value.toString().length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString()))
          error = "Invalid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.toString().length < 8) error = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(value.toString())) error = "Password must contain at least one uppercase letter";
        else if (!/[0-9]/.test(value.toString())) error = "Password must contain at least one number";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(value.toString())) error = "Invalid phone number (10 digits required)";
        break;
      case "nic":
        if (!value) error = "NIC is required";
        else if (!/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/.test(value.toString()))
          error = "Invalid NIC format (old: 9 digits + V/X, new: 12 digits)";
        break;
      case "dateOfBirth":
        if (!value) error = "Date of birth is required";
        else {
          const dob = new Date(value.toString());
          const today = new Date();
          const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

          if (dob > minAgeDate) error = "You must be at least 16 years old";
        }
        break;
      case "address":
        if (!value) error = "Address is required";
        else if (value.toString().length < 10) error = "Address must be at least 10 characters";
        break;
      case "profileImage":
        if (!value) error = "Profile image is required";
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      MySwal.fire({
        title: "Validation Error",
        text: "Please correct the errors in the form",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value instanceof File ? value : value.toString());
        }
      });

      await signUp(data);

      await MySwal.fire({
        title: "Success!",
        text: "Your account has been created successfully",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });

      navigate("/login");
    } catch (error) {
      let errorMessage = "An error occurred during signup";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      await MySwal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "File size should be less than 2MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please select a valid image file (JPEG, PNG)",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Clear any previous error
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profileImage;
        return newErrors;
      });
    }
  };

  const inputClasses = (fieldName: string) =>
      `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
          errors[fieldName]
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      }`;

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side - decorative image */}
            <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-blue-500 to-indigo-600 p-8 flex flex-col justify-center text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Our Library</h2>
                <p className="mb-6">Join our community of readers and staff members</p>
                <div className="bg-white/20 rounded-full p-3 inline-flex items-center justify-center">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right side - form */}
            <div className="w-full md:w-2/3 p-6 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Create Your Account</h1>
                <p className="text-gray-600 mt-2">
                  Fill in the form below to register as a staff member
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses("name")}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses("email")}
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputClasses("password")}
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={inputClasses("confirmPassword")}
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses("phone")}
                        placeholder="0771234567"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIC <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className={inputClasses("nic")}
                        placeholder="123456789V or 123456789012"
                    />
                    {errors.nic && (
                        <p className="mt-1 text-sm text-red-600">{errors.nic}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={inputClasses("dateOfBirth")}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 16))
                            .toISOString()
                            .split("T")[0]}
                    />
                    {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={inputClasses("address")}
                        placeholder="123 Main St, City"
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {formData.profileImage ? (
                              <>
                                <img
                                    src={URL.createObjectURL(formData.profileImage)}
                                    alt="Preview"
                                    className="h-16 w-16 object-cover rounded-full mb-2"
                                />
                                <p className="text-sm text-gray-500">
                                  {formData.profileImage.name}
                                </p>
                              </>
                          ) : (
                              <>
                                <svg
                                    className="w-8 h-8 mb-3 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  ></path>
                                </svg>
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG (MAX. 2MB)
                                </p>
                              </>
                          )}
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
                        <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70"
                  >
                    {isLoading ? (
                        <>
                          <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                          >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                    ) : (
                        "Register Now"
                    )}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  <p>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 transition duration-150"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Signup;