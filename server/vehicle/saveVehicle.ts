'use server';

import dbConnect from "@/lib/services/mongodb";
import Vehicle from '@/lib/models/Vehicle.model';
import mongoose from 'mongoose';

export async function saveVehicleAction(data: any) {
    try {
        await dbConnect();

        // On prépare le payload propre pour MongoDB (en forçant la plaque en majuscules)
        const payload = {
            plate: data.plate ? data.plate.toUpperCase() : '',
            year: data.year || '',
            brand: data.brand || null,
            model: data.model || null,
            color: data.color || null,
            carStatus: data.carStatus || null,
        };

        if (data._id) {
            // MODE MODIFICATION
            if (!mongoose.Types.ObjectId.isValid(data._id)) {
                return { success: false, error: "ID de véhicule invalide" };
            }

            const updatedVehicle = await Vehicle.findByIdAndUpdate(
                data._id,
                payload,
                { new: true, runValidators: true }
            ).lean();

            // On convertit pour Next.js (qui n'aime pas les objets Mongoose purs transitant vers le client)
            const safeVehicle = JSON.parse(JSON.stringify(updatedVehicle));
            return { success: true, vehicle: safeVehicle };

        } else {
            // MODE CRÉATION
            const newVehicle = await Vehicle.create(payload);
            const safeVehicle = JSON.parse(JSON.stringify(newVehicle.toObject()));
            return { success: true, vehicle: safeVehicle };
        }

    } catch (error: any) {
        console.error("❌ Erreur saveVehicleAction:", error);
        return { success: false, error: error.message || "Impossible de sauvegarder le véhicule." };
    }
}