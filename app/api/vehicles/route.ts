import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Vehicle from "@/lib/models/Vehicle.model";



export async function GET() {
    try {
        // 1. Connexion à la base de données
        await dbConnect();

        // 2. On récupère tous les véhicules.
        // Bonus : On trie par date de création (les plus récents en premier)
        const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
        console.log('è', vehicles)

        // 3. On renvoie le JSON au front-end (SWR)
        return NextResponse.json(vehicles);

    } catch (error: any) {
        console.error("❌ Échec de la route GET /api/vehicles :", error);
        return NextResponse.json(
            { message: error.message || "Erreur interne du serveur lors de la récupération des véhicules." },
            { status: 500 }
        );
    }
}