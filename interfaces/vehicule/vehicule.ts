export interface IVehicle {
    plate?: string;
    brand?: string;
    model?: string;
    carStatus?: string; // ex: Volé, Suspect, Remisé
    owner?: IPerson;
}