import * as Contacts from 'expo-contacts';

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
                isPrimary: true,
            },
            {
                countryCode: 'nl',
                digits: '0687654321',
                label: 'And this label',
                number: '0687654321',
                isPrimary: false,
            },
        ],
    };

    const contactId = await Contacts.addContactAsync(contact);

    return contactId;
}

export async function requestContactsPermission() {
    const { status } = await Contacts.requestPermissionsAsync();

    return Boolean(status === Contacts.PermissionStatus.GRANTED);
}

export async function getSomeCompanyContactFromPhoneContacts() {
    const contactsResponse = await Contacts.getContactsAsync();

    const someCompanyContact = contactsResponse.data.filter(
        ({ company }) => company === COMPANY_NAME,
    );

    return someCompanyContact;
}
