export interface IAddress {
    civicNumber: string;  // string au cas où (ex: 123A)
    street: string;
    apartment?: string;   // Souvent utile pour les blocs/plex
    city: string;
    zipCode: string;      // Format J2J 2J2
    sector?: '1' | '2' | '3'; // Optionnel ici car déjà dans l'event, mais utile si l'adresse est isolée
    notes?: string;       // ex: "Entrée par l'arrière", "Code porte 1234"
}