import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { getOrders, updateOrderStatus } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED'];

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(statusFilter || undefined);
      setOrders(data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (order, newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    } catch {
      setError('Failed to update order status');
    }
  };

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'status', label: 'Status' },
    { key: 'total_amount', label: 'Total' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Orders</h1>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : (
          <Table
            columns={columns}
            data={orders}
            renderActions={(row) => (
              <select
                value={row.status}
                onChange={(e) => handleStatusChange(row, e.target.value)}
                className="input"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Orders;