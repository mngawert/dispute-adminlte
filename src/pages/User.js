import React, { useState, useEffect } from 'react';
import api from '../api';
import ContentHeader from '../components/ContentHeader';

const User = () => {
    const [users, setUsers] = useState([]);
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        userStatus: 'Active',
        homeLocationCode: '',
        creditLimit: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/User/GetAllUsers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm({
            ...userForm,
            [name]: name === 'creditLimit' ? parseFloat(value) || '' : value
        });
    };

    const handleCreateUser = async () => {
        try {
            await api.post('/api/User/CreateUser', userForm);
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleEditUser = async () => {
        try {
            await api.put(`/api/User/UpdateUser/${userForm.userId}`, userForm);
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const openCreateModal = () => {
        setUserForm({
            username: '',
            password: '',
            userStatus: 'Active',
            homeLocationCode: '',
            creditLimit: ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setUserForm(user);
        setIsEditMode(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="content-wrapper-x">
            {/* Content Header (Page header) */}
            <ContentHeader title="User Management" />
            {/* /.content-header */}
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {/* START CONTENT */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-end mb-3">
                                        <button className="btn btn-primary" onClick={openCreateModal}>Create User</button>
                                    </div>
                                    <div className="table-responsive" style={{ height: 500, overflowY: 'auto' }}>
                                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>Status</th>
                                                    <th>Home Location Code</th>
                                                    <th>Credit Limit</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(user => (
                                                    <tr key={user.userId}>
                                                        <td>{user.username}</td>
                                                        <td>{user.userStatus}</td>
                                                        <td>{user.homeLocationCode}</td>
                                                        <td>{user.creditLimit}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm mr-2"
                                                                onClick={() => openEditModal(user)}
                                                            >
                                                                <i className="fa fa-pencil-alt" aria-hidden="true"></i> Edit {/* Edit Icon */}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* END CONTENT */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Edit User' : 'Create User'}</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={userForm.username}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                {!isEditMode && (
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={userForm.password}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Status</label>
                                    <input
                                        type="text"
                                        name="userStatus"
                                        value={userForm.userStatus}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Home Location Code</label>
                                    <input
                                        type="text"
                                        name="homeLocationCode"
                                        value={userForm.homeLocationCode}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Credit Limit</label>
                                    <input
                                        type="number"
                                        name="creditLimit"
                                        value={userForm.creditLimit}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={isEditMode ? handleEditUser : handleCreateUser}
                                >
                                    {isEditMode ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;