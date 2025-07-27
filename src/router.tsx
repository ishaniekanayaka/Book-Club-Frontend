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
import SettingPage from "./pages/SettingPage.tsx";
import StaffPage from "./pages/StaffPage.tsx";

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
                    { path: "adminDashboard/books", element: <BookPage /> },
                    { path: "adminDashboard/lending", element: <LendingPage /> },
                    {path: "adminDashboard/overdue", element: <OverduePage/>},
                    {path: "adminDashboard/settings", element: <SettingPage/>},
                    {path: "adminDashboard/staff", element: <StaffPage/>}

                ],
            },
        ],
    },
])

export default router