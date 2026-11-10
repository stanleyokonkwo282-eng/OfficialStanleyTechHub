// SEO structured data schemas (JSON-LD) for Creators Hub Academy
// Used by HeadTag.jsx to emit Organization, WebSite, and BreadcrumbList schemas.

const SITE = "https://creators-hub-academy.vercel.app";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Creators Hub Academy",
  url: SITE,
  logo: `${SITE}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@creatorshubacademy.com",
  },
  sameAs: [],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Creators Hub Academy",
  url: SITE,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE}/search?q={search_term}`,
    "query-input": "required name=search_term",
  },
};

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const courseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.description,
  provider: {
    "@type": "Organization",
    name: "Creators Hub Academy",
  },
  url: `${SITE}/courses/${course.id}`,
  inLanguage: "en",
  audience: {
    "@type": "Audience",
    audienceType: "learner",
  },
});

export const seoSchemas = {
  organization: organizationSchema,
  website: websiteSchema,
  course: courseSchema,
  breadcrumb: breadcrumbSchema,
};

export default seoSchemas;