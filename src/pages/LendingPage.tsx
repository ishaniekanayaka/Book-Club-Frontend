import { useEffect, useState } from "react";
import type { Lending } from "../types/Lending";
import { getAllLendings } from "../services/LendingService";

const LendingPage = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLendings = async () => {
        setLoading(true);
        try {
            const data = await getAllLendings();
            setLendings(data);
        } catch (err) {
            console.error("Failed to fetch lendings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLendings();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold mt-10">All Lending Records</h2>
            {loading ? (
                <p>Loading lendings...</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lendings.length === 0 ? (
                        <p>No lending records found.</p>
                    ) : (
                        lendings.map((lending) => (
                            <div key={lending._id} className="border rounded-xl p-4 shadow-md bg-white">
                                <p>
                                    <strong>Reader:</strong>{" "}
                                    {typeof lending.readerId === "object"
                                        ? lending.readerId.fullName
                                        : lending.readerId}
                                </p>
                                <p>
                                    <strong>Book:</strong>{" "}
                                    {typeof lending.bookId === "object" ? lending.bookId.title : lending.bookId}
                                </p>
                                <p><strong>Lend Date:</strong> {new Date(lending.lendDate).toLocaleDateString()}</p>
                                <p><strong>Due Date:</strong> {new Date(lending.dueDate).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {lending.isReturned ? "Returned" : "Borrowed"}</p>
                                {lending.returnDate && (
                                    <p><strong>Returned At:</strong> {new Date(lending.returnDate).toLocaleDateString()}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default LendingPage;
