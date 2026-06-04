import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Icon from '../components/Icons';
import { getOrders, updateOrderStatus, getOrderReadiness, fulfillOrder, rejectOrder } from '../services/api';
import './OrderDetail.css';

const STATUS_BADGE = {
    PENDING: 'badge-warning',
    PAID: 'badge-success',
    FULFILLED: 'badge-info',
    CANCELLED: 'badge-danger',
    REFUNDED: 'badge-neutral',
};

const ORDER_STATUSES = ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED'];

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [readiness, setReadiness] = useState(null);
    const [credentialNotes, setCredentialNotes] = useState({});
    const [submittingDetail, setSubmittingDetail] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            const found = data.find((o) => o.id === orderId);
            setOrder(found || null);
            if (!found) {
                setError('Order not found');
                setReadiness(null);
            } else {
                try {
                    const readinessData = await getOrderReadiness(orderId);
                    setReadiness(readinessData);
                } catch {
                    setReadiness(null);
                }
            }
        } catch {
            setError('Failed to load orders');
            setOrder(null);
            setReadiness(null);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (orderId) fetchOrders();
    }, [orderId, fetchOrders]);

    const handleStatusUpdate = async () => {
        if (!order || !newStatus) return;
        try {
            setUpdating(true);
            await updateOrderStatus(order.id, newStatus);
            setOrder((prev) => ({ ...prev, status: newStatus }));
            setStatusModalOpen(false);
            await fetchOrders();
        } catch {
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const openDetail = async () => {
        if (!order) return;
        setDetailModalOpen(true);
        setReadiness(null);
        setCredentialNotes({});
        try {
            const data = await getOrderReadiness(order.id);
            setReadiness(data);
        } catch {
            setReadiness(null);
        }
    };

    const handleReject = async () => {
        try {
            setRejecting(true);
            await rejectOrder(order.id);
            setRejectModalOpen(false);
            await fetchOrders();
        } catch {
            alert('Failed to reject order');
        } finally {
            setRejecting(false);
        }
    };

    const handleFulfill = async () => {
        if (!readiness?.items) return;
        const creds = readiness.items
            .filter((item) => credentialNotes[item.order_item_id])
            .map((item) => ({
                order_item_id: item.order_item_id,
                payload: credentialNotes[item.order_item_id],
            }));
        if (creds.length === 0) {
            alert('Enter at least one credential payload.');
            return;
        }
        try {
            setSubmittingDetail(true);
            await fulfillOrder(order.id, creds);
            setDetailModalOpen(false);
            await fetchOrders();
        } catch {
            alert('Failed to fulfill order');
        } finally {
            setSubmittingDetail(false);
        }
    };

    if (loading) return <div className="loading-state">Loading order details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!order) return <div className="error-message">Order not found</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Order Detail</h1>
                <Button variant="secondary" onClick={() => navigate('/orders')}>
                    Back to Orders
                </Button>
            </div>

            <div className="grid grid-4" style={{ marginBottom: '24px' }}>
                <Card title="Order ID">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{order.id}</div>
                </Card>
                <Card title="Status">
                    <span className={`badge ${STATUS_BADGE[order.status] || 'badge-neutral'}`}>
                        {order.status}
                    </span>
                </Card>
                <Card title="Total Amount">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)' }}>
                        {Number(order.total_amount).toFixed(2)}
                    </div>
                </Card>
                <Card title="Currency">{order.currency || 'ZAR'}</Card>
            </div>

            <Card title="Actions">
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setNewStatus(order.status);
                            setStatusModalOpen(true);
                        }}
                    >
                        Update Status
                    </Button>
                    <Button variant="primary" onClick={openDetail}>
                        Process Fulfillment
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setRejectModalOpen(true)}
                        disabled={order.status !== 'PAID'}
                    >
                        Reject Order
                    </Button>
                    <Button variant="ghost" onClick={() => window.print()} className="no-print">
                        Print Receipt
                    </Button>
                </div>
            </Card>

            {/* Status Update Modal */}
            <Modal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                title="Update Order Status"
                size="sm"
                actions={[
                    { label: 'Cancel', onClick: () => setStatusModalOpen(false), variant: 'secondary' },
                    {
                        label: updating ? 'Saving...' : 'Save',
                        onClick: handleStatusUpdate,
                        variant: 'primary',
                        disabled: !newStatus || newStatus === order.status || updating,
                    },
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label className="label" htmlFor="status-select">New Status</label>
                    <select
                        id="status-select"
                        className="input"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="">Select status</option>
                        {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </Modal>

            {/* Process / Fulfill Modal */}
            <Modal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title="Fulfill Order"
                size="lg"
                actions={[
                    { label: 'Close', onClick: () => setDetailModalOpen(false), variant: 'secondary' },
                    {
                        label: submittingDetail ? 'Submitting...' : 'Fulfill Order',
                        onClick: handleFulfill,
                        variant: 'success',
                        disabled: submittingDetail,
                    },
                ]}
            >
                {readiness ? (
                    <div className="fulfill-order-body">
                        <div className="fulfill-meta">
                            <div className="fulfill-meta-row">
                                <span className="label">Status</span>
                                <span className={`badge ${STATUS_BADGE[order.status] || 'badge-neutral'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="fulfill-meta-row">
                                <span className="label">Total</span>
                                <span style={{ fontFamily: 'var(--font-mono)' }}>
                                    {Number(order.total_amount).toFixed(2)} {order.currency || 'ZAR'}
                                </span>
                            </div>
                        </div>

                        <div className="divider" />

                        {readiness.items && readiness.items.length > 0 && (
                            <div className="fulfill-items">
                                <h4 className="section-title" style={{ marginBottom: '12px' }}>Order Items</h4>
                                <div className="fulfill-items-grid">
                                    {readiness.items.map((item) => (
                                        <div key={item.order_item_id} className="fulfill-item-card">
                                            <div className="fulfill-item-header">
                                                <span className="label">Item</span>
                                                <span className="badge badge-accent">{item.item_type}</span>
                                            </div>
                                            <div className="fulfill-item-title">{item.title}</div>
                                            <div className="fulfill-item-meta">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="mono">
                                                    Unit Price: {Number(item.unit_price).toFixed(2)}
                                                </span>
                                            </div>
                                            {item.item_type === 'SERVICE' && (
                                                <div className="fulfill-credential-field" style={{ marginTop: '12px' }}>
                                                    <input
                                                        className="input"
                                                        placeholder="Credential / access payload"
                                                        value={credentialNotes[item.order_item_id] || ''}
                                                        onChange={(e) =>
                                                            setCredentialNotes((prev) => ({
                                                                ...prev,
                                                                [item.order_item_id]: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="loading-state">Loading readiness...</div>
                )}
            </Modal>

            {/* Reject Confirm Modal */}
            <Modal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Order"
                size="sm"
                actions={[
                    { label: 'Cancel', onClick: () => setRejectModalOpen(false), variant: 'secondary' },
                    {
                        label: rejecting ? 'Rejecting...' : 'Confirm Reject',
                        onClick: handleReject,
                        variant: 'danger',
                        disabled: rejecting,
                    },
                ]}
            >
                <p>
                    Are you sure you want to reject this order? This will cancel it and refund the full
                    amount to the client’s wallet if a wallet exists.
                </p>
            </Modal>

            {/* Printable receipt (hidden by default, shown when printing) */}
            <div className="receipt print-only">
                <div className="receipt-header">
                    <h2>Order Confirmation</h2>
                    <div className="receipt-meta">
                        <span>Order ID: <strong>{order.id}</strong></span>
                        <span>Date: {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</span>
                        <span>Status: {order.status}</span>
                    </div>
                </div>
                <div className="receipt-section">
                    <h3>Summary</h3>
                    <div className="receipt-row">
                        <span>Total Amount</span>
                        <span>{Number(order.total_amount).toFixed(2)} {order.currency || 'ZAR'}</span>
                    </div>
                </div>
                {readiness?.items?.length > 0 && (
                    <div className="receipt-section">
                        <h3>Items</h3>
                        <table className="receipt-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    {readiness.items.some(i => i.item_type === 'SERVICE') && <th>Credential</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {readiness.items.map((item) => (
                                    <tr key={item.order_item_id}>
                                        <td>{item.title}</td>
                                        <td>{item.item_type}</td>
                                        <td>{item.quantity}</td>
                                        <td>{Number(item.unit_price).toFixed(2)}</td>
                                        {readiness.items.some(i => i.item_type === 'SERVICE') && (
                                            <td>{credentialNotes[item.order_item_id] || '(after fulfillment)'}</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="receipt-footer">
                    <span>Reference: {order.id}</span>
                    <span>Generated: {new Date().toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
