import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/AdminLayout.jsx';

const ClientsPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - Clientes - Modo Fácil</title>
      </Helmet>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Clientes</h1>
      </div>
    </AdminLayout>
  );
};

export default ClientsPage;
