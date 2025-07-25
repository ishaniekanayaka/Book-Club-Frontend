import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"

import AdminRoutes from "./pages/AdminRoutes"
import LibrarianDashboard from "./pages/LibrarianDashboard.tsx";


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
                    { path: "/librarianDashboard", element: <LibrarianDashboard/>}
                    /*{ path: "/dashboard", element: <Dashboard /> },*/
                   /* { path: "/librarianDashboard", element: <LibrarianDashboard/>},
                    { path: "/readerDashboard", element: <ReaderDashboard/>},
                    { path: "/adminDashboard", element: <AdminDashboard/>}
*/
                ],
            },
        ],
    },
])

export default router
