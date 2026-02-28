import {MenuItem} from "@/interfaces/menuItems/menuItems.interface";
import {mdiHome, mdiListBox} from "@mdi/js";

export const MENU_ITEMS: MenuItem[] = [
    {
        name: 'Accueil',
        path: '/',
        icon: mdiHome,
    },
    {
        name: 'Formulaires',
        path: '/forms',
        icon: mdiListBox,
    },
];