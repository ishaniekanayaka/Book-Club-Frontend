import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { Reader } from "../types/Reader.ts"
import { addReader, deleteReader, getAllReaders, searchReader, updateReader } from "../services/ReaderService.ts"
import ReaderForm from "../components/forms/ReaderForm.tsx"
import ReadersTable from "../components/tables/ReadersTable.tsx"

const ReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([])
    const [editingReader, setEditingReader] = useState<Reader | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchReaders = async () => {
        const res = await getAllReaders()
        setReaders(res)
    }

    useEffect(() => {
        fetchReaders()
    }, [])

    const handleSubmit = async (data: FormData) => {
        try {
            if (editingReader) {
                await updateReader(editingReader._id, data)
                toast.success("Reader updated!")
            } else {
                await addReader(data)
                toast.success("Reader added!")
            }
            fetchReaders()
            setEditingReader(null)
        } catch (err) {
            toast.error("Failed to save reader.")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteReader(id)
            toast.success("Reader deleted!")
            fetchReaders()
        } catch (err) {
            toast.error("Delete failed")
        }
    }

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchReaders()
            return
        }

        const result = await searchReader(searchTerm.trim())
        if (result) {
            setReaders([result])
        } else {
            toast.error("Reader not found")
            setReaders([])
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Readers</h1>

            {/* 🔍 Search Bar */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search by Member ID or NIC"
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            <ReaderForm reader={editingReader!} onSubmit={handleSubmit} />
            <ReadersTable readers={readers} onEdit={setEditingReader} onDelete={handleDelete} />
        </div>
    )
}

export default ReadersPage
