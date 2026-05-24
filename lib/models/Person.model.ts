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
    photos: [{
        url: String, // Le lien vers l'image
        isMain: { type: Boolean, default: false } // Le fameux flag pour le thumbnail
    }],
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
    personRelations: [{
        person: { type: Schema.Types.ObjectId, ref: 'Person' },
        role: String
    }],

    vehicleRelations: [{
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
        role: String
    }],
    activities: [String],
    conditions: [String]
}, { timestamps: true });

export default models.Person || model('Person', PersonSchema);