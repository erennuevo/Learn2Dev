import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import usePolling from '../hooks/usePolling';
import { getConversation, getMessages, sendMessage, markMessagesRead } from '../api/chats';

const API_BASE = 'http://127.0.0.1:8000';

export default function ChatDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        getConversation(id).then(res => setConversation(res.data)).catch(() => {
            setError('Conversation not found');
        });
    }, [id]);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await getMessages(id);
            setMessages(res.data.results || res.data);
        } catch {}
    }, [id]);

    usePolling(fetchMessages, 5000);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Mark messages as read when viewing
        markMessagesRead(id).catch(() => {});
    }, [id]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(id, newMessage.trim());
            setNewMessage('');
            // Immediately refetch messages
            const res = await getMessages(id);
            setMessages(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{error}</p>
                <Link to="/chats" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
                    Back to chats
                </Link>
            </div>
        );
    }

    if (!conversation) {
        return <div className="text-center py-12 text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            {/* Header */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0 p-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/chats')}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                        &larr; Back to chats
                    </button>
                    <div className="text-center">
                        <span className="font-medium text-gray-900">{conversation.other_user?.username}</span>
                        <p className="text-xs text-gray-500">
                            Re: {conversation.listing_title}
                        </p>
                    </div>
                    <div className="w-20"></div> {/* spacer for centering */}
                </div>

                {/* Listing card */}
                {conversation.listing_image && (
                    <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-md p-2">
                        <img
                            src={`${API_BASE}${conversation.listing_image}`}
                            alt={conversation.listing_title}
                            className="w-10 h-10 rounded object-cover"
                        />
                        <div className="text-sm">
                            <Link to={`/listing/${conversation.listing}`} className="font-medium text-gray-900 hover:text-indigo-600">
                                {conversation.listing_title}
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 border-x border-gray-200 p-4 space-y-3">
                {messages.map(msg => {
                    const isMe = msg.sender_username === JSON.parse(localStorage.getItem('user') || '{}').username;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                isMe
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-900'
                            }`}>
                                {!isMe && (
                                    <p className={`text-xs font-medium ${isMe ? 'text-indigo-200' : 'text-gray-500'} mb-0.5`}>
                                        {msg.sender_username}
                                    </p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-4 flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                    Send
                </button>
            </form>
        </div>
    );
}