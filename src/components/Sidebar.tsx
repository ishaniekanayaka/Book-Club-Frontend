import React, { useState } from "react";

import {
    Users,
    BookOpen,
    FileText,
    AlertTriangle,
    Settings,
    LogOut,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.ts";

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`bg-slate-800 text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Header */}
            <div className="py-6 px-4 border-b border-slate-600 relative">
                {!isCollapsed && (
                    <>
                        <h1 className="text-2xl font-bold text-center text-slate-100">📚 Book Club</h1>
                        <p className="text-sm text-slate-300 text-center mt-1">Admin Dashboard</p>
                    </>
                )}
                {isCollapsed && (
                    <div className="flex justify-center">
                        <Menu className="w-8 h-8 text-slate-100" />
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-8 bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1.5 shadow-lg border-2 border-slate-600 transition-all duration-200"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                                        isActive
                                            ? "bg-slate-600 text-white shadow-lg border border-slate-500"
                                            : "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"
                                    }`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-300'}`} />
                                    {!isCollapsed && (
                                        <>
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && (
                                                <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                                            )}
                                        </>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-600">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut className="h-5 w-5 group-hover:text-red-100" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;