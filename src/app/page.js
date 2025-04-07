'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDate, isDateApproaching } from './utils/date';

export default function Dashboard() {
  const [upcomingTaxes, setUpcomingTaxes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      
        try {
          const companiesRes = await fetch('/api/companies');
          const companiesData = await companiesRes.json();
          setCompanies(companiesData);
          
          // Obtener impuestos con fechas próximas
          const taxesRes = await fetch('/api/taxes/upcoming');
          const taxesData = await taxesRes.json();
          setUpcomingTaxes(taxesData);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    
    fetchData();
  }, );

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Próximos Vencimientos</h2>
          {upcomingTaxes.length > 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impuesto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingTaxes.map((tax) => {
                    const company = companies.find(c => c._id === tax.company);
                    const isPending = new Date(tax.dueDate) > new Date();
                    const isUrgent = isDateApproaching(tax.dueDate, 3);
                    
                    return (
                      <tr key={tax._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{company?.name || 'Empresa no encontrada'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tax.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(tax.dueDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${isPending 
                              ? isUrgent 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'}`}>
                            {isPending 
                              ? isUrgent 
                                ? 'Próximo' 
                                : 'Pendiente'
                              : 'Vencido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/taxes/${tax._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            Ver
                          </Link>
                          <Link href={`/taxes/${tax._id}/pay`} className="text-green-600 hover:text-green-900">
                            Registrar Pago
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="bg-white p-4 rounded shadow">No hay impuestos próximos a vencer.</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Total Empresas</h3>
            <p className="text-3xl font-bold">{companies.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Impuestos Vencidos</h3>
            <p className="text-3xl font-bold text-red-600">
              {upcomingTaxes.filter(tax => new Date(tax.dueDate) < new Date()).length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Vencimientos Próximos</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {upcomingTaxes.filter(tax => isDateApproaching(tax.dueDate, 7)).length}
            </p>
          </div>
        </div>
      </div>
   
  );
}
