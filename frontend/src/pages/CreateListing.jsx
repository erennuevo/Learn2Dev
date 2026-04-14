import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListing, createListing, updateListing, getCategories } from '../api/listings';

export default function CreateListing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        description: '',
        listing_type: 'sell',
        category: '',
        price: '',
        condition: '',
        location: '',
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (isEditing) {
            getListing(id).then(res => {
                const l = res.data;
                setForm({
                    title: l.title,
                    description: l.description,
                    listing_type: l.listing_type,
                    category: l.category || '',
                    price: l.price,
                    condition: l.condition,
                    location: l.location,
                });
            }).catch(() => navigate('/'));
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== '' && value !== null) data.append(key, value);
        });
        if (image) data.append('image', image);

        try {
            if (isEditing) {
                await updateListing(id, data);
            } else {
                await createListing(data);
            }
            navigate(isEditing ? `/listing/${id}` : '/my-listings');
        } catch (err) {
            const msg = err.response?.data;
            setError(msg ? JSON.stringify(msg) : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditing ? 'Edit Listing' : 'Create Listing'}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-lg border border-gray-200 p-6">
                {/* Listing Type Toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, listing_type: 'sell' }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                form.listing_type === 'sell'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            For Sale
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, listing_type: 'borrow' }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                form.listing_type === 'borrow'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            For Borrow
                        </button>
                    </div>
                </div>

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
                        required
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

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
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <select
                            name="condition"
                            value={form.condition}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="">Select condition</option>
                            <option value="new">New</option>
                            <option value="like_new">Like New</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
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
                        {loading ? 'Saving...' : (isEditing ? 'Update Listing' : 'Create Listing')}
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