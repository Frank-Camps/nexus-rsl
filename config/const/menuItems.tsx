import {MenuItem} from "@/interfaces/menuItems/menuItems.interface";
import {mdiHome, mdiListBox, mdiTarget, mdiAccountTieHat, mdiCarSports, mdiMapMarkerRadius, mdiDatabaseSettings,mdiCog, mdiAccountGroup } from "@mdi/js";


export const MENU_ITEMS: MenuItem[] = [
    {
        name: 'Accueil',
        path: '/',
        icon: mdiHome,
    },
    {
        name: "Cibles d'intérêts",
        path: '/targets-group', // Chemin fictif pour le parent
        icon: mdiTarget,
        children: [
            {
                name: "Personnes d'intérêt",
                path: '/target/persons',
                icon: mdiAccountTieHat,
            },
            {
                name: "Véhicules d'intérêt",
                path: '/target/cars',
                icon: mdiCarSports,
            },
            {
                name: "Lieux d'intérêt",
                path: '/target/places',
                icon: mdiMapMarkerRadius,
            },
        ],
    },
    {
        name: 'Formulaires',
        path: '/forms',
        icon: mdiListBox,
    },
    {
        name: 'PAI',
        path: '/pai',
        icon: mdiListBox,
    },
    {
        name: 'Configurations',
        path: '/settings',
        icon: mdiCog,
        children: [
            {
                name: 'MétaDonnées',
                path: '/settings/metaData',
                icon: mdiDatabaseSettings,
            },
            {
                name: 'Utilisateurs',
                path: '/settings/users',
                icon: mdiAccountGroup,
            }
        ]
    }
];