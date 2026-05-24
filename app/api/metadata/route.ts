import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/services/mongodb';
import MetadataModel from "@/lib/models/Metadata.model";

export async function GET() {
    try {
        await dbConnect();
        // On récupère tout et on trie par nom
        const data = await MetadataModel.find({}).sort({ name: 1 });

        // Mongoose va transformer les documents via le toJSON qu'on a mis dans le modèle
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erreur GET MetadataModel:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newItem = await MetadataModel.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { id, ...updateData } = await request.json();

        const updatedItem = await MetadataModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Retourne le document modifié
        );

        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();

        // On récupère l'ID envoyé dans le body par Axios
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const deletedItem = await MetadataModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ error: "Élément introuvable" }, { status: 404 });
        }

        return NextResponse.json({ message: "Supprimé avec succès" });
    } catch (error) {
        console.error("Erreur DELETE MetadataModel:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}