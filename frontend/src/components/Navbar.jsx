import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../api/auth';

export default function Navbar({ unreadCount = 0 }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/', label: 'Marketplace' },
        { to: '/map', label: 'Map' },
        { to: '/my-listings', label: 'My Listings' },
        { to: '/chats', label: 'Chats', badge: unreadCount },
        { to: '/profile', label: 'Profile' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-indigo-600">
                            BlueMart
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(link.to)
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.label}
                                {link.badge > 0 && (
                                    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive(link.to)
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.label}
                                {link.badge > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}