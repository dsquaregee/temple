// Renders a schema.org JSON-LD document as a <script> tag. Server component —
// the structured data is baked into the static HTML at build, which is what
// search-engine crawlers read (decision D3: Google is the top-of-funnel).
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
