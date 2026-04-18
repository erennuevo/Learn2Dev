import { Link } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000';

export default function AttendeeList({ rsvps = [] }) {
    const going = rsvps.filter(r => r.status === 'going');
    const maybe = rsvps.filter(r => r.status === 'maybe');

    return (
        <div className="space-y-4">
            {going.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Going ({going.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {going.map(rsvp => (
                            <Link
                                key={rsvp.id}
                                to={`/profile/${rsvp.username}`}
                                className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm text-green-700 hover:bg-green-100"
                            >
                                {rsvp.avatar ? (
                                    <img src={`${API_BASE}${rsvp.avatar}`} alt="" className="w-5 h-5 rounded-full object-cover" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-xs">
                                        {rsvp.username[0]?.toUpperCase()}
                                    </div>
                                )}
                                {rsvp.username}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {maybe.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Maybe ({maybe.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {maybe.map(rsvp => (
                            <Link
                                key={rsvp.id}
                                to={`/profile/${rsvp.username}`}
                                className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 text-sm text-yellow-700 hover:bg-yellow-100"
                            >
                                {rsvp.avatar ? (
                                    <img src={`${API_BASE}${rsvp.avatar}`} alt="" className="w-5 h-5 rounded-full object-cover" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-yellow-200 flex items-center justify-center text-xs">
                                        {rsvp.username[0]?.toUpperCase()}
                                    </div>
                                )}
                                {rsvp.username}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {going.length === 0 && maybe.length === 0 && (
                <p className="text-sm text-gray-500">No attendees yet. Be the first to RSVP!</p>
            )}
        </div>
    );
}