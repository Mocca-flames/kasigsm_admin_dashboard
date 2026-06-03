import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { getTechnicianRequests, reviewTechnicianRequest, getAllTechnicians } from '../services/api';

const Technicians = () => {
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const [tab, setTab] = useState('pending');

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTechnicianRequests();
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load technician requests');
    } finally {
      setLoading(false);
    }
  };

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTechnicians();
      setTechnicians(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'pending') {
      loadRequests();
    } else {
      loadTechnicians();
    }
  }, [tab]);

  const handleReview = async (id, action) => {
    try {
      setSubmitting((prev) => ({ ...prev, [id]: action }));
      await reviewTechnicianRequest(id, action);
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${action} technician request`);
    } finally {
      setSubmitting((prev) => ({ ...prev, [id]: null }));
    }
  };

  const pendingColumns = [
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span style={{
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          background: row.status === 'PENDING' ? '#fef3c7' : row.status === 'APPROVED' ? '#d1fae5' : '#fee2e2',
          color: row.status === 'PENDING' ? '#92400e' : row.status === 'APPROVED' ? '#065f46' : '#991b1b',
        }}>
          {row.status}
        </span>
      ),
    },
    { key: 'specialization', label: 'Specialization' },
    {
      key: 'created_at',
      label: 'Submitted',
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  const techniciansColumns = [
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span style={{
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          background: row.status === 'PENDING' ? '#fef3c7' : row.status === 'APPROVED' ? '#d1fae5' : '#fee2e2',
          color: row.status === 'PENDING' ? '#92400e' : row.status === 'APPROVED' ? '#065f46' : '#991b1b',
        }}>
          {row.status}
        </span>
      ),
    },
    { key: 'specialization', label: 'Specialization' },
    {
      key: 'created_at',
      label: 'Submitted',
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Technician Requests</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review and manage technician requests.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          className={`btn ${tab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('pending')}
          style={{ padding: '10px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
        >
          Pending Requests
        </button>
        <button
          className={`btn ${tab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('all')}
          style={{ padding: '10px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
        >
          All Technicians
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : tab === 'pending' ? (
          <Table
            columns={pendingColumns}
            data={requests}
            renderActions={(row) => (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="success"
                  size="sm"
                  loading={submitting[row.id] === 'approve'}
                  onClick={() => handleReview(row.id, 'approve')}
                  disabled={row.status !== 'PENDING'}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={submitting[row.id] === 'reject'}
                  onClick={() => handleReview(row.id, 'reject')}
                  disabled={row.status !== 'PENDING'}
                >
                  Reject
                </Button>
              </div>
            )}
          />
        ) : (
          <Table columns={techniciansColumns} data={technicians} />
        )}
      </Card>
    </div>
  );
};

export default Technicians;
