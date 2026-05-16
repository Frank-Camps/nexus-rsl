import { NextResponse } from 'next/server';
import { seedPersons } from '@/scripts/seed-person';

export async function GET() {
    try {
        await seedPersons();
        return NextResponse.json({ message: "Peuplement terminé avec succès" });
    } catch (e) {
        return NextResponse.json({ error: "Échec du peuplement" }, { status: 500 });
    }
}