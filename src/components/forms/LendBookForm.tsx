import React, { useState } from "react"
import toast from "react-hot-toast"
import apiClient from "../../services/apiClient.ts";


const LendBookForm: React.FC = () => {
    const [memberId, setMemberId] = useState("")
    const [nic, setNic] = useState("")
    const [isbn, setIsbn] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isbn.trim()) {
            toast.error("Book ISBN is required")
            return
        }

        if (!memberId.trim() && !nic.trim()) {
            toast.error("Enter either Member ID or NIC")
            return
        }

        try {
            setLoading(true)
            await apiClient.post("/lending/lend", {
                memberId: memberId.trim() || undefined,
                nic: nic.trim() || undefined,
                isbn: isbn.trim(),
            });
            toast.success("Book lent successfully")
            setMemberId("")
            setNic("")
            setIsbn("")
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to lend book")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Lend a Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Member ID</label>
                    <input
                        type="text"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        placeholder="Optional if NIC is provided"
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">NIC</label>
                    <input
                        type="text"
                        value={nic}
                        onChange={(e) => setNic(e.target.value)}
                        placeholder="Optional if Member ID is provided"
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Book ISBN</label>
                    <input
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        placeholder="Required"
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Lending..." : "Lend Book"}
                </button>
            </form>
        </div>
    )
}

export default LendBookForm
