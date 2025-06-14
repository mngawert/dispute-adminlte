import React, { useState, useEffect } from 'react';
import api from '../api';
import ContentHeader from '../components/ContentHeader';

const User = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        userStatus: 'Active',
        homeLocationCode: '',
        creditLimit: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [availableGroupFilter, setAvailableGroupFilter] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchAllGroups();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/User/GetAllUsers');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchAllGroups = async () => {
        try {
            const response = await api.get('/api/Group/GetAllGroups'); // Assuming this endpoint exists
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const fetchUserGroups = async (userId) => {
        try {
            const response = await api.get(`/api/User/GetUserGroups/${userId}`);
            setUserGroups(response.data);
        } catch (error) {
            console.error('Error fetching user groups:', error);
        }
    };

    const handleAddGroupToUser = async (groupId) => {
        try {
            await api.post('/api/User/AddUserToGroup', { userId: selectedUserId, groupId });
            fetchUserGroups(selectedUserId);
        } catch (error) {
            console.error('Error adding group to user:', error);
        }
    };

    const handleRemoveGroupFromUser = async (groupId) => {
        try {
            await api.delete(`/api/User/RemoveUserFromGroup/${selectedUserId}/${groupId}`);
            fetchUserGroups(selectedUserId);
        } catch (error) {
            console.error('Error removing group from user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm({
            ...userForm,
            [name]: name === 'creditLimit' ? parseFloat(value) || '' : value
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        const filtered = users.filter(user =>
            (user.username || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.userStatus || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.homeLocationCode || '').toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleCreateUser = async () => {
        try {
            await api.post('/api/User/CreateUser', userForm);
            alert('User created successfully.');
            fetchUsers(); // Refresh the user list
            closeModal(); // Close the modal
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
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

    const handleResetPassword = async () => {
        try {
            await api.put(`/api/User/ResetPassword/${userForm.userId}`);
            alert('Password has been reset successfully.');
            closeModal();
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.');
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

    const openGroupModal = (userId) => {
        setSelectedUserId(userId);
        fetchUserGroups(userId);
        setShowGroupModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const closeGroupModal = () => {
        setShowGroupModal(false);
        setUserGroups([]);
        setSelectedUserId(null);
    };

    return (
        <div className="content-wrapper-x">
            <ContentHeader title="User Management" />
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-3">
                                        <input
                                            type="text"
                                            className="form-control w-50"
                                            placeholder="Search by username, status, or location"
                                            value={searchText}
                                            onChange={handleSearchChange}
                                        />
                                        <button className="btn btn-primary" onClick={openCreateModal}>
                                            Create User
                                        </button>
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
                                                {filteredUsers.map(user => (
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
                                                                <i className="fa fa-pencil-alt" aria-hidden="true"></i> Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info"
                                                                onClick={() => openGroupModal(user.userId)}
                                                            >
                                                                <i className="fa fa-users" aria-hidden="true"></i> Manage Groups
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
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
                                        disabled={isEditMode} // Disable username field in edit mode
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
                                    <select
                                        name="userStatus"
                                        value={userForm.userStatus}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
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
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={isEditMode ? handleEditUser : handleCreateUser}
                                >
                                    {isEditMode ? 'Update User' : 'Create User'}
                                </button>

                                {isEditMode && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleResetPassword}
                                    >
                                        Reset Password
                                    </button>
                                )}

                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Group Management Modal */}
            {showGroupModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Manage Groups for User: <strong>{users.find(user => user.userId === selectedUserId)?.username}</strong>
                                </h5>
                                <button type="button" className="close" onClick={closeGroupModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6>Assigned Groups</h6>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {userGroups.map(group => (
                                            <li key={group.groupId} className="list-group-item d-flex align-items-center justify-content-between">
                                                <span>{group.groupName}</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveGroupFromUser(group.groupId)}
                                                    title="Remove Group"
                                                >
                                                    <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <h6 className="mt-3">Available Groups</h6>
                                {/* Filter Input for Available Groups */}
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Filter available groups"
                                    value={availableGroupFilter}
                                    onChange={(e) => setAvailableGroupFilter(e.target.value)}
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {groups
                                            .filter(group =>
                                                group.groupName.toLowerCase().includes(availableGroupFilter.toLowerCase()) &&
                                                !userGroups.some(ug => ug.groupId === group.groupId)
                                            )
                                            .map(group => (
                                                <li key={group.groupId} className="list-group-item d-flex align-items-center justify-content-between">
                                                    <span>{group.groupName}</span>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleAddGroupToUser(group.groupId)}
                                                        title="Add Group"
                                                    >
                                                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeGroupModal}>
                                    Close
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