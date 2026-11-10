import { Helmet } from "react-helmet";
import { organizationSchema, websiteSchema, breadcrumbSchema } from "../../utils/seoSchemas";

const SITE = "https://creators-hub-academy.vercel.app";
const DEFAULT_DESCRIPTION =
  "Creators Hub Academy – Premium online learning platform for creators. Learn tech, design, and freelancing from expert mentors.";
const DEFAULT_OG_IMAGE = "/og-image.svg";

export default function HeadTag({
  title = "Creators Hub Academy | Learn. Create. Lead.",
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd = [],
}) {
  const canonical = path === "/" ? SITE : `${SITE}${path}`;
  const ogUrl = path === "/" ? SITE : `${SITE}${path}`;
  const breadcrumbs = path === "/"
    ? [{ name: "Home", url: SITE }]
    : [
        { name: "Home", url: SITE },
        { name: title.replace(/ \| Creators Hub Academy.*$/, ""), url: ogUrl },
      ];

  const allJsonLd = [organizationSchema, websiteSchema, breadcrumbSchema(breadcrumbs), ...jsonLd];

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={ogUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}${ogImage}`} />
      <link rel="canonical" href={canonical} />
      {allJsonLd.map((schema, i) => (
        <script key={`json-ld-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}