import React from 'react';
import {
    Users,
    BookOpen,
    FileText,
    AlertTriangle,
    Mail,
    Settings,
    LogOut,
    TrendingUp
} from 'lucide-react';

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'readers', label: 'Reader Management', icon: Users },
        { id: 'books', label: 'Book Management', icon: BookOpen },
        { id: 'lending', label: 'Lending Management', icon: FileText },
        { id: 'overdue', label: 'Overdue Management', icon: AlertTriangle },
        { id: 'notifications', label: 'Notifications', icon: Mail },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const handleLogout = () => {
        // Logout functionality will be implemented here
        console.log('Logout clicked');
        alert('Logout functionality will be implemented with JWT');
    };

    return (
        <div className="w-64 bg-white shadow-xl min-h-screen flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    📚 Book Club Library
                </h1>
                <p className="text-sm text-gray-600 mt-1">Management System</p>
                <div className="mt-3 text-xs text-gray-500">
                    Librarian Dashboard
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSectionChange(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                                        activeSection === item.id
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
                                    }`}
                                >
                                    <IconComponent className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {activeSection === item.id && (
                                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-800">Welcome Back!</div>
                    <div className="text-xs text-gray-600">Library Administrator</div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 hover:scale-105"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;