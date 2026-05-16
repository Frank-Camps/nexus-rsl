import mongoose, { Schema, model, models } from 'mongoose';

const PersonSchema = new Schema({
    firstname: String,
    lastname: String,
    nickname: String,
    birthDate: String,
    diverLicence: String,
    fps: String,
    phone: String,
    email: String,
    wanted: { type: Boolean, default: false },
    isTarget: { type: Boolean, default: false },
    notes: String,
    sex: String,
    origin: String,
    personStatus: String,
    hairType: String,
    hairColor: String,
    eyeColor: String,
    // MODIFICATION ICI : On accepte un tableau de strings (IDs des secteurs)
    activitySector: [String],
    filesRelated: [String],
    address: [{
        civic: String,
        apartment: String,
        street: String,
        city: String,
        postalCode: String,
        type: { type: String, default: 'Domicile' }
    }],
    tattoo: [{ region: String, description: String }],
    piercings: [{ region: String, description: String }],
    scars: [{ region: String, description: String }],
    // MODIFICATION ICI : Pour matcher ton formulaire qui envoie { person: 'ID' }
    relations: [{
        person: String, // On stocke l'ID en string pour simplifier
    }],
    // MODIFICATION ICI : Pour matcher ton formulaire qui envoie { info: 'PLAQUE' }
    vehicles: [{
        info: String
    }],
    activities: [String],
    conditions: [String]
}, { timestamps: true });

export default models.Person || model('Person', PersonSchema);