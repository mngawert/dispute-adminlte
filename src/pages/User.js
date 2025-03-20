import React, { useState, useEffect } from 'react';
import api from '../api';
import ContentHeader from '../components/ContentHeader'; // Adjust the import path as necessary
import { exportAdjustmentRequestsToExcel } from '../utils/exportUtils'; // Import the new export function

const User = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        userStatus: 'Active',
        homeLocationCode: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);

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
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    const handleCreateUser = async () => {
        try {
            await api.post('/api/User/CreateUser', newUser);
            fetchUsers();
            setNewUser({
                username: '',
                password: '',
                userStatus: 'Active',
                homeLocationCode: ''
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleSelectUser = async (userId) => {
        try {
            const response = await api.get(`/api/User/GetUserByUserId/${userId}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            await api.put(`/api/User/UpdateUser/${selectedUser.userId}`, selectedUser);
            fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleSelectedUserChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({
            ...selectedUser,
            [name]: value
        });
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
                                        <button className="btn btn-default mr-2" onClick={handleCreateUser}>Create User</button>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={newUser.username}
                                            onChange={handleInputChange}
                                            className="form-control mb-2"
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={newUser.password}
                                            onChange={handleInputChange}
                                            className="form-control mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="homeLocationCode"
                                            placeholder="Home Location Code"
                                            value={newUser.homeLocationCode}
                                            onChange={handleInputChange}
                                            className="form-control mb-2"
                                        />
                                    </div>
                                    <div className="table-responsive" style={{ height: 300 }}>
                                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>Status</th>
                                                    <th>Home Location Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(user => (
                                                    <tr key={user.userId} onClick={() => handleSelectUser(user.userId)} className={user.userId === selectedUser?.userId ? 'selected' : ''}>
                                                        <td>{user.username}</td>
                                                        <td>{user.userStatus}</td>
                                                        <td>{user.homeLocationCode}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {selectedUser && (
                                        <div className="mt-3">
                                            <h2>Update User</h2>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    placeholder="Username"
                                                    value={selectedUser.username}
                                                    onChange={handleSelectedUserChange}
                                                    className="form-control mb-2"
                                                />
                                                <input
                                                    type="text"
                                                    name="userStatus"
                                                    placeholder="User Status"
                                                    value={selectedUser.userStatus}
                                                    onChange={handleSelectedUserChange}
                                                    className="form-control mb-2"
                                                />
                                                <input
                                                    type="text"
                                                    name="homeLocationCode"
                                                    placeholder="Home Location Code"
                                                    value={selectedUser.homeLocationCode}
                                                    onChange={handleSelectedUserChange}
                                                    className="form-control mb-2"
                                                />
                                                <button className="btn btn-default" onClick={handleUpdateUser}>Update User</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* END CONTENT */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;