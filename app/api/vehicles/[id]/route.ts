import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from "@/lib/services/mongodb";

// Imports explicites pour contrer le cache de Next.js
import Vehicle from '@/lib/models/Vehicle.model';
import Metadata from '@/lib/models/Metadata.model';
import CarModel from '@/lib/models/CarModel.model';
import Person from '@/lib/models/Person.model';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Format d'ID invalide" }, { status: 400 });
        }

        // 1. Chercher le véhicule (sans owner ni relatedPerson car ils ne sont pas dans ce schéma)
        const vehicleDoc = await Vehicle.findById(id)
            .populate({ path: 'brand', model: Metadata, select: 'name' })
            .populate({ path: 'model', model: CarModel, select: 'name' })
            .populate({ path: 'color', model: Metadata, select: 'name' })
            .populate({ path: 'carStatus', model: Metadata, select: 'name' })
            .lean();

        if (!vehicleDoc) {
            return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
        }

        // 2. RECHERCHE INVERSÉE : On cherche toutes les personnes qui ont ce véhicule dans leur dossier
        const personsLinked = await Person.find({ 'vehicleRelations.vehicle': id })
            .populate({ path: 'vehicleRelations.role', model: Metadata, select: 'name' })
            .select('firstname lastname birthDate photos vehicleRelations')
            .lean();

        // 3. On nettoie et on extrait le rôle spécifique à ce véhicule pour l'affichage
        const formattedRelations = personsLinked.map((p: any) => {
            // On trouve le rôle exact que cette personne a avec CE véhicule
            const relation = p.vehicleRelations.find((r: any) => r.vehicle.toString() === id);

            return {
                _id: p._id,
                firstname: p.firstname,
                lastname: p.lastname,
                birthDate: p.birthDate,
                photos: p.photos,
                roleName: relation?.role?.name || 'Relié'
            };
        });

        // 4. On fusionne les données pour le front-end
        const vehicleData = {
            ...vehicleDoc,
            relatedPersons: formattedRelations // On injecte le tableau qu'on vient de construire
        };

        return NextResponse.json(vehicleData);

    } catch (error: any) {
        console.error("❌ Erreur lors de la récupération du véhicule:", error.message);
        return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
    }
}