import mongoose from 'mongoose';

let bucket: mongoose.mongo.GridFSBucket | null = null;

export function getGridFSBucket(): mongoose.mongo.GridFSBucket {
    if (bucket) return bucket;

    const conn = mongoose.connection;
    if (!conn.db) {
        throw new Error("❌ Mongoose n'est pas encore connecté à la base de données.");
    }

    // On crée un compartiment nommé 'photos'
    bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });

    return bucket;
}