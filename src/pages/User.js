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
        creditLimit: '',
        startDate: '', // Add startDate field
        endDate: ''    // Add endDate field
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [availableGroupFilter, setAvailableGroupFilter] = useState('');
    const [staffInfo, setStaffInfo] = useState(null);
    const [staffLoading, setStaffLoading] = useState(false);
    const [staffError, setStaffError] = useState('');
    const [homeLocationCodes, setHomeLocationCodes] = useState([]); // New state for home location codes

    useEffect(() => {
        fetchUsers();
        fetchAllGroups();
        fetchHomeLocationCodes(); // Fetch home location codes on component mount
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

    const fetchHomeLocationCodes = async () => {
        try {
            const response = await api.get('/api/Group/GetHomeLocationCodes');
            setHomeLocationCodes(response.data);
        } catch (error) {
            console.error('Error fetching home location codes:', error);
        }
    };

    const handleAddGroupToUser = async (groupId) => {
        try {
            await api.post('/api/User/AddUserToGroup', { userId: selectedUserId, groupId });
            fetchUserGroups(selectedUserId);
        } catch (error) {
            console.error('Error adding group to user:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add group to user. Please try again.';
            alert(errorMessage);
        }
    };

    const handleRemoveGroupFromUser = async (groupId) => {
        try {
            await api.delete(`/api/User/RemoveUserFromGroup/${selectedUserId}/${groupId}`);
            fetchUserGroups(selectedUserId);
        } catch (error) {
            console.error('Error removing group from user:', error);
            const errorMessage = error.response?.data?.message || 'Failed to remove group from user. Please try again.';
            alert(errorMessage);
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
            (user.empCode || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.firstNameTh || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.lastNameTh || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.userStatus || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.homeLocationCode || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.locationName || '').toLowerCase().includes(value.toLowerCase()) ||
            (user.sector || '').toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    // Update the prepareUserPayload function to include cctr
    const prepareUserPayload = () => {
        return {
            ...userForm,
            // Convert empty date strings to null
            startDate: userForm.startDate || null,
            endDate: userForm.endDate || null,
            empCode: staffInfo?.empCode || userForm.empCode || '',
            titleTh: staffInfo?.titleTh || userForm.titleTh || '',
            firstNameTh: staffInfo?.firstNameTh || userForm.firstNameTh || '',
            lastNameTh: staffInfo?.lastNameTh || userForm.lastNameTh || '',
            currDepFull: staffInfo?.currDepFull || userForm.currDepFull || '',
            posAbbr: staffInfo?.posAbbr || userForm.posAbbr || '',
            email: staffInfo?.email || userForm.email || '',
            tel: staffInfo?.tel || userForm.tel || '',
            cctr: staffInfo?.cctr || userForm.cctr || ''
        };
    };

    const handleCreateUser = async () => {
        // Validate credit limit is provided
        if (!userForm.creditLimit && userForm.creditLimit !== 0) {
            alert('Credit Limit is required.');
            return;
        }

        try {
            const payload = prepareUserPayload();
            await api.post('/api/User/CreateUser', payload);
            alert('User created successfully.');
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Error creating user:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create user. Please try again.';
            alert(errorMessage);
        }
    };

    const handleEditUser = async () => {
        // Validate credit limit is provided
        if (!userForm.creditLimit && userForm.creditLimit !== 0) {
            alert('Credit Limit is required.');
            return;
        }
        
        try {
            const payload = prepareUserPayload();
            await api.put(`/api/User/UpdateUser/${userForm.userId}`, payload);
            
            // Fetch the updated user list
            const response = await api.get('/api/User/GetAllUsers');
            setUsers(response.data);
            setFilteredUsers(response.data);
            
            alert('User updated successfully.');
            closeModal();
        } catch (error) {
            console.error('Error updating user:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update user. Please try again.';
            alert(errorMessage);
        }
    };

    const handleResetPassword = async () => {
        try {
            await api.put(`/api/User/ResetPassword/${userForm.userId}`);
            alert('Password has been reset successfully.');
            closeModal();
        } catch (error) {
            console.error('Error resetting password:', error);
            const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
            alert(errorMessage);
        }
    };

    const openCreateModal = () => {
        setUserForm({
            username: '',
            password: '',
            userStatus: 'Active',
            homeLocationCode: '',
            creditLimit: '',
            startDate: '', // Initialize with empty string
            endDate: ''    // Initialize with empty string
        });
        // Clear staff info when creating a new user
        setStaffInfo(null);
        setStaffError('');
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (user) => {
        // Format dates correctly for the date inputs (YYYY-MM-DD format)
        const formattedUser = {
            ...user,
            // Format startDate if it exists
            startDate: user.startDate ? formatDateForInput(user.startDate) : '',
            // Format endDate if it exists
            endDate: user.endDate ? formatDateForInput(user.endDate) : ''
        };
        
        setUserForm(formattedUser);
        setIsEditMode(true);
        
        // First try to populate staffInfo from the existing user data
        setStaffInfo({
            empCode: user.empCode || '',
            titleTh: user.titleTh || '',
            firstNameTh: user.firstNameTh || '',
            lastNameTh: user.lastNameTh || '',
            currDepFull: user.currDepFull || '',
            posAbbr: user.posAbbr || '',
            email: user.email || '',
            tel: user.tel || ''
        });
        setStaffLoading(false);
        setStaffError('');
        
        setShowModal(true);
    };

    // Helper function to format dates for input fields
    const formatDateForInput = (dateString) => {
        try {
            // First check if it's a string that needs parsing
            if (typeof dateString === 'string') {
                // Parse the date in UTC to avoid timezone issues
                const parts = dateString.split('T')[0].split('-');
                if (parts.length === 3) {
                    // Create date using UTC components (YYYY-MM-DD)
                    return dateString.split('T')[0]; // Return just the date part
                }
                
                // Try regular date parsing as fallback
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    // Get year, month, and day in local timezone
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } else if (dateString instanceof Date) {
                // If it's already a Date object
                const year = dateString.getFullYear();
                const month = String(dateString.getMonth() + 1).padStart(2, '0');
                const day = String(dateString.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            return '';
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Add this function to convert between date formats
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        
        try {
            // For consistent display, use a specific format
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                // Format as DD/MM/YYYY
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
            return '';
        } catch (error) {
            console.error('Error formatting date for display:', error);
            return '';
        }
    };

    const fetchStaffInfo = async (username) => {
        setStaffLoading(true);
        setStaffError('');
        setStaffInfo(null);
        
        try {
            const response = await api.post(
                `${process.env.REACT_APP_STAFF_INFO_URL || '/api/StaffInfo/GetStaffInfoFromJson'}`,
                { staffID: username }
            );
            
            if (response.data && response.data.length > 0) {
                setStaffInfo(response.data[0]);
            } else {
                setStaffError('No staff info found.');
            }
        } catch (error) {
            console.error('Error fetching staff info:', error);
            setStaffError('Error fetching staff info.');
        } finally {
            setStaffLoading(false);
        }
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

    // Search Staff Info using api.get
    const handleSearchStaff = () => fetchStaffInfo(userForm.username);

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
                                                    <th>Employee Code</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Sector</th>
                                                    <th>Username</th>
                                                    <th>Status</th>
                                                    <th>Home Location Code</th>
                                                    <th>Home Location Name</th>
                                                    <th>Credit Limit</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map(user => (
                                                    <tr key={user.userId}>
                                                        <td>{user.empCode}</td>
                                                        <td>{user.firstNameTh}</td>
                                                        <td>{user.lastNameTh}</td>
                                                        <td>{user.sector}</td>
                                                        <td>{user.username}</td>
                                                        <td>{user.userStatus}</td>
                                                        <td>{user.homeLocationCode}</td>
                                                        <td>{user.homeLocationName}</td>
                                                        <td>{user.creditLimit}</td>
                                                        <td>{formatDateForDisplay(user.startDate)}</td>
                                                        <td>{formatDateForDisplay(user.endDate)}</td>
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
                    <div className="modal-dialog" style={{ maxWidth: 900, maxHeight: '90vh' }}>
                        <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Edit User' : 'Create User'}</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <div className="row">
                                    {/* Left Column */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Username</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={userForm.username}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    disabled={isEditMode}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={handleSearchStaff}
                                                        disabled={!userForm.username}
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>ชื่อ-สกุล (TH)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    staffLoading
                                                        ? 'Loading...'
                                                        : staffError
                                                            ? staffError
                                                            : staffInfo
                                                                ? `${staffInfo.titleTh} ${staffInfo.firstNameTh} ${staffInfo.lastNameTh}`
                                                                : ''
                                                }
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>แผนก</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={staffInfo?.currDepFull || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>ตำแหน่ง</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={staffInfo?.posAbbr || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={staffInfo?.email || ''}
                                                readOnly
                                            />
                                        </div>
                                        {/* Moved Tel field here */}
                                        <div className="form-group">
                                            <label>โทร</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={staffInfo?.tel || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Right Column */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={userForm.password}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={isEditMode}
                                            />
                                        </div>
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
                                            <select
                                                name="homeLocationCode"
                                                value={userForm.homeLocationCode}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            >
                                                <option value="">-- Select Location --</option>
                                                {homeLocationCodes.map(location => (
                                                    <option key={location.locationCode} value={location.locationCode}>
                                                        {location.locationName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Credit Limit <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                name="creditLimit"
                                                value={userForm.creditLimit}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                            <small className="text-muted">This field is required</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <div className="input-group">
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={userForm.startDate}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                                                />
                                                <div 
                                                    className="form-control" 
                                                    onClick={() => document.querySelector('input[name="startDate"]').showPicker()}
                                                    style={{ cursor: "pointer", background: "#f8f9fa" }}
                                                >
                                                    {userForm.startDate ? formatDateForDisplay(userForm.startDate) : 'Click to select date'}
                                                </div>
                                                <div className="input-group-append">
                                                    <button 
                                                        className="btn btn-outline-secondary" 
                                                        type="button"
                                                        onClick={() => {
                                                            setUserForm({...userForm, startDate: ''});
                                                        }}
                                                        title="Clear date"
                                                    >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <div className="input-group">
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={userForm.endDate}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                                                />
                                                <div 
                                                    className="form-control" 
                                                    onClick={() => document.querySelector('input[name="endDate"]').showPicker()}
                                                    style={{ cursor: "pointer", background: "#f8f9fa" }}
                                                >
                                                    {userForm.endDate ? formatDateForDisplay(userForm.endDate) : 'Click to select date'}
                                                </div>
                                                <div className="input-group-append">
                                                    <button 
                                                        className="btn btn-outline-secondary" 
                                                        type="button"
                                                        onClick={() => {
                                                            setUserForm({...userForm, endDate: ''});
                                                        }}
                                                        title="Clear date"
                                                    >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                    <div className="modal-dialog" style={{ maxWidth: 600, maxHeight: '90vh' }}>
                        <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Manage Groups for User: <strong>{users.find(user => user.userId === selectedUserId)?.username}</strong>
                                </h5>
                                <button type="button" className="close" onClick={closeGroupModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ overflowY: 'auto' }}>
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