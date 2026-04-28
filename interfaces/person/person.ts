export interface IPerson {
    lastname?: string;
    firstname?: string;
    birthDate?: string; // Format ISO YYYY-MM-DD
    personStatus?: string; // ex: Suspect, Témoin, Plaignant
    vehicles?: IVehicle[];
    relations?: IPerson[];
}