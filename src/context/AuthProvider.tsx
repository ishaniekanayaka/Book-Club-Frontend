import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient"
import router from "../router"
import { getLoggedInUser } from "../services/authService"
import type { User } from "../types/User"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)

    const login = async (token: string) => {
        setIsLoggedIn(true)
        setAccessToken(token)
        setHeader(token)

        try {
            const userData = await getLoggedInUser()
            setUser(userData)
            router.navigate("/adminDashboard")
        } catch (err) {
            console.error("Failed to fetch user data on login")
        }
    }

    const logout = () => {
        setIsLoggedIn(false)
        setAccessToken("")
        setHeader("")
        setUser(null)
        router.navigate("/login")
    }

    useEffect(() => {
        setHeader(accessToken)
    }, [accessToken])

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await apiClient.post("/auth/refresh-token")
                const newToken = result.data.accessToken
                setAccessToken(newToken)
                setIsLoggedIn(true)
                setHeader(newToken)

                const userData = await getLoggedInUser()
                setUser(userData)

                const currentPath = window.location.pathname
                if (["/login", "/signup", "/"].includes(currentPath)) {
                    router.navigate("/adminDashboard")
                }
            } catch (error) {
                setAccessToken("")
                setIsLoggedIn(false)
                setUser(null)
                setHeader("")
            } finally {
                setIsAuthenticating(false)
            }
        }

        tryRefresh()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
                isAuthenticating,
                user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}