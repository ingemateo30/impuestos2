import { NextResponse } from 'next/server';
import XLSX from 'xlsx';
import { connectDB } from '@/lib/db';
import { Company, Tax } from '@/models';

export async function POST(request) {
  await connectDB();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se ha subido ningún archivo' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Procesar empresas
    const companiesSheet = workbook.Sheets[workbook.SheetNames[0]];
    const companiesData = XLSX.utils.sheet_to_json(companiesSheet);
    
    for (const row of companiesData) {
      await Company.upsert({
        nit: row.NIT,
        name: row.Nombre,
        email: row.Email,
        phone: row.Telefono,
        address: row.Direccion
      });
    }
    
    // Procesar impuestos
    const taxesSheet = workbook.Sheets[workbook.SheetNames[1]];
    const taxesData = XLSX.utils.sheet_to_json(taxesSheet);
    
    for (const row of taxesData) {
      const company = await Company.findOne({ where: { nit: row.NIT } });
      if (company) {
        await Tax.upsert({
          companyId: company.id,
          type: row.Tipo,
          name: row.Nombre,
          amount: row.Monto,
          dueDate: new Date(row.FechaVencimiento),
          status: 'pending'
        });
      }
    }
    
    return NextResponse.json({ success: true, processed: companiesData.length + taxesData.length });
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}