import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, deleteListing } from '../api/listings';
import { createConversation } from '../api/chats';

const API_BASE = 'http://127.0.0.1:8000';

export default function ListingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contacting, setContacting] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = listing && String(listing.seller) === String(storedUser.id);

    useEffect(() => {
        getListing(id)
            .then(res => setListing(res.data))
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleContact = async () => {
        if (contacting) return;
        setContacting(true);
        try {
            const res = await createConversation(listing.id, 'Hi, I am interested in your listing!');
            navigate(`/chats/${res.data.id}`);
        } catch (err) {
            console.error('Failed to start conversation', err);
        } finally {
            setContacting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await deleteListing(listing.id);
            navigate('/');
        } catch (err) {
            console.error('Failed to delete listing', err);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
    if (!listing) return null;

    const typeLabels = { sell: 'For Sale', borrow: 'For Borrow' };
    const typeColors = { sell: 'bg-green-100 text-green-700', borrow: 'bg-blue-100 text-blue-700' };
    const conditionLabels = { new: 'New', like_new: 'Like New', good: 'Good', fair: 'Fair' };
    const statusLabels = { available: 'Available', sold: 'Sold', borrowed: 'Borrowed', returned: 'Returned' };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-indigo-600 hover:text-indigo-700"
            >
                &larr; Back
            </button>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {listing.image && (
                    <img
                        src={`${API_BASE}${listing.image}`}
                        alt={listing.title}
                        className="w-full h-72 object-cover"
                    />
                )}

                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[listing.listing_type]}`}>
                                    {typeLabels[listing.listing_type]}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    listing.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {statusLabels[listing.status]}
                                </span>
                                {listing.condition && (
                                    <span className="text-sm text-gray-500">{conditionLabels[listing.condition]}</span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">${listing.price}</span>
                    </div>

                    <div className="mt-4 text-gray-600 whitespace-pre-wrap">{listing.description}</div>

                    <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                        {listing.category_name && <span>Category: {listing.category_name}</span>}
                        {listing.location && <span>Location: {listing.location}</span>}
                        <span>Seller: {listing.seller_username}</span>
                    </div>

                    <div className="mt-6 flex gap-3">
                        {!isOwner && (
                            <button
                                onClick={handleContact}
                                disabled={contacting || listing.status !== 'available'}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {contacting ? 'Starting chat...' : 'Contact Seller'}
                            </button>
                        )}
                        {isOwner && (
                            <>
                                <button
                                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                    className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-white text-red-600 rounded-lg border border-red-300 hover:bg-red-50 transition-colors font-medium"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}