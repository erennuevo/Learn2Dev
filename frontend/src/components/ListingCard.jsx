import { Link } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000';

export default function ListingCard({ listing, viewMode = 'grid' }) {
    const typeColors = {
        sell: 'bg-green-100 text-green-700',
        borrow: 'bg-blue-100 text-blue-700',
    };

    const statusLabels = {
        available: 'Available',
        sold: 'Sold',
        borrowed: 'Borrowed',
        returned: 'Returned',
    };

    const conditionLabels = {
        new: 'New',
        like_new: 'Like New',
        good: 'Good',
        fair: 'Fair',
    };

    if (viewMode === 'list') {
        return (
            <Link
                to={`/listing/${listing.id}`}
                className="flex bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
                <div className="w-32 h-32 shrink-0 bg-gray-100">
                    {listing.image ? (
                        <img
                            src={`${API_BASE}${listing.image}`}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{listing.title}</h3>
                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[listing.listing_type]}`}>
                            {listing.listing_type === 'sell' ? 'For Sale' : 'For Borrow'}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{listing.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-gray-900">${listing.price}</span>
                        {listing.condition && <span>{conditionLabels[listing.condition] || listing.condition}</span>}
                        {listing.location && <span>{listing.location}</span>}
                        <span>by {listing.seller_username}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/listing/${listing.id}`}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            <div className="w-full h-48 bg-gray-100">
                {listing.image ? (
                    <img
                        src={`${API_BASE}${listing.image}`}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[listing.listing_type]}`}>
                        {listing.listing_type === 'sell' ? 'For Sale' : 'For Borrow'}
                    </span>
                    {listing.condition && (
                        <span className="text-xs text-gray-500">{conditionLabels[listing.condition] || listing.condition}</span>
                    )}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${listing.price}</span>
                    <span className="text-xs text-gray-500">{listing.seller_username}</span>
                </div>
            </div>
        </Link>
    );
}