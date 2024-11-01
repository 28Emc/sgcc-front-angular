export const ROLES = [
  {
    id: 1,
    role: 'admin',
    description: 'ADMINISTRADOR'
  },
  {
    id: 2,
    role: 'user',
    description: 'USUARIO'
  }
];
export const USER_ROLE = ROLES[1].role;
export const DEFAULT_BADGE_CLASSES: string[] = ['bg-gray-600/10', 'text-gray-600'];
export const BADGE_STYLES: Map<string, string[]> = new Map<string, string[]>([
  ['admin', ['bg-red-400/20', 'text-red-600']],
  ['user', ['bg-cyan-400/20', 'text-cyan-600']],
  // ['xxx', ['bg-yellow-400/20', 'text-yellow-600']],
  // ['yyy', ['bg-orange-400/20', 'text-orange-600']],
  // ['zzz', ['bg-purple-400/20', 'text-purple-600']],
]);
export const MAX_WIDTH_MOBILE = `(max-width: 599px)`;
