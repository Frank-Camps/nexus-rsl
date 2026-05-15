import mongoose, { Schema, models, model } from 'mongoose';

const CarModelSchema = new Schema({
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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

const CarModel = models.CarModel || model('CarModel', CarModelSchema);

export default CarModel;