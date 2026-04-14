import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getListings, getCategories } from '../api/listings';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';

export default function Marketplace() {
    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        listing_type: '',
        category: '',
        condition: '',
        status: 'available',
        min_price: '',
        max_price: '',
        search: '',
        ordering: '-created_at',
    });
    const abortRef = useRef(null);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data.results || res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        // Cancel previous request if still pending
        if (abortRef.current) {
            abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });

        getListings(params, { signal: controller.signal })
            .then(res => {
                setListings(res.data.results || res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [filters]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                <Link
                    to="/create-listing"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    + New Listing
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                />

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">
                            {loading ? 'Searching...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {loading && listings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">Loading listings...</div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No listings found.</p>
                            <Link to="/create-listing" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
                                Create the first listing!
                            </Link>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                                : 'space-y-4'
                        }>
                            {listings.map(listing => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}