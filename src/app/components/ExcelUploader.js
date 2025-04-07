import { useState } from 'react';
import XLSX from 'xlsx';

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ total: 0, processed: 0 });

  const processExcel = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const companies = XLSX.utils.sheet_to_json(workbook.Sheets['Empresas']);
      const taxes = XLSX.utils.sheet_to_json(workbook.Sheets['Impuestos']);
      
      setProgress({ total: companies.length + taxes.length, processed: 0 });

      // Procesar empresas
      for (const company of companies) {
        await fetch('/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: company.Nombre,
            nit: company.NIT,
            email: company.Email,
            phone: company.Telefono,
            address: company.Direccion
          })
        });
        setProgress(p => ({ ...p, processed: p.processed + 1 }));
      }

      // Procesar impuestos
      for (const tax of taxes) {
        await fetch('/api/taxes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyId: tax.CompanyID,
            type: tax.Tipo,
            name: tax.Nombre,
            description: tax.Descripcion,
            frequency: tax.Frecuencia,
            dueDate: new Date(tax.FechaVencimiento)
          })
        });
        setProgress(p => ({ ...p, processed: p.processed + 1 }));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={() => processExcel(file)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!file}
      >
        Importar Datos
      </button>
      {progress.total > 0 && (
        <div className="mt-4">
          <progress
            value={progress.processed}
            max={progress.total}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-2">
            Procesando {progress.processed} de {progress.total} registros
          </p>
        </div>
      )}
    </div>
  );
}