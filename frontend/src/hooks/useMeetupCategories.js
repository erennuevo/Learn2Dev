import { useState, useEffect } from 'react';
import { getMeetupCategories } from '../api/meetups';

export default function useMeetupCategories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getMeetupCategories()
            .then(res => setCategories(res.data.results || res.data))
            .catch(() => {});
    }, []);

    return categories;
}