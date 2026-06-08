import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';

const TopUps = () => {
  const [topUps, setTopUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, topUp: null });
  const [reviewNote, setReviewNote] = useState('');
  const [reviewApproved, setReviewApproved] = useState(true);

  const fetchTopUps = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('admin_token');
      const baseURL = "https://api.kasigsm.co.za";
      const url = status
        ? `${baseURL}/wallet/top-ups?status=${status}`
        : `${baseURL}/wallet/top-ups`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load top-ups');
      }
      const data = await response.json();
      setTopUps(data);
    } catch {
      setError('Failed to load top-ups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopUps(statusFilter || undefined);
  }, [statusFilter]);

  const openReview = (topUp) => {
    setReviewModal({ open: true, topUp });
    setReviewNote('');
    setReviewApproved(true);
  };

  const submitReview = async () => {
    const { topUp } = reviewModal;
    if (!topUp) return;
    try {
      setSubmitting((prev) => ({ ...prev, [topUp.id]: true }));
      const token = localStorage.getItem('admin_token');
      const baseURL = "https://api.kasigsm.co.za";
      const response = await fetch(`${baseURL}/wallet/top-ups/${topUp.id}/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved: reviewApproved,
          note: reviewNote,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to submit review');
      }
      setReviewModal({ open: false, topUp: null });
      await fetchTopUps(statusFilter || undefined);
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting((prev) => ({ ...prev, [reviewModal.topUp?.id]: false }));
    }
  };

  const statusOptions = ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'];

  const columns = [
    { key: 'wallet_id', label: 'Wallet ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'reference', label: 'Reference' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created' },
    { key: 'reviewed_at', label: 'Reviewed' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Top-Ups</h1>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading top-ups...</div>
        ) : (
          <Table
            columns={columns}
            data={topUps}
            renderActions={(row) => (
              <Button
                size="sm"
                variant="primary"
                onClick={() => openReview(row)}
                disabled={row.status !== 'PENDING'}
              >
                Review
              </Button>
            )}
          />
        )}
      </Card>

      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, topUp: null })}
        title="Review Top-Up"
      >
        {reviewModal.topUp && (
          <div>
            <p>Amount: {reviewModal.topUp.amount}</p>
            <p>Reference: {reviewModal.topUp.reference}</p>
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Decision
              </label>
              <select
                value={reviewApproved ? 'approve' : 'reject'}
                onChange={(e) => setReviewApproved(e.target.value === 'approve')}
                className="input"
              >
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Note (optional)
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="input"
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => setReviewModal({ open: false, topUp: null })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={!!submitting[reviewModal.topUp.id]}
                onClick={submitReview}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TopUps;
