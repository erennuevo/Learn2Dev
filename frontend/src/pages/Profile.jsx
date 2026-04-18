import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/profiles';

const API_BASE = 'http://127.0.0.1:8000';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        bio: '',
        location: '',
        phone: '',
    });
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        getProfile()
            .then(res => {
                setProfile(res.data);
                setForm({
                    bio: res.data.bio || '',
                    location: res.data.location || '',
                    phone: res.data.phone || '',
                });
            })
            .catch(() => setError('Failed to load profile'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        const data = new FormData();
        data.append('bio', form.bio);
        data.append('location', form.location);
        data.append('phone', form.phone);
        if (avatar) data.append('avatar', avatar);

        try {
            const res = await updateProfile(data);
            setProfile(res.data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-lg border border-gray-200 p-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
                        {profile?.avatar ? (
                            <img src={`${API_BASE}${profile.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 font-bold">
                                {profile?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setAvatar(e.target.files[0])}
                                className="hidden"
                            />
                        </label>
                        {avatar && <p className="mt-1 text-xs text-gray-500">{avatar.name}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        value={profile?.username || ''}
                        disabled
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={form.location}
                            onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="City, State"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}