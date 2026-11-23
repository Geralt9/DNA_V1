import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import ThemedArt from '../components/ThemedArt.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { site } from '../data/site.js';
import './About.css';

// Every fact here comes from the previous DNA site's About, Services and Q&A copy.
const CHAPTERS = [
  {
    numeral: 'I',
    title: 'The name',
    body: [
      'DNA was founded in 1994. The media was consumed by one of history’s most publicised murder trials, and DNA evidence was still new: compelling, talked about everywhere, and suddenly the thing that connected every one of us.',
      'The name was chosen in that spirit. Ever since, the shop has set out to be a reliable beacon in an often unreliable world.',
    ],
  },
  {
    numeral: 'II',
    title: 'The shop',
    body: [
      'Our bay opens onto Halls Lane in downtown Kitchener. Blank garments arrive there by the pallet and leave as finished, cured prints bound for gigs, teams, festivals and storefronts.',
      'Inside are two automatic presses, three manual presses and full industry-standard dryers. The cure is what keeps ink from cracking after the first wash, so we never rush it. We take on start-up runs and twenty-thousand-shirt orders alike.',
    ],
  },
  {
    numeral: 'III',
    title: 'The craft',
    body: [
      'We print anything from a single clean colour to full-colour process work that reads like a photograph, with up to eight spot colours on one print. Every separation is made in house and matched to industry-standard Pantone books.',
      'Inside tags, sleeves and side prints are all fair game. You get an electronic proof after your order is placed and again at pre-press, before anything touches a screen.',
    ],
  },
  {
    numeral: 'IV',
    title: 'The ink',
    body: [
      'We use phthalate-free inks. A garment that ends up worn against the skin every week deserves to be made with care, and that starts with what goes into the ink.',
    ],
  },
  {
    numeral: 'V',
    title: 'The revolution',
    body: [
      'Screen printing is built on repetition, and repetition is unity: band wear, team wear, fan wear, every shared piece of artistic, political or personal expression. A printed shirt tells the room who you are and what you stand for.',
      'The current DNA mark and its line, “The revolution is just a t-shirt away”, were adopted after one particularly good live show. The energy of 1994 is still the energy of the shop, fuelled by music, pop culture and every form of expression.',
    ],
  },
];

export default function About() {
  useDocumentTitle('About');
  const ref = useRef(null);
  useReveal(ref);

  return (
    <div className="page about" ref={ref}>
      <div className="about__layout container">
        <aside className="about__art" data-reveal="image">
          <ThemedArt
            pair="about"
            className="about__img"
            sizes="(max-width: 900px) 92vw, 38vw"
            priority
            position="50% 28%"
            alt={{
              light: 'Pencil drawing of a crowned, winged rider on a griffin-like beast beneath two gilt stars',
              dark: 'Painting of a hooded reaper with a scythe, wrapped in blue mist',
            }}
          />
          <p className="about__caption" aria-hidden="true">
            Kitchener, Ontario · MCMXCIV
          </p>
        </aside>

        <div className="about__body">
          <header className="about__head">
            <p className="eyebrow" data-reveal="up">
              Our story
            </p>
            <h1 className="about__title" data-reveal="lines">
              <span className="mask-line">
                <span>A reliable beacon</span>
              </span>
              <span className="mask-line">
                <span>in an unreliable</span>
              </span>
              <span className="mask-line">
                <span>world.</span>
              </span>
            </h1>
            <p className="lede" data-reveal="up">
              Over thirty years of ink, cure and allegiance, from a back bay on Halls Lane.
            </p>
          </header>

          <ol className="chapters" role="list">
            {CHAPTERS.map((c) => (
              <li key={c.numeral} className="chapter">
                <p className="chapter__numeral" aria-hidden="true" data-reveal="up">
                  {c.numeral}
                </p>
                <div>
                  <h2 className="chapter__title" data-reveal="lines">
                    <span className="mask-line">
                      <span>{c.title}</span>
                    </span>
                  </h2>
                  <div className="prose" data-reveal="up">
                    {c.body.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <figure className="about__quote" data-reveal="up">
            <blockquote>
              <p>The revolution is just a t-shirt away.</p>
            </blockquote>
            <figcaption>The DNA line, since the last great show</figcaption>
          </figure>

          <section className="visit" aria-labelledby="visit-title" data-reveal="up">
            <h2 id="visit-title" className="visit__title">
              Come by the shop
            </h2>
            <div className="visit__grid">
              <address>
                {site.address.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
              <p>
                {site.hours}
                <br />
                <a href={site.phoneHref}>{site.phone}</a>
              </p>
            </div>
            <div className="visit__actions">
              <Link to="/designs" className="btn">
                See the work <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href={`mailto:${site.email}`} className="link-arrow">
                {site.email}
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
