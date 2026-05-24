import mongoose, { Schema, model, models } from 'mongoose';

const VehicleSchema = new Schema({
    plate: String,
    // On utilise Schema.Types.ObjectId pour lier aux autres collections
    brand: { type: Schema.Types.ObjectId, ref: 'Metadata' },
    model: { type: Schema.Types.ObjectId, ref: 'CarModel' },
    color: { type: Schema.Types.ObjectId, ref: 'Metadata' },
    carStatus: { type: Schema.Types.ObjectId, ref: 'Metadata' },
    year: String
}, { timestamps: true });

// On exporte le modèle en s'assurant qu'il n'est pas compilé deux fois par Next.js
export default models.Vehicle || model('Vehicle', VehicleSchema);