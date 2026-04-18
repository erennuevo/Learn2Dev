import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import usePolling from '../hooks/usePolling';
import { getConversations, getUnreadCount } from '../api/chats';

const API_BASE = 'http://127.0.0.1:8000';

export default function ChatList() {
    const [conversations, setConversations] = useState([]);
    const [unreadTotal, setUnreadTotal] = useState(0);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await getConversations();
            setConversations(res.data.results || res.data);
        } catch {}
    }, []);

    const fetchUnread = useCallback(async () => {
        try {
            const res = await getUnreadCount();
            setUnreadTotal(res.data.unread_count);
        } catch {}
    }, []);

    usePolling(fetchConversations, 5000);
    usePolling(fetchUnread, 30000);

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

            {conversations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">No conversations yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Start a conversation by contacting a seller from a listing page.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {conversations.map(conv => (
                        <Link
                            key={conv.id}
                            to={`/chats/${conv.id}`}
                            className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                                        {conv.other_user?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{conv.other_user?.username}</span>
                                            <span className="text-xs text-gray-400">about {conv.listing_title}</span>
                                        </div>
                                        {conv.last_message && (
                                            <p className="text-sm text-gray-500 truncate">{conv.last_message.sender}: {conv.last_message.content}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {conv.unread_count > 0 && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}