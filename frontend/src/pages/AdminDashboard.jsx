import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import FlatsResidentsTab from '../components/admin/FlatsResidentsTab';
import BillingTab from '../components/admin/BillingTab';
import ComplaintsTab from '../components/admin/ComplaintsTab';
import VisitorsTab from '../components/admin/VisitorsTab';
import FacilitiesTab from '../components/admin/FacilitiesTab';
import NoticesTab from '../components/admin/NoticesTab';

const TABS = [
  { id: 'flats', label: 'Flats & Residents' },
  { id: 'billing', label: 'Billing' },
  { id: 'complaints', label: 'Complaints' },
  { id: 'visitors', label: 'Visitors' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'notices', label: 'Notices' },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('flats');

  return (
    <DashboardLayout>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'flats' && <FlatsResidentsTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'complaints' && <ComplaintsTab />}
      {activeTab === 'visitors' && <VisitorsTab />}
      {activeTab === 'facilities' && <FacilitiesTab />}
      {activeTab === 'notices' && <NoticesTab />}
    </DashboardLayout>
  );
}

export default AdminDashboard;