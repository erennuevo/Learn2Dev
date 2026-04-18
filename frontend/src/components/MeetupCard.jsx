import { Link } from 'react-router-dom';

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

export default function MeetupCard({ meetup }) {
    return (
        <Link
            to={`/meetups/${meetup.id}`}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            {meetup.image && (
                <div className="w-full h-40 bg-gray-100">
                    <img
                        src={`${API_BASE}${meetup.image}`}
                        alt={meetup.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
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
                <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">{meetup.title}</h3>
                {meetup.location_text && (
                    <p className="mt-1 text-xs text-gray-500">{meetup.location_text}</p>
                )}
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {new Date(meetup.meetup_datetime).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                        {meetup.attendee_count} going
                    </span>
                </div>
            </div>
        </Link>
    );
}