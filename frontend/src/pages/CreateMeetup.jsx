import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeetup, getMeetupCategories } from '../api/meetups';
import LocationPicker from '../components/LocationPicker';

export default function CreateMeetup() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        location_text: '',
        category: '',
        meetup_datetime: '',
        max_attendees: '',
    });

    const minDatetime = new Date().toISOString().slice(0, 16);
    const [image, setImage] = useState(null);

    useEffect(() => {
        getMeetupCategories().then(res => setCategories(res.data.results || res.data)).catch(() => {});
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location) {
            setError('Please select a location on the map.');
            return;
        }
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== '' && value !== null) data.append(key, value);
        });
        data.append('latitude', parseFloat(location.latitude.toFixed(8)));
        data.append('longitude', parseFloat(location.longitude.toFixed(8)));
        if (image) data.append('image', image);

        try {
            await createMeetup(data);
            navigate('/map');
        } catch (err) {
            const msg = err.response?.data;
            setError(msg ? JSON.stringify(msg) : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Meetup</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-lg border border-gray-200 p-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="meetup_datetime"
                            value={form.meetup_datetime}
                            onChange={handleChange}
                            min={minDatetime}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                        <input
                            type="text"
                            name="location_text"
                            value={form.location_text}
                            onChange={handleChange}
                            placeholder="e.g., Central Park, NYC"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                        <input
                            type="number"
                            name="max_attendees"
                            value={form.max_attendees}
                            onChange={handleChange}
                            placeholder="Leave empty for unlimited"
                            min="1"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pick Location on Map</label>
                    <LocationPicker value={location} onChange={setLocation} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading ? 'Creating...' : 'Create Meetup'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}