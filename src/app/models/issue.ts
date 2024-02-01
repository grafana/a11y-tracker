export type Issue = {
  author: string;
  body: string;
  closedAt: number | null;
  createdAt: number;
  labels: string;
  reactions: number;
  state: `open` | `closed`;
  title: string;
  updatedAt: number;
  'wcag level A': boolean;
  'wcag level AA': boolean;
  'wcag level AAA': boolean;
};
