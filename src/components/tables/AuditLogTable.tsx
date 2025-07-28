import React, { useEffect, useState } from "react";
import { getAllAuditLogs } from "../../services/auditService";
import moment from "moment";
import type { AuditLog } from "../../types/AuditLog";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const AuditLogTable: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getAllAuditLogs();
                const sortedData = data.reverse(); // latest first
                setLogs(sortedData);
                setFilteredLogs(sortedData);
            } catch (error) {
                console.error("Failed to fetch audit logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredLogs(logs);
        } else {
            const filtered = logs.filter(log =>
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredLogs(filtered);
        }
    }, [searchQuery, logs]);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const data = await getAllAuditLogs();
            const sortedData = data.reverse();
            setLogs(sortedData);
            setFilteredLogs(sortedData);
            setSearchQuery("");
        } catch (error) {
            console.error("Failed to refresh audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center mt-8">
                <div className="text-gray-500 text-lg">No audit logs found</div>
                <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Audit Logs</h1>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                            />
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Performed By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Entity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Entity ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                                                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                                                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                                {log.action}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.performedBy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.entityType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.entityId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.details || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No logs match your search criteria
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogTable;