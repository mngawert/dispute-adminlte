import React, { useState, useEffect } from 'react';
import api from '../api';

/**
 * LocationFilter component for filtering and selecting locations
 * 
 * @param {Object} props Component props
 * @param {Array} props.selectedLocations Currently selected locations
 * @param {Function} props.onLocationSelect Callback when location is selected
 * @param {Function} props.onLocationRemove Callback when location is removed
 * @param {Boolean} props.showOnlyInactiveLocations Flag to show only inactive locations
 * @param {Function} props.onInactiveLocationsChange Callback when inactive locations filter changes
 * @param {Boolean} props.loading Loading state passed from parent
 */
const LocationFilter = ({
  selectedLocations = [],
  onLocationSelect,
  onLocationRemove,
  showOnlyInactiveLocations = false,
  onInactiveLocationsChange,
  loading: externalLoading = false
}) => {
  // Location filtering states
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');

  // Hierarchy filter states
  const [workareas, setWorkareas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sectors, setSectors] = useState([]);
  
  const [selectedWorkarea, setSelectedWorkarea] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  // Fetch locations when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Function to fetch locations
  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await api.get('/api/ServiceLocation/GetAllServiceLocations');
      setLocations(response.data);
      
      // Extract unique values for workarea hierarchy
      const uniqueWorkareas = [...new Set(response.data.map(loc => loc.workarea))].filter(Boolean).sort();
      setWorkareas(uniqueWorkareas);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Cascade filter effects
  useEffect(() => {
    if (selectedWorkarea) {
      const filteredLocations = locations.filter(loc => loc.workarea === selectedWorkarea);
      const uniqueRegions = [...new Set(filteredLocations.map(loc => loc.region))].filter(Boolean).sort();
      setRegions(uniqueRegions);
      setSelectedRegion('');
      setSelectedDepartment('');
      setSelectedSector('');
      setDepartments([]);
      setSectors([]);
    } else {
      setRegions([]);
      setDepartments([]);
      setSectors([]);
      setSelectedRegion('');
      setSelectedDepartment('');
      setSelectedSector('');
    }
  }, [selectedWorkarea, locations]);

  useEffect(() => {
    if (selectedRegion) {
      const filteredLocations = locations.filter(loc => 
        loc.workarea === selectedWorkarea && loc.region === selectedRegion
      );
      const uniqueDepartments = [...new Set(filteredLocations.map(loc => loc.department))].filter(Boolean).sort();
      setDepartments(uniqueDepartments);
      setSelectedDepartment('');
      setSelectedSector('');
      setSectors([]);
    } else {
      setDepartments([]);
      setSectors([]);
      setSelectedDepartment('');
      setSelectedSector('');
    }
  }, [selectedRegion, selectedWorkarea, locations]);

  useEffect(() => {
    if (selectedDepartment) {
      const filteredLocations = locations.filter(loc => 
        loc.workarea === selectedWorkarea && 
        loc.region === selectedRegion && 
        loc.department === selectedDepartment
      );
      const uniqueSectors = [...new Set(filteredLocations.map(loc => loc.sector))].filter(Boolean).sort();
      setSectors(uniqueSectors);
      setSelectedSector('');
    } else {
      setSectors([]);
      setSelectedSector('');
    }
  }, [selectedDepartment, selectedRegion, selectedWorkarea, locations]);

  // Get filtered locations for display
  const getFilteredLocations = () => {
    let filtered = [...locations];
    
    // Filter out items with null locationCode
    filtered = filtered.filter(loc => loc.locationCode != null);
    
    // Filter to show only locations with status=null when checkbox is checked
    if (showOnlyInactiveLocations) {
      filtered = filtered.filter(loc => loc.status === null);
    }
    
    // Apply text filter if provided
    if (locationFilter) {
      const searchTerm = locationFilter.toLowerCase();
      filtered = filtered.filter(loc => 
        loc.locationCode.toLowerCase().includes(searchTerm) || 
        (loc.locationName && loc.locationName.toLowerCase().includes(searchTerm))
      );
    }
    
    if (selectedWorkarea) {
      filtered = filtered.filter(loc => loc.workarea === selectedWorkarea);
    }
    
    if (selectedRegion) {
      filtered = filtered.filter(loc => loc.region === selectedRegion);
    }
    
    if (selectedDepartment) {
      filtered = filtered.filter(loc => loc.department === selectedDepartment);
    }
    
    if (selectedSector) {
      filtered = filtered.filter(loc => loc.sector === selectedSector);
    }
    
    // Filter out already selected locations
    return filtered.filter(loc => !selectedLocations.some(selected => selected.locationCode === loc.locationCode));
  };

  // Handler functions
  const handleAddLocation = (locationCode) => {
    const locationToAdd = locations.find(loc => loc.locationCode === locationCode);
    if (locationToAdd && onLocationSelect) {
      onLocationSelect(locationToAdd);
    }
  };

  const handleRemoveLocation = (locationCode) => {
    if (onLocationRemove) {
      onLocationRemove(locationCode);
    }
  };

  const handleInactiveLocationsChange = (e) => {
    if (onInactiveLocationsChange) {
      onInactiveLocationsChange(e.target.checked);
    }
  };

  return (
    <>
      {/* Location filter section */}
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Location Filters</h3>
            </div>
            <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
              <div className="form-group mb-2">
                <label>Workarea</label>
                <select
                  className="form-control"
                  value={selectedWorkarea}
                  onChange={(e) => setSelectedWorkarea(e.target.value)}
                >
                  <option value="">-- Select Workarea --</option>
                  {workareas.map(workarea => (
                    <option key={workarea} value={workarea}>{workarea}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-2">
                <label>Region</label>
                <select
                  className="form-control"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  disabled={!selectedWorkarea}
                >
                  <option value="">-- Select Region --</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-2">
                <label>Department</label>
                <select
                  className="form-control"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={!selectedRegion}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sector</label>
                <select
                  className="form-control"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  disabled={!selectedDepartment}
                >
                  <option value="">-- Select Sector --</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Available Locations</h3>
            </div>
            <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
              {/* Add text filter for locations */}
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter locations..."
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              {loadingLocations || externalLoading ? (
                <p className="text-center">Loading locations...</p>
              ) : (
                <ul className="list-group">
                  {getFilteredLocations().map(location => (
                    <li key={location.locationCode} className="list-group-item d-flex align-items-center justify-content-between">
                      <span>{location.locationCode} - {location.locationName}</span>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddLocation(location.locationCode)}
                        title="Add Location"
                      >
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              
              {getFilteredLocations().length === 0 && !loadingLocations && !externalLoading && (
                <p className="text-center text-muted mt-3">No locations match the selected criteria</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Selected Locations</h3>
            </div>
            <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
              {selectedLocations.length === 0 ? (
                <p className="text-muted">No locations selected (will search all locations)</p>
              ) : (
                <ul className="list-group">
                  {selectedLocations.map(location => (
                    <li key={location.locationCode} className="list-group-item d-flex align-items-center justify-content-between">
                      <span>{location.locationCode} - {location.locationName}</span>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveLocation(location.locationCode)}
                        title="Remove Location"
                      >
                        <i className="fa fa-minus-circle" aria-hidden="true"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkbox for inactive locations */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="showOnlyInactiveLocations"
                checked={showOnlyInactiveLocations}
                onChange={handleInactiveLocationsChange}
              />
              <label className="custom-control-label" htmlFor="showOnlyInactiveLocations">
                Show only inactive locations
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationFilter;
