import { Button, StyleSheet, View } from 'react-native';

import { useCalendarSync } from './calendar-sync';
import { useContactsSync } from './contacts-sync';

export default function App() {
    const { startCalendarSync, isCalendarSyncing } = useCalendarSync();
    const { startContactsSync, isContactsSyncing } = useContactsSync();

    const isSyncing = Boolean(isCalendarSyncing || isContactsSyncing);

    return (
        <View style={styles.container}>
            <Button onPress={startCalendarSync} title="Sync with calendar" disabled={isSyncing} />
            <Button onPress={startContactsSync} title="Sync with contacts" disabled={isSyncing} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
});
