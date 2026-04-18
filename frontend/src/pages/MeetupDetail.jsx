import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMeetup, deleteMeetup, rsvpMeetup, cancelRsvp } from '../api/meetups';
import { createMeetupConversation } from '../api/chats';
import MeetupMap from '../components/MeetupMap';
import AttendeeList from '../components/AttendeeList';

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

export default function MeetupDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meetup, setMeetup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isCreator = meetup && String(meetup.creator) === String(storedUser.id);

    useEffect(() => {
        getMeetup(id)
            .then(res => { setMeetup(res.data); setLoading(false); })
            .catch(() => { navigate('/map'); });
    }, [id, navigate]);

    const fetchMeetup = () => {
        getMeetup(id).then(res => setMeetup(res.data));
    };

    const handleRsvp = async (status = 'going') => {
        setRsvpLoading(true);
        try {
            await rsvpMeetup(id, status);
            fetchMeetup();
        } catch (err) {
            console.error('RSVP failed', err);
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleCancelRsvp = async () => {
        setRsvpLoading(true);
        try {
            await cancelRsvp(id);
            fetchMeetup();
        } catch (err) {
            console.error('Cancel RSVP failed', err);
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this meetup?')) return;
        try {
            await deleteMeetup(id);
            navigate('/map');
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleChat = async () => {
        try {
            const res = await createMeetupConversation(id, `Hi! I'm interested in the meetup: ${meetup.title}`);
            navigate(`/chats/${res.data.id}`);
        } catch (err) {
            console.error('Failed to start chat', err);
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
    if (!meetup) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {meetup.category_name && (
                            <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                style={{ backgroundColor: `${meetup.category_color}20`, color: meetup.category_color }}
                            >
                                {meetup.category_name}
                            </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[meetup.status]}`}>
                            {statusLabels[meetup.status]}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{meetup.title}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Created by{' '}
                        <Link to={`/profile/${meetup.creator_username}`} className="text-indigo-600 hover:text-indigo-700">
                            {meetup.creator_username}
                        </Link>
                    </p>
                </div>
                {isCreator && (
                    <div className="flex gap-2">
                        <Link
                            to={`/edit-meetup/${meetup.id}`}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {meetup.image && (
                <div className="rounded-lg overflow-hidden">
                    <img src={`${API_BASE}${meetup.image}`} alt={meetup.title} className="w-full max-h-80 object-cover" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h2 className="font-semibold text-gray-900 mb-2">Details</h2>
                        {meetup.description && <p className="text-sm text-gray-700 whitespace-pre-wrap">{meetup.description}</p>}
                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium text-gray-700">When:</span> {new Date(meetup.meetup_datetime).toLocaleString()}</p>
                            {meetup.location_text && <p><span className="font-medium text-gray-700">Where:</span> {meetup.location_text}</p>}
                            {meetup.max_attendees && <p><span className="font-medium text-gray-700">Max attendees:</span> {meetup.max_attendees}</p>}
                            <p><span className="font-medium text-gray-700">Going:</span> {meetup.attendee_count}{meetup.max_attendees ? ` / ${meetup.max_attendees}` : ''}</p>
                        </div>
                    </div>

                    {!isCreator && meetup.status !== 'cancelled' && meetup.status !== 'completed' && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h2 className="font-semibold text-gray-900 mb-3">RSVP</h2>
                            {!meetup.user_rsvp ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRsvp('going')}
                                        disabled={rsvpLoading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                                    >
                                        Going
                                    </button>
                                    <button
                                        onClick={() => handleRsvp('maybe')}
                                        disabled={rsvpLoading}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 text-sm font-medium"
                                    >
                                        Maybe
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">
                                        You are <span className="font-medium">{meetup.user_rsvp === 'going' ? 'Going' : 'Maybe'}</span>
                                    </span>
                                    <button
                                        onClick={handleCancelRsvp}
                                        disabled={rsvpLoading}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Cancel RSVP
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={handleChat}
                                className="mt-3 w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                            >
                                Message Organizer
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h2 className="font-semibold text-gray-900 mb-3">Attendees</h2>
                        <AttendeeList rsvps={meetup.rsvps} />
                    </div>
                </div>

                <div>
                    <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                        <MeetupMap
                            meetups={[meetup]}
                            center={[parseFloat(meetup.latitude), parseFloat(meetup.longitude)]}
                            zoom={15}
                        />
                    </div>
                    <div className="mt-2 flex justify-center">
                        <MarkerPin />
                        <span className="text-xs text-gray-500">{meetup.location_text || `${parseFloat(meetup.latitude).toFixed(4)}, ${parseFloat(meetup.longitude).toFixed(4)}`}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MarkerPin() {
    return <span className="text-lg mr-1">&#128205;</span>;
}