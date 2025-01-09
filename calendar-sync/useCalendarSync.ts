import { useEffect, useState } from 'react';

import {
    createExpoCalendarOnPhone,
    createSomeEventTodayInExpoCalendar,
    getExpoCalendarIdFromPhone,
    getTodayEventsFromExpoCalendar,
    requestCalendarPermission,
} from './helpers';

export function useCalendarSync() {
    const [hasPermission, setHasPermission] = useState(false);

    const [expoCalendarId, setExpoCalendarId] = useState('');
    const hasExpoCalendar = Boolean(expoCalendarId);

    const [isCalendarSyncing, setIsCalendarSyncing] = useState(false);

    function startCalendarSync() {
        setIsCalendarSyncing(true);
    }

    function stopCalendarSync() {
        setIsCalendarSyncing(false);
    }

    // 1: Get calendar permissions
    useEffect(() => {
        if (isCalendarSyncing && !hasPermission) {
            (async () => {
                const isCalendarPermissionGranted = await requestCalendarPermission();

                if (isCalendarPermissionGranted) {
                    setHasPermission(true);
                } else {
                    stopCalendarSync();
                }
            })();
        }
    }, [isCalendarSyncing, hasPermission]);

    // 2: Create expo calendar if needed
    useEffect(() => {
        if (isCalendarSyncing && hasPermission && !hasExpoCalendar) {
            (async () => {
                const expoCalendarId = await getExpoCalendarIdFromPhone();

                if (expoCalendarId) {
                    setExpoCalendarId(expoCalendarId);
                } else {
                    const newExpoCalendarId = await createExpoCalendarOnPhone();

                    if (newExpoCalendarId) {
                        setExpoCalendarId(newExpoCalendarId);
                    } else {
                        stopCalendarSync();
                    }
                }
            })();
        }
    }, [isCalendarSyncing, hasPermission, hasExpoCalendar]);

    // 3: Create some event today and retrieve it
    useEffect(() => {
        if (isCalendarSyncing && hasPermission && hasExpoCalendar) {
            (async () => {
                await createSomeEventTodayInExpoCalendar(expoCalendarId);
                const events = await getTodayEventsFromExpoCalendar(expoCalendarId);

                console.log('Events from expo calendar without organizer property on iOS:', events);

                stopCalendarSync();
            })();
        }
    }, [expoCalendarId, hasExpoCalendar, hasPermission, isCalendarSyncing]);

    return { startCalendarSync, isCalendarSyncing };
}
