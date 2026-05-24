
import {IVehicle} from "../vehicle/vehicle";
import {IAddress, IMetadataItem, IPiercing, IScar, ITattoo} from "@/interfaces/properties/properties.interface";


export interface IPerson {
    _id?: string;
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
    personRelations?: IPersonRelation[];
    vehicleRelations?: IVehicleRelation[];
    isTarget?: boolean;

    // Entités complexes (Collections séparées ou sous-documents riches)
    address: IAddress[];

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
    photos: IPhoto[];

    // Tableaux de métadonnées (Pour les choix multiples)
    activities?: IMetadataItem[]; // type: 'activity'
    conditions?: IMetadataItem[]; // type: 'condition'
}

export interface IPersonRelation {
    person: string | IPerson; // ID (string) avant le populate, objet complet après
    role?: string;
}

export interface IVehicleRelation {
    vehicle: string | IVehicle; // ID (string) avant le populate, objet complet après
    role?: string;
}

export interface IPhoto {
    url: string;
    isMain: boolean;
    file?: File; // 🟢 Optionnel : Sert uniquement au Front-end pour garder le fichier en mémoire avant l'upload
}