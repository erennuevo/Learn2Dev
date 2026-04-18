import { useState, useEffect } from 'react';
import { getMeetup } from '../api/meetups';

export default function useMeetup(id) {
    const [meetup, setMeetup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getMeetup(id)
            .then(res => { setMeetup(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    return { meetup, setMeetup, loading };
}