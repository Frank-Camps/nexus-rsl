

import {MenuItem} from "@/interfaces/menuItems/menuItems.interface";
import {mdiLogout} from "@mdi/js";

export const SUBMENU_ITEMS: MenuItem[] = [
    {
        name: 'Déconnecter',
        path: '/logout',
        icon: mdiLogout,
    },
];