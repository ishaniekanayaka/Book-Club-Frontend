import { useEffect, useState } from "react";

import { getAllLendings, getOverdueLendings } from "../services/LendingService";
import type {Lending} from "../types/Lending.ts";
import LendingCard from "../components/card/LendingCard.tsx";


const LendingPage = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [filter, setFilter] = useState<"all" | "overdue">("all");

    const fetchLendings = async () => {
        try {
            const data = filter === "all" ? await getAllLendings() : await getOverdueLendings();
            setLendings(data);
        } catch (err) {
            console.error("Failed to fetch lendings", err);
        }
    };

    useEffect(() => {
        fetchLendings();
    }, [filter]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Lending Records</h2>

            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                    All Lendings
                </button>
                <button
                    onClick={() => setFilter("overdue")}
                    className={`px-4 py-2 rounded ${filter === "overdue" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                >
                    Overdue Only
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lendings.map((lending) => (
                    <LendingCard key={lending._id} lending={lending} onReturn={fetchLendings} />
                ))}
            </div>
        </div>
    );
};

export default LendingPage;
