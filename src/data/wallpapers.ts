/**
 * Wallpapers are hosted on ImgBB, so the images themselves are not part of this project.
 * To add one: upload it to ImgBB, then add a line below with
 *   preview = the "medium"/viewer image link (i.ibb.co/...), shown on the page
 *   page    = the ImgBB page link (ibb.co/...), where visitors press Download
 * Add new wallpapers at the bottom of the list. The page shows the list newest-first, so they appear at the top.
 *
 * WALLPAPERS = desktop wallpapers. MOBILE_WALLPAPERS = phone wallpapers (below).
 */
export type Wallpaper = {
  id: string;
  title: string;
  /** Direct image link (i.ibb.co/...). Leave empty until you have it; the card shows a placeholder. */
  preview: string;
  page: string;
  size: string;
};

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "hades-crimson-underworld",
    title: "Hades in the Crimson Underworld",
    preview: "https://i.ibb.co/8DHg2qRJ/Hades-in-the-Crimson-Underworld.png",
    page: "https://ibb.co/ynrF5tMD",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "lion-clad-hero",
    title: "Lion-Clad Hero Beneath Fiery Skies",
    preview: "https://i.ibb.co/5XKr49gM/Lion-Clad-Hero-Beneath-Fiery-Skies.png",
    page: "https://ibb.co/Y40cQWFR",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "storm-god-electric-blue",
    title: "Storm God in Electric Blue",
    preview: "https://i.ibb.co/35xZsjP6/Storm-God-in-Electric-Blue-1.png",
    page: "https://ibb.co/vCNnBTMy",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "storm-kissed-queen",
    title: "Storm-Kissed Queen with Peacock",
    preview: "https://i.ibb.co/20JZpS7N/Storm-Kissed-Queen-with-Peacock.png",
    page: "https://ibb.co/mrpNP0C8",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "aphrodite-rose-gold-ruins",
    title: "Aphrodite Amidst Rose Gold Ruins",
    preview: "https://i.ibb.co/XfCN5QHC/Aphrodite-Amidst-Rose-Gold-Ruins.png",
    page: "https://ibb.co/1YmhXgcm",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "cronus-golden-scythe",
    title: "Cronus, Titan of the Golden Scythe",
    preview: "https://i.ibb.co/Q70S62qv/Cronus-Titan-of-the-Golden-Scythe.png",
    page: "https://ibb.co/GfmYVK1Q",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "celestial-moon-goddess",
    title: "Celestial Moon Goddess Above the Clouds",
    preview: "https://i.ibb.co/4ZTKvP3j/Celestial-Moon-Goddess-Above-the-Clouds.png",
    page: "https://ibb.co/wNWBGMjK",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "crimson-spartan-stormy-skies",
    title: "Crimson Spartan Beneath Stormy Skies",
    preview: "https://i.ibb.co/0VBRxpMy/Crimson-Spartan-Beneath-Stormy-Skies.png",
    page: "https://ibb.co/Qj8347Nv",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "emerald-moon-artemis-stag",
    title: "Emerald Moon: Artemis and Stag",
    preview: "https://i.ibb.co/whwF4zMd/Emerald-Moon-Artemis-and-Stag.png",
    page: "https://ibb.co/Swd4B3R6",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "storm-king-tempest",
    title: "Storm King of the Tempest",
    preview: "https://i.ibb.co/tpsYmfJP/Storm-King-of-the-Tempest.png",
    page: "https://ibb.co/Zz8cLsM1",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "three-headed-hellhound",
    title: "Three-Headed Hellhound Over Infernal Ruins",
    preview: "https://i.ibb.co/TBRjkR98/Three-Headed-Hellhound-Over-Infernal-Ruins.png",
    page: "https://ibb.co/C5vCzvR7",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "hecate-triple-moon",
    title: "Hecate Beneath the Triple Moon",
    preview: "https://i.ibb.co/GQvFkGm3/Hecate-Beneath-the-Triple-Moon.png",
    page: "https://ibb.co/fdYQtZJG",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "hestia-hearth-ruins",
    title: "Hestia's Hearth Among Ancient Ruins",
    preview: "https://i.ibb.co/nsxtw1yf/Hestia-s-Hearth-Among-Ancient-Ruins.png",
    page: "https://ibb.co/gMkhrW8w",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "mythic-blacksmith-flames",
    title: "Mythic Blacksmith Amidst the Flames",
    preview: "https://i.ibb.co/N27xyQjP/Mythic-Blacksmith-Amidst-the-Flames.png",
    page: "https://ibb.co/Mk9nCWV4",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "persephone-crimson-garden",
    title: "Persephone in the Crimson Underworld Garden",
    preview: "https://i.ibb.co/tM8CL0jT/Persephone-in-the-Crimson-Underworld-Garden.png",
    page: "https://ibb.co/qMk1JHq3",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "serpent-queen-ruined-temple",
    title: "Serpent Queen of the Ruined Temple",
    preview: "https://i.ibb.co/qYP5dKC3/Serpent-Queen-of-the-Ruined-Temple.png",
    page: "https://ibb.co/HTkdV6Cf",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "hades-crimson-underworld-ii",
    title: "Hades in the Crimson Underworld II",
    preview: "https://i.ibb.co/Hf790zv1/Hades-in-the-Crimson-Underworld.png",
    page: "https://ibb.co/dwBHS291",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "lion-clad-hero-ii",
    title: "Lion-Clad Hero Beneath Fiery Skies II",
    preview: "https://i.ibb.co/fzSnT0fw/Lion-Clad-Hero-Beneath-Fiery-Skies.png",
    page: "https://ibb.co/7dzR0yPm",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "storm-god-electric-blue-ii",
    title: "Storm God in Electric Blue II",
    preview: "https://i.ibb.co/gGySKBf/Storm-God-in-Electric-Blue-1.png",
    page: "https://ibb.co/vb13nKT",
    size: "1920 × 1080 · PNG",
  },
  {
    id: "storm-kissed-queen-ii",
    title: "Storm-Kissed Queen with Peacock II",
    preview: "https://i.ibb.co/RGycs4Cv/Storm-Kissed-Queen-with-Peacock.png",
    page: "https://ibb.co/ymSqZB8f",
    size: "1920 × 1080 · PNG",
  },
];

