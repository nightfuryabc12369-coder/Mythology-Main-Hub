export type Aura = "gold" | "wine" | "marble" | "ember";

export type RealmId = "olympus" | "sky" | "sea" | "earth" | "underworld" | "tartarus" | "wild";

export type Emblem =
  | "bolt"
  | "crown"
  | "wave"
  | "wheat"
  | "shield"
  | "sun"
  | "moon"
  | "swords"
  | "shell"
  | "hammer"
  | "feather"
  | "grape"
  | "key"
  | "flower"
  | "flame"
  | "crossroad"
  | "wine";

export type GodStats = {
  might: number;
  craft: number;
  cunning: number;
  dominion: number;
  wrath: number;
  favor: number;
  endurance: number;
};

export type God = {
  id: string;
  name: string;
  epithet: string;
  aliases: string[];
  realm: RealmId;
  office: string;
  domain: string;
  parentage: string;
  status: string;
  age: string;
  line: string;
  summary: string;
  story: string;
  nature: string;
  symbols: string[];
  epithetIds: string[];
  allies: string[];
  rivals: string[];
  kin: string[];
  deeds: string[];
  tags: string[];
  olympian: boolean;
  featured?: boolean;
  stats: GodStats;
  image: string;
  focus: string;
  emblem: Emblem;
  aura: Aura;
};

export type Age = {
  id: string;
  name: string;
  years: string;
  tag: string;
  summary: string;
  story: string;
  image: string;
  focus: string;
  aura: Aura;
  gods: string[];
  myths: string[];
};

export type Myth = {
  id: string;
  name: string;
  age: string;
  order: number;
  span: string;
  logline: string;
  story: string;
  gods: string[];
  mortals: string[];
  beats: string[];
  moments: string[];
  aura: Aura;
  image: string;
  focus: string;
};

export type Epithet = {
  id: string;
  name: string;
  god: string;
  line: string;
  stage: number;
  meaning: string;
  description: string;
  signs: string[];
  note: string;
  aura: Aura;
};

export type Epic = {
  id: string;
  title: string;
  year: string;
  voice: string;
  synopsis: string;
  gods: string[];
  image: string;
  focus: string;
  aura: Aura;
};

export type TimelineEvent = {
  id: string;
  age: string;
  title: string;
  when: string;
  description: string;
  aura: Aura;
};

export type Realm = {
  id: RealmId;
  name: string;
  epithet: string;
  keeper: string;
  blurb: string;
  image: string;
  focus: string;
  gods: string[];
};

export type Constellation = {
  id: string;
  name: string;
  patron: string;
  myth: string;
  stars: Array<[number, number]>;
};

export type SearchKind = "god" | "myth" | "epithet" | "epic" | "age";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  keywords: string;
};

export type FavoriteKind = "god" | "myth" | "epithet" | "epic";

export const STAT_KEYS = [
  ["might", "Might"],
  ["craft", "Craft"],
  ["cunning", "Cunning"],
  ["dominion", "Dominion"],
  ["wrath", "Wrath"],
  ["favor", "Favor"],
  ["endurance", "Endurance"],
] as const;

export type StatKey = (typeof STAT_KEYS)[number][0];

export const THRONES = [
  "zeus",
  "hera",
  "poseidon",
  "demeter",
  "athena",
  "apollo",
  "artemis",
  "ares",
  "aphrodite",
  "hephaestus",
  "hermes",
  "dionysus",
] as const;
