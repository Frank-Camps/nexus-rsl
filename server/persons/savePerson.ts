'use server';

import Person from '@/lib/models/Person.model';
import dbConnect from "../../lib/services/mongodb";
import { IPerson } from "../../interfaces/person/person.interface";

const sanitizeEmptyStrings = (obj: any) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === '') {
            obj[key] = null;
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
        await dbConnect();

        const cleanedData = JSON.parse(JSON.stringify(formData));
        sanitizeEmptyStrings(cleanedData);

        const { _id, ...dataToSave } = cleanedData;

        // --- ÉTAPE 1 : ANALYSE DES RELATIONS AVANT SAUVEGARDE ---
        let oldRelationIds: string[] = [];

        // Si c'est une modification, on va lire la base de données pour connaître les anciens amis
        if (_id) {
            const oldPerson = await Person.findById(_id);
            if (oldPerson && oldPerson.personRelations) {
                oldRelationIds = oldPerson.personRelations
                    .filter((r: any) => r.person)
                    .map((r: any) => r.person.toString());
            }
        }

        // On extrait la liste des nouveaux amis du formulaire
        const newRelationIds = dataToSave.personRelations
            ? dataToSave.personRelations
                .filter((r: any) => r.person)
                .map((r: any) => r.person.toString())
            : [];


        // --- ÉTAPE 2 : SAUVEGARDE DE LA FICHE PRINCIPALE ---
        let savedPerson;
        if (_id) {
            console.log(`💾 [MONGO] Mise à jour de l'ID : ${_id}`);
            savedPerson = await Person.findByIdAndUpdate(
                _id,
                { $set: dataToSave },
                { new: true, runValidators: true }
            );
            if (!savedPerson) return { success: false, error: "L'individu à modifier est introuvable." };
        } else {
            console.log("💾 [MONGO] Création d'un nouvel individu");
            savedPerson = await Person.create(dataToSave);
        }

        const subjectId = savedPerson._id.toString();


        // --- ÉTAPE 3 : LA MAGIE BIDIRECTIONNELLE (SYNCHRONISATION) ---

        // A. On regroupe tout le monde (anciens et nouveaux) sans doublons
        const allInvolvedIds = [...new Set([...oldRelationIds, ...newRelationIds])];

        if (allInvolvedIds.length > 0) {
            // B. Le grand ménage : On efface la trace de notre sujet chez TOUS ces individus.
            // Cela permet de nettoyer proprement si une relation a été supprimée ou si un rôle a changé.
            await Person.updateMany(
                { _id: { $in: allInvolvedIds } },
                { $pull: { personRelations: { person: subjectId } } }
            );
        }

        // C. On recrée les liens uniquement chez les individus présents dans le nouveau formulaire
        if (dataToSave.personRelations && dataToSave.personRelations.length > 0) {
            for (const rel of dataToSave.personRelations) {
                if (!rel.person) continue;

                // On injecte notre sujet avec le même rôle (relation symétrique)
                await Person.findByIdAndUpdate(
                    rel.person,
                    {
                        $push: {
                            personRelations: {
                                person: subjectId,
                                role: rel.role
                            }
                        }
                    }
                );
            }
        }

        return {
            success: true,
            message: `La fiche a été enregistrée et le réseau de relations a été synchronisé.`
        };

    } catch (error: any) {
        console.error("❌ Erreur critique dans savePersonAction:", error);
        if (error.code === 11000) {
            return { success: false, error: "Un individu avec cet identifiant unique existe déjà." };
        }
        return { success: false, error: error.message || "Impossible d'enregistrer les données." };
    }
}