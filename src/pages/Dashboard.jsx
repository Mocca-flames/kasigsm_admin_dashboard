import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/Card';
import { getStatsSummary, getOrders } from '../services/api';
import Icon from '../components/Icons';
import { RadialBarChart, RadialBar, Tooltip } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        period_days: 30,
        total_orders: 0,
        orders_by_status: {},
        total_revenue: '0',
        total_clients: 0,
        total_items: 0,
        low_stock_items: 0,
        fulfilled_orders: 0,
        pending_fulfillment: 0,
        refunded_orders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, ordersData] = await Promise.all([
                getStatsSummary(30),
                getOrders(),
            ]);

            setStats(statsData);
            setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const ordersByStatus = stats.orders_by_status || {};
    const statusEntries = Object.entries(ordersByStatus);

    const statusColors = {
        pending: '#ffc107',
        processing: '#17a2b8',
        completed: '#28a745',
        fulfilled: '#28a745',
        cancelled: '#dc3545',
        refunded: '#6c757d',
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>

            <div className="grid grid-4" style={{ marginTop: '32px', marginBottom: '24px' }}>
                <StatCard
                    icon={<Icon name="cart" size={18} />}
                    label="Total Orders"
                    value={stats.total_orders}
                    color="primary"
                />
                <StatCard
                    icon={<Icon name="dollar" size={18} />}
                    label="Revenue"
                    value={Number(stats.total_revenue)}
                    color="success"
                />
                <StatCard
                    icon={<Icon name="users" size={18} />}
                    label="Total Clients"
                    value={stats.total_clients}
                    color="alt"
                />
                <StatCard
                    icon={<Icon name="package" size={18} />}
                    label="Total Items"
                    value={stats.total_items}
                    color="warning"
                />
            </div>

            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
                <StatCard
                    icon={<Icon name="check" size={18} />}
                    label="Fulfilled Orders"
                    value={stats.fulfilled_orders}
                    color="success"
                    className="card-sm"
                />
                <StatCard
                    icon={<Icon name="clock" size={18} />}
                    label="Pending Fulfillment"
                    value={stats.pending_fulfillment}
                    color="warning"
                    className="card-sm"
                />
                <StatCard
                    icon={<Icon name="x" size={18} />}
                    label="Refunded Orders"
                    value={stats.refunded_orders}
                    color="danger"
                    className="card-sm"
                />
            </div>

            {stats.low_stock_items > 0 && (
                <div className="grid grid-1" style={{ marginBottom: '24px' }}>
                    <Card title="Inventory Alert" color="danger">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Icon name="alert" size={24} />
                            <div>
                                <strong>{stats.low_stock_items}</strong> item{stats.low_stock_items !== 1 ? 's' : ''} are currently low in stock and may need restocking.
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {statusEntries.length > 0 && (
                <div className="grid grid-1" style={{ marginBottom: '24px' }}>
                    <Card title={`Orders by Status (Last ${stats.period_days || 30} Days)`}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                            {statusEntries.map(([status, count]) => (
                                <div
                                    key={status}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: statusColors[status] || '#6c757d',
                                        }}
                                    />
                                    <span style={{ textTransform: 'capitalize', color: '#495057' }}>{status}</span>
                                    <span style={{ fontWeight: 600, color: '#212529' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {recentOrders.length > 0 && (
                <div className="grid grid-1" style={{ marginBottom: '24px' }}>
                    <Card title="Recent Orders">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontWeight: 500, color: '#495057' }}>Order #{order.id}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                                            {order.client_id || 'Guest'}
                                        </span>
                                        <span
                                            className={`status-badge ${order.status}`}
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                backgroundColor: statusColors[order.status] || '#6c757d',
                                                color: 'white',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-1" style={{ marginBottom: '24px' }}>
                <Card title="Inventory Status" className="animate-in">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="chart" style={{ maxWidth: '320px', margin: '0 auto' }}>
                            <RadialBarChart
                                width={320}
                                height={260}
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                data={[
                                    {
                                        name: 'In Stock',
                                        value: Math.max(0, stats.total_items - stats.low_stock_items),
                                        fill: 'var(--accent)',
                                    },
                                    {
                                        name: 'Low Stock',
                                        value: stats.low_stock_items || 0,
                                        fill: 'var(--color-warning)',
                                    },
                                    {
                                        name: 'Out of Stock',
                                        value: 0,
                                        fill: 'var(--color-danger)',
                                    },
                                ]}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                    background={{ fill: 'transparent' }}
                                    dataKey="value"
                                    cornerRadius={8}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-card)',
                                        border: `1px solid var(--border-subtle)`,
                                        color: 'var(--text-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 'var(--text-sm)',
                                        padding: '8px 12px',
                                    }}
                                    formatter={(value, name) => [`${value} items`, name]}
                                />
                            </RadialBarChart>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span className="badge badge-info">In Stock {Math.max(0, stats.total_items - stats.low_stock_items)}</span>
                            <span className="badge badge-warning">Low Stock {stats.low_stock_items || 0}</span>
                            <span className="badge badge-danger">Out of Stock 0</span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '24px' }}>
                <Card title="Order Fulfillment">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#6c757d', fontSize: '14px' }}>Fulfilled</span>
                            <span style={{ fontWeight: 600, color: '#28a745' }}>{stats.fulfilled_orders}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#6c757d', fontSize: '14px' }}>Pending</span>
                            <span style={{ fontWeight: 600, color: '#ffc107' }}>{stats.pending_fulfillment}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#6c757d', fontSize: '14px' }}>Refunded</span>
                            <span style={{ fontWeight: 600, color: '#6c757d' }}>{stats.refunded_orders}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                            Total: {stats.total_orders} orders
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
