import { useEffect, useState } from "react";
import { getReturnedOverdueLendings } from "../services/LendingService";
import type { Lending } from "../types/Lending";

const ReturnedOverduePage = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);

    const fetchReturnedOverdues = async () => {
        try {
            const data = await getReturnedOverdueLendings();
            setLendings(data);
        } catch (err) {
            console.error("Failed to fetch returned overdue lendings", err);
        }
    };

    useEffect(() => {
        fetchReturnedOverdues();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Returned Overdue Books</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lendings.map((lending) => (
                    <div key={lending._id} className="border rounded-xl p-4 shadow-md bg-white">
                        <p><strong>Reader:</strong> {lending.readerId.fullName}</p>
                        <p><strong>Book:</strong> {lending.bookId.title}</p>
                        <p><strong>Lend Date:</strong> {new Date(lending.lendDate).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> {new Date(lending.dueDate).toLocaleDateString()}</p>
                        <p><strong>Returned At:</strong> {new Date(lending.returnDate!).toLocaleDateString()}</p>
                        <p className="text-red-600"><strong>Fine Amount:</strong> Rs. {lending.fineAmount ?? 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReturnedOverduePage;
