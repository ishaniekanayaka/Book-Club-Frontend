// components/modals/LendBookModal.tsx

import React, { useState } from "react"
import toast from "react-hot-toast"
import {lendBook} from "../services/LendingService.ts";


type Props = {
    bookTitle: string
    isbn: string
    onClose: () => void
}

const LendBookModal: React.FC<Props> = ({ isbn, onClose, bookTitle }) => {
    const [nicOrMemberId, setNicOrMemberId] = useState("")

    const handleLend = async () => {
        if (!nicOrMemberId.trim()) {
            toast.error("Please enter NIC or Member ID")
            return
        }

        try {
            await lendBook(nicOrMemberId.trim(), isbn)
            toast.success("Book lent successfully")
            onClose()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Lending failed")
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Lend: {bookTitle}</h2>
                <input
                    type="text"
                    placeholder="Enter NIC or Member ID"
                    value={nicOrMemberId}
                    onChange={(e) => setNicOrMemberId(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleLend}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Lend
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LendBookModal
