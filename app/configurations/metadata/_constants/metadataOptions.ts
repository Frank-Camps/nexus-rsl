import { MetadataType } from "@/interfaces/properties/properties.interface";
import {
    mdiEye, mdiGenderTransgender, mdiMapMarker, mdiFormatListBulleted,
    mdiHair, mdiPalette, mdiAccountQuestion, mdiCar, mdiAccountTieHat
} from "@mdi/js";

export interface IMetadataOption {
    type: MetadataType;
    label: string;
    icon: string;
}

export const METADATA_OPTIONS: IMetadataOption[] = [
    { type: 'sex', label: 'Sexe / Genre', icon: mdiGenderTransgender },
    { type: 'eye-color', label: 'Couleur des yeux', icon: mdiEye },
    { type: 'hair-type', label: 'Type de cheveux', icon: mdiFormatListBulleted },
    { type: 'hair-color', label: 'Couleur des cheveux', icon: mdiPalette },
    { type: 'body-part', label: 'Régions anatomiques (Tattoos/Cicatrices)', icon: mdiAccountTieHat },
    { type: 'origin', label: 'Origine / Ethnicité', icon: mdiAccountQuestion },
    { type: 'sector', label: 'Secteurs des Activitées', icon: mdiMapMarker },
    { type: 'car-brand', label: 'Marques de véhicule', icon: mdiCar },
    { type: 'car-color', label: 'Couleurs de véhicule', icon: mdiPalette },
    { type: 'car-status', label: 'Statuts de véhicule', icon: mdiFormatListBulleted },
    { type: 'person-status', label: 'Statuts des sujets', icon: mdiAccountQuestion },
    { type: 'activity', label: 'Activités / Relié', icon: mdiFormatListBulleted },
    { type: 'condition', label: 'Conditions / Ordonnances', icon: mdiFormatListBulleted },
];