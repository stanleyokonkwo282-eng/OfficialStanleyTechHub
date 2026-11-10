// SEO structured data schemas (JSON-LD) for Creators Hub Academy
// Follows the same patterns used in src/components/common/HeadTag.jsx

export const organizationSchema = {
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
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Creators Hub Academy",
  url: "https://creators-hub-academy.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://creators-hub-academy.vercel.app/search?q={search_term}",
    "query-input": "required name=search_term",
  },
};

export const courseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.description,
  provider: {
    "@type": "Organization",
    name: "Creators Hub Academy",
  },
  url: `https://creators-hub-academy.vercel.app/course/${course.id}`,
  inLanguage: "en",
  audience: {
    "@type": "Audience",
    audienceType: "learner",
  },
});

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

export const seoSchemas = {
  organization: organizationSchema,
  website: websiteSchema,
  course: courseSchema,
  breadcrumb: breadcrumbSchema,
};

export default seoSchemas;