import { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Maps internal SEO routes to a list of phrases (case-insensitive) we want to
 * automatically turn into clickable internal links inside descriptive text.
 *
 * Phrases are listed in multiple languages so the linkifier works for the
 * whole site (English, Spanish, Polish, German, French).
 *
 * To avoid spammy linking, only the FIRST occurrence of each route is linked
 * within a given text block.
 */
const ROUTE_PHRASES: Array<{ to: string; phrases: string[] }> = [
  {
    to: "/track-subscriptions",
    phrases: [
      "track monthly subscriptions",
      "track your subscriptions",
      "track subscriptions",
      "subscription tracker app",
      "rastrea tus suscripciones",
      "rastrear suscripciones",
      "śledź subskrypcje",
      "śledzenie subskrypcji",
      "abonnements verfolgen",
      "suivre vos abonnements",
      "suivre les abonnements",
    ],
  },
  {
    to: "/cancel-subscriptions",
    phrases: [
      "cancel unused subscriptions",
      "cancel subscriptions",
      "stop unwanted subscriptions",
      "cancela suscripciones",
      "cancelar suscripciones",
      "anuluj subskrypcje",
      "abonnements kündigen",
      "annuler les abonnements",
    ],
  },
  {
    to: "/subscription-manager",
    phrases: [
      "manage all subscriptions",
      "manage subscriptions",
      "personal subscription manager",
      "manage subscriptions app",
      "gestiona tus suscripciones",
      "zarządzaj subskrypcjami",
      "abonnements verwalten",
      "gérer vos abonnements",
    ],
  },
  {
    to: "/reduce-subscription-costs",
    phrases: [
      "reduce subscription costs",
      "reduce your monthly costs",
      "save money on subscriptions",
      "reducir costes",
      "ogranicz koszty",
      "kosten senken",
      "réduire les coûts",
    ],
  },
  {
    to: "/subscription-tracker",
    phrases: [
      "subscription tracking app",
      "track subscriptions automatically",
      "seguimiento de suscripciones",
      "śledzenie subskrypcji",
      "abonnements verfolgen",
      "suivi des abonnements",
    ],
  },
];

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Walk the text and wrap the FIRST occurrence of each route's phrases (case
 * insensitive, longest match first) into a <Link>. Returns a ReactNode array
 * suitable for rendering inline.
 */
export function linkifyText(text: string): ReactNode {
  if (!text) return text;

  type Match = { start: number; end: number; to: string; original: string };
  const matches: Match[] = [];
  const usedRoutes = new Set<string>();

  // Sort all phrases by length (longer first) to avoid partial overshadowing.
  const phraseEntries = ROUTE_PHRASES.flatMap((r) =>
    r.phrases.map((p) => ({ to: r.to, phrase: p }))
  ).sort((a, b) => b.phrase.length - a.phrase.length);

  for (const { to, phrase } of phraseEntries) {
    if (usedRoutes.has(to)) continue;
    const re = new RegExp(escapeRegex(phrase), "i");
    const m = re.exec(text);
    if (!m) continue;
    // Skip if overlaps another already-claimed match.
    const overlaps = matches.some(
      (mm) => !(m.index + m[0].length <= mm.start || m.index >= mm.end)
    );
    if (overlaps) continue;
    matches.push({
      start: m.index,
      end: m.index + m[0].length,
      to,
      original: m[0],
    });
    usedRoutes.add(to);
  }

  if (matches.length === 0) return text;

  matches.sort((a, b) => a.start - b.start);
  const out: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) out.push(text.slice(cursor, m.start));
    out.push(
      <Link
        key={`${m.to}-${i}`}
        to={m.to}
        className="text-primary underline-offset-4 hover:underline transition-colors"
      >
        {m.original}
      </Link>
    );
    cursor = m.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return <>{out}</>;
}
