import React from "react";
import AuditLogTable from "../components/tables/AuditLogTable.tsx";


const AuditLogsPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-6 px-4">
            <AuditLogTable />
        </div>
    );
};

export default AuditLogsPage;
