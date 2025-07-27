import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import AdminDashboard from "./pages/AdminDashboard"
import ReadersPage from "./pages/ReadersPage"
import BookPage from "./pages/BookPage.tsx";
import LendingPage from "./pages/LendingPage.tsx";
import OverduePage from "./pages/OverduePage.tsx";

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
                    { path: "adminDashboard/readers", element: <ReadersPage /> },
                    { path: "dashboard/books", element: <BookPage /> },
                    { path: "dashboard/lending", element: <LendingPage /> },
                    {path: "dashboard/overdue", element: <OverduePage/>}

                ],
            },
        ],
    },
])

export default router