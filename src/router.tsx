import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"

import AdminRoutes from "./pages/AdminRoutes"
import AdminDashboard from "./pages/AdminDashboard.tsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Login /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            {
                element: <AdminRoutes />,
                children: [
                    { path: "/AdminDashboard", element: <AdminDashboard/>},

                ],
            },
        ],
    },
])

export default router
