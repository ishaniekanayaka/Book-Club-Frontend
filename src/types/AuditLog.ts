export type AuditLog = {
    _id: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "LEND" | "RETURN" | "LOGIN" | "OTHER";
    performedBy: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    details?: string;
};
