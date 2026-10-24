import { getTranslations } from 'next-intl/server';

/**
 * Supporting copy for the four index routes (products, projects, blog,
 * contact).
 *
 * Each of those pages rendered a heading, one sentence and a grid of links —
 * 172-202 words in every locale, which is below the point where a page reads as
 * a real category page rather than a navigation stub. The copy lives in the
 * message catalogs under `<namespace>.guide` so it is translated alongside the
 * rest of the page rather than hard-coded in English.
 *
 * Rendered as H2 + paragraphs + a definition-style list: the structure a
 * crawler can segment into passages, not a wall of text.
 */
export async function IndexGuide({
  namespace,
  slot = 'guide'
}: {
  namespace: 'products' | 'projects' | 'blog' | 'contact';
  /** Which block in the namespace to render; a namespace may carry several. */
  slot?: string;
}) {
  const t = await getTranslations(namespace);
  const guide = t.raw(slot) as
    | { title: string; body: string; items: { term: string; detail: string }[] }
    | undefined;
  if (!guide?.items?.length) return null;

  return (
    <section className="container mt-16 max-w-screen-lg">
      <h2 className="mb-4 text-2xl font-bold md:text-3xl">{guide.title}</h2>
      <p className="mb-8 text-muted-foreground">{guide.body}</p>
      <dl className="grid gap-6 sm:grid-cols-2">
        {guide.items.map((item) => (
          <div key={item.term}>
            <dt className="mb-1 font-semibold">{item.term}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
