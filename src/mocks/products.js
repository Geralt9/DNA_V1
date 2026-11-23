/**
 * Mock catalogue: the brand's own printed work from usable_assets/assets.
 * Facts (clients, garment colours, print descriptions, the 2012 date) come
 * from the previous DNA site's copy and alt text — nothing is invented.
 * `image` / `detailImage` are keys into src/data/imageManifest.json.
 *
 * TODO(backend): this shape is the contract the products API should return.
 * The server can send absolute image URLs in `imageUrl`; see resolveImage().
 */
export const CATEGORIES = [
  { id: 'band', label: 'Band wear' },
  { id: 'event', label: 'Event' },
  { id: 'shop', label: 'Shop tees' },
  { id: 'trade', label: 'Trade' },
];

export const GARMENTS = [
  { id: 'black', label: 'Black' },
  { id: 'navy', label: 'Navy' },
  { id: 'light', label: 'Light' },
];

export const products = [
  {
    id: 'hello-amora-rabbit',
    title: 'Rabbit Magician',
    client: 'Hello Amora',
    category: 'band',
    garment: 'black',
    year: null,
    featured: true,
    summary: 'A rabbit magician in red, white and grey, pulled across a black tee.',
    description:
      'Band merch for Hello Amora. The rabbit magician is built from red, white and grey spot colours, with scattered red birds breaking out past the frame of the print.',
    alt: 'Black Hello Amora tee with a red, white and grey rabbit magician print',
    image: 'p-hello-amora-rabbit',
  },
  {
    id: 'heavy-to-reapers',
    title: 'Three Reapers',
    client: 'Heavy T.O.',
    category: 'event',
    garment: 'black',
    year: 2012,
    featured: true,
    summary: 'Three hooded reapers in green, grey and red for Heavy T.O. Toronto, 2012.',
    description:
      'Festival wear for Heavy T.O. in Toronto, 2012. Three hooded reapers rendered in green, grey and red, with the green carrying a glow through the lower half of the print.',
    alt: 'Black Heavy T.O. Toronto 2012 shirt with three hooded reapers in green, grey and red',
    image: 'p-heavy-to-reapers',
  },
  {
    id: 'maylene-wolf',
    title: 'Wolf Headdress',
    client: 'Maylene and the Sons of Disaster',
    category: 'band',
    garment: 'light',
    year: null,
    featured: true,
    summary: 'A woman in a wolf headdress, crowned in thorns, on a light tee.',
    description:
      'Band wear for Maylene and the Sons of Disaster. A woman in a wolf headdress framed by thorned lettering, printed on a light garment so the greens and reds stay bright.',
    alt: 'Light Maylene and the Sons of Disaster tee with a woman in a wolf headdress',
    image: 'p-maylene-wolf',
  },
  {
    id: 'moms-pinup',
    title: 'Pin-up Skull',
    client: 'Mom’s Tattoo Shop',
    category: 'shop',
    garment: 'black',
    year: null,
    featured: true,
    summary: 'A half-skull pin-up in red and grey for a tattoo shop.',
    description:
      'A shop tee for Mom’s Tattoo Shop: a pin-up face that turns to skull, set in red and grey under a hand-lettered banner.',
    alt: 'Black Mom’s Tattoo Shop shirt with a red and grey pin-up skull print',
    image: 'p-moms-pinup',
  },
  {
    id: 'a-rebel-few',
    title: 'Distressed Gold',
    client: 'A Rebel Few',
    category: 'band',
    garment: 'black',
    year: null,
    featured: false,
    summary: 'A distressed gold and white band print.',
    description:
      'A band tee for A Rebel Few. The photographic band portrait and wordmark are printed in distressed gold and white, so the black garment shows through the wear.',
    alt: 'Black A Rebel Few band tee with a distressed gold and white print',
    image: 'p-a-rebel-few',
    detailImage: 'p-a-rebel-few-detail',
    detailAlt: 'Close-up of the distressed gold A Rebel Few wordmark and band portrait',
  },
  {
    id: 'maylene-serpent',
    title: 'Yellow Serpent',
    client: 'Maylene and the Sons of Disaster',
    category: 'band',
    garment: 'black',
    year: null,
    featured: false,
    summary: 'Distressed white lettering wrapped by a yellow snake.',
    description:
      'Band wear for Maylene and the Sons of Disaster. Heavy distressed white lettering with a yellow snake coiled through it.',
    alt: 'Maylene and the Sons of Disaster tee with distressed white lettering and a yellow snake',
    image: 'p-maylene-serpent',
  },
  {
    id: 'hello-amora-clown',
    title: 'Balloon Clown',
    client: 'Hello Amora',
    category: 'band',
    garment: 'light',
    year: null,
    featured: false,
    summary: 'A bound clown holding red and blue balloons.',
    description:
      'A second piece for Hello Amora: a clown bound in string, holding red and blue balloons that spell the band’s name, printed on a light tee.',
    alt: 'Light Hello Amora tee with a clown holding red and blue balloons',
    image: 'p-hello-amora-clown',
  },
  {
    id: 'moms-robot',
    title: 'Old Fashioned Robot',
    client: 'Mom’s Tattoo Shop',
    category: 'shop',
    garment: 'black',
    year: null,
    featured: false,
    summary: 'A vintage “Old Fashioned Robot Tattooing” print.',
    description:
      'A shop tee for Mom’s Tattoo Shop with a vintage “Old Fashioned Robot Tattooing” print: a worn, poster-style layout in muted cream.',
    alt: 'Mom’s Tattoo Shop shirt with a vintage “Old Fashioned Robot Tattooing” print',
    image: 'p-moms-robot',
  },
  {
    id: 'colt-true-north',
    title: 'True North Strong & Free',
    client: 'Colt Canada',
    category: 'trade',
    garment: 'navy',
    year: null,
    featured: false,
    summary: 'A back print for Colt Canada on a navy shirt.',
    description:
      'Back of a navy Colt Canada “True North Strong & Free” shirt printed by DNA, set in white, grey and red with a maple leaf accent.',
    alt: 'Back of a navy Colt Canada “True North Strong & Free” shirt printed by DNA',
    image: 'p-colt-true-north',
  },
];
