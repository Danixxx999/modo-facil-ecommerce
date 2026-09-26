import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/AdminLayout.jsx';

const FAQPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - FAQ - Modo Fácil</title>
      </Helmet>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Preguntas frecuentes</h1>
      </div>
    </AdminLayout>
  );
};

export default FAQPage;
