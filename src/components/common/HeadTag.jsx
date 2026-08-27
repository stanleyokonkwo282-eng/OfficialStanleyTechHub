import { Helmet } from "react-helmet";

export default function HeadTag({ title = "Creators Hub Academy | Learn. Create. Lead." }) {
  const description = "Creators Hub Academy – Premium online learning platform for creators. Learn tech, design, and freelancing from expert mentors.";

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/logo.png" />
      <meta property="og:url" content="https://creators-hub-academy.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/logo.png" />
      <link rel="canonical" href="https://creators-hub-academy.vercel.app" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Creators Hub Academy",
          url: "https://creators-hub-academy.vercel.app",
          logo: "https://creators-hub-academy.vercel.app/logo.png",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            email: "support@creatorshubacademy.com",
          },
          sameAs: [],
        })}
      </script>
    </Helmet>
  );
}