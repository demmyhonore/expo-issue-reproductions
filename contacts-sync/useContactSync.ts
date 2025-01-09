import { useEffect, useState } from 'react';

import {
    createSomeCompanyContactInPhoneContacts,
    getSomeCompanyContactFromPhoneContacts,
    requestContactsPermission,
} from './helpers';

export function useContactsSync() {
    const [hasPermission, setHasPermission] = useState(false);

    const [isContactsSyncing, setIsContactsSyncing] = useState(false);

    function startContactsSync() {
        setIsContactsSyncing(true);
    }
    function stopContactsSync() {
        setIsContactsSyncing(false);
    }

    // 1: Get contacts permissions
    useEffect(() => {
        if (isContactsSyncing && !hasPermission) {
            (async () => {
                const isContactsPermissionGranted = await requestContactsPermission();

                if (isContactsPermissionGranted) {
                    setHasPermission(true);
                } else {
                    stopContactsSync();
                }
            })();
        }
    }, [isContactsSyncing, hasPermission]);

    // 2: Create some company contact and retrieve it
    useEffect(() => {
        if (isContactsSyncing && hasPermission) {
            (async () => {
                await createSomeCompanyContactInPhoneContacts();

                const someCompanyContact = await getSomeCompanyContactFromPhoneContacts();

                console.log(
                    'some company contact phonenumbers carry isPrimary=0 and label=unknown on Android',
                    someCompanyContact,
                );

                stopContactsSync();
            })();
        }
    }, [hasPermission, isContactsSyncing]);

    return { startContactsSync, isContactsSyncing };
}
