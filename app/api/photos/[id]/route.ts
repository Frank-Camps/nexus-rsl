import { NextResponse } from 'next/server';

import mongoose from 'mongoose';
import dbConnect from "@/lib/services/mongodb";
import {getGridFSBucket} from "@/lib/services/gridfs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const bucket = getGridFSBucket();

        // CRUCIAL pour Next.js 15+ : On "unwrappe" les params
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID de fichier invalide" }, { status: 400 });
        }

        const objectId = new mongoose.Types.ObjectId(id);

        // 1. On cherche la carte d'identité du fichier pour connaître son type (jpeg, png)
        const fileMetadata = await mongoose.connection.db
            ?.collection('photos.files')
            .findOne({ _id: objectId });

        if (!fileMetadata) {
            return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
        }

        // 2. Création du flux de téléchargement depuis MongoDB
        const downloadStream = bucket.openDownloadStream(objectId);

        // 3. Transformation du flux Node.js en flux Web compatible avec Next.js
        const webStream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (err) => controller.error(err));
            }
        });

        // 4. On retourne la réponse avec le bon Content-Type de l'image
        return new NextResponse(webStream, {
            headers: {
                'Content-Type': fileMetadata.contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable' // Met l'image en cache pour la rapidité
            }
        });

    } catch (error: any) {
        console.error("❌ Erreur de lecture GridFS:", error);
        return NextResponse.json({ error: "Impossible de lire le fichier" }, { status: 500 });
    }
}