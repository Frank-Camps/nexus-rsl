'use server';


import dbConnect from "../../lib/services/mongodb";
import Person from "@/lib/models/Person.model";

export async function getPersonsAction(isTargetOnly: boolean = false) {
    try {
        // 1. Connexion à la base de données
        await dbConnect();

        // 2. Définition du filtre (si isTargetOnly est vrai, on filtre)
        const filter = isTargetOnly ? { isTarget: true } : {};

        // 3. Récupération des données triées par mise à jour récente
        const persons = await Person.find(filter).sort({ updatedAt: -1 });

        // 4. Nettoyage obligatoire pour Next.js (Mongoose renvoie des types complexes qui font planter le passage Serveur -> Client)
        return {
            success: true,
            data: JSON.parse(JSON.stringify(persons))
        };
    } catch (error: unknown) {
        console.error("Erreur dans getPersonsAction:", error);

        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : "Impossible de récupérer les individus."
        };
    }
}