import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import FlatsResidentsTab from '../components/admin/FlatsResidentsTab';
import BillingTab from '../components/admin/BillingTab';
import ComplaintsTab from '../components/admin/ComplaintsTab';

const TABS = [
  { id: 'flats', label: 'Flats & Residents' },
  { id: 'billing', label: 'Billing' },
  { id: 'complaints', label: 'Complaints' },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('flats');

  return (
    <DashboardLayout>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
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
    </DashboardLayout>
  );
}

export default AdminDashboard;