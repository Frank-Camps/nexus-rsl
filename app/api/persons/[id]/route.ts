import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/services/mongodb';
import Person from '@/lib/models/Person.model';
import Metadata from '@/lib/models/Metadata'; // Si tu l'as
import Vehicle from '@/lib/models/Vehicle.model'; // Le véhicule lui-même
import CarModel from '@/lib/models/CarModel';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        // CRUCIAL : On "unwrappe" les params ici
        const { id } = await params;

        const person = await Person.findById(id)
            .populate({
                path: 'sex origin personStatus hairColor hairType eyeColor',
                model: Metadata
            })
            .populate({
                path: 'personRelations.person',
                model: Person // On indique explicitement à Mongoose de chercher dans la collection Person
            })
            .populate({
                path: 'vehicleRelations.vehicle',
                model: Vehicle,
                populate: [
                    { path: 'brand', model: Metadata },
                    { path: 'model', model: CarModel },
                    { path: 'color', model: Metadata }
                ]
            });

        if (!person) {
            return NextResponse.json({ error: "Sujet non trouvé" }, { status: 404 });
        }

        return NextResponse.json(person);
    } catch (error: any) {
        console.error("ERREUR API DETAILS PERSONNE:", error.message);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}