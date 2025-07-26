
import toast from "react-hot-toast";
import {returnBook} from "../../services/LendingService.ts";
import type {Lending} from "../../types/Lending.ts";

interface Props {
    lending: Lending;
    onReturn: () => void;
}

const LendingCard = ({ lending, onReturn }: Props) => {
    const handleReturn = async () => {
        try {
            await returnBook(lending._id);
            toast.success("Book marked as returned");
            onReturn();
        } catch (err) {
            toast.error("Failed to return book");
        }
    };

    return (
        <div className="border rounded-xl p-4 shadow bg-white space-y-2">
            <p><strong>Reader:</strong> {lending.readerId?.fullName}</p>
            <p><strong>Book:</strong> {lending.bookId?.title}</p>
            <p><strong>Lend Date:</strong> {new Date(lending.lendDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> {new Date(lending.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {lending.isReturned ? "Returned" : "Borrowed"}</p>
            {lending.returnDate && (
                <p><strong>Returned At:</strong> {new Date(lending.returnDate).toLocaleDateString()}</p>
            )}

            {!lending.isReturned && (
                <button
                    onClick={handleReturn}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Mark as Returned
                </button>
            )}
        </div>
    );
};

export default LendingCard;
