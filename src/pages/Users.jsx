import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import { getUsers, updateUserStatus } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      await updateUserStatus(user.id, !user.is_active);
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch {
      setError('Failed to update user status');
    }
  };

  const columns = [
    { key: 'id', label: 'User ID' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Users</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : (
          <Table
            columns={columns}
            data={users}
            renderActions={(row) => (
              <button
                className={`action-btn ${row.is_active ? 'active' : 'inactive'}`}
                onClick={() => handleStatusToggle(row)}
                title={row.is_active ? 'Deactivate' : 'Activate'}
              >
                {row.is_active ? 'Active' : 'Inactive'}
              </button>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Users;