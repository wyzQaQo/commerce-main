/**
 * Pillar (conversion-hub) pages — the two highest-opportunity SEO landing pages
 * from the 100tiki blueprint: fire-retardant treatment and South-Africa pricing.
 *
 * These are NOT blog posts: they are hub pages that rank for high-volume
 * informational queries (fire retardant cost ~2650/mo, SA pricing ~1580/mo) and
 * funnel into the product catalog and contact page. Content is authored in EN
 * (the ranking locale per the brief); the localized fields carry the same
 * structured data in all four locales so the JSON-LD is consistent, and the
 * page falls back to EN body for non-EN locales rather than shipping four
 * hand-written translations we cannot verify.
 *
 * Each page carries:
 *  - FAQPage schema (questions = long-tail keywords, blueprint T4 rule)
 *  - HowTo schema on the fire page (rich-result eligible)
 *  - a spec/price table (Google + buyers love tables)
 *  - CTA links to products + contact (the internal-link matrix targets)
 */
export interface PillarTable {
  caption: string;
  head: string[];
  rows: string[][];
}

export interface PillarFaq {
  q: string;
  a: string;
}

export interface PillarLink {
  /** i18n key under the "pillars" message namespace. */
  labelKey: string;
  href: string;
}

export interface PillarPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  body: string[];
  tables: PillarTable[];
  faqs: PillarFaq[];
  howTo?: { name: string; steps: string[] };
  /** product slugs this pillar links out to (internal-link matrix). */
  productSlugs: string[];
  /** CTA label key + href. */
  cta: PillarLink;
}

