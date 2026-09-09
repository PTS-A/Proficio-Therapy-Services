import React, { useState, useMemo } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Location, LocationType, ServiceType } from '../../types';
import { 
  Building2, 
  Home, 
  MapPin, 
  Plus, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Users, 
  FileText, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Layers, 
  School, 
  Laptop, 
  Phone, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

interface LocationsMasterProps {
  onSelectRecord?: (record: any) => void;
  onNavigateToStaff?: (locationId?: string) => void;
  onNavigateToTracker?: (locationId?: string) => void;
}

export const LocationsMaster: React.FC<LocationsMasterProps> = ({
  onSelectRecord,
  onNavigateToStaff,
  onNavigateToTracker,
}) => {
  const { 
    locations, 
    entities, 
    providers, 
    records, 
    payers,
    addLocation, 
    updateLocation, 
    deleteLocation, 
    toggleLocationStatus,
    isAdmin,
    currentUser,
    setFilters
  } = useCredentialing();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'in-home' | 'clinic' | 'school' | 'telehealth'>('all');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [selectedPaveFilter, setSelectedPaveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteConfirmLocation, setDeleteConfirmLocation] = useState<Location | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    locationType: 'Physical Clinic' as LocationType,
    entityId: entities[0]?.id || 'ent-1',
    dba: entities[0]?.dba || '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    phone: '',
    primaryContact: '',
    serviceTypes: ['In-Clinic', 'In-Home'] as ServiceType[],
    payerApplicability: ['All'] as string[],
    leaseAgreementStatus: 'Active' as Location['leaseAgreementStatus'],
    leaseExpiryDate: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    paveStatus: 'Approved' as Location['paveStatus'],
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved' as Location['locationApprovalStatus'],
    countiesServedInput: 'Santa Clara, Alameda',
    serviceRadiusMiles: 30,
    notes: '',
  });

  // Calculate Metrics
  const stats = useMemo(() => {
    const total = locations.length;
    const inHomeCount = locations.filter(l => 
      l.locationType === 'In-Home / Mobile' || l.serviceTypes?.includes('In-Home')
    ).length;
    const clinicCount = locations.filter(l => 
      l.locationType === 'Physical Clinic' || (!l.locationType && l.serviceTypes?.includes('In-Clinic'))
    ).length;
    const paveApproved = locations.filter(l => l.paveStatus === 'Approved').length;
    const activeStaffLinked = providers.filter(p => p.locationIds && p.locationIds.length > 0).length;

    return {
      total,
      inHomeCount,
      clinicCount,
      paveApproved,
      activeStaffLinked,
    };
  }, [locations, providers]);

  // Filter Locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = loc.name.toLowerCase().includes(q);
        const matchCity = (loc.city || '').toLowerCase().includes(q);
        const matchZip = (loc.zip || loc.zipCode || '').toLowerCase().includes(q);
        const matchDba = (loc.dba || '').toLowerCase().includes(q);
        const matchAddress = (loc.address || '').toLowerCase().includes(q);
        const matchCounties = loc.countiesServed?.some(c => c.toLowerCase().includes(q)) || false;
        if (!matchName && !matchCity && !matchZip && !matchDba && !matchAddress && !matchCounties) {
          return false;
        }
      }

      // Modality / Type Filter
      if (selectedTypeFilter === 'in-home') {
        const isInHome = loc.locationType === 'In-Home / Mobile' || loc.serviceTypes?.includes('In-Home');
        if (!isInHome) return false;
      } else if (selectedTypeFilter === 'clinic') {
        const isClinic = loc.locationType === 'Physical Clinic' || (!loc.locationType && loc.serviceTypes?.includes('In-Clinic'));
        if (!isClinic) return false;
      } else if (selectedTypeFilter === 'school') {
        const isSchool = loc.locationType === 'School District' || loc.serviceTypes?.includes('In-School');
        if (!isSchool) return false;
      } else if (selectedTypeFilter === 'telehealth') {
        const isTele = loc.locationType === 'Telehealth Virtual' || loc.serviceTypes?.includes('Telehealth');
        if (!isTele) return false;
      }

      // Entity Filter
      if (selectedEntityFilter !== 'all' && loc.entityId !== selectedEntityFilter) {
        return false;
      }

      // State Filter
      if (selectedStateFilter !== 'all' && loc.state !== selectedStateFilter) {
        return false;
      }

      // PAVE Filter
      if (selectedPaveFilter !== 'all' && loc.paveStatus !== selectedPaveFilter) {
        return false;
      }

      return true;
    });
  }, [locations, searchQuery, selectedTypeFilter, selectedEntityFilter, selectedStateFilter, selectedPaveFilter]);

  // Open Add Modal with Preset
  const handleOpenAddModal = (presetType: LocationType = 'Physical Clinic') => {
    setActionError(null);
    setEditingLocation(null);

    const defaultEntity = entities[0] || null;
    const isInHomePreset = presetType === 'In-Home / Mobile';

    setFormData({
      name: isInHomePreset ? 'New In-Home & Mobile Therapy Territory' : '',
      locationType: presetType,
      entityId: defaultEntity?.id || 'ent-1',
      dba: defaultEntity?.dba || '',
      address: isInHomePreset ? 'Regional In-Home & Community Coverage Network' : '',
      city: isInHomePreset ? 'San Jose' : '',
      state: 'CA',
      zip: isInHomePreset ? '95124' : '',
      phone: defaultEntity?.phone || '(408) 559-8800',
      primaryContact: defaultEntity?.primaryContact || '',
      serviceTypes: isInHomePreset ? ['In-Home', 'Telehealth'] : ['In-Clinic', 'In-Home'],
      payerApplicability: ['All'],
      leaseAgreementStatus: isInHomePreset ? 'Not Applicable' : 'Active',
      leaseExpiryDate: isInHomePreset ? '' : '2028-12-31',
      effectiveDate: new Date().toISOString().split('T')[0],
      paveStatus: 'Approved',
      insuranceCoverageValid: true,
      locationApprovalStatus: 'Approved',
      countiesServedInput: isInHomePreset ? 'Santa Clara, San Mateo, Alameda, Contra Costa' : 'Santa Clara',
      serviceRadiusMiles: isInHomePreset ? 50 : 25,
      notes: isInHomePreset ? 'Mobile therapy & home-based clinical intervention network.' : '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (loc: Location) => {
    setActionError(null);
    setEditingLocation(loc);

    setFormData({
      name: loc.name,
      locationType: loc.locationType || (loc.serviceTypes?.includes('In-Home') && !loc.serviceTypes.includes('In-Clinic') ? 'In-Home / Mobile' : 'Physical Clinic'),
      entityId: loc.entityId,
      dba: loc.dba || '',
      address: loc.address || loc.addressLine1 || '',
      city: loc.city,
      state: loc.state,
      zip: loc.zip || loc.zipCode || '',
      phone: loc.phone || '',
      primaryContact: loc.primaryContact || '',
      serviceTypes: loc.serviceTypes || ['In-Clinic'],
      payerApplicability: loc.payerApplicability || ['All'],
      leaseAgreementStatus: loc.leaseAgreementStatus || (loc.locationType === 'In-Home / Mobile' ? 'Not Applicable' : 'Active'),
      leaseExpiryDate: loc.leaseExpiryDate || loc.leaseExpirationDate || '',
      effectiveDate: loc.effectiveDate || new Date().toISOString().split('T')[0],
      paveStatus: loc.paveStatus || loc.paveLocationStatus || 'Approved',
      insuranceCoverageValid: loc.insuranceCoverageValid !== undefined ? loc.insuranceCoverageValid : true,
      locationApprovalStatus: loc.locationApprovalStatus || 'Approved',
      countiesServedInput: (loc.countiesServed || []).join(', ') || (loc.city ? `${loc.city} County` : ''),
      serviceRadiusMiles: loc.serviceRadiusMiles || 30,
      notes: loc.notes || '',
    });
    setIsModalOpen(true);
  };

  // Handle Preset Switching inside Modal
  const handleSelectModalPreset = (preset: LocationType) => {
    const isInHome = preset === 'In-Home / Mobile';
    const isSchool = preset === 'School District';
    const isTele = preset === 'Telehealth Virtual';

    setFormData(prev => ({
      ...prev,
      locationType: preset,
      serviceTypes: isInHome 
        ? ['In-Home', 'Telehealth'] 
        : isSchool 
        ? ['In-School', 'In-Home']
        : isTele 
        ? ['Telehealth'] 
        : ['In-Clinic', 'In-Home'],
      leaseAgreementStatus: isInHome || isTele ? 'Not Applicable' : 'Active',
      address: isInHome && (!prev.address || prev.address === '') 
        ? 'Regional In-Home & Community Coverage Network' 
        : prev.address,
    }));
  };

  // Toggle Service Modality inside Form
  const toggleFormServiceType = (st: ServiceType) => {
    setFormData(prev => {
      const exists = prev.serviceTypes.includes(st);
      const updated = exists 
        ? prev.serviceTypes.filter(s => s !== st)
        : [...prev.serviceTypes, st];
      return {
        ...prev,
        serviceTypes: updated.length > 0 ? updated : [st],
      };
    });
  };

  // Save Location Handler
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!formData.name.trim()) {
      setActionError('Location name is required.');
      return;
    }
    if (!formData.city.trim()) {
      setActionError('City / Operating municipality is required.');
      return;
    }

    const selectedEntity = entities.find(ent => ent.id === formData.entityId);
    const countiesArray = formData.countiesServedInput
      ? formData.countiesServedInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload: Omit<Location, 'id'> = {
      name: formData.name.trim(),
      locationType: formData.locationType,
      address: formData.address.trim() || `${formData.city} Regional Service Area`,
      addressLine1: formData.address.trim() || `${formData.city} Regional Service Area`,
      city: formData.city.trim(),
      state: formData.state.trim().toUpperCase(),
      zip: formData.zip.trim() || '95124',
      zipCode: formData.zip.trim() || '95124',
      phone: formData.phone.trim() || selectedEntity?.phone || '',
      entityId: formData.entityId,
      dba: formData.dba || selectedEntity?.dba || '',
      serviceTypes: formData.serviceTypes,
      payerApplicability: formData.payerApplicability,
      leaseAgreementStatus: formData.leaseAgreementStatus,
      leaseExpiryDate: formData.leaseExpiryDate,
      leaseExpirationDate: formData.leaseExpiryDate,
      effectiveDate: formData.effectiveDate,
      paveStatus: formData.paveStatus,
      paveLocationStatus: formData.paveStatus,
      insuranceCoverageValid: formData.insuranceCoverageValid,
      locationApprovalStatus: formData.locationApprovalStatus,
      primaryContact: formData.primaryContact || selectedEntity?.primaryContact || '',
      countiesServed: countiesArray,
      serviceRadiusMiles: Number(formData.serviceRadiusMiles) || 30,
      notes: formData.notes,
      active: editingLocation ? editingLocation.active : true,
    };

    if (editingLocation) {
      updateLocation(editingLocation.id, payload);
      setSuccessToast(`Successfully updated location "${formData.name}".`);
    } else {
      addLocation(payload);
      setSuccessToast(`Successfully added new location "${formData.name}" to supported clinics & locations.`);
    }

    setTimeout(() => setSuccessToast(null), 4000);
    setIsModalOpen(false);
  };

  // Delete Location Handler
  const handleDeleteConfirm = () => {
    if (!deleteConfirmLocation) return;
    const res = deleteLocation(deleteConfirmLocation.id);
    if (!res.success) {
      setActionError(res.error || 'Failed to delete location.');
      setDeleteConfirmLocation(null);
      return;
    }
    setSuccessToast(`Location "${deleteConfirmLocation.name}" was removed.`);
    setTimeout(() => setSuccessToast(null), 4000);
    setDeleteConfirmLocation(null);
  };

  // Helper for unique states
  const uniqueStates = useMemo(() => {
    const states = new Set(locations.map(l => l.state).filter(Boolean));
    return Array.from(states);
  }, [locations]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 border border-emerald-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-300 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Error Banner */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Metrics Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2B4C9D]/10 text-[#2B4C9D] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <span>Clinic & Practice Locations Directory</span>
                  <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-bold">
                    {locations.length} Supported
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage physical clinics, satellite facilities, school district campuses, and <strong className="text-emerald-700">In-Home / Mobile therapy service territories</strong> across all legal entities.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons for Admins */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenAddModal('In-Home / Mobile')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>+ Add In-Home Territory</span>
            </button>

            <button
              onClick={() => handleOpenAddModal('Physical Clinic')}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Location</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Overview Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Locations</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across {entities.length} legal entities</div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
            <div className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span>In-Home / Mobile</span>
            </div>
            <div className="text-xl font-bold text-emerald-900 mt-1">{stats.inHomeCount} Hubs</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Home-based therapy delivery</div>
          </div>

          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-sky-800">
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Physical Clinics</span>
            </div>
            <div className="text-xl font-bold text-sky-900 mt-1">{stats.clinicCount} Centers</div>
            <div className="text-[10px] text-sky-700 mt-0.5">Facility & center practices</div>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-indigo-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>PAVE Approved</span>
            </div>
            <div className="text-xl font-bold text-indigo-900 mt-1">{stats.paveApproved} Sites</div>
            <div className="text-[10px] text-indigo-700 mt-0.5">Medi-Cal DHCS verified</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Modality Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Supported Locations', count: locations.length, icon: Layers },
              { id: 'in-home', label: 'In-Home & Mobile Coverage', count: stats.inHomeCount, icon: Home, highlight: true },
              { id: 'clinic', label: 'Physical Clinics', count: stats.clinicCount, icon: Building2 },
              { id: 'school', label: 'School Districts', count: locations.filter(l => l.serviceTypes?.includes('In-School')).length, icon: School },
              { id: 'telehealth', label: 'Telehealth Virtual', count: locations.filter(l => l.serviceTypes?.includes('Telehealth')).length, icon: Laptop },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedTypeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTypeFilter(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? tab.highlight 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-[#2B4C9D] text-white shadow-xs'
                      : tab.highlight
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Card Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dense Table
            </button>
          </div>
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by clinic name, city, state, zip, county coverage, or DBA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Entity Filter */}
          <div>
            <select
              value={selectedEntityFilter}
              onChange={(e) => setSelectedEntityFilter(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white"
            >
              <option value="all">All Legal Entities</option>
              {entities.map(e => (
                <option key={e.id} value={e.id}>{e.dba || e.legalName}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white"
            >
              <option value="all">All States {uniqueStates && uniqueStates.length > 0 ? `(${uniqueStates.join(', ')})` : ''}</option>
              {uniqueStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Locations Display Area */}
      {filteredLocations.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching locations found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, selecting "All Supported Locations", or add a new clinic or in-home delivery territory.
          </p>
          <div className="pt-2 flex justify-center space-x-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTypeFilter('all');
                setSelectedEntityFilter('all');
                setSelectedStateFilter('all');
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => handleOpenAddModal('In-Home / Mobile')}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
            >
              + Add In-Home Location
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => {
            const entity = entities.find(e => e.id === loc.entityId);
            const isInHome = loc.locationType === 'In-Home / Mobile' || (loc.serviceTypes?.includes('In-Home') && !loc.serviceTypes.includes('In-Clinic'));
            const staffCount = providers.filter(p => p.primaryLocationId === loc.id || p.locationIds?.includes(loc.id)).length;
            const appCount = records.filter(r => r.locationId === loc.id).length;

            return (
              <div
                key={loc.id}
                className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                  isInHome 
                    ? 'border-emerald-200 hover:border-emerald-400 bg-gradient-to-b from-emerald-50/20 to-white' 
                    : 'border-slate-200 hover:border-[#2B4C9D]/40'
                } ${!loc.active ? 'opacity-60 bg-slate-50' : ''}`}
              >
                {/* Card Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2.5">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isInHome 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-indigo-50 text-[#2B4C9D]'
                      }`}>
                        {isInHome ? <Home className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isInHome 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}>
                            {loc.locationType || (isInHome ? 'In-Home / Mobile' : 'Physical Clinic')}
                          </span>
                          {!loc.active && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                          {loc.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {entity?.dba || entity?.legalName || loc.dba}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address / Territory Details */}
                  <div className="p-3 bg-slate-50/80 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                    <div className="flex items-start space-x-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="font-medium">
                        {loc.address ? `${loc.address}, ` : ''}{loc.city}, {loc.state} {loc.zip}
                      </span>
                    </div>
                    {loc.phone && (
                      <div className="flex items-center space-x-1.5 text-slate-600 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{loc.phone}</span>
                      </div>
                    )}
                    {/* Counties / Coverage Territory */}
                    {loc.countiesServed && loc.countiesServed.length > 0 && (
                      <div className="pt-1 border-t border-slate-200/60 text-[11px]">
                        <span className="font-semibold text-slate-600">Coverage Territory: </span>
                        <span className="text-emerald-800 font-medium">
                          {(loc.countiesServed || []).join(', ')} ({loc.serviceRadiusMiles || 30} mi radius)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Modality Chips */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Supported Modalities</div>
                    <div className="flex flex-wrap gap-1">
                      {loc.serviceTypes?.map(st => (
                        <span
                          key={st}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                            st === 'In-Home'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : st === 'In-Clinic'
                              ? 'bg-sky-50 text-sky-800 border border-sky-200'
                              : st === 'In-School'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {st === 'In-Home' && <Home className="w-2.5 h-2.5 mr-0.5" />}
                          <span>{st}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Badges Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center space-x-1.5">
                      <ShieldCheck className={`w-3.5 h-3.5 ${loc.paveStatus === 'Approved' ? 'text-emerald-600' : 'text-amber-500'}`} />
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">PAVE Status</div>
                        <div className="font-semibold text-slate-800">{loc.paveStatus || 'Approved'}</div>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2B4C9D]" />
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">Lease / Facility</div>
                        <div className="font-semibold text-slate-800 truncate">
                          {loc.leaseAgreementStatus === 'Not Applicable' ? 'In-Home (N/A)' : (loc.leaseAgreementStatus || 'Active')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Linked Staff & Application counts */}
                  <div className="flex items-center justify-between text-xs font-semibold pt-1 text-slate-600">
                    <button
                      onClick={() => onNavigateToStaff && onNavigateToStaff(loc.id)}
                      className="flex items-center space-x-1 hover:text-[#2B4C9D] transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staffCount} Clinical Staff</span>
                    </button>

                    <button
                      onClick={() => onNavigateToTracker && onNavigateToTracker(loc.id)}
                      className="flex items-center space-x-1 hover:text-[#2B4C9D] transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appCount} Applications</span>
                    </button>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleLocationStatus(loc.id)}
                    className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                      loc.active ? 'text-slate-500 hover:text-slate-800' : 'text-emerald-700 font-bold hover:text-emerald-900'
                    }`}
                  >
                    {loc.active ? 'Deactivate' : 'Activate Location'}
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEditModal(loc)}
                      className="p-1.5 text-slate-600 hover:text-[#2B4C9D] hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Edit Location"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmLocation(loc)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Location & Delivery Type</th>
                  <th className="py-3 px-4">Entity / DBA</th>
                  <th className="py-3 px-4">Address / Coverage Area</th>
                  <th className="py-3 px-4">Service Modalities</th>
                  <th className="py-3 px-4">PAVE Medi-Cal</th>
                  <th className="py-3 px-4">Staff</th>
                  <th className="py-3 px-4">Applications</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLocations.map((loc) => {
                  const entity = entities.find(e => e.id === loc.entityId);
                  const isInHome = loc.locationType === 'In-Home / Mobile' || loc.serviceTypes?.includes('In-Home');
                  const staffCount = providers.filter(p => p.primaryLocationId === loc.id || p.locationIds?.includes(loc.id)).length;
                  const appCount = records.filter(r => r.locationId === loc.id).length;

                  return (
                    <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          {isInHome ? <Home className="w-3.5 h-3.5 text-emerald-600" /> : <Building2 className="w-3.5 h-3.5 text-[#2B4C9D]" />}
                          <span>{loc.name}</span>
                        </div>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                          isInHome ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {loc.locationType || (isInHome ? 'In-Home / Mobile' : 'Physical Clinic')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {entity?.dba || entity?.legalName}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{loc.city}, {loc.state} {loc.zip}</div>
                        {loc.countiesServed && loc.countiesServed.length > 0 && (
                          <div className="text-[10px] text-emerald-700 font-semibold truncate max-w-xs">
                            Counties: {(loc.countiesServed || []).join(', ')}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {loc.serviceTypes?.map(st => (
                            <span key={st} className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                              {st}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          loc.paveStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {loc.paveStatus || 'Approved'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {staffCount}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {appCount}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(loc)}
                            className="p-1.5 text-slate-600 hover:text-[#2B4C9D] hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmLocation(loc)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT LOCATION MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#2B4C9D]/10 text-[#2B4C9D]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingLocation ? `Edit Location: ${editingLocation.name}` : 'Add Clinic or Practice Location'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure service delivery modalities including <strong className="text-emerald-700">In-Home</strong>, physical facility specs, and PAVE compliance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLocation} className="p-6 overflow-y-auto space-y-5 text-xs">
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Delivery Category Presets */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  Location Delivery Category / Archetype
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { type: 'In-Home / Mobile' as LocationType, label: 'In-Home / Mobile Hub', icon: Home, desc: 'Home & community visits' },
                    { type: 'Physical Clinic' as LocationType, label: 'Physical Clinic Facility', icon: Building2, desc: 'Dedicated center site' },
                    { type: 'School District' as LocationType, label: 'School District Site', icon: School, desc: 'On-campus therapy' },
                    { type: 'Telehealth Virtual' as LocationType, label: 'Telehealth Virtual Hub', icon: Laptop, desc: 'Virtual therapy practice' },
                    { type: 'Satellite' as LocationType, label: 'Satellite Clinic', icon: Layers, desc: 'Branch / satellite office' },
                  ].map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = formData.locationType === preset.type;
                    return (
                      <button
                        type="button"
                        key={preset.type}
                        onClick={() => handleSelectModalPreset(preset.type)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? preset.type === 'In-Home / Mobile'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                              : 'border-[#2B4C9D] bg-indigo-50/60 text-[#2B4C9D] ring-2 ring-[#2B4C9D]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 font-bold">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{preset.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-800">Location Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Jose Clinical Center or Northern California In-Home Therapy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Associated Legal Entity *</label>
                  <select
                    value={formData.entityId}
                    onChange={(e) => {
                      const ent = entities.find(en => en.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        entityId: e.target.value,
                        dba: ent?.dba || formData.dba 
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                  >
                    {entities.map(e => (
                      <option key={e.id} value={e.id}>{e.legalName} ({e.dba})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Doing Business As (DBA)</label>
                  <input
                    type="text"
                    placeholder="e.g. AGES In-Home Services"
                    value={formData.dba}
                    onChange={(e) => setFormData({ ...formData, dba: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Supported Service Modalities Selection */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Supported Service Delivery Modalities *
                  </label>
                  <span className="text-[11px] text-slate-500">Select all that apply</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: 'In-Home' as ServiceType, label: 'In-Home', icon: Home, highlight: true },
                    { type: 'In-Clinic' as ServiceType, label: 'In-Clinic', icon: Building2 },
                    { type: 'In-School' as ServiceType, label: 'In-School', icon: School },
                    { type: 'Telehealth' as ServiceType, label: 'Telehealth', icon: Laptop },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isChecked = formData.serviceTypes.includes(m.type);
                    return (
                      <button
                        type="button"
                        key={m.type}
                        onClick={() => toggleFormServiceType(m.type)}
                        className={`flex items-center space-x-2 p-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          isChecked 
                            ? m.highlight 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                              : 'bg-indigo-50 text-[#2B4C9D] border-indigo-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? (m.highlight ? 'bg-emerald-600 text-white' : 'bg-[#2B4C9D] text-white') : 'border border-slate-300'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Address / Geographic Hub */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Physical Address or In-Home Regional Delivery Hub
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2105 S Bascom Ave, Suite 150 or Regional Mobile Coverage Network"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">City / Municipality *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. San Jose"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">State (2-Letter) *</label>
                    <input
                      type="text"
                      maxLength={2}
                      required
                      placeholder="CA"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 95124"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Territory & In-Home Coverage (when In-Home is selected) */}
              {formData.serviceTypes.includes('In-Home') && (
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span>In-Home Service Territory & County Coverage</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-semibold text-emerald-950">Counties Served (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Santa Clara, San Mateo, Alameda, Contra Costa"
                        value={formData.countiesServedInput}
                        onChange={(e) => setFormData({ ...formData, countiesServedInput: e.target.value })}
                        className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-emerald-950">Service Radius (miles)</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={formData.serviceRadiusMiles}
                        onChange={(e) => setFormData({ ...formData, serviceRadiusMiles: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Credentialing Compliance & Lease Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Medi-Cal PAVE Location Status</label>
                  <select
                    value={formData.paveStatus}
                    onChange={(e) => setFormData({ ...formData, paveStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                  >
                    <option value="Approved">Approved (DHCS Verified)</option>
                    <option value="Pending">Pending PAVE Application Review</option>
                    <option value="Not Required">Not Required (Out of State / Non-Medicaid)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Lease / Sublease Agreement Status</label>
                  <select
                    value={formData.leaseAgreementStatus}
                    onChange={(e) => setFormData({ ...formData, leaseAgreementStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs"
                  >
                    <option value="Active">Active Lease Agreement on File</option>
                    <option value="Sublease">Active Sublease Agreement</option>
                    <option value="Not Applicable">Not Applicable (In-Home / Mobile Delivery)</option>
                    <option value="Missing">Pending / Missing Agreement</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {formData.leaseAgreementStatus !== 'Not Applicable' && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Lease Expiration Date</label>
                    <input
                      type="date"
                      value={formData.leaseExpiryDate}
                      onChange={(e) => setFormData({ ...formData, leaseExpiryDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs font-mono"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Location Effective Date</label>
                  <input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:bg-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLocation ? 'Save Location Changes' : 'Add Location to Supported Master'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Remove Location?</h3>
                <p className="text-slate-500 mt-1">
                  Are you sure you want to remove <strong>"{deleteConfirmLocation.name}"</strong> from supported clinics & locations?
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmLocation(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
