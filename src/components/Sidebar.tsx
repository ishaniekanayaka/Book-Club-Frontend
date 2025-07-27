import React from "react";

import {
    Users,
    BookOpen,
    FileText,
    AlertTriangle,

    Settings,
    LogOut,
    TrendingUp,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.ts";

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

const Sidebar: React.FC = () => {
    const { user } = useAuth();  // Hook inside component

    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems: SidebarItem[] = [
        { id: "overview", label: "Overview", icon: TrendingUp },
        { id: "readers", label: "Reader Management", icon: Users },
        { id: "books", label: "Book Management", icon: BookOpen },

        { id: "lending", label: "Lending Management", icon: FileText },
        { id: "overdue", label: "Overdue Management", icon: AlertTriangle },
        ...(user?.role === "librarian"
            ? [{ id: "staff", label: "Staff Management", icon: Users }]
            : []),
        { id: "settings", label: "Settings", icon: Settings },
        { id: "logs", label: "Logs", icon: FileText },
    ];

    // Determine active section from URL
    const activeItem = location.pathname.split("/")[2] || "overview";

    const handleItemClick = (itemId: string) => {
        navigate(`/adminDashboard/${itemId}`);
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        alert("JWT logout logic will be implemented here.");
    };

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
            {/* Header */}
            <div className="py-6 px-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-center">📚 Book Club</h1>
                <p className="text-sm text-gray-400 text-center mt-1">Admin Dashboard</p>
            </div>

            {/* Menu */}
            <nav className="p-4 flex-1">
                <ul className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === activeItem;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleItemClick(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
