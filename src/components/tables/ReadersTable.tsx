import React from "react"
import type { Reader } from "../../types/Reader"

type Props = {
    readers: Reader[]
    onEdit: (reader: Reader) => void
    onDelete: (id: string) => void
}

const ReadersTable: React.FC<Props> = ({ readers, onEdit, onDelete }) => {
    return (
        <table className="min-w-full border mt-4">
            <thead className="bg-gray-100">
            <tr>
                <th className="p-2 border">Full Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">NIC</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Actions</th>
            </tr>
            </thead>
            <tbody>
            {readers.map((reader) => (
                <tr key={reader._id} className="text-center">
                    <td className="p-2 border">{reader.fullName}</td>
                    <td className="p-2 border">{reader.email}</td>
                    <td className="p-2 border">{reader.nic}</td>
                    <td className="p-2 border">{reader.phone}</td>
                    <td className="p-2 border">{reader.address}</td>
                    <td className="p-2 border space-x-2">
                        <button onClick={() => onEdit(reader)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => onDelete(reader._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ReadersTable
