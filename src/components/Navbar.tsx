import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "../context/useAuth"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const { isLoggedIn, logout: unauthenticate, user } = useAuth()

    const handleLogin = () => navigate("/login")
    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await logout()
            toast.success("Logout successful!")
            unauthenticate()
            navigate("/login")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleDashboard = () => navigate("/dashboard")
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className='bg-white shadow-md border-b border-gray-200'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>

                    {/* Logo Section with user image */}
                    <div className='flex items-center space-x-3'>
                        {user?.profileImage && (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="h-10 w-10 rounded-full object-cover border-2 border-blue-600"
                            />
                        )}
                        <h1 className='text-2xl font-bold text-blue-700'>📚 Book Club</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center space-x-4'>
                        {!isLoggedIn ? (
                            <button
                                onClick={handleLogin}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleDashboard}
                                    className='bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='md:hidden'>
                        <button
                            onClick={toggleMenu}
                            className='text-gray-600 hover:text-gray-800 focus:outline-none'
                        >
                            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className='md:hidden'>
                        <div className='px-2 pt-2 pb-3 space-y-1 border-t border-gray-200'>
                            {!isLoggedIn ? (
                                <button
                                    onClick={handleLogin}
                                    className='block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium'
                                >
                                    Login
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleDashboard}
                                        className='block w-full text-left bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md text-base font-medium'
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        disabled={isLoading}
                                        onClick={handleLogout}
                                        className='block w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium'
                                    >
                                        {isLoading ? "Logging out..." : "Logout"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
