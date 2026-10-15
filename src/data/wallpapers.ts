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
];
