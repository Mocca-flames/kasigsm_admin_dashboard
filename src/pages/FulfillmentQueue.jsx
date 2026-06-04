import React, { useState, useEffect, useCallback } from 'react';
import { Card, StatCard } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Icon from '../components/Icons';
import {
    getFulfillmentQueue,
    getOrderReadiness,
    fulfillOrder,
    rejectOrder,
} from '../services/api';
import './FulfillmentQueue.css';

const STATUS_BADGE = {
    PAID: 'badge-success',
    PENDING: 'badge-warning',
    FULFILLED: 'badge-info',
    CANCELLED: 'badge-danger',
    REFUNDED: 'badge-neutral',
};

const FulfillmentQueue = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [credentialNotes, setCredentialNotes] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);

    const fetchQueue = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getFulfillmentQueue();
            setQueue(data);
        } catch {
            setError('Failed to load fulfillment queue');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQueue();
    }, [fetchQueue]);

    const openDetail = async (order) => {
        setSelectedOrder(order);
        setDetailOpen(true);
        setDetailLoading(true);
        setCredentialNotes({});
        try {
            const readiness = await getOrderReadiness(order.id);
            setSelectedOrder((prev) => ({ ...prev, readiness }));
        } catch {
            setSelectedOrder((prev) => ({ ...prev, readiness: null }));
        } finally {
            setDetailLoading(false);
        }
    };

    const handleFulfill = async () => {
        if (!selectedOrder?.readiness?.items) return;
        const credentials = selectedOrder.readiness.items
            .filter((item) => credentialNotes[item.order_item_id])
            .map((item) => ({
                order_item_id: item.order_item_id,
                payload: credentialNotes[item.order_item_id],
            }));

        if (credentials.length === 0) {
            alert('Please fill in credentials for at least one item.');
            return;
        }

        try {
            setSubmitting(true);
            await fulfillOrder(selectedOrder.id, credentials);
            await fetchQueue();
            setDetailOpen(false);
        } catch {
            alert('Failed to fulfill order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        try {
            setSubmitting(true);
            await rejectOrder(rejectingId);
            await fetchQueue();
            setRejectModalOpen(false);
            setRejectingId(null);
        } catch {
            alert('Failed to reject order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'Order ID',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                    {row.id}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`badge ${STATUS_BADGE[row.status] || 'badge-neutral'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            key: 'total_amount',
            label: 'Total',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Number(row.total_amount).toFixed(2)}</span>
            ),
        },
        {
            key: 'currency',
            label: 'Currency',
            render: (row) => row.currency || 'ZAR',
        },
        {
            key: 'created_at',
            label: 'Created',
            render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : '-'),
        },
    ];

    const serviceItems = selectedOrder?.readiness?.items?.filter((item) => item.item_type === 'SERVICE') || [];
    const allServiceCredsFilled =
        serviceItems.length > 0 &&
        serviceItems.every((item) => credentialNotes[item.order_item_id]?.trim());

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Fulfillment Queue</h1>
                <p>PAID orders that require credential assignment or action.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="grid grid-4" style={{ marginBottom: '24px' }}>
                <StatCard icon="📦" label="Awaiting Fulfillment" value={queue.length} color="warning" />
            </div>

            <Card>
                {loading ? (
                    <div className="loading-state">Loading fulfillment queue...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={queue}
                        renderActions={(row) => (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => openDetail(row)}
                                    leftIcon={<Icon name="clipboard" size={16} />}
                                >
                                    Process
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => {
                                        setRejectingId(row.id);
                                        setRejectModalOpen(true);
                                    }}
                                >
                                    Reject
                                </Button>
                            </div>
                        )}
                    />
                )}
            </Card>

            {/* Detail / Fulfill Modal */}
            <Modal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                title={`Order ${selectedOrder?.id || ''}`}
                size="lg"
                actions={[
                    {
                        label: 'Cancel',
                        onClick: () => setDetailOpen(false),
                        variant: 'secondary',
                    },
                    {
                        label: submitting ? 'Submitting...' : 'Fulfill Order',
                        onClick: handleFulfill,
                        variant: 'success',
                        disabled: !allServiceCredsFilled || submitting || detailLoading,
                    },
                    {
                        label: 'Print Receipt',
                        onClick: () => window.print(),
                        variant: 'ghost',
                    },
                ]}
            >
                {detailLoading && (
                    <div className="loading-state">Loading order readiness...</div>
                )}
                {!detailLoading && selectedOrder?.readiness && (
                    <div className="fulfill-order-body">
                        <div className="fulfill-meta">
                            <div className="fulfill-meta-row">
                                <span className="label">Status</span>
                                <span className={`badge ${STATUS_BADGE[selectedOrder.status] || 'badge-neutral'}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div className="fulfill-meta-row">
                                <span className="label">Total</span>
                                <span style={{ fontFamily: 'var(--font-mono)' }}>
                                    {Number(selectedOrder.total_amount).toFixed(2)} {selectedOrder.currency || 'ZAR'}
                                </span>
                            </div>
                        </div>

                        <div className="divider" />

                        {selectedOrder.readiness.items && selectedOrder.readiness.items.length > 0 && (
                            <div className="fulfill-items">
                                <h4 className="section-title" style={{ marginBottom: '12px' }}>
                                    Items
                                </h4>
                                <div className="fulfill-items-grid">
                                    {selectedOrder.readiness.items.map((item) => (
                                        <div key={item.order_item_id} className="fulfill-item-card">
                                            <div className="fulfill-item-header">
                                                <span className="label">Item</span>
                                                <span className="badge badge-accent">{item.item_type}</span>
                                            </div>
                                            <div className="fulfill-item-title">{item.title}</div>
                                            <div className="fulfill-item-meta">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="mono">Unit Price: {Number(item.unit_price).toFixed(2)}</span>
                                            </div>

                                            {item.item_type === 'SERVICE' && (
                                                <div className="fulfill-credential-field" style={{ marginTop: '12px' }}>
                                                    <Input
                                                        label="Credential / Access Info"
                                                        placeholder="Enter credential or access payload"
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
                        label: submitting ? 'Rejecting...' : 'Confirm Reject',
                        onClick: handleReject,
                        variant: 'danger',
                        disabled: submitting,
                    },
                ]}
            >
                <p>Are you sure you want to reject this order? This will cancel the order and refund the full amount to the client if a wallet exists.</p>
            </Modal>
        </div>
    );
};

export default FulfillmentQueue;
