import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import AdminDashboard from "./pages/AdminDashboard"
import ReadersPage from "./pages/ReadersPage"
import BookPage from "./pages/BookPage.tsx";
import LendingPage from "./pages/LendingPage.tsx";

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
                    { path: "/adminDashboard", element: <AdminDashboard /> },
                    { path: "dashboard/readers", element: <ReadersPage /> },
                    { path: "dashboard/books", element: <BookPage /> },
                    { path: "dashboard/lending", element: <LendingPage /> }

                ],
            },
        ],
    },
])

export default router