import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useOrders } from '@/hooks/useOrders.js';

const OrdersPage = () => {
  const { orders, loading } = useOrders();

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - Pedidos - Modo Fácil</title>
      </Helmet>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Pedidos</h1>
        {loading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : (
          <p className="text-muted-foreground">Total de pedidos: {orders.length}</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
