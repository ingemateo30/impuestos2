import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Company } from '@/models';

export async function GET() {
  await connectDB();
  try {
    const companies = await Company.findAll({
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener empresas' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const company = await Company.create(body);
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear empresa' },
      { status: 400 }
    );
  }
}