import { useState, useEffect, useRef } from 'react';
import { getMeetups } from '../api/meetups';

export default function useMeetups(filters = {}) {
    const [meetups, setMeetups] = useState([]);
    const [loading, setLoading] = useState(true);
    const abortRef = useRef(null);

    useEffect(() => {
        if (abortRef.current) {
            abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params[key] = value;
            }
        });

        getMeetups(params, { signal: controller.signal })
            .then(res => {
                setMeetups(res.data.results || res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [JSON.stringify(filters)]);

    return { meetups, setMeetups, loading };
}