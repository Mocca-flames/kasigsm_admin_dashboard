import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import * as api from '../services/api';

/**
 * REPAIR ORDERS PAGE
 * Manage all phone repair tickets
 *
 * Repair status flow:
 *   pending → accepted → in_progress → repaired → ready_for_pickup → completed
 *   (cancelled at any stage)
 */
const REPAIR_ORDER_STATUSES = [
    'pending',
    'accepted',
    'in_progress',
    'repaired',
    'ready_for_pickup',
    'completed',
    'cancelled'
];

const RepairOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await api.getAllOrders();
            setOrders(ordersData);
            setLoading(false);
        } catch {
            console.error('Error fetching repair orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDeleteClick = (row) => {
        setOrderToDelete(row);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        try {
            await api.deleteOrder(orderToDelete.id);
            setDeleteStatus('success');
            await fetchOrders();
        } catch {
            setDeleteStatus('error');
        } finally {
            setTimeout(() => {
                setShowDeleteModal(false);
                setOrderToDelete(null);
                setDeleteStatus(null);
            }, 1500);
        }
    };

    const handleStatusUpdateClick = (row) => {
        setOrderToUpdate(row);
        setNewStatus(row.status);
        setShowStatusModal(true);
    };

    const confirmStatusUpdate = async () => {
        if (!orderToUpdate || !newStatus) return;
        try {
            await api.updateOrderStatus(orderToUpdate.id, newStatus);
            setUpdateStatus('success');
            await fetchOrders();
        } catch {
            setUpdateStatus('error');
        } finally {
            setTimeout(() => {
                setShowStatusModal(false);
                setOrderToUpdate(null);
                setNewStatus('');
                setUpdateStatus(null);
            }, 1500);
        }
    };

    const tableColumns = [
        {
            key: 'id',
            label: 'Ticket #',
            render: (row) => <strong>#{row.id}</strong>
        },
        {
            key: 'pickup_address',
            label: 'Device',
            render: (row) => (
                <span>
                    {row.device_brand || row.pickup_address || '—'}
                    {row.device_model ? ` ${row.device_model}` : ''}
                </span>
            )
        },
        {
            key: 'device_info',
            label: 'Issue & Notes',
            render: (row) => (
                <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                        {row.dropoff_address || row.issue_type || '—'}
                    </span>
                    {row.warranty_status && (
                        <span style={{
                            fontSize: '0.75em', padding: '2px 6px',
                            borderRadius: '4px',
                            background: row.warranty_status === 'under_warranty' ? 'var(--success-light)' : 'var(--bg-tertiary)',
                            color: row.warranty_status === 'under_warranty' ? 'var(--success)' : 'var(--text-muted)',
                            marginRight: '4px'
                        }}>
                            {row.warranty_status === 'under_warranty' ? 'Warranty' : 'No Warranty'}
                        </span>
                    )}
                    {row.notes && <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>Has notes</span>}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <div onClick={() => handleStatusUpdateClick(row)} style={{ cursor: 'pointer' }} title="Click to update status">
                    <span className={`status-badge ${row.status}`}>{row.status}</span>
                </div>
            )
        },
        {
            key: 'price',
            label: 'Cost',
            render: (row) => row.price
                ? <strong>{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(row.price)}</strong>
                : '—'
        },
    ];

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading repair orders...</div>;
    }

    return (
        <div>
            <h1>Repair Orders</h1>
            <p>Manage all phone repair tickets in the system.</p>

            <div className="grid grid-4" style={{ marginTop: '32px', marginBottom: '32px' }}>
                <Card title="Total Tickets">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orders.length}</div>
                </Card>
                <Card title="Pending">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                        {orders.filter(o => o.status === 'pending').length}
                    </div>
                </Card>
                <Card title="In Repair">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                        {orders.filter(o => o.status === 'in_progress').length}
                    </div>
                </Card>
                <Card title="Completed">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                        {orders.filter(o => o.status === 'completed' || o.status === 'ready_for_pickup').length}
                    </div>
                </Card>
            </div>

            <Card title="All Repair Orders">
                <Table columns={tableColumns} data={orders} onEdit={(r) => console.log('Edit:', r)} onDelete={handleDeleteClick} />
            </Card>

            <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setOrderToDelete(null); setDeleteStatus(null); }} title="Confirm Delete" actions={[
                { label: 'Cancel', onClick: () => { setShowDeleteModal(false); setOrderToDelete(null); setDeleteStatus(null); }, variant: 'secondary' },
                { label: 'Delete', onClick: confirmDelete, variant: 'danger' }
            ]}>
                <p>Are you sure you want to delete repair ticket #{orderToDelete?.id}?</p>
                <p>This action cannot be undone.</p>
                {deleteStatus === 'success' && <div style={{ color: 'green', marginTop: '10px' }}>Repair order deleted successfully!</div>}
                {deleteStatus === 'error' && <div style={{ color: 'red', marginTop: '10px' }}>Failed. Please try again.</div>}
            </Modal>

            <Modal isOpen={showStatusModal} onClose={() => { setShowStatusModal(false); setOrderToUpdate(null); setNewStatus(''); setUpdateStatus(null); }} title={`Update Status — Ticket #${orderToUpdate?.id}`} actions={[
                { label: 'Cancel', onClick: () => { setShowStatusModal(false); setOrderToUpdate(null); setNewStatus(''); setUpdateStatus(null); }, variant: 'secondary' },
                { label: 'Update Status', onClick: confirmStatusUpdate, variant: 'primary', disabled: !newStatus || newStatus === orderToUpdate?.status || updateStatus !== null }
            ]}>
                {orderToUpdate && (
                    <>
                        <p>Device: <strong>{orderToUpdate.device_brand || '—'}{orderToUpdate.device_model ? ` ${orderToUpdate.device_model}` : ''}</strong></p>
                        <p>Current Status: <span className={`status-badge ${orderToUpdate.status}`}>{orderToUpdate.status}</span></p>
                        <div style={{ marginTop: '15px' }}>
                            <label htmlFor="new-status-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select New Status:</label>
                            <select id="new-status-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
                                {REPAIR_ORDER_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'ready_for_pickup' ? 'Ready for Pickup' :
                                         status === 'in_progress' ? 'In Repair' :
                                         status === 'repaired' ? 'Repaired' :
                                         status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {updateStatus === 'success' && <div style={{ color: 'green', marginTop: '10px' }}>Status updated!</div>}
                        {updateStatus === 'error' && <div style={{ color: 'red', marginTop: '10px' }}>Failed. Try again.</div>}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default RepairOrders;
