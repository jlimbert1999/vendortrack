import { UserRole } from 'src/modules/users/entities/user.entity';

export const MENU_FRONTEND = [
  {
    role: UserRole.OFFICER,
    menu: [
      { label: 'Comerciantes', icon: 'diversity_3', routerLink: 'traders' },
      { label: 'Puestos', icon: 'storefront', routerLink: 'stalls' },
    ],
  },
  {
    role: UserRole.ADMIN,
    menu: [{ label: 'Usuarios', icon: 'group', routerLink: 'users' }],
  },
] as const;
