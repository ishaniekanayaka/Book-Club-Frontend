import React, { useEffect, useState } from "react";
import { getAllAuditLogs } from "../../services/auditService";

import moment from "moment";
import type {AuditLog} from "../../types/AuditLog.ts";

const AuditLogTable: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getAllAuditLogs();
                setLogs(data.reverse()); // latest first
            } catch (error) {
                console.error("Failed to fetch audit logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <div className="text-center mt-4">Loading...</div>;

    if (logs.length === 0) return <div className="text-center mt-4">No audit logs found.</div>;

    return (
        <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
    <div className="overflow-auto rounded-lg border shadow">
    <table className="min-w-full bg-white">
    <thead className="bg-gray-100 text-gray-700">
    <tr>
        <th className="py-2 px-4">Action</th>
        <th className="py-2 px-4">Performed By</th>
    <th className="py-2 px-4">Entity</th>
        <th className="py-2 px-4">Entity ID</th>
    <th className="py-2 px-4">Timestamp</th>
        <th className="py-2 px-4">Details</th>
        </tr>
        </thead>
        <tbody>
        {logs.map((log) => (
                <tr key={log._id} className="border-t">
            <td className="py-2 px-4 text-blue-600 font-semibold">{log.action}</td>
                <td className="py-2 px-4">{log.performedBy}</td>
                <td className="py-2 px-4">{log.entityType}</td>
                <td className="py-2 px-4">{log.entityId}</td>
                <td className="py-2 px-4">{moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
    <td className="py-2 px-4">{log.details || "-"}</td>
        </tr>
))}
    </tbody>
    </table>
    </div>
    </div>
);
};

export default AuditLogTable;
