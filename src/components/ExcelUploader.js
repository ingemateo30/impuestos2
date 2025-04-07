'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error(await response.text());
      
      setMessage('Datos importados correctamente');
      router.refresh();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Seleccionar archivo Excel:
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full border rounded p-2"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : 'Importar Datos'}
        </button>
        
        {message && (
          <p className={`mt-4 text-sm ${
            message.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}