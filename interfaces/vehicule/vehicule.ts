import { IMetadataItem } from "@/interfaces/properties.interface";
import { IPerson } from "@/interfaces/person/person.interface"; // Ajuste le chemin selon ta structure

export interface IVehicle {
    id: string; // Toujours pratique d'avoir l'id de l'entité véhicule
    plate?: string;
    owner?: IPerson;
    relatedPerson?: IPerson[];
    createdAt?: Date;
    updatedAt?: Date;

    // Métadonnées (Pointent vers la collection unique "Metadata")
    brand?: IMetadataItem;     // type: 'car-brand'
    carStatus?: IMetadataItem; // type: 'car-status'
    color?: IMetadataItem;     // type: 'car-color' (Tu l'avais dans tes interfaces de base, je l'ajoute ici !)

    // Entité liée (Collection ou structure à part)
    model?: ICarModel; // Contient le nom du modèle et le brandId associé
}

export interface ICarModel {
    id: string;
    brandId: string; // Référence à l'id d'un IMetadataItem de type 'car-brand'
    name: string;
}