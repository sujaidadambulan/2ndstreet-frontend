import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Admin.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('adminInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/admin/login');
            return;
        }
        fetchUsers();
    }, [navigate, userInfo]);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const res = await fetch('/api/users', config);
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const toggleBlockHandler = async (id) => {
        if (window.confirm('Are you sure you want to block/unblock this user?')) {
            try {
                const config = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const res = await fetch(`/api/users/${id}/block`, config);
                if (!res.ok) throw new Error('Failed to update user');
                fetchUsers(); // Refresh list
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/admin/dashboard')} className="action-btn">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="admin-title">Users Management</h1>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner"></div>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>BLOCKED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`status-badge ${user.isBlocked ? 'inactive' : 'active'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => toggleBlockHandler(user._id)}
                                        >
                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;
