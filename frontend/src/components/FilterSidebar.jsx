import { useState } from 'react';

export default function FilterSidebar({ filters, setFilters, categories }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            listing_type: '',
            category: '',
            condition: '',
            status: 'available',
            min_price: '',
            max_price: '',
            search: '',
            ordering: '-created_at',
        });
    };

    const content = (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-700">
                    Clear all
                </button>
            </div>

            {/* Search */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                    type="text"
                    value={filters.search}
                    onChange={e => handleChange('search', e.target.value)}
                    placeholder="Search listings..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            {/* Listing Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                    value={filters.listing_type}
                    onChange={e => handleChange('listing_type', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">All Types</option>
                    <option value="sell">For Sale</option>
                    <option value="borrow">For Borrow</option>
                </select>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    value={filters.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Condition */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                    value={filters.condition}
                    onChange={e => handleChange('condition', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">Any Condition</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                </select>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={filters.min_price}
                        onChange={e => handleChange('min_price', e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="Min"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        inputMode="decimal"
                        value={filters.max_price}
                        onChange={e => handleChange('max_price', e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="Max"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Sort */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                    value={filters.ordering}
                    onChange={e => handleChange('ordering', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                </select>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile filter toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                Filters
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/25" onClick={() => setMobileOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto z-50">
                        {content}
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:block w-64 shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                    {content}
                </div>
            </div>
        </>
    );
}