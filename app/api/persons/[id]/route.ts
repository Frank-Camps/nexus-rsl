import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Person from '@/lib/models/Person.model';
import Metadata from '@/lib/models/Metadata'; // Toujours importer pour le populate

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        // CRUCIAL : On "unwrappe" les params ici
        const { id } = await params;

        const person = await Person.findById(id)
            .populate({
                path: 'sex origin personStatus hairColor hairType eyeColor',
                model: Metadata
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