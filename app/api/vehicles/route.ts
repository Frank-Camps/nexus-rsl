import { NextResponse } from 'next/server';
import dbConnect from "@/lib/services/mongodb";

// 1. On importe explicitement avec des variables pour empêcher Next.js de les ignorer
import Vehicle from '@/lib/models/Vehicle.model';
import Metadata from '@/lib/models/Metadata.model'; // Assure-toi que ce nom correspond à ton fichier
import CarModel from '@/lib/models/CarModel.model'; // Assure-toi que ce nom correspond à ton fichier

export async function GET() {
    try {
        await dbConnect();

        // 2. On injecte explicitement les modèles dans le populate
        const vehicles = await Vehicle.find()
            .populate({ path: 'brand', model: Metadata, select: 'name' })
            .populate({ path: 'model', model: CarModel, select: 'name' })
            .populate({ path: 'color', model: Metadata, select: 'name' })
            .populate({ path: 'carStatus', model: Metadata, select: 'name' })
            .sort({ createdAt: -1 })
            .lean(); // 3. CRUCIAL : Force la conversion en JSON propre, sans les méthodes Mongoose qui causent des bugs

        return NextResponse.json(vehicles);
    } catch (error: any) {
        console.error("❌ Erreur lors de la récupération des véhicules:", error.message);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}