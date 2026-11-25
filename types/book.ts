export type Motif = "sun" | "moon" | "waves" | "flower" | "lines" | "arch";
export type Illustration = "botanical" | "constellation" | "diagram" | "storybook" | "none";

export interface PageContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  pageNumber: number;
  illustration: Illustration;
  dropCap?: boolean;
  pullQuote?: string;
}

export interface BookCoverStyle {
  background: string;
  accent: string;
  text: string;
  motif: Motif;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  description: string;
  pages: number;
  year: number;
  cover: BookCoverStyle;
  spineWidth: number;
  height: number;
  tilt?: number;
  leftPage: PageContent;
  rightPage: PageContent;
}
