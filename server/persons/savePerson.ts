'use server';

import Person from '@/lib/models/Person.model';
import dbConnect from "@/lib/mongodb";
import {IPerson} from "@/interfaces/person/person";

const sanitizeEmptyStrings = (obj: any) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === '') {
            obj[key] = null; // C'est ici la magie !
        } else if (Array.isArray(obj[key])) {
            obj[key].forEach(item => {
                if (typeof item === 'object' && item !== null) sanitizeEmptyStrings(item);
            });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeEmptyStrings(obj[key]);
        }
    });
};

export async function savePersonAction(formData: IPerson) {
    try {
        // 1. Connexion obligatoire à MongoDB
        await dbConnect();

        const cleanedData = JSON.parse(JSON.stringify(formData));
        sanitizeEmptyStrings(cleanedData);

        // 2. On sépare l'_id du reste
        const { _id, ...dataToSave } = cleanedData;

        if (_id) {
            // --- MODE : MODIFICATION ---
            console.log(`💾 [MONGO] Mise à jour de l'ID : ${_id}`);

            // On met à jour le document avec les nouvelles options :
            // - new: true renvoie le document modifié mis à jour
            // - runValidators: true force le respect du schéma Mongoose même en modification
            const updatedPerson = await Person.findByIdAndUpdate(
                _id,
                { $set: dataToSave },
                { new: true, runValidators: true }
            );

            if (!updatedPerson) {
                return { success: false, error: "L'individu à modifier est introuvable en base de données." };
            }

            return {
                success: true,
                message: `La fiche de ${updatedPerson.firstname} ${updatedPerson.lastname} a été mise à jour.`
            };

        } else {
            // --- MODE : CRÉATION ---
            console.log("💾 [MONGO] Création d'un nouvel individu");

            const newPerson = await Person.create(dataToSave);

            return {
                success: true,
                message: `Le sujet ${newPerson.firstname} ${newPerson.lastname} a été enregistré avec succès.`
            };
        }

    } catch (error: any) {
        console.error("❌ Erreur critique dans savePersonAction:", error);

        // Gestion propre des erreurs de doublons (ex: si le FPS ou le permis doit être unique)
        if (error.code === 11000) {
            return { success: false, error: "Un individu avec cet identifiant unique (FPS/Permis) existe déjà." };
        }

        return {
            success: false,
            error: error.message || "Impossible d'enregistrer les données dans MongoDB."
        };
    }
}