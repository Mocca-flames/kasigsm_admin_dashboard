import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import { getAllClients } from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const customersData = await getAllClients();
            setCustomers(customersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setLoading(false);
        }
    };

    const tableColumns = [
        { key: 'id', label: 'Customer ID' },
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone_number', label: 'Phone Number' },
        { key: 'created_at', label: 'Joined' }
    ];

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading customers...</div>;
    }

    return (
        <div>
            <h1>Customers</h1>
            <p>Manage all customers and their device repair history.</p>

            <div className="grid grid-4" style={{ marginTop: '32px', marginBottom: '32px' }}>
                <Card title="Total Customers">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{customers.length}</div>
                </Card>
            </div>

            <Card title="All Customers">
                <Table
                    columns={tableColumns}
                    data={customers}
                    onEdit={(row) => console.log('Edit customer:', row)}
                    onDelete={(row) => console.log('Delete customer:', row)}
                    itemsPerPage={15}
                />
            </Card>
        </div>
    );
};

export default Customers;
