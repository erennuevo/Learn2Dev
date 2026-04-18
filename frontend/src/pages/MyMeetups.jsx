import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyMeetups, deleteMeetup } from '../api/meetups';

const API_BASE = 'http://127.0.0.1:8000';

const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export default function MyMeetups() {
    const navigate = useNavigate();
    const [meetups, setMeetups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyMeetups()
            .then(res => { setMeetups(res.data.results || res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meetup?')) return;
        try {
            await deleteMeetup(id);
            setMeetups(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Meetups</h1>
                <Link
                    to="/create-meetup"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    + New Meetup
                </Link>
            </div>

            {meetups.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-lg">You haven't created any meetups yet.</p>
                    <Link to="/create-meetup" className="mt-2 inline-block text-indigo-600 hover:text-indigo-700">
                        Create one!
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meetup</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Going</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {meetups.map(meetup => (
                                <tr key={meetup.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {meetup.image && (
                                                <img src={`${API_BASE}${meetup.image}`} alt="" className="w-10 h-10 rounded object-cover" />
                                            )}
                                            <Link to={`/meetups/${meetup.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                                                {meetup.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(meetup.meetup_datetime).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            meetup.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                            meetup.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                                            meetup.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {statusLabels[meetup.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {meetup.attendee_count}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <Link
                                            to={`/edit-meetup/${meetup.id}`}
                                            className="text-sm text-indigo-600 hover:text-indigo-700"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(meetup.id)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}