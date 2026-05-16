import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Person from '@/lib/models/Person.model';
import Metadata from '@/lib/models/Metadata'; // On s'assure qu'il est chargé

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isTarget = searchParams.get('isTarget');

        await dbConnect();

        // PETITE ASTUCE : Forcer l'initialisation si Mongoose est capricieux
        // On s'assure que le modèle Metadata est bien compilé
        if (!Metadata) {
            throw new Error("Le modèle Metadata n'a pas pu être chargé");
        }

        const query = isTarget ? { isTarget: isTarget === 'true' } : {};

        const persons = await Person.find(query)
            .populate({
                path: 'sex origin personStatus',
                model: Metadata // On force explicitement le modèle à utiliser pour le populate
            })
            .sort({ lastname: 1 });

        return NextResponse.json(persons);
    } catch (error: any) {
        console.error("ERREUR API PERSONS:", error.message);
        return NextResponse.json({
            error: "Erreur serveur",
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        console.log('entered')
        await dbConnect();
        const data = await request.json();

        // Création dans MongoDB
        const newPerson = await Person.create(data);

        return NextResponse.json(newPerson, { status: 201 });
    } catch (error: any) {
        console.error("ERREUR SERVEUR DETECTEE:", error);
        // On renvoie l'erreur réelle pour la voir dans la console du navigateur
        return NextResponse.json({
            message: "Erreur serveur",
            detail: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}