import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import { addDays, addHours } from 'date-fns';

const EXPO_CALENDAR_NAME = 'Expo calendar';
const EXPO_CALENDAR_COLOR = '#FF9500';

const ORGANIZER_EMAIL = 'organizer@organizer.com';

const isIOS = Platform.OS === 'ios';

export async function createExpoCalendarOnPhone() {
    const calendarDetailsForIOS: Partial<Calendar.Calendar> = {
        allowsModifications: true,
        entityType: Calendar.EntityTypes.EVENT,
        id: EXPO_CALENDAR_NAME,
        color: EXPO_CALENDAR_COLOR,
        source: {
            id: EXPO_CALENDAR_NAME,
            name: EXPO_CALENDAR_NAME,
            type: Calendar.SourceType.LOCAL,
        },
        title: EXPO_CALENDAR_NAME,
    };

    const calendarDetailsForAndroid: Partial<Calendar.Calendar> = {
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
        allowsModifications: true,
        id: EXPO_CALENDAR_NAME,
        color: EXPO_CALENDAR_COLOR,
        name: EXPO_CALENDAR_NAME,
        ownerAccount: EXPO_CALENDAR_NAME,
        source: {
            isLocalAccount: true,
            name: EXPO_CALENDAR_NAME,
            type: Calendar.SourceType.LOCAL,
        },
        title: EXPO_CALENDAR_NAME,
    };

    const calendarDetails = isIOS ? calendarDetailsForIOS : calendarDetailsForAndroid;

    const expoCalendarId = await Calendar.createCalendarAsync(calendarDetails);

    return expoCalendarId;
}

export async function createSomeEventTodayInExpoCalendar(calendarId: string) {
    const baseEvent = {
        calendarId,
        startDate: new Date(),
        endDate: addHours(new Date(), 5),
        title: 'Just a title',
    };

    const event: Omit<Partial<Calendar.Event>, 'id'> = isIOS
        ? {
              ...baseEvent,
              organizer: ORGANIZER_EMAIL,
          }
        : {
              ...baseEvent,
              organizerEmail: ORGANIZER_EMAIL,
          };

    return await Calendar.createEventAsync(calendarId, event);
}

export async function getExpoCalendarIdFromPhone() {
    const phoneCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const expoCalendar = phoneCalendars.find(({ title }) => title === EXPO_CALENDAR_NAME);

    return expoCalendar?.id;
}

export async function getTodayEventsFromExpoCalendar(calendarId: string) {
    const yesterday = addDays(new Date(), -1);
    const tomorrow = addDays(new Date(), 1);

    const events = await Calendar.getEventsAsync([calendarId], yesterday, tomorrow);
    return events;
}

export async function requestCalendarPermission() {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    return Boolean(status === Calendar.PermissionStatus.GRANTED);
}
