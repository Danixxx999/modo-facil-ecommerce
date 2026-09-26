import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useProducts } from '@/hooks/useProducts.js';

const ProductsPage = () => {
  const { products, loading } = useProducts({});

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - Productos - Modo Fácil</title>
      </Helmet>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Productos</h1>
        {loading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : (
          <p className="text-muted-foreground">Total de productos: {products.length}</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
