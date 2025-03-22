import React, { useState } from 'react';
import api from '../api';
import ContentHeader from '../components/ContentHeader'; // Adjust the import path as necessary

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('New password and confirm password do not match.');
            return;
        }

        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const response = await api.put(`/api/User/ChangePassword/${userLogin.userId}`, {
                currentPassword,
                newPassword
            });

            if (response.status === 200) {
                setSuccessMessage('Password changed successfully.');
                setErrorMessage('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="content-wrapper-x">
            {/* Content Header (Page header) */}
            <ContentHeader title="Change Password" />
            {/* /.content-header */}
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {/* START CONTENT */}
                            <div className="card">
                                <div className="card-body">
                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                    <div className="form-group col-md-6 mx-auto">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="form-group col-md-6 mx-auto">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="form-group col-md-6 mx-auto">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <div className="form-group col-md-6 mx-auto">
                                        <button className="btn btn-primary w-50" onClick={handleChangePassword}>
                                            Change Password
                                        </button>
                                    </div>
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

export default ChangePassword;