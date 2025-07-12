import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
  dateOfBirth: string
  role: "student" | "admin" | "librarian"
  profileImage: File | null
  nic: string
  memberCode?: string
}

interface FormErrors {
  [key: string]: string | undefined
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
    role: "student",
    profileImage: null,
    nic: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters"

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password"
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (!formData.phone) newErrors.phone = "Phone is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth required"
    if (!formData.nic) newErrors.nic = "NIC is required"
    if (!formData.profileImage) newErrors.profileImage = "Profile image required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("password", formData.password)
      data.append("phone", formData.phone)
      data.append("address", formData.address)
      data.append("dateOfBirth", formData.dateOfBirth)
      data.append("role", formData.role)
      data.append("nic", formData.nic)
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage)
      }

      try {
        await signUp(data)
        toast.success("Signup successful! Please login.")
        navigate("/login")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Signup failed")
        } else {
          toast.error("Something went wrong")
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }))
      setErrors((prev) => ({
        ...prev,
        profileImage: undefined,
      }))
    }
  }

  return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='text-center text-3xl font-extrabold text-gray-900'>
              Create your account
            </h2>
          </div>
          <form className='space-y-4' onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Email Address", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Confirm Password", name: "confirmPassword", type: "password" },
              { label: "Phone", name: "phone", type: "text" },
              { label: "Address", name: "address", type: "text" },
              { label: "NIC", name: "nic", type: "text" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            ].map(({ label, name, type }) => (
                <div key={name}>
                  <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
                    {label}
                  </label>
                  <input
                      id={name}
                      name={name}
                      type={type}
                      value={formData[name as keyof FormData] as string}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors[name] && (
                      <p className='text-sm text-red-600 mt-1'>{errors[name]}</p>
                  )}
                </div>
            ))}

            {/* Role Select */}
            <div>
              <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <select
                  id='role'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value='student'>Student</option>
                <option value='admin'>Admin</option>
                <option value='librarian'>Librarian</option>
              </select>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label htmlFor='profileImage' className='block text-sm font-medium text-gray-700'>
                Profile Image
              </label>
              <input
                  id='profileImage'
                  name='profileImage'
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='mt-1 block w-full text-sm text-gray-700'
              />
              {errors.profileImage && (
                  <p className='text-sm text-red-600 mt-1'>{errors.profileImage}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
            </div>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Already have an account?{" "}
                <Link to='/login' className='text-indigo-600 hover:text-indigo-500'>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
  )
}

export default Signup
