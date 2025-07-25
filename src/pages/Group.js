import React, { useState, useEffect } from 'react';
import api from '../api';
import ContentHeader from '../components/ContentHeader';

const Group = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [groupForm, setGroupForm] = useState({
        groupId: '',
        groupName: '',
        groupDescription: '',
        status: 'T'
    });
    const [roles, setRoles] = useState([]);
    const [groupRoles, setGroupRoles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groupLocations, setGroupLocations] = useState([]);
    const [invoicingCompanies, setInvoicingCompanies] = useState([]);
    const [groupInvoicingCompanies, setGroupInvoicingCompanies] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showInvoicingCompanyModal, setShowInvoicingCompanyModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [availableLocationFilter, setAvailableLocationFilter] = useState('');
    const [availableRoleFilter, setAvailableRoleFilter] = useState('');
    const [availableInvoicingCompanyFilter, setAvailableInvoicingCompanyFilter] = useState('');

    useEffect(() => {
        fetchGroups();
        fetchAllRoles();
        fetchAllLocations();
        fetchAllInvoicingCompanies();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/api/Group/GetAllGroups');
            setGroups(response.data);
            setFilteredGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const fetchAllRoles = async () => {
        try {
            const response = await api.get('/api/Group/GetAllRoles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchAllLocations = async () => {
        try {
            const response = await api.get('/api/Group/GetHomeLocationCodes');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchAllInvoicingCompanies = async () => {
        try {
            const response = await api.get('/api/Group/GetAllInvoicingCompanies');
            setInvoicingCompanies(response.data);
        } catch (error) {
            console.error('Error fetching invoicing companies:', error);
        }
    };

    const fetchGroupRoles = async (groupId) => {
        try {
            const response = await api.get(`/api/Group/GetGroupRoles/${groupId}`);
            setGroupRoles(response.data);
        } catch (error) {
            console.error('Error fetching group roles:', error);
        }
    };

    const fetchGroupLocations = async (groupId) => {
        try {
            const response = await api.get(`/api/Group/GetGroupLocations/${groupId}`);
            setGroupLocations(response.data);
        } catch (error) {
            console.error('Error fetching group locations:', error);
        }
    };

    const fetchGroupInvoicingCompanies = async (groupId) => {
        try {
            const response = await api.get(`/api/Group/GetGroupInvoicingCompanies/${groupId}`);
            setGroupInvoicingCompanies(response.data);
        } catch (error) {
            console.error('Error fetching group invoicing companies:', error);
        }
    };

    const handleAddRoleToGroup = async (roleId) => {
        try {
            await api.post('/api/Group/AddGroupRole', { groupId: selectedGroupId, roleId });
            fetchGroupRoles(selectedGroupId);
        } catch (error) {
            console.error('Error adding role to group:', error);
        }
    };

    const handleAddLocationToGroup = async (locationCode) => {
        try {
            await api.post('/api/Group/AddGroupLocation', { groupId: selectedGroupId, locationCode });
            fetchGroupLocations(selectedGroupId);
        } catch (error) {
            console.error('Error adding location to group:', error);
        }
    };

    const handleAddInvoicingCompanyToGroup = async (invoicingCoId) => {
        try {
            await api.post('/api/Group/AddGroupInvoicingCompany', { 
                groupId: selectedGroupId, 
                invoicingCoId: invoicingCoId 
            });
            fetchGroupInvoicingCompanies(selectedGroupId);
        } catch (error) {
            console.error('Error adding invoicing company to group:', error);
        }
    };

    const handleRemoveRoleFromGroup = async (roleId) => {
        try {
            // Use POST instead of DELETE and send the roleId in the request body
            await api.post(`/api/Group/DeleteGroupRole`, {
                groupId: selectedGroupId,
                roleId: roleId
            });
            fetchGroupRoles(selectedGroupId);
        } catch (error) {
            console.error('Error removing role from group:', error);
            alert('Error removing role: ' + (error.response?.data || error.message));
        }
    };

    const handleRemoveLocationFromGroup = async (locationCode) => {
        try {
            await api.delete(`/api/Group/DeleteGroupLocation/${selectedGroupId}/${locationCode}`);
            fetchGroupLocations(selectedGroupId);
        } catch (error) {
            console.error('Error removing location from group:', error);
        }
    };

    const handleRemoveInvoicingCompanyFromGroup = async (companyId) => {
        try {
            await api.delete(`/api/Group/DeleteGroupInvoicingCompany/${selectedGroupId}/${companyId}`);
            fetchGroupInvoicingCompanies(selectedGroupId);
        } catch (error) {
            console.error('Error removing invoicing company from group:', error);
        }
    };

    const openRoleModal = (groupId) => {
        setSelectedGroupId(groupId);
        fetchGroupRoles(groupId);
        setShowRoleModal(true);
    };

    const openLocationModal = (groupId) => {
        setSelectedGroupId(groupId);
        fetchGroupLocations(groupId);
        setShowLocationModal(true);
    };

    const openInvoicingCompanyModal = (groupId) => {
        setSelectedGroupId(groupId);
        fetchGroupInvoicingCompanies(groupId);
        setShowInvoicingCompanyModal(true);
    };

    const closeRoleModal = () => {
        setShowRoleModal(false);
        setGroupRoles([]);
        setSelectedGroupId(null);
    };

    const closeLocationModal = () => {
        setShowLocationModal(false);
        setGroupLocations([]);
        setSelectedGroupId(null);
    };

    const closeInvoicingCompanyModal = () => {
        setShowInvoicingCompanyModal(false);
        setGroupInvoicingCompanies([]);
        setSelectedGroupId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupForm({
            ...groupForm,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        const filtered = groups.filter(group =>
            (group.groupName || '').toLowerCase().includes(value.toLowerCase()) ||
            (group.groupDescription || '').toLowerCase().includes(value.toLowerCase())
        );
        setFilteredGroups(filtered);
    };

    const handleCreateGroup = async () => {
        try {
            await api.post('/api/Group/CreateGroup', groupForm);
            fetchGroups();
            closeModal();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleEditGroup = async () => {
        try {
            await api.put(`/api/Group/UpdateGroup/${groupForm.groupId}`, groupForm);
            fetchGroups();
            closeModal();
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const openCreateModal = () => {
        setGroupForm({
            groupId: '',
            groupName: '',
            groupDescription: '',
            status: 'T'
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (group) => {
        setGroupForm(group);
        setIsEditMode(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="content-wrapper-x">
            <ContentHeader title="Group Management" />
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
                                            placeholder="Search by group name or description"
                                            value={searchText}
                                            onChange={handleSearchChange}
                                        />
                                        <button className="btn btn-primary" onClick={openCreateModal}>
                                            Create Group
                                        </button>
                                    </div>
                                    <div className="table-responsive" style={{ height: 500, overflowY: 'auto' }}>
                                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Group Name</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredGroups.map(group => (
                                                    <tr key={group.groupId}>
                                                        <td>{group.groupName}</td>
                                                        <td>{group.groupDescription}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm mr-2"
                                                                onClick={() => openEditModal(group)}
                                                            >
                                                                <i className="fa fa-pencil-alt" aria-hidden="true"></i> Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info mr-2"
                                                                onClick={() => openRoleModal(group.groupId)}
                                                            >
                                                                <i className="fa fa-users" aria-hidden="true"></i> Manage Roles
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info mr-2"
                                                                onClick={() => openLocationModal(group.groupId)}
                                                            >
                                                                <i className="fa fa-map-marker" aria-hidden="true"></i> Manage Locations
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info"
                                                                onClick={() => openInvoicingCompanyModal(group.groupId)}
                                                            >
                                                                <i className="fa fa-money-bill-wave" aria-hidden="true"></i> Manage Invoicing Companies
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

            {/* Role Management Modal */}
            {showRoleModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Manage Roles for Group: <strong>{groups.find(group => group.groupId === selectedGroupId)?.groupName}</strong>
                                </h5>
                                <button type="button" className="close" onClick={closeRoleModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6>Assigned Roles</h6>
                                {/* Added height constraint and overflow for scrolling */}
                                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '15px' }}>
                                    <ul className="list-group">
                                        {groupRoles.map(role => (
                                            <li key={role.roleId} className="list-group-item d-flex align-items-center justify-content-between">
                                                <span>{role.roleId}</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveRoleFromGroup(role.roleId)}
                                                    title="Remove Role"
                                                >
                                                    <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <h6 className="mt-3">Available Roles</h6>
                                {/* Added search filter for available roles */}
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Filter available roles"
                                    value={availableRoleFilter}
                                    onChange={(e) => setAvailableRoleFilter(e.target.value)}
                                />
                                {/* Added height constraint and overflow for scrolling */}
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {roles
                                            .filter(role => 
                                                (role.roleId || '').toLowerCase().includes((availableRoleFilter || '').toLowerCase()) &&
                                                !groupRoles.some(gr => gr.roleId === role.roleId)
                                            )
                                            .map(role => (
                                                <li key={role.roleId} className="list-group-item d-flex align-items-center justify-content-between">
                                                    <span>{role.roleId}</span>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleAddRoleToGroup(role.roleId)}
                                                        title="Add Role"
                                                    >
                                                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeRoleModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Management Modal */}
            {showLocationModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Manage Locations for Group: <strong>{groups.find(group => group.groupId === selectedGroupId)?.groupName}</strong>
                                </h5>
                                <button type="button" className="close" onClick={closeLocationModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6>Assigned Locations</h6>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {groupLocations.map(location => (
                                            <li key={location.locationCode} className="list-group-item d-flex align-items-center justify-content-between">
                                                <span>{location.locationName}</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveLocationFromGroup(location.locationCode)}
                                                    title="Remove Location"
                                                >
                                                    <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <h6 className="mt-3">Available Locations</h6>
                                {/* Filter Input for Available Locations */}
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Filter available locations"
                                    value={availableLocationFilter}
                                    onChange={(e) => setAvailableLocationFilter(e.target.value)}
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {locations
                                            .filter(location =>
                                                location.locationName.toLowerCase().includes(availableLocationFilter.toLowerCase()) &&
                                                !groupLocations.some(gl => gl.locationCode === location.locationCode)
                                            )
                                            .map(location => (
                                                <li key={location.locationCode} className="list-group-item d-flex align-items-center justify-content-between">
                                                    <span>{location.locationName}</span>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleAddLocationToGroup(location.locationCode)}
                                                        title="Add Location"
                                                    >
                                                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeLocationModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoicing Company Management Modal */}
            {showInvoicingCompanyModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Manage Invoicing Companies for Group: <strong>{groups.find(group => group.groupId === selectedGroupId)?.groupName}</strong>
                                </h5>
                                <button type="button" className="close" onClick={closeInvoicingCompanyModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6>Assigned Invoicing Companies</h6>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {groupInvoicingCompanies.map(company => (
                                            <li key={company.invoicingCoId} className="list-group-item d-flex align-items-center justify-content-between">
                                                <span>{company.invoicingCoName}</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveInvoicingCompanyFromGroup(company.invoicingCoId)}
                                                    title="Remove Invoicing Company"
                                                >
                                                    <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <h6 className="mt-3">Available Invoicing Companies</h6>
                                {/* Filter Input for Available Invoicing Companies */}
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Filter available invoicing companies"
                                    value={availableInvoicingCompanyFilter}
                                    onChange={(e) => setAvailableInvoicingCompanyFilter(e.target.value)}
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <ul className="list-group">
                                        {invoicingCompanies
                                            .filter(company =>
                                                company.invoicingCoName.toLowerCase().includes(availableInvoicingCompanyFilter.toLowerCase()) &&
                                                !groupInvoicingCompanies.some(gc => gc.invoicingCoId === company.invoicingCoId)
                                            )
                                            .map(company => (
                                                <li key={company.invoicingCoId} className="list-group-item d-flex align-items-center justify-content-between">
                                                    <span>{company.invoicingCoName}</span>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleAddInvoicingCompanyToGroup(company.invoicingCoId)}
                                                        title="Add Invoicing Company"
                                                    >
                                                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeInvoicingCompanyModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Group Modal */}
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Edit Group' : 'Create Group'}</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Group Name</label>
                                    <input
                                        type="text"
                                        name="groupName"
                                        value={groupForm.groupName}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="groupDescription"
                                        value={groupForm.groupDescription || ''}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={isEditMode ? handleEditGroup : handleCreateGroup}
                                >
                                    {isEditMode ? 'Update Group' : 'Create Group'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Group;