// ==========================================
// 1. SECTION MÉTAPROPRIÉTÉS (Collection unique "MetadataModel")
// ==========================================

export type MetadataType =
    | 'origin'
    | 'sex'
    | 'sector'
    | 'hair-type'
    | 'hair-color'
    | 'eye-color'
    | 'body-part'
    | 'activity'
    | 'person-status'
    | 'condition'
    | 'car-brand'
    | 'car-color'
    | 'car-status';

export interface IMetadataItem {
    id: string;
    type: MetadataType;
    name: string;
}

// ==========================================
// 2. SECTION CARACTÉRISTIQUES PHYSIQUES INDIVIDUELLES
// ==========================================

export interface ITattoo {
    id: string;
    bodyPartId: string; // Référence à l'id d'un IMetadataItem de type 'body-part'
    description: string;
}

export interface IPiercing {
    id: string;
    bodyPartId: string; // Référence à l'id d'un IMetadataItem de type 'body-part'
    description: string;
}

export interface IScar {
    id: string;
    bodyPartId: string; // Référence à l'id d'un IMetadataItem de type 'body-part'
    description?: string; // Optionnel : pour ajouter des détails si nécessaire
}

// ==========================================
// 3. SECTION ENTITÉS COMPLEXES & LIAISONS
// ==========================================

export interface IAddress {
    id: string;
    civic: string;
    street: string;
    city: string;
    postalCode: string;
}

