import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store/api';

export const useLoyalty = () => {
    const [loyaltyInfo, setLoyaltyInfo] = useState(null);
    const [checkingLoyalty, setCheckingLoyalty] = useState(false);

    const checkLoyaltyStatus = async (phone) => {
        const cleanPhone = phone.replace(/\s/g, '');

        if (cleanPhone.length !== 10) {
            setLoyaltyInfo(null);
            return;
        }

        setCheckingLoyalty(true);

        try {
            const url = `${API_BASE_URL}/loyalty/check/${cleanPhone}`;
            const response = await axios.get(url);

            if (response.data.exists) {
                setLoyaltyInfo(response.data.card);
            } else {
                setLoyaltyInfo(null);
            }
        } catch (error) {
            console.error('❌ [LOYALTY] Erreur:', error);
            setLoyaltyInfo(null);
        } finally {
            setCheckingLoyalty(false);
        }
    };

    return {
        loyaltyInfo,
        checkingLoyalty,
        checkLoyaltyStatus
    };
};
