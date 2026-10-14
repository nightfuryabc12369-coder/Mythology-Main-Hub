export type Article = {
  slug: string;
  title: string;
  /** Matches the card image at /public/cards/<godId>.webp */
  godId: string;
  godName: string;
  tag: string;
  excerpt: string;
  /** Plain paragraphs. A line starting with "## " becomes a subheading. */
  body: string[];
};
