import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient"
import router from "../router"
import {jwtDecode} from "jwt-decode";

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)

    const login = (token: string) => {
        setIsLoggedIn(true)
        setAccessToken(token)

        const decoded: { userId: string; role: string } = jwtDecode(token);

        if (decoded.role === "reader") {
            router.navigate("/readerDashboard");
        } else if (decoded.role === "admin") {
            router.navigate("/adminDashboard");
        } else if (decoded.role === "librarian") {
            router.navigate("/librarianDashboard");
        } else {
            router.navigate("/dashboard"); // fallback
        }
    }

    const logout = () => setIsLoggedIn(false)

    useEffect(() => {
        setHeader(accessToken)
    }, [accessToken])

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await apiClient.post("/auth/refresh-token")
                setAccessToken(result.data.accessToken)
                setIsLoggedIn(true)

                const currentPath = window.location.pathname
                if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
                    const decoded: { userId: string; role: string } = jwtDecode(result.data.accessToken);

                    if (decoded.role === "reader") {
                        router.navigate("/readerDashboard");
                    } else if (decoded.role === "admin") {
                        router.navigate("/adminDashboard");
                    } else if (decoded.role === "librarian") {
                        router.navigate("/librarianDashboard");
                    } else {
                        router.navigate("/dashboard");
                    }
                }
            } catch (error) {
                setAccessToken("")
                setIsLoggedIn(false)
            } finally {
                setIsAuthenticating(false)
            }
        }

        tryRefresh()
    }, [])

    return <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating }}>{children}</AuthContext.Provider>
}