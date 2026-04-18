import { useState } from 'react';

export default function MeetupFilters({ filters, setFilters, categories }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            status: 'upcoming',
            search: '',
            ordering: 'meetup_datetime',
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                    type="text"
                    value={filters.search}
                    onChange={e => handleChange('search', e.target.value)}
                    placeholder="Search meetups..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    value={filters.status}
                    onChange={e => handleChange('status', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                    value={filters.ordering}
                    onChange={e => handleChange('ordering', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="meetup_datetime">Soonest First</option>
                    <option value="-meetup_datetime">Latest First</option>
                    <option value="-created_at">Newly Created</option>
                </select>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                Filters
            </button>
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/25" onClick={() => setMobileOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto z-50">
                        {content}
                    </div>
                </div>
            )}
            <div className="hidden lg:block w-64 shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                    {content}
                </div>
            </div>
        </>
    );
}