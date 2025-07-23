import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient"
import router from "../router"
import { jwtDecode } from "jwt-decode"

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
        setHeader(token)

        const decoded: { userId: string; role: string } = jwtDecode(token)

        switch (decoded.role) {
            case "reader":
                router.navigate("/readerDashboard")
                break
            case "staff":
                router.navigate("/adminDashboard")
                break
            case "librarian":
                router.navigate("/librarianDashboard")
                break
            default:
                router.navigate("/dashboard")
        }
    }

    const logout = () => {
        setIsLoggedIn(false)
        setAccessToken("")
        setHeader("")
        router.navigate("/login")
    }

    useEffect(() => {
        setHeader(accessToken)
    }, [accessToken])

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await apiClient.get("/auth/refresh-token")
                const newToken = result.data.accessToken

                setAccessToken(newToken)
                setIsLoggedIn(true)
                setHeader(newToken)

                const currentPath = window.location.pathname
                if (["/login", "/signup", "/"].includes(currentPath)) {
                    const decoded: { userId: string; role: string } = jwtDecode(newToken)

                    switch (decoded.role) {
                        case "reader":
                            router.navigate("/readerDashboard")
                            break
                        case "staff":
                            router.navigate("/adminDashboard")
                            break
                        case "librarian":
                            router.navigate("/librarianDashboard")
                            break
                        default:
                            router.navigate("/dashboard")
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setAccessToken("")
                setIsLoggedIn(false)
                setHeader("")
            } finally {
                setIsAuthenticating(false)
            }
        }

        tryRefresh()
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating }}>
            {children}
        </AuthContext.Provider>
    )
}
