import { apollo } from "./apollo";
import { ares } from "./ares";
import { athena } from "./athena";
import { dionysus } from "./dionysus";
import { hades } from "./hades";
import { hecate } from "./hecate";
import { hephaestus } from "./hephaestus";
import { hera } from "./hera";
import { hermes } from "./hermes";
import { medusa } from "./medusa";
import { persephone } from "./persephone";
import { poseidon } from "./poseidon";
import { prometheus } from "./prometheus";
import { zeus } from "./zeus";
import { artemis } from "./artemis";
import { demeter } from "./demeter";
import { aphrodite } from "./aphrodite";
import { heracles } from "./heracles";
import { hestia } from "./hestia";
import { cronus } from "./cronus";
import { gaia } from "./gaia";
import { pan } from "./pan";
import { eros } from "./eros";
import { nemesis } from "./nemesis";
import { hypnos } from "./hypnos";
import { thanatos } from "./thanatos";
import type { Article } from "./types";

export type { Article } from "./types";

// To add a new article: create a file like zeus.ts in this folder,
// import it above, and add it to this list.
export const ARTICLES: Article[] = [
  zeus,
  hades,
  athena,
  prometheus,
  hecate,
  hermes,
  poseidon,
  hephaestus,
  dionysus,
  medusa,
  hera,
  apollo,
  persephone,
  ares,
  heracles,
  aphrodite,
  demeter,
  artemis,
  hestia,
  cronus,
  gaia,
  pan,
  eros,
  nemesis,
  hypnos,
  thanatos,
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function readingMinutes(article: Article): number {
  const words = article.body.join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
