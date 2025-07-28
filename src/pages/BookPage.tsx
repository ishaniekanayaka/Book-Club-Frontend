import React, { useEffect, useState } from "react"
import { Search, BookOpen, Filter, Download, Plus, RefreshCw, Users, BookCopy } from "lucide-react"
import toast from "react-hot-toast"
import type { Book } from "../types/Book"
import { addBook, deleteBook, getAllBooks, updateBook } from "../services/BookService"
import { lendBook } from "../services/LendingService"
import BookForm from "../components/forms/BookForm"
import BookCard from "../components/card/BookCard"

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [lendingBook, setLendingBook] = useState<Book | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("All")
    const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all')
    const [sortBy, setSortBy] = useState<'title' | 'author' | 'date' | 'copies'>('title')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    // Lending modal states
    const [nicInput, setNicInput] = useState("")
    const [memberIdInput, setMemberIdInput] = useState("")
    const [isLending, setIsLending] = useState(false)

    const fetchBooks = async () => {
        setIsLoading(true)
        try {
            const res = await getAllBooks({})
            setBooks(res)
            setFilteredBooks(res)
            toast.success(`Loaded ${res.length} books successfully`)
        } catch (err) {
            toast.error("Failed to load books. Please try again.")
            console.error("Fetch books error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [])

    // Filter and sort books
    useEffect(() => {
        let filtered = [...books]

        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(term) ||
                book.author.toLowerCase().includes(term) ||
                (book.genre && book.genre.toLowerCase().includes(term)) ||
                (book.isbn && book.isbn.toLowerCase().includes(term)) ||
                (book.description && book.description.toLowerCase().includes(term))
            )
        }

        // Apply genre filter
        if (selectedGenre !== "All") {
            filtered = filtered.filter(book => book.genre === selectedGenre)
        }

        // Apply availability filter
        if (availabilityFilter === 'available') {
            filtered = filtered.filter(book => book.copiesAvailable > 0)
        } else if (availabilityFilter === 'unavailable') {
            filtered = filtered.filter(book => book.copiesAvailable === 0)
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title)
                    break
                case 'author':
                    comparison = a.author.localeCompare(b.author)
                    break
                case 'date':
                    const dateA = new Date(a.publishedDate || '').getTime()
                    const dateB = new Date(b.publishedDate || '').getTime()
                    comparison = dateA - dateB
                    break
                case 'copies':
                    comparison = a.copiesAvailable - b.copiesAvailable
                    break
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        setFilteredBooks(filtered)
    }, [books, searchTerm, selectedGenre, availabilityFilter, sortBy, sortOrder])

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true)
        try {
            if (editingBook) {
                await updateBook(editingBook._id, data)
                toast.success("Book updated successfully!")
            } else {
                await addBook(data)
                toast.success("Book added successfully!")
            }
            await fetchBooks()
            setEditingBook(null)
            setShowForm(false)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save book"
            toast.error(errorMessage)
            console.error("Save book error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const book = books.find(b => b._id === id)
        const confirmMessage = book
            ? `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this book?"

        if (!window.confirm(confirmMessage)) {
            return
        }

        setIsLoading(true)
        try {
            await deleteBook(id)
            toast.success("Book deleted successfully!")
            await fetchBooks()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete book"
            toast.error(errorMessage)
            console.error("Delete book error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLend = async () => {
        if (!nicInput.trim() && !memberIdInput.trim()) {
            toast.error("Please enter either NIC or Member ID")
            return
        }
        if (!lendingBook) return

        setIsLending(true)
        try {
            await lendBook(
                {
                    nic: nicInput.trim() || undefined,
                    memberId: memberIdInput.trim() || undefined,
                },
                lendingBook.isbn
            )
            toast.success(`"${lendingBook.title}" lent successfully!`)
            setLendingBook(null)
            setNicInput("")
            setMemberIdInput("")
            await fetchBooks()
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to lend book. Please try again."
            toast.error(errorMessage)
            console.error("Lending error:", err)
        } finally {
            setIsLending(false)
        }
    }

    const handleAddNew = () => {
        setEditingBook(null)
        setShowForm(true)
    }

    const handleEditBook = (book: Book) => {
        setEditingBook(book)
        setShowForm(true)
    }

    const handleCancelForm = () => {
        setEditingBook(null)
        setShowForm(false)
    }

    const handleRefresh = () => {
        fetchBooks()
        toast.success("Data refreshed!")
    }

    const handleExport = () => {
        try {
            const csvContent = [
                'Title,Author,Genre,ISBN,Published Date,Copies Available,Description',
                ...filteredBooks.map(book => [
                    book.title,
                    book.author,
                    book.genre || '',
                    book.isbn || '',
                    book.publishedDate || '',
                    book.copiesAvailable,
                    book.description || ''
                ].map(field => `"${field}"`).join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `books_${new Date().toISOString().split('T')[0]}.csv`
            link.click()
            window.URL.revokeObjectURL(url)

            toast.success(`Exported ${filteredBooks.length} books to CSV`)
        } catch (err) {
            toast.error("Failed to export data")
            console.error("Export error:", err)
        }
    }

    const handleClearFilters = () => {
        setSearchTerm("")
        setSelectedGenre("All")
        setAvailabilityFilter('all')
    }

    // Extract genres from books
    const genres = ["All", ...Array.from(new Set(books.map(b => b.genre).filter(Boolean)))]

    const stats = {
        total: books.length,
        available: books.filter(b => b.copiesAvailable > 0).length,
        unavailable: books.filter(b => b.copiesAvailable === 0).length,
        totalCopies: books.reduce((sum, book) => sum + book.copiesAvailable, 0),
        filtered: filteredBooks.length
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                                Books Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage your library's book collection and lending system
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
                                disabled={filteredBooks.length === 0}
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
                                Add Book
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Books</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                            <div className="text-sm text-gray-600">Available Books</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
                            <div className="text-sm text-gray-600">Out of Stock</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-purple-600">{stats.totalCopies}</div>
                            <div className="text-sm text-gray-600">Total Copies</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-orange-600">{stats.filtered}</div>
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
                                placeholder="Search by title, author, genre, ISBN, or description..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={availabilityFilter}
                                    onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable')}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Books</option>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Out of Stock</option>
                                </select>
                            </div>

                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-')
                                    setSortBy(field as 'title' | 'author' | 'date' | 'copies')
                                    setSortOrder(order as 'asc' | 'desc')
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="title-asc">Title A-Z</option>
                                <option value="title-desc">Title Z-A</option>
                                <option value="author-asc">Author A-Z</option>
                                <option value="author-desc">Author Z-A</option>
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="copies-desc">Most Copies</option>
                                <option value="copies-asc">Least Copies</option>
                            </select>

                            {(searchTerm || selectedGenre !== 'All' || availabilityFilter !== 'all') && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Genre Filter Pills */}
                    {genres.length > 1 && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Filter by Genre:</p>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre) => (
                                    <button
                                        key={genre}
                                        onClick={() => setSelectedGenre(genre)}
                                        className={`px-3 py-1 rounded-full text-sm border font-medium transition-all ${
                                            selectedGenre === genre
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                        }`}
                                    >
                                        {genre}
                                        {genre !== 'All' && (
                                            <span className="ml-1 text-xs opacity-75">
                                                ({books.filter(b => b.genre === genre).length})
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {(searchTerm || selectedGenre !== 'All' || availabilityFilter !== 'all') && (
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
                            {selectedGenre !== 'All' && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                    Genre: {selectedGenre}
                                    <button
                                        onClick={() => setSelectedGenre('All')}
                                        className="hover:text-green-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {availabilityFilter !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                                    Status: {availabilityFilter}
                                    <button
                                        onClick={() => setAvailabilityFilter('all')}
                                        className="hover:text-purple-900"
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
                    <BookForm
                        book={editingBook ?? undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancelForm}
                        isLoading={isLoading}
                    />
                )}

                {/* Lending Modal */}
                {lendingBook && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        Lend Book
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setLendingBook(null)
                                            setNicInput("")
                                            setMemberIdInput("")
                                        }}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLending}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-medium text-blue-900">"{lendingBook.title}"</h3>
                                    <p className="text-sm text-blue-700">by {lendingBook.author}</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {lendingBook.copiesAvailable} copies available
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Member NIC
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter member's NIC number"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={nicInput}
                                            onChange={(e) => setNicInput(e.target.value)}
                                            disabled={isLending}
                                        />
                                    </div>

                                    <div className="text-center">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                            OR
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Member ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter member ID"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={memberIdInput}
                                            onChange={(e) => setMemberIdInput(e.target.value)}
                                            disabled={isLending}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setLendingBook(null)
                                            setNicInput("")
                                            setMemberIdInput("")
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        disabled={isLending}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLend}
                                        disabled={isLending || (!nicInput.trim() && !memberIdInput.trim())}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {isLending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Lending...
                                            </>
                                        ) : (
                                            <>
                                                <BookCopy className="w-4 h-4" />
                                                Lend Book
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {!isLoading && filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <BookCard
                                key={book._id}
                                book={book}
                                onEdit={handleEditBook}
                                onDelete={handleDelete}
                                onClick={() => setLendingBook(book)}
                            />
                        ))
                    ) : isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                <div className="bg-gray-300 h-3 rounded mb-2"></div>
                                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm || selectedGenre !== 'All' || availabilityFilter !== 'all'
                                        ? "Try adjusting your search criteria or filters."
                                        : "Start by adding your first book to the collection."}
                                </p>
                                {(searchTerm || selectedGenre !== 'All' || availabilityFilter !== 'all') && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Info */}
                {!isLoading && filteredBooks.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <span>
                            Showing {filteredBooks.length} of {books.length} books
                            {searchTerm && ` for "${searchTerm}"`}
                            {selectedGenre !== 'All' && ` in ${selectedGenre}`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BooksPage