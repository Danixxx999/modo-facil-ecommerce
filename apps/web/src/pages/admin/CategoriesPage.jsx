import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/AdminLayout.jsx';

const CategoriesPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - Categorías - Modo Fácil</title>
      </Helmet>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Categorías</h1>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
