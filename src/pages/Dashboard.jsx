import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/Card';
import Table from '../components/Table';
import Chart from '../components/Chart';
import Button from '../components/Button';
import { getStatsSummary, getAllOrders, getAllClients } from '../services/api';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
    }).format(amount);
};

const getCustomerName = (clientId, customers) => {
    const customer = customers.find(c => c.id === clientId);
    return customer ? customer.full_name : clientId;
};

const REPAIR_STATUSES = [
    'pending',
    'accepted',
    'in_progress',
    'completed',
    'cancelled'
];

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        averagePrice: 0,
        periodStart: '',
        periodEnd: '',
        topCustomers: []
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, ordersData, customersData] = await Promise.all([
                getStatsSummary(30),
                getAllOrders(),
                getAllClients()
            ]);

            setStats({
                totalOrders: statsData.orders?.total || 0,
                totalRevenue: statsData.revenue?.gross_revenue || 0,
                averagePrice: statsData.revenue?.gross_revenue / statsData.orders?.total || 0,
                periodStart: statsData.period_start,
                periodEnd: statsData.period_end,
                topCustomers: statsData.top_clients || []
            });

            setRecentOrders(ordersData.slice(0, 5));
            setCustomers(customersData);

            if (statsData.orders_by_status) {
                setChartData({
                    labels: Object.keys(statsData.orders_by_status),
                    datasets: [{
                        label: 'Repair Orders by Status',
                        data: Object.values(statsData.orders_by_status),
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']
                    }]
                });
            } else {
                setChartData({
                    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
                    datasets: [{
                        label: 'Repair Orders by Status',
                        data: [
                            statsData.orders?.total - statsData.orders?.completed || 0,
                            statsData.orders?.in_progress || 0,
                            statsData.orders?.completed || 0,
                            0,
                        ],
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444']
                    }]
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const tableColumns = [
        { key: 'id', label: 'Order ID' },
        { key: 'pickup_address', label: 'Device / Location' },
        { key: 'dropoff_address', label: 'Issue / Notes' },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`status-badge ${row.status}`}>
                    {row.status}
                </span>
            )
        },
        { key: 'price', label: 'Repair Cost' }
    ];

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>

            <div className="grid grid-4" style={{ marginTop: '32px', marginBottom: '32px' }}>
                <StatCard
                    icon="🔧"
                    label="Total Repair Orders"
                    value={stats.totalOrders}
                    color="primary"
                />
                <StatCard
                    icon="💰"
                    label="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    color="success"
                />
                <StatCard
                    icon="📊"
                    label="Avg Repair Cost"
                    value={formatCurrency(stats.averagePrice)}
                    color="info"
                />
            </div>

            <div className="grid grid-2" style={{ marginBottom: '32px' }}>
                <Card title="Repair Orders by Status">
                    {chartData ? (
                        <Chart
                            type="bar"
                            data={chartData}
                            height={300}
                        />
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>Loading chart...</div>
                    )}
                </Card>
                <Card title="Quick Actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button variant="primary" fullWidth>
                            Create Repair Ticket
                        </Button>
                        <Button variant="secondary" fullWidth>
                            All Repair Orders
                        </Button>

                    </div>
                </Card>
            </div>

            <div className="grid grid-1" style={{ marginBottom: '32px' }}>
                <Card title="Top Customers">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Array.isArray(stats.topCustomers) && stats.topCustomers.length > 0 ? (
                            stats.topCustomers.map((client, index) => (
                                <div
                                    key={client.client_id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}
                                >
                                    <div>
                                        <span style={{ fontWeight: '500', color: '#495057' }}>
                                            {getCustomerName(client.client_id, customers)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                                            {client.orders} order{client.orders !== 1 ? 's' : ''}
                                        </span>
                                        <span style={{
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#6c757d', margin: '20px 0' }}>
                                No customer data available
                            </p>
                        )}
                    </div>
                </Card>
            </div>

            <Card title="Recent Repair Orders" style={{ marginTop: '32px' }}>
                <Table
                    columns={tableColumns}
                    data={recentOrders}
                    onEdit={(row) => console.log('Edit order:', row)}
                    onDelete={(row) => console.log('Delete order:', row)}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
