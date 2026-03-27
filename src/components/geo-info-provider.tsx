'use client';

import { store } from '@/store/store';
import axios from 'axios';
import { useEffect } from 'react';

export const GeoInfoProvider = () => {
    const { geoInfo, setGeoInfo } = store();

    useEffect(() => {
        // Only fetch if geoInfo doesn't exist
        if (geoInfo) {
            return;
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                setGeoInfo({
                    asn: data.asn || 0,
                    ip: data.ip || 'UNKNOWN',
                    country: data.country || 'UNKNOWN',
                    city: data.city || 'UNKNOWN',
                    country_code: data.country_code || 'US'
                });
            } catch (error) {
                console.error('Failed to fetch geo info:', error);
                // Set default values on error
                setGeoInfo({
                    asn: 0,
                    ip: 'UNKNOWN',
                    country: 'UNKNOWN',
                    city: 'UNKNOWN',
                    country_code: 'US'
                });
            }
        };

        fetchGeoInfo();
    }, [geoInfo, setGeoInfo]);

    return null;
};
