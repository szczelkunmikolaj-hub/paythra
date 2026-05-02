import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  /** Defaults to "index, follow" — pass "noindex" if needed. */
  robots?: string;
}

const upsertMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Replace existing hreflang link tags with a fresh set for the given URL.
 * Since this app does not use language-prefixed routes, all hreflang variants
 * point to the same canonical URL — but we still expose the alternates so
 * search engines understand the page is multilingual.
 */
const upsertHreflang = (canonical: string) => {
  document.head
    .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
    .forEach((el) => el.remove());

  const langs = ["en", "es", "de", "fr", "pl", "x-default"];
  langs.forEach((lang) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", lang);
    link.setAttribute("href", canonical);
    document.head.appendChild(link);
  });
};

const SEO = ({ title, description, canonical, robots = "index, follow" }: SEOProps) => {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[name="robots"]', "name", "robots", robots);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertCanonical(canonical);
    upsertHreflang(canonical);
  }, [title, description, canonical, robots]);

  return null;
};

export default SEO;
