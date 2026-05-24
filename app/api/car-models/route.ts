import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/services/mongodb';
import CarModelModel from '../../../lib/models/CarModel.model';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brandId = searchParams.get('brandId');
        await dbConnect();
        const query = brandId ? { brandId } : {};
        const data = await CarModelModel.find(query).sort({ name: 1 });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newItem = await CarModelModel.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { id, name } = await request.json();
        const updated = await CarModelModel.findByIdAndUpdate(id, { name }, { new: true });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { id } = await request.json();
        await CarModelModel.findByIdAndDelete(id);
        return NextResponse.json({ message: "Supprimé" });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}