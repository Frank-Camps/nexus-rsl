import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/services/mongodb';
import Person from '@/lib/models/Person.model';
import Vehicle from '@/lib/models/Vehicle.model';
import CarModelModel from "@/lib/models/CarModel.model";
import MetadataModel from "@/lib/models/Metadata.model"; // Le véhicule lui-même


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        // CRUCIAL : On "unwrappe" les params ici
        const { id } = await params;

        const person = await Person.findById(id)
            .populate({
                path: 'sex origin personStatus hairColor hairType eyeColor',
                model: MetadataModel
            })
            .populate({
                path: 'personRelations.person',
                model: Person // On indique explicitement à Mongoose de chercher dans la collection Person
            })
            .populate({
                path: 'vehicleRelations.vehicle',
                model: Vehicle,
                populate: [
                    { path: 'brand', model: MetadataModel },
                    { path: 'model', model: CarModelModel },
                    { path: 'color', model: MetadataModel }
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