export const PILLARS: PillarPage[] = [
  {
    slug: 'fire-retardant-thatch-treatment',
    title:
      'Fire Retardant Treatment for Thatch Roofs: Cost, B1 & Class A Guide | Palm Grass Pro',
    h1: 'Fire Retardant Treatment for Thatch Roofs — Costs & Certifications',
    description:
      'How much does fire retardant treatment for thatch roofs cost? B1 (DIN 4102) vs Class A (ASTM E108), factory-treated panels vs spray, and a 24-hour quote.',
    body: [
      'Synthetic thatch from PalmGrass Pro is fire rated as part of the material, not sprayed on after installation. The flame-retardant masterbatch is blended into the HDPE during extrusion and the panels are moulded with the B1 compound, so the rating cannot wear off or wash away.',
      'For most resort, tiki-bar and hospitality projects the relevant benchmark is B1 under DIN 4102 (the European reaction-to-fire class). Where the authority requires a North-American rating, Class A under ASTM E108 is available as a build option.',
      'Below are the two decisions buyers actually face: which rating they need, and whether to buy factory-treated panels or treat natural thatch with spray. Factory-treated synthetic panels win on consistency and labour — every batch is lab tested, and there is no annual re-application.',
      'Use the table to price a project, then request a fire-treated quote from the contact page. Certificates ship with every container for customs and insurance.'
    ],
    tables: [
      {
        caption: 'Fire-rated thatch — what to specify',
        head: ['Specification', 'PalmGrass synthetic', 'Natural thatch + spray'],
        rows: [
          ['Fire rating', 'B1 (DIN 4102) built-in, Class A opt.', 'Annual retardant spray required'],
          ['Lifespan', '15-20 years', '3-7 years'],
          ['Maintenance', 'None', 'Annual re-thatching + re-spray'],
          ['10-yr cost / m²', '$9-12', '$18-25 incl. labour'],
          ['MOQ', '500 m² mixed profiles', 'n/a']
        ]
      }
    ],
    faqs: [
      {
        q: 'How much does fire retardant treatment for thatch roofs cost?',
        a: 'Factory-treated synthetic thatch panels run $9-12 per m² over a 10-year horizon including labour, versus $18-25 for natural thatch once annual spray and re-thatching are counted. A 200 m² villa roof is typically $1,700-2,400 FOB Guangzhou.'
      },
      {
        q: 'What fire rating do I need for a thatch roof?',
        a: 'B1 under DIN 4102 covers most European and hospitality specs; Class A under ASTM E108 is the North-American equivalent and is available as a build option. Both are tested per batch, not per panel.'
      },
      {
        q: 'Fire retardant spray vs factory-treated panels — which is better?',
        a: 'Factory-treated panels are more consistent: the retardant is in the material, so it cannot wash off, and there is no annual re-application. Spray on natural thatch must be re-applied every year and re-tested.'
      },
      {
        q: 'Do you supply fire test certificates?',
        a: 'Yes. Each production batch is tested to DIN 4102-B1 (or ASTM E108 for Class A batches) and the certificate ships with every container for customs clearance and insurance.'
      }
    ],
    howTo: {
      name: 'How fire retardant treatment is applied to synthetic thatch',
      steps: [
        'Flame-retardant masterbatch is blended into HDPE during extrusion.',
        'Panels are moulded with the B1 compound, not surface-sprayed.',
        'Each batch is tested to DIN 4102-B1; Class A batches to ASTM E108.',
        'Test certificates ship with every container for customs and insurance.'
      ]
    },
    productSlugs: [
      'resort-hotel-villa-tiki-hut-fire-retardant-artificial-palm-t',
      'fireproof-synthetic-safari-thatched-roof-covering-for-shed'
    ],
    cta: { labelKey: 'getFireQuote', href: '/contact' }
  },
  {
    slug: 'thatch-roofing-price-south-africa',
    title:
      'Thatch Roofing Prices in South Africa 2026: Synthetic vs Natural | Palm Grass Pro',
    h1: 'Thatch Roofing Prices in South Africa — 2026 Import Guide',
    description:
      'Current synthetic and natural thatch roofing price ranges in South Africa, why projects import synthetic reed thatch, and FOB Guangzhou shipping to Durban and Cape Town.',
    body: [
      'South African lodges, game reserves and coastal homes have used natural thatch for generations, but import volumes of synthetic reed and cadjan thatch are rising because the installed 10-year cost is lower and there is no annual re-thatching.',
      'Prices below are FOB Guangzhou and exclude ocean freight. They are reference ranges for budgeting, not a quotation — request a firm FOB price from the contact page once you know the roof area.',
      'A 20-foot container typically loads 1,500-2,000 m² of panel depending on profile, so most villa and lodge projects ship in a single container to Durban or Cape Town. Lead time from deposit is 25-35 days.',
      'African reed thatch (viro reed / makuti style) is available for projects that want the natural look with synthetic durability — see the product links below.'
    ],
    tables: [
      {
        caption: 'Reference prices — FOB Guangzhou, ex-works',
        head: ['Project type', 'Roof size', 'Synthetic thatch (USD)', 'Lead time'],
        rows: [
          ['Tiki bar roof', '20 m²', '$170-240', '15 days'],
          ['Private villa roof', '200 m²', '$1,700-2,400', '25 days'],
          ['Resort / lodge project', '1,000 m²', '$8,500-12,000', '35 days']
        ]
      }
    ],
    faqs: [
      {
        q: 'How much does thatch roofing cost per square metre in South Africa?',
        a: 'Imported synthetic thatch lands at roughly $9-12 per m² FOB Guangzhou, against $18-25 for natural thatch once annual maintenance is included. A 200 m² villa roof is typically $1,700-2,400.'
      },
      {
        q: 'Why do South African projects import synthetic reed thatch?',
        a: 'The installed 10-year cost is lower — no annual re-thatching — and the fire rating is built into the material. Natural reed still needs yearly retardant spray and re-thatching.'
      },
      {
        q: 'How long does shipping to Durban or Cape Town take?',
        a: 'Most villa and lodge orders ship in a single 20-foot container (1,500-2,000 m² depending on profile). Lead time from deposit is 25-35 days to Durban or Cape Town.'
      },
      {
        q: 'Is African reed thatch available?',
        a: 'Yes. Synthetic African reed (viro reed / makuti style) is supplied for projects wanting the natural look with synthetic durability. MOQ is 300-500 m² mixed profiles.'
      }
    ],
    productSlugs: [
      'reed-thatch-for-makuti-and-alang-alang-roofs',
      'overwater-villa-artificial-kajan-thatch-roof'
    ],
    cta: { labelKey: 'getSaQuote', href: '/contact' }
  }
];

export function getPillarBySlug(slug: string): PillarPage | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

export function getAllPillarSlugs(): string[] {
  return PILLARS.map((p) => p.slug);
}
