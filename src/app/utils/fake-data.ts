import { DateTime } from 'luxon';
import { IUser } from '../interfaces/IUser.interface';
import { NavigationItem } from '../core/navigation/navigation-item.interface';

export interface Order {
  name: string;
  price: string;
  status: 'ready' | 'pending' | 'warn';
  timestamp: string;
}

export const tableSalesData: Order[] = [
  {
    name: 'Apple iPhone 8',
    price: '$899.99',
    status: 'pending',
    timestamp: DateTime.local().minus({ minutes: 2 }).toRelative()!
  },
  {
    name: 'USB-C Cable',
    price: '$8.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 6 }).toRelative()!
  },
  {
    name: 'Apple MacBook Pro',
    price: '$1299.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 14 }).toRelative()!
  },
  {
    name: 'Samsung Galaxy S9',
    price: '$799.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 17 }).toRelative()!
  },
  {
    name: 'Lightning to USB-C Adapter',
    price: '$16.99',
    status: 'pending',
    timestamp: DateTime.local().minus({ minutes: 25 }).toRelative()!
  },
  {
    name: 'Samsung Galaxy S8 256GB',
    price: '$599.99',
    status: 'warn',
    timestamp: DateTime.local().minus({ minutes: 42 }).toRelative()!
  },
  {
    name: 'Apple iPhone X',
    price: '$1099.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 87 }).toRelative()!
  },
  {
    name: 'Apple iPhone 7 128GB',
    price: '$699.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 102 }).toRelative()!
  },
  {
    name: 'Apple Mac Pro',
    price: '$999.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 122 }).toRelative()!
  },
  {
    name: 'Samsung DEX',
    price: '$54.99',
    status: 'pending',
    timestamp: DateTime.local().minus({ minutes: 300 }).toRelative()!
  },
  {
    name: 'Apple iPhone X 256GB',
    price: '$1199.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 340 }).toRelative()!
  },
  {
    name: 'Apple MacBook 2019',
    price: '$2499.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 400 }).toRelative()!
  }
];

export const fakeUserLogin: IUser = {
  id: 1,
  alias: "Administrador",
  username: "Administrador",
  role: "ADMIN",
  accessToken: "ec80f5690620d23ab137502f24165195009d9466",
  refreshToken: "ec80f5690620d23ab137502f24165195009d9466",
  createdAt: DateTime.now().setLocale('es-PE').toFormat('yyyy-MM-dd HH:mm:ss')
}

export const OPTIONS: NavigationItem[] = [
  {
    type: 'link',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'mat:dashboard',
    routerLinkActiveOptions: { exact: true }
  },
  {
    type: 'subheading',
    label: 'Mantenimiento',
    children: [
      {
        type: 'link',
        label: 'Usuarios',
        route: '/maintenance/users',
        icon: 'mat:group',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Áreas',
        route: '/maintenance/areas',
        icon: 'mat:door_front',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Servicios',
        route: '/maintenance/services',
        icon: 'mat:emoji_objects',
        routerLinkActiveOptions: { exact: true }
      },
    ]
  },
  {
    type: 'subheading',
    label: 'Gestión',
    children: [
      {
        type: 'link',
        label: 'Consumos',
        route: '/management/consumptions',
        icon: 'mat:calculate',
        routerLinkActiveOptions: { exact: true }
      },
    ]
  }
  // TODO: AGREGAR MÁS OPCIONES DE SER NECESARIO
];
