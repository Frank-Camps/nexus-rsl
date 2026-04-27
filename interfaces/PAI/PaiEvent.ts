export interface IPaiEvent {
    id: string; // ID MongoDB ou UUID
    date: string;
    shift: 'Jour' | 'Soir' | 'Nuit';
    sector: '1' | '2' | '3';
    fileNumber?: string;
    adresse?: string;
    event: string;

    // On utilise des tableaux car un appel peut impliquer
    // plusieurs personnes ou plusieurs véhicules
    persons?: IPerson[];
    cars?: IVehicle[];

    notes?: string; // Pour les détails plus narratifs du fichier Word
    createurId?: string; // Matricule de l'agent qui a saisi l'info
    createdAt: string;
}

export interface IPerson {
    lastname?: string;
    firstname?: string;
    birthDate?: string; // Format ISO YYYY-MM-DD
    personStatus?: string; // ex: Suspect, Témoin, Plaignant
}

export interface IVehicle {
    plate?: string;
    brand?: string;
    model?: string;
    carStatus?: string; // ex: Volé, Suspect, Remisé
}