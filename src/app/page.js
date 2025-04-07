'use client'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor selecciona un archivo Excel')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(`Importación exitosa. Registros procesados: ${data.processed}`)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error(error)
      setMessage('Error al subir el archivo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Importar desde Excel</h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Subiendo...' : 'Subir y Procesar Excel'}
      </button>

      {message && <p className="mt-4 text-center text-green-700">{message}</p>}
    </div>
  )
}

