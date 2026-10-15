/**
 * Wallpapers are hosted on ImgBB, so the images themselves are not part of this project.
 * To add one: upload it to ImgBB, then add a line below with
 *   preview = the "medium"/viewer image link (i.ibb.co/...), shown on the page
 *   page    = the ImgBB page link (ibb.co/...), where visitors press Download
 * New wallpapers go at the bottom of the list and appear last on the page.
 */
export type Wallpaper = {
  id: string;
  title: string;
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
];
