import { connectDB } from '../../lib/db';
import { Company, Tax } from '../../models';
import XLSX from 'xlsx';
import { getTaxDueDate } from '../../lib/tax-dates';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await connectDB();
    
    const fileBuffer = Buffer.from(req.body.file, 'base64');
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Procesar empresas
    const companiesSheet = workbook.Sheets[workbook.SheetNames[0]];
    const companiesData = XLSX.utils.sheet_to_json(companiesSheet);
    
    for (const company of companiesData) {
      await Company.upsert({
        nit: company.NIT,
        name: company.Nombre,
        email: company.Email,
        phone: company.Telefono,
        address: company.Direccion
      });
    }
    
    // Procesar impuestos
    const taxesSheet = workbook.Sheets[workbook.SheetNames[1]];
    const taxesData = XLSX.utils.sheet_to_json(taxesSheet);
    
    for (const tax of taxesData) {
      const company = await Company.findOne({ where: { nit: tax.NIT } });
      if (!company) continue;
      
      await Tax.upsert({
        companyId: company.id,
        type: tax.Tipo,
        name: tax.Nombre,
        description: tax.Descripcion,
        frequency: tax.Frecuencia,
        dueDate: getTaxDueDate(tax.NIT, tax.Tipo)
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en la importación:', error);
    res.status(500).json({ error: 'Error en la importación' });
  }
}