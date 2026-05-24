import mongoose, { Schema, model, models } from 'mongoose';
import Metadata from "@/lib/models/Metadata.model";
import CarModel from "@/lib/models/CarModel.model";
// 🟢 LE FIX : On supprime les imports de MetadataModel et CarModelModel ici !

const VehicleSchema = new Schema({
    plate: String,
    // 🟢 LE FIX : On utilise les noms exacts en format Texte (String)
    brand: { type: Schema.Types.ObjectId, ref: Metadata },
    model: { type: Schema.Types.ObjectId, ref: CarModel },
    color: { type: Schema.Types.ObjectId, ref: Metadata },
    carStatus: { type: Schema.Types.ObjectId, ref: Metadata },
    year: String
}, { timestamps: true });

export default models.Vehicle || model('Vehicle', VehicleSchema);