/**
 * Mobile (phone) wallpapers, in the order they were added. Each one is a god or goddess.
 * preview = the ImgBB viewer image (smaller, fast to load), page = the ImgBB page where visitors press Download.
 * To add one: upload it to ImgBB, then add a line at the bottom of MOBILE_WALLPAPERS (the page shows it newest-first).
 */
export const MOBILE_WALLPAPERS: Wallpaper[] = [
  {
    id: "mobile-helios",
    title: "Helios",
    preview: "https://i.ibb.co/4g32BLjd/Helios.png",
    page: "https://ibb.co/S7GcqgKr",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-pan",
    title: "Pan",
    preview: "https://i.ibb.co/gMWjMJtZ/Pan.png",
    page: "https://ibb.co/JRpBRHrj",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-eros",
    title: "Eros",
    preview: "https://i.ibb.co/GwFmTZQ/Eros.png",
    page: "https://ibb.co/yTV2SzF",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-leto",
    title: "Leto",
    preview: "https://i.ibb.co/zT51My3z/Leto.png",
    page: "https://ibb.co/q3nzStHv",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-rhea",
    title: "Rhea",
    preview: "https://i.ibb.co/Xkj42SPp/Rhea.png",
    page: "https://ibb.co/S75xsRg0",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-cronus",
    title: "Cronus",
    preview: "https://i.ibb.co/gMqkDb5G/Cronus.png",
    page: "https://ibb.co/BVW0gHXm",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-uranus",
    title: "Uranus",
    preview: "https://i.ibb.co/5hyf8cqk/Uranus.png",
    page: "https://ibb.co/1G5wq2HM",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-gaia",
    title: "Gaia",
    preview: "https://i.ibb.co/67J43NB9/Gaia.png",
    page: "https://ibb.co/Zp1hnNm4",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-prometheus",
    title: "Prometheus",
    preview: "https://i.ibb.co/Q7ScR5sg/Prometheus.png",
    page: "https://ibb.co/rK8tSWnj",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-hecate",
    title: "Hecate",
    preview: "https://i.ibb.co/7tS2Fvzs/Hecate.png",
    page: "https://ibb.co/60yg5YZj",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-hestia",
    title: "Hestia",
    preview: "https://i.ibb.co/m5PRxTCN/Hestia.png",
    page: "https://ibb.co/k2PGdBgm",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-persephone",
    title: "Persephone",
    preview: "https://i.ibb.co/V0KLQ951/Persephone.png",
    page: "https://ibb.co/FkPh03Cr",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-hades",
    title: "Hades",
    preview: "https://i.ibb.co/ccsR2Tp7/Hades.png",
    page: "https://ibb.co/d0HXkK3z",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-dionysus",
    title: "Dionysus",
    preview: "https://i.ibb.co/3m70K0DN/Dionysus.png",
    page: "https://ibb.co/k2xhZhR8",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-hermes",
    title: "Hermes",
    preview: "https://i.ibb.co/TDWm8s9W/Hermes.png",
    page: "https://ibb.co/NgTZjMcT",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-hephaestus",
    title: "Hephaestus",
    preview: "https://i.ibb.co/vCGBwNrH/Hephaestus.png",
    page: "https://ibb.co/nqv0gXVb",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-aphrodite",
    title: "Aphrodite",
    preview: "https://i.ibb.co/twZn6348/Aphrodite.png",
    page: "https://ibb.co/Ng1fq7sZ",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-ares",
    title: "Ares",
    preview: "https://i.ibb.co/93dvqM3n/Ares.png",
    page: "https://ibb.co/vvMBJtv1",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-artemis",
    title: "Artemis",
    preview: "https://i.ibb.co/p6jLyS9d/Artemis.png",
    page: "https://ibb.co/203kNTfd",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-apollo",
    title: "Apollo",
    preview: "https://i.ibb.co/hFJXZbfv/Apollo.png",
    page: "https://ibb.co/k2s39j1F",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-athena",
    title: "Athena",
    preview: "https://i.ibb.co/3mLd0VBB/Athena.png",
    page: "https://ibb.co/yFbP8KWW",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-demeter",
    title: "Demeter",
    preview: "https://i.ibb.co/Kxyj7HJ1/Demeter.png",
    page: "https://ibb.co/YBj78Gxr",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-poseidon",
    title: "Poseidon",
    preview: "https://i.ibb.co/RT4BSdQd/Poseidon.png",
    page: "https://ibb.co/4RgYf343",
    size: "1145 × 1374 · PNG",
  },
  {
    id: "mobile-hera",
    title: "Hera",
    preview: "https://i.ibb.co/JR9xbkyG/Hera.png",
    page: "https://ibb.co/ccjbpTCZ",
    size: "1024 × 1536 · PNG",
  },
  {
    id: "mobile-zeus",
    title: "Zeus",
    preview: "https://i.ibb.co/CKvKw6My/Zeus.png",
    page: "https://ibb.co/PG4GrM9y",
    size: "1145 × 1374 · PNG",
  },
];
