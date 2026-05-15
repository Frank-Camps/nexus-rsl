import {
    IMetadataItem,
    IAddress,
    ITattoo,
    IPiercing,
    IScar
} from "@/interfaces/properties";
import { IVehicle } from "@/interfaces/vehicule"; // Ajuste le chemin si nécessaire

export interface IPerson {
    lastname?: string;
    firstname?: string;
    nickname?: string;
    birthDate?: Date;
    diverLicence?: string;
    fps?: string;
    phone?: string;
    email?: string;
    wanted?: boolean;
    option2?: boolean; // À renommer ou supprimer selon tes besoins futurs
    filesRelated?: string[]; // IDs ou chemins vers tes fichiers/pièces jointes
    relations?: IPerson[]; // Tableau de liaisons vers d'autres cibles

    // Entités complexes (Collections séparées ou sous-documents riches)
    address: IAddress[];
    vehicles?: IVehicle[];

    // Caractéristiques physiques individuelles (Contiennent des descriptions libres)
    tattoo?: ITattoo[];
    piercings?: IPiercing[];
    scars?: IScar[];

    // Métadonnées (Pointent toutes vers ta collection unique "Metadata")
    origin?: IMetadataItem;       // type: 'origin'
    sex?: IMetadataItem;          // type: 'sex'
    activitySector?: IMetadataItem; // type: 'sector'
    hairType?: IMetadataItem;     // type: 'hair-type'
    hairColor?: IMetadataItem;    // type: 'hair-color'
    eyeColor?: IMetadataItem;     // type: 'eye-color'
    personStatus?: IMetadataItem; // type: 'person-status'

    // Tableaux de métadonnées (Pour les choix multiples)
    activities?: IMetadataItem[]; // type: 'activity'
    conditions?: IMetadataItem[]; // type: 'condition'
}