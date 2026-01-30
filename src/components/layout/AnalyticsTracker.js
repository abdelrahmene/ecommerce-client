import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store/api';

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Generate or get session ID from localStorage
        let sessionId = localStorage.getItem('birk_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('birk_session_id', sessionId);
        }

        const trackActivity = async () => {
            try {
                await axios.post(`${API_URL}/analytics/track`, {
                    sessionId,
                    path: location.pathname
                });
            } catch (err) {
                // Silent fail for analytics
                console.warn('Analytics tracking failed');
            }
        };

        // Track on mount / path change
        trackActivity();

        // Heartbeat every 2 minutes
        const interval = setInterval(trackActivity, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, [location.pathname]);

    return null;
};

export default AnalyticsTracker;
