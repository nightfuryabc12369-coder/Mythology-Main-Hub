/**
 * Articles shown in the "Articles" dropdown in the top bar.
 * This is a short hand-picked list on purpose: the full article texts are big, and keeping them out of
 * the menu keeps every page light. To change the menu, edit this list (slug = the article's slug).
 * Everything else lives in the Library, which the "More articles" link opens.
 */
export const NAV_ARTICLES = [
  { slug: "zeus-best-politician-in-the-family", name: "Zeus" },
  { slug: "hera-the-goddess-who-keeps-the-receipts", name: "Hera" },
  { slug: "poseidon-the-god-who-never-won-an-argument", name: "Poseidon" },
  { slug: "athena-plan-that-survives-the-battle", name: "Athena" },
  { slug: "apollo-the-god-who-works-from-a-distance", name: "Apollo" },
  { slug: "artemis-punishes-the-people-who-claim", name: "Artemis" },
  { slug: "ares-the-war-god-nobody-wanted-to-win", name: "Ares" },
  { slug: "aphrodite-is-not-the-goddess-of-romance", name: "Aphrodite" },
  { slug: "hades-is-not-the-villain", name: "Hades" },
  { slug: "hermes-never-stays-where-you-left-him", name: "Hermes" },
] as const;
