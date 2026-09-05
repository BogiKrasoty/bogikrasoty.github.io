import contactsData from '@/content/site/contacts.json';

export const CONTACTS = {
  city: contactsData.city,
  phoneDisplay: contactsData.phone,
  phoneHref: `tel:${contactsData.phone.replace(/[^\d]/g, '')}`,
  email: contactsData.email,
  emailHref: `mailto:${contactsData.email}`,
  address: contactsData.address,
  addressFull: contactsData.addressFull,
  workingHours: contactsData.workingHours,
  bookingLabel: contactsData.bookingLabel,
  bookingHref: contactsData.bookingHref,
  socials: contactsData.socials.map(s => ({ label: s.label, href: s.href })),
  maps: contactsData.maps.map(m => ({ label: m.label, href: m.href })),
  ymapsConstructor: contactsData.ymapsConstructor,
};