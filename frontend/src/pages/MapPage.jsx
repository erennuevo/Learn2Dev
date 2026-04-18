import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useMeetups from '../hooks/useMeetups';
import useMeetupCategories from '../hooks/useMeetupCategories';
import MeetupMap from '../components/MeetupMap';
import MeetupFilters from '../components/MeetupFilters';

const API_BASE = 'http://127.0.0.1:8000';

const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
};

export default function MapPage() {
    const navigate = useNavigate();
    const categories = useMeetupCategories();
    const [filters, setFilters] = useState({
        category: '',
        status: 'upcoming',
        search: '',
        ordering: 'meetup_datetime',
    });
    const [flyTo, setFlyTo] = useState(null);
    // Fetch ALL meetups for the list (no bbox filtering)
    const { meetups, loading } = useMeetups(filters);

    const handleMarkerClick = useCallback((meetup) => {
        navigate(`/meetups/${meetup.id}`);
    }, [navigate]);

    const handleListClick = (meetup) => {
        setFlyTo({ latitude: parseFloat(meetup.latitude), longitude: parseFloat(meetup.longitude) });
        setTimeout(() => {
            document.getElementById('map-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Meetups Map</h1>
                <Link
                    to="/create-meetup"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    + New Meetup
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <MeetupFilters
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                />

                <div className="flex-1 space-y-6">
                    <div id="map-container" className="h-96 lg:h-[500px] rounded-lg overflow-hidden border border-gray-200">
                        <MeetupMap
                            meetups={meetups}
                            onMarkerClick={handleMarkerClick}
                            flyTo={flyTo}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            {loading ? 'Loading...' : `${meetups.length} meetup${meetups.length !== 1 ? 's' : ''}`}
                        </h2>

                        {meetups.length === 0 && !loading ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <p className="text-gray-500 text-lg">No meetups found.</p>
                                <Link to="/create-meetup" className="mt-2 inline-block text-indigo-600 hover:text-indigo-700">
                                    Create one!
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {meetups.map(meetup => (
                                    <button
                                        key={meetup.id}
                                        onClick={() => handleListClick(meetup)}
                                        className="w-full text-left bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all p-4 flex items-start gap-4"
                                    >
                                        {meetup.image ? (
                                            <img
                                                src={`${API_BASE}${meetup.image}`}
                                                alt=""
                                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                                            />
                                        ) : (
                                            <div
                                                className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center text-white text-xl font-bold"
                                                style={{ backgroundColor: meetup.category_color || '#4F46E5' }}
                                            >
                                                {meetup.title[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {meetup.category_name && (
                                                    <span
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                                        style={{ backgroundColor: `${meetup.category_color || '#4F46E5'}20`, color: meetup.category_color || '#4F46E5' }}
                                                    >
                                                        {meetup.category_name}
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[meetup.status]}`}>
                                                    {statusLabels[meetup.status]}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{meetup.title}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                {meetup.location_text && <span>{meetup.location_text}</span>}
                                                <span>{new Date(meetup.meetup_datetime).toLocaleDateString()}</span>
                                                <span>{meetup.attendee_count} going</span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}