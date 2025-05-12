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
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchGroups();
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
            (group.groupDescription || '').toLowerCase().includes(value.toLowerCase()) // Updated field name
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

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;

        try {
            await api.delete(`/api/Group/DeleteGroup/${groupId}`);
            fetchGroups();
        } catch (error) {
            console.error('Error deleting group:', error);
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
                                                            {/* Delete button is hidden for now */}
                                                            {/* <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDeleteGroup(group.groupId)}
                                                            >
                                                                <i className="fa fa-trash" aria-hidden="true"></i> Delete
                                                            </button> */}
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
                                        value={groupForm.groupDescription || ''} // Ensure value is never null
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