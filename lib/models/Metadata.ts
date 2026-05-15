import mongoose, { Schema, models, model } from 'mongoose';

const MetadataSchema = new Schema({
    type: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

// On définit le modèle et on l'exporte de façon nommée ET par défaut pour éviter les erreurs d'import
const Metadata = models.Metadata || model('Metadata', MetadataSchema);

export default Metadata;