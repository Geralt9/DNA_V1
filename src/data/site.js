/** Site-wide facts, taken from the brand's previous website. */
export const site = {
  name: 'DNA Screen Printing',
  tagline: 'The revolution is just a t-shirt away.',
  founded: 1994,
  address: ['18 Charles St. W', 'Kitchener, ON', 'Canada'],
  mapsUrl: 'https://maps.google.com/?q=18+Charles+St+W,+Kitchener,+ON',
  phone: '519-585-1033',
  phoneHref: 'tel:+15195851033',
  email: 'mail@dnascreening.com',
  hours: 'Monday to Friday, 10am – 5pm',
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/dnascreeningink' },
    { label: 'Twitter', href: 'https://twitter.com/dnascreeninginc' },
  ],
};

export const nav = [
  { to: '/', label: 'Home', numeral: 'I', end: true },
  { to: '/designs', label: 'Designs', numeral: 'II' },
  { to: '/about', label: 'About', numeral: 'III' },
  { to: '/account', label: 'Account', numeral: 'IV' },
];
