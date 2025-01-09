# 2 syncing issues

## Calendar.getEventsAsync does not return organizer property on iOS ([link](https://docs.expo.dev/versions/latest/sdk/calendar/#calendargeteventsasynccalendarids-startdate-enddate))

On iOS, the event objects ([link](https://docs.expo.dev/versions/latest/sdk/calendar/#event)) returned do not carry the `organizer` property.

This flow can be observed in the iOS simulator by pressing the `Sync with calendar` button on `App.tsx`. It will first create a calendar event (`Calendar.createEventAsync`) and then retrieve it (`Calendar.getEventsAsync`):

On `calendar-sync/helpers.ts`, I first create the event object:

```ts
const ORGANIZER_EMAIL = 'organizer@organizer.com';

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
```

Then I retrieve it:

```ts
export async function getTodayEventsFromExpoCalendar(calendarId: string) {
    const yesterday = addDays(new Date(), -1);
    const tomorrow = addDays(new Date(), 1);

    const events = await Calendar.getEventsAsync([calendarId], yesterday, tomorrow);
    return events;
}
```

## Contacts.addContactAsync does not pickup the label and isPrimary properties on phone numbers ([link](https://docs.expo.dev/versions/latest/sdk/contacts/#phonenumber)) for a company contact on Android ([link](https://docs.expo.dev/versions/latest/sdk/contacts/#contactsaddcontactasynccontact-containerid))

On Android, when creating a company contact and passing along phone numbers, their label and isPrimary values are not picked up.

This flow can be observed by pressing the `Sync with contacts` button on `App.tsx`. It will create a company contact (`Contacts.addContactAsync`) with phonenumbers carrying values for labels and isPrimary. Where after these are not picked up by Android when inspecting the calendar.

On `contacts-sync/helpers.ts`, I first create a company contact:

```ts
const COMPANY_NAME = 'Some company';

export async function createSomeCompanyContactInPhoneContacts() {
    const contact: Contacts.Contact = {
        name: COMPANY_NAME,
        company: COMPANY_NAME,
        addresses: [],
        contactType: Contacts.ContactTypes.Company,
        imageAvailable: false,
        phoneNumbers: [
            {
                countryCode: 'nl',
                digits: '0612345678',
                label: 'Where is this label on android',
                number: '0612345678',
                isPrimary: true, // does not do anything
            },
            {
                countryCode: 'nl',
                digits: '0687654321',
                label: 'And this label',
                number: '0687654321',
                isPrimary: false, // does not do anything
            },
        ],
    };

    const contactId = await Contacts.addContactAsync(contact);

    return contactId;
}
```

Then I observe the contact in the Android simulator.
