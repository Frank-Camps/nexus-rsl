import dbConnect from '../lib/services/mongodb';
import Person from '../lib/models/Person.model';
import Metadata from '../lib/models/Metadata';

export async function seedPersons() {
    await dbConnect();

    // 1. On récupère quelques IDs de métadonnées pour que ce soit réaliste
    const homme = await Metadata.findOne({ name: 'Homme', type: 'sex' });
    const caucasien = await Metadata.findOne({ name: 'Caucasien', type: 'origin' });
    const actif = await Metadata.findOne({ name: 'Actif', type: 'person-status' });
    const bleu = await Metadata.findOne({ name: 'Bleu', type: 'eye-color' });

    const dummyPersons = [
        {
            lastname: "TREMBLAY",
            firstname: "Marc-André",
            nickname: "Le Grand",
            birthDate: new Date("1985-06-12"),
            fps: "882744-A",
            wanted: true,
            isTarget: true,
            sex: homme?._id,
            origin: caucasien?._id,
            personStatus: actif?._id,
            eyeColor: bleu?._id,
            phone: "514-555-0199",
            nickname: "Big Marc",
            notes: "Individu considéré comme imprévisible. Connu pour trafic de stupéfiants."
        },
        {
            lastname: "GARCIA",
            firstname: "Elena",
            nickname: "La Reina",
            birthDate: new Date("1992-11-24"),
            fps: "993012-C",
            wanted: false,
            isTarget: true,
            sex: await Metadata.findOne({ name: 'Femme' }).then(m => m?._id),
            origin: await Metadata.findOne({ name: 'Latino' }).then(m => m?._id),
            personStatus: actif?._id,
            notes: "Lien suspect avec le crime organisé. Surveillance discrète requise."
        },
        {
            lastname: "DUBOIS",
            firstname: "Jérôme",
            birthDate: new Date("1978-02-02"),
            fps: "445100-F",
            wanted: false,
            isTarget: true,
            sex: homme?._id,
            origin: caucasien?._id,
            personStatus: await Metadata.findOne({ name: 'En attente' }).then(m => m?._id),
            notes: "Expert en fraude informatique. Ne possède pas de véhicule connu."
        }
    ];

    try {
        // Optionnel : Nettoyer la collection avant (Attention en prod !)
        // await Person.deleteMany({ isTarget: true });

        const created = await Person.insertMany(dummyPersons);
        console.log(`✅ Succès : ${created.length} personnes d'intérêt créées.`);
    } catch (error) {
        console.error("❌ Erreur de peuplement :", error);
    }
}