import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '../api/profiles';
import { getListings } from '../api/listings';
import ListingCard from '../components/ListingCard';

const API_BASE = 'http://127.0.0.1:8000';

export default function PublicProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getPublicProfile(username),
            getListings({ seller: '' }), // We'll filter after getting all listings
        ])
            .then(([profileRes]) => {
                setProfile(profileRes.data);
                // Get this user's available listings
                return getListings({ search: '', status: 'available' });
            })
            .then(res => {
                const allListings = res.data.results || res.data;
                const userListings = allListings.filter(
                    l => l.seller_username === username
                );
                setListings(userListings);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [username]);

    if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
    if (!profile) return <div className="text-center py-12 text-gray-500">User not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden shrink-0">
                        {profile.avatar ? (
                            <img src={`${API_BASE}${profile.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 font-bold">
                                {profile.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                        {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
                        <p className="text-sm text-gray-500 mt-1">
                            {profile.listing_count} active listing{profile.listing_count !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {profile.bio && (
                    <p className="mt-4 text-gray-600">{profile.bio}</p>
                )}
            </div>

            {listings.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Listings by {profile.username}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}