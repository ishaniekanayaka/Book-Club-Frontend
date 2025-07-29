import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "../context/useAuth"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const { isLoggedIn, logout: unauthenticate, user } = useAuth()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogin = () => navigate("/login")

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await logout()
            toast.success("👋 Logout successful!", {
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
            unauthenticate()
            navigate("/login")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message, {
                    style: {
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '16px 24px',
                    },
                })
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                : 'bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm shadow-sm border-b border-gray-100/50'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Enhanced Logo Section */}
                    <div
                        className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-105"
                        onClick={() => navigate("/")}
                    >
                        <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                            <div className="absolute inset-0 bg-white opacity-20 rounded-xl"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {/* Animated ring */}
                            <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col group-hover:translate-x-1 transition-transform duration-300">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                BookVerse
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">Your Literary Haven</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {!isLoggedIn ? (
                            <button
                                onClick={handleLogin}
                                className="relative bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6c5ce7] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#667eea]/30 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {/* User Profile Section */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center space-x-3 bg-gray-50/80 hover:bg-white/80 border border-gray-200/50 rounded-xl px-4 py-2 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#667eea]/20 group"
                                    >
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="h-8 w-8 rounded-full object-cover border-2 border-[#667eea]/20 group-hover:border-[#667eea]/40 transition-all duration-300"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-sm font-bold">
                                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">Welcome back!</p>
                                        </div>
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50"
                                             style={{
                                                 animation: 'slideDown 0.2s ease-out'
                                             }}
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleDashboard()
                                                    setShowProfileMenu(false)
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#667eea]/10 hover:text-[#667eea] transition-colors duration-200 flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                My Dashboard
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleLogout()
                                                    setShowProfileMenu(false)
                                                }}
                                                disabled={isLoading}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 mr-3 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                                        Signing Out...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Sign Out
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-3">
                        {isLoggedIn && (
                            <div className="flex items-center space-x-2">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full object-cover border-2 border-[#667eea]/30"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-sm font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-xl bg-gray-50/80 hover:bg-white/80 border border-gray-200/50 text-gray-600 hover:text-[#667eea] focus:outline-none focus:ring-4 focus:ring-[#667eea]/20 transition-all duration-300 hover:shadow-md"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-5 h-5">
                                <span className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-1'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />
                                    </svg>
                                </span>
                                <span className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'rotate-0 translate-y-1'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12" />
                                    </svg>
                                </span>
                                {!isMenuOpen && (
                                    <>
                                        <span className="absolute inset-0">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Enhanced Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen
                        ? 'max-h-96 opacity-100 pb-4'
                        : 'max-h-0 opacity-0 pb-0'
                } overflow-hidden`}>
                    <div className="border-t border-gray-200/50 mt-2 pt-4">
                        <div className="px-2 space-y-3">
                            {!isLoggedIn ? (
                                <button
                                    onClick={handleLogin}
                                    className="block w-full text-left bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6c5ce7] text-white px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    {/* User Info Card */}
                                    <div className="bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt="Profile"
                                                    className="h-12 w-12 rounded-full object-cover border-2 border-[#667eea]/30"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-lg">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800">{user?.name}</p>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleDashboard}
                                        className="block w-full text-left bg-white/80 hover:bg-[#667eea]/10 border border-gray-200/50 hover:border-[#667eea]/30 text-gray-700 hover:text-[#667eea] px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        My Dashboard
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="block w-full text-left bg-red-50/80 hover:bg-red-100/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 mr-3 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                                Signing Out...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                ></div>
            )}
        </nav>
    )
}

export default Navbar