import React, { useEffect, useState } from "react"

import toast from "react-hot-toast"
import type {Reader} from "../types/Reader.ts";
import {addReader, deleteReader, getAllReaders, updateReader} from "../services/ReaderService.ts";
import ReaderForm from "../components/forms/ReaderForm.tsx";
import ReadersTable from "../components/tables/ReadersTable.tsx";

const ReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([])
    const [editingReader, setEditingReader] = useState<Reader | null>(null)

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

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Readers</h1>
            <ReaderForm reader={editingReader!} onSubmit={handleSubmit} />
            <ReadersTable readers={readers} onEdit={setEditingReader} onDelete={handleDelete} />
        </div>
    )
}

export default ReadersPage
