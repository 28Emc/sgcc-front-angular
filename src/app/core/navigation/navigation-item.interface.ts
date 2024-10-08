export type NavigationItem =
  | NavigationLink
  | NavigationDropdown
  | NavigationSubheading;

export interface NavigationLink {
  type: 'link';
  route: string | any;
  fragment?: string;
  label: string;
  icon?: string;
  routerLinkActiveOptions?: { exact: boolean };
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };

  id_componente_padre?: number;
  id_componente?: number;
  orden?: number;
}

export interface NavigationDropdown {
  type: 'dropdown';
  label: string;
  icon?: string;
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };

  id_componente_padre?: number;
  id_componente?: number;
  orden?: number;
}

export interface NavigationSubheading {
  type: 'subheading';
  label: string;
  children: Array<NavigationLink | NavigationDropdown>;
}
