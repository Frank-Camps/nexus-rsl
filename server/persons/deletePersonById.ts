'use server';


import Person from '@/lib/models/Person.model';
import dbConnect from "@/lib/mongodb";

export async function deletePersonByIdAction(id: string) {
    try {
        // 1. Connexion à la base de données
        await dbConnect();

        // 2. Validation rapide que l'ID est fourni
        if (!id) {
            return { success: false, error: "L'identifiant du sujet est manquant." };
        }

        // 3. Suppression dans MongoDB
        const deletedPerson = await Person.findByIdAndDelete(id);

        // 4. Si l'ID n'existait pas ou avait déjà été supprimé
        if (!deletedPerson) {
            return { success: false, error: "Aucun individu trouvé avec cet identifiant." };
        }

        return { success: true };
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