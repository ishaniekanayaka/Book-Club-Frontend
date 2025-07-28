import React, { useEffect, useState } from "react"
import { Search, Users, RefreshCw, Filter, Download, Plus } from "lucide-react"
import toast from "react-hot-toast"
import type { Reader, ReaderFormData } from "../types/Reader"
import { addReader, deleteReader, getAllReaders, searchReader, updateReader } from "../services/ReaderService"
import ReaderForm from "../components/forms/ReaderForm"
import ReadersTable from "../components/tables/ReadersTable"

const ReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([])
    const [filteredReaders, setFilteredReaders] = useState<Reader[]>([])
    const [editingReader, setEditingReader] = useState<Reader | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'email'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    const fetchReaders = async () => {
        setIsLoading(true)
        try {
            const res = await getAllReaders()
            setReaders(res)
            setFilteredReaders(res)
            toast.success(`Loaded ${res.length} readers successfully`)
        } catch (err) {
            toast.error("Failed to fetch readers. Please try again.")
            console.error("Fetch readers error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReaders()
    }, [])

    // Filter and sort readers
    useEffect(() => {
        let filtered = [...readers]

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(reader =>
                (reader.status || 'active') === filterStatus
            )
        }

        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(reader =>
                reader.fullName.toLowerCase().includes(term) ||
                reader.email.toLowerCase().includes(term) ||
                reader.nic.toLowerCase().includes(term) ||
                (reader.phone && reader.phone.toLowerCase().includes(term)) ||
                (reader.address && reader.address.toLowerCase().includes(term))
            )
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case 'name':
                    comparison = a.fullName.localeCompare(b.fullName)
                    break
                case 'email':
                    comparison = a.email.localeCompare(b.email)
                    break
                case 'date':
                    const dateA = new Date(a.dateOfBirth || '').getTime()
                    const dateB = new Date(b.dateOfBirth || '').getTime()
                    comparison = dateA - dateB
                    break
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        setFilteredReaders(filtered)
    }, [readers, searchTerm, filterStatus, sortBy, sortOrder])

    const handleSubmit = async (data: ReaderFormData) => {
        setIsLoading(true)
        try {
            if (editingReader) {
                await updateReader(editingReader._id, data)
                toast.success("Reader updated successfully!")
            } else {
                await addReader(data)
                toast.success("Reader added successfully!")
            }
            await fetchReaders()
            setEditingReader(null)
            setShowForm(false)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save reader"
            toast.error(errorMessage)
            console.error("Save reader error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const reader = readers.find(r => r._id === id)
        const confirmMessage = reader
            ? `Are you sure you want to delete "${reader.fullName}"? This action cannot be undone.`
            : "Are you sure you want to delete this reader?"

        if (!window.confirm(confirmMessage)) {
            return
        }

        setIsLoading(true)
        try {
            await deleteReader(id)
            toast.success("Reader deleted successfully!")
            await fetchReaders()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete reader"
            toast.error(errorMessage)
            console.error("Delete reader error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            return
        }

        setIsSearching(true)
        try {
            const result = await searchReader(searchTerm.trim())
            if (result) {
                setReaders([result])
                setFilteredReaders([result])
                toast.success("Reader found!")
            } else {
                toast.error("No reader found matching your search")
                setFilteredReaders([])
            }
        } catch (err) {
            toast.error("Search failed. Please try again.")
            console.error("Search error:", err)
        } finally {
            setIsSearching(false)
        }
    }

    const handleClearSearch = () => {
        setSearchTerm("")
        setFilterStatus('all')
        fetchReaders()
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleEditReader = (reader: Reader) => {
        setEditingReader(reader)
        setShowForm(true)
    }

    const handleAddNew = () => {
        setEditingReader(null)
        setShowForm(true)
    }

    const handleCancelForm = () => {
        setEditingReader(null)
        setShowForm(false)
    }

    const handleRefresh = () => {
        fetchReaders()
        toast.success("Data refreshed!")
    }

    const handleExport = () => {
        try {
            const csvContent = [
                'Full Name,Email,NIC,Phone,Address,Date of Birth,Status',
                ...filteredReaders.map(reader => [
                    reader.fullName,
                    reader.email,
                    reader.nic,
                    reader.phone || '',
                    reader.address || '',
                    reader.dateOfBirth || '',
                    reader.status || 'active'
                ].join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `readers_${new Date().toISOString().split('T')[0]}.csv`
            link.click()
            window.URL.revokeObjectURL(url)

            toast.success(`Exported ${filteredReaders.length} readers to CSV`)
        } catch (err) {
            toast.error("Failed to export data")
            console.error("Export error:", err)
        }
    }

    const stats = {
        total: readers.length,
        active: readers.filter(r => (r.status || 'active') === 'active').length,
        inactive: readers.filter(r => r.status === 'inactive').length,
        filtered: filteredReaders.length
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                Readers Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage library members and their information
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                title="Refresh data"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={filteredReaders.length === 0}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                title="Export to CSV"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button
                                onClick={handleAddNew}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Reader
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Readers</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                            <div className="text-sm text-gray-600">Active Members</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                            <div className="text-sm text-gray-600">Inactive Members</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-purple-600">{stats.filtered}</div>
                            <div className="text-sm text-gray-600">Showing Results</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, NIC, phone, or address..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-')
                                    setSortBy(field as 'name' | 'date' | 'email')
                                    setSortOrder(order as 'asc' | 'desc')
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="email-asc">Email A-Z</option>
                                <option value="email-desc">Email Z-A</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="date-desc">Youngest First</option>
                            </select>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching || !searchTerm.trim()}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSearching ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                    Search
                                </button>

                                {(searchTerm || filterStatus !== 'all') && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(searchTerm || filterStatus !== 'all') && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                    Search: "{searchTerm}"
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="hover:text-blue-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filterStatus !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                    Status: {filterStatus}
                                    <button
                                        onClick={() => setFilterStatus('all')}
                                        className="hover:text-green-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Form Section */}
                {showForm && (
                    <ReaderForm
                        reader={editingReader ?? undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancelForm}
                        isLoading={isLoading}
                    />
                )}

                {/* Table Section */}
                <ReadersTable
                    readers={filteredReaders}
                    onEdit={handleEditReader}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />

                {/* Results Info */}
                {!isLoading && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        {filteredReaders.length === 0 ? (
                            <span>No readers found matching your criteria</span>
                        ) : (
                            <span>
                                Showing {filteredReaders.length} of {readers.length} readers
                                {searchTerm && ` for "${searchTerm}"`}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReadersPage