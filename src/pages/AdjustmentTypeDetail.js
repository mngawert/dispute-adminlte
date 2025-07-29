import React, { useState, useEffect } from 'react';
import api from '../api';
import ContentHeader from '../components/ContentHeader';

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const AdjustmentTypeDetail = () => {
    const [adjustmentTypeDetails, setAdjustmentTypeDetails] = useState([]);
    const [filteredAdjustmentTypeDetails, setFilteredAdjustmentTypeDetails] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [adjustmentTypeDetailForm, setAdjustmentTypeDetailForm] = useState({
        adjustmentTypeId: '',
        adjustmentTypeName: '',
        adjustmentTypeDesc: '',
        accountCode: '',
        startDate: '',
        endDate: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdjustmentTypeDetails();
    }, []);

    const fetchAdjustmentTypeDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/AdjustmentTypeDetail/GetAllAdjustmentTypeDetails');
            setAdjustmentTypeDetails(response.data);
            
            // Apply existing search filter to the newly fetched data
            if (searchText.trim()) {
                const filtered = response.data.filter(item =>
                    (item.adjustmentTypeName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                    (item.adjustmentTypeDesc || '').toLowerCase().includes(searchText.toLowerCase()) ||
                    (item.accountCode || '').toLowerCase().includes(searchText.toLowerCase())
                );
                setFilteredAdjustmentTypeDetails(filtered);
            } else {
                setFilteredAdjustmentTypeDetails(response.data);
            }
        } catch (error) {
            console.error('Error fetching adjustment type details:', error);
            alert('Error fetching adjustment type details: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdjustmentTypeDetailForm({
            ...adjustmentTypeDetailForm,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        const filtered = adjustmentTypeDetails.filter(item =>
            (item.adjustmentTypeName || '').toLowerCase().includes(value.toLowerCase()) ||
            (item.adjustmentTypeDesc || '').toLowerCase().includes(value.toLowerCase()) ||
            (item.accountCode || '').toLowerCase().includes(value.toLowerCase())
        );
        setFilteredAdjustmentTypeDetails(filtered);
    };

    const handleEditAdjustmentTypeDetail = async () => {
        try {
            // Format dates for API
            const payload = {
                ...adjustmentTypeDetailForm,
                startDate: adjustmentTypeDetailForm.startDate || null,
                endDate: adjustmentTypeDetailForm.endDate || null
            };
            
            await api.put(`/api/AdjustmentTypeDetail/UpdateAdjustmentTypeDetail/${adjustmentTypeDetailForm.adjustmentTypeId}`, payload);
            fetchAdjustmentTypeDetails();
            closeModal();
        } catch (error) {
            console.error('Error updating adjustment type detail:', error);
            alert('Error updating adjustment type detail: ' + (error.response?.data || error.message));
        }
    };

    const openEditModal = async (id) => {
        try {
            const response = await api.get(`/api/AdjustmentTypeDetail/GetAdjustmentTypeDetailById/${id}`);
            setAdjustmentTypeDetailForm({
                ...response.data,
                startDate: response.data.startDate ? response.data.startDate.split('T')[0] : '',
                endDate: response.data.endDate ? response.data.endDate.split('T')[0] : ''
            });
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching adjustment type detail:', error);
            alert('Error fetching adjustment type detail: ' + (error.response?.data || error.message));
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="content-wrapper-x">
            <ContentHeader title="Account Code Configuration" />
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control w-50"
                                            placeholder="Search by name, description, or account code"
                                            value={searchText}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="table-responsive" style={{ height: 500, overflowY: 'auto' }}>
                                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Account Code</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">Loading...</td>
                                                    </tr>
                                                ) : filteredAdjustmentTypeDetails.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">No adjustment type details found</td>
                                                    </tr>
                                                ) : (
                                                    filteredAdjustmentTypeDetails.map(item => (
                                                        <tr key={item.adjustmentTypeId}>
                                                            <td>{item.adjustmentTypeId}</td>
                                                            <td>{item.adjustmentTypeName}</td>
                                                            <td>{item.adjustmentTypeDesc}</td>
                                                            <td>{item.accountCode}</td>
                                                            <td>{formatDateForDisplay(item.startDate)}</td>
                                                            <td>{formatDateForDisplay(item.endDate)}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm"
                                                                    onClick={() => openEditModal(item.adjustmentTypeId)}
                                                                >
                                                                    <i className="fa fa-pencil-alt" aria-hidden="true"></i> Edit
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Adjustment Type Detail</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        name="adjustmentTypeId"
                                        value={adjustmentTypeDetailForm.adjustmentTypeId}
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="adjustmentTypeName"
                                        value={adjustmentTypeDetailForm.adjustmentTypeName}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="adjustmentTypeDesc"
                                        value={adjustmentTypeDetailForm.adjustmentTypeDesc || ''}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Account Code</label>
                                    <input
                                        type="text"
                                        name="accountCode"
                                        value={adjustmentTypeDetailForm.accountCode || ''}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <div className="input-group">
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={adjustmentTypeDetailForm.startDate}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                                        />
                                        <div 
                                            className="form-control" 
                                            onClick={() => document.querySelector('input[name="startDate"]').showPicker()}
                                            style={{ cursor: "pointer", background: "#f8f9fa" }}
                                        >
                                            {adjustmentTypeDetailForm.startDate ? formatDateForDisplay(adjustmentTypeDetailForm.startDate) : 'Click to select date'}
                                        </div>
                                        <div className="input-group-append">
                                            <button 
                                                className="btn btn-outline-secondary" 
                                                type="button"
                                                onClick={() => setAdjustmentTypeDetailForm({...adjustmentTypeDetailForm, startDate: ''})}
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
                                            value={adjustmentTypeDetailForm.endDate}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                                        />
                                        <div 
                                            className="form-control" 
                                            onClick={() => document.querySelector('input[name="endDate"]').showPicker()}
                                            style={{ cursor: "pointer", background: "#f8f9fa" }}
                                        >
                                            {adjustmentTypeDetailForm.endDate ? formatDateForDisplay(adjustmentTypeDetailForm.endDate) : 'Click to select date'}
                                        </div>
                                        <div className="input-group-append">
                                            <button 
                                                className="btn btn-outline-secondary" 
                                                type="button"
                                                onClick={() => setAdjustmentTypeDetailForm({...adjustmentTypeDetailForm, endDate: ''})}
                                                title="Clear date"
                                            >
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleEditAdjustmentTypeDetail}
                                >
                                    Update
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

export default AdjustmentTypeDetail;