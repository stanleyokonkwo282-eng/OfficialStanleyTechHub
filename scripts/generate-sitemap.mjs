import { writeFileSync } from "fs";

const SITE = "https://creators-hub-academy.vercel.app";

const pages = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/courses", changefreq: "daily", priority: "0.9" },
  { loc: "/about", changefreq: "weekly", priority: "0.8" },
  { loc: "/contact", changefreq: "weekly", priority: "0.8" },
  { loc: "/faq", changefreq: "weekly", priority: "0.7" },
  { loc: "/be-teacher", changefreq: "monthly", priority: "0.7" },
  { loc: "/portfolio", changefreq: "monthly", priority: "0.6" },
  { loc: "/privacy-policy", changefreq: "monthly", priority: "0.5" },
  { loc: "/terms-of-service", changefreq: "monthly", priority: "0.5" },
  { loc: "/refund-policy", changefreq: "monthly", priority: "0.5" },
  { loc: "/cookie-policy", changefreq: "monthly", priority: "0.5" },
];

const urlset = pages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log("Sitemap generated with", pages.length, "URLs");