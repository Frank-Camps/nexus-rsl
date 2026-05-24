import { NextResponse } from 'next/server';
import dbConnect from "@/lib/services/mongodb";
import {getGridFSBucket} from "@/lib/services/gridfs";


export async function POST(request: Request) {
    try {
        await dbConnect();
        const bucket = getGridFSBucket();

        // 1. Récupération du fichier depuis le FormData envoyé par le Front-end
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
        }

        // 2. Conversion du fichier en Buffer lisible par Node.js
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Ouverture du flux d'écriture vers MongoDB GridFS
        const uploadStream = bucket.openUploadStream(file.name, {
            contentType: file.type,
            metadata: { uploadedAt: new Date() }
        });

        // 4. Écriture du fichier et fermeture du flux
        await new Promise<void>((resolve, reject) => {
            uploadStream.end(buffer, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        // 5. On renvoie l'ID généré par MongoDB pour cette photo
        return NextResponse.json({
            success: true,
            fileId: uploadStream.id.toString(),
            filename: file.name
        });

    } catch (error: any) {
        console.error("❌ Erreur d'upload GridFS:", error);
        return NextResponse.json({ error: "Erreur lors du traitement du fichier" }, { status: 500 });
    }
}