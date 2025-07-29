import { FaBook, FaUser, FaUserTie, FaClipboardList, FaExclamationTriangle } from "react-icons/fa";

type Props = {
    totalBooks: number;
    totalReaders: number;
    totalStaff: number;
    totalLibrarians: number;
    activeLendings: number;
    overdueBooks: number;
};

const DashboardStats = ({
                            totalBooks,
                            totalReaders,
                            totalStaff,
                            totalLibrarians,
                            activeLendings,
                            overdueBooks,
                        }: Props) => {
    const cards = [
        { label: "Total Books", value: totalBooks, icon: <FaBook className="text-indigo-500" /> },
        { label: "Total Readers", value: totalReaders, icon: <FaUser className="text-green-500" /> },
        { label: "Total Staff", value: totalStaff, icon: <FaUserTie className="text-yellow-500" /> },
        { label: "Total Librarians", value: totalLibrarians, icon: <FaUserTie className="text-purple-500" /> },
        { label: "Active Lendings", value: activeLendings, icon: <FaClipboardList className="text-blue-500" /> },
        { label: "Overdue Books", value: overdueBooks, icon: <FaExclamationTriangle className="text-red-500" /> },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
                    </div>
                    <div className="text-3xl">{card.icon}</div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
