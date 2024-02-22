import type { ReactElement } from 'react';

export interface SubLink {
  id: number;
  link: string;
  title: string;
  selected: boolean;
  allow: boolean;
  icon: IconObject | null;
}

export interface LinkItem {
  id: number;
  link: string;
  title: string;
  selected: boolean;
  allow: boolean;
  icon: IconObject | null;
  subLinks?: SubLink[];
}

export type IconObject = ReactElement | null;
