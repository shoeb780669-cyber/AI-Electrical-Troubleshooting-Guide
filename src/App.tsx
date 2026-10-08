import React, { useState, useMemo, useEffect } from 'react';
import {
  MonthlyEnergyRecord,
  ComputedMonthlyMetric,
  DashboardSummaryKPIs,
} from './types/electrical';
import {
  loadStoredMonthlyRecords,
  saveMonthlyRecords,
  resetToDefaultRecords,
} from './services/storageService';
import {
  computeMonthlyMetrics,
  calculateDashboardSummary,
} from './services/electricalAnalytics';
import { NavigationHeader, ActiveTab } from './components/NavigationHeader';
import { DashboardOverview } from './components/DashboardOverview';
import { MonthlyDataManagement } from './components/MonthlyDataManagement';
import { InteractiveCharts } from './components/InteractiveCharts';
import { TroubleshootingSection } from './components/TroubleshootingSection';
import { ElectricalCalculator } from './components/ElectricalCalculator';
import { Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  // Load persistent records from LocalStorage
  const [records, setRecords] = useState<MonthlyEnergyRecord[]>(() => loadStoredMonthlyRecords());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Modal control states shared with MonthlyDataManagement
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<MonthlyEnergyRecord | null>(null);

  // Automatically recalculate metrics and summary KPIs when records change
  const computedMetrics = useMemo(() => computeMonthlyMetrics(records), [records]);
  const summaryKPIs = useMemo(() => calculateDashboardSummary(computedMetrics), [computedMetrics]);

  // Persist records to LocalStorage on changes
  useEffect(() => {
    saveMonthlyRecords(records);
    setLastSavedAt(new Date().toLocaleTimeString());
  }, [records]);

  // Record Handlers
  const handleAddRecord = (newRecord: MonthlyEnergyRecord) => {
    setRecords((prev) => [...prev, newRecord]);
  };

  const handleUpdateRecord = (updatedRecord: MonthlyEnergyRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetDefaults = () => {
    const defaults = resetToDefaultRecords();
    setRecords(defaults);
  };

  const handleStartEditFromDashboard = (rec: MonthlyEnergyRecord) => {
    setActiveTab('monthlyData');
    setEditingRecord(rec);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Navigation */}
      <NavigationHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lastSavedAt={lastSavedAt}
        recordsCount={records.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* VIEW 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            <DashboardOverview
              summary={summaryKPIs}
              metrics={computedMetrics}
              onOpenAddModal={() => {
                setActiveTab('monthlyData');
                setIsAddModalOpen(true);
              }}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onEditRecord={handleStartEditFromDashboard}
            />
          </div>
        )}

        {/* VIEW 2: Monthly Energy Data Management */}
        {activeTab === 'monthlyData' && (
          <div className="animate-in fade-in duration-200">
            <MonthlyDataManagement
              records={records}
              metrics={computedMetrics}
              onAddRecord={handleAddRecord}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onResetDefaults={handleResetDefaults}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              editingRecord={editingRecord}
              setEditingRecord={setEditingRecord}
            />
          </div>
        )}

        {/* VIEW 3: Interactive Charts */}
        {activeTab === 'charts' && (
          <div className="animate-in fade-in duration-200">
            <InteractiveCharts metrics={computedMetrics} />
          </div>
        )}

        {/* VIEW 4: AI Electrical Troubleshooting Guide */}
        {activeTab === 'troubleshoot' && (
          <div className="animate-in fade-in duration-200">
            <TroubleshootingSection />
          </div>
        )}

        {/* VIEW 5: Calculators & Safety Standards */}
        {activeTab === 'calculators' && (
          <div className="animate-in fade-in duration-200">
            <ElectricalCalculator />
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">AI Electrical Troubleshooting Guide</span>
            <span>— Energy Analytics, Power Quality & Safety Intelligence</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local Data Persistence Active • Zero Cloud Payment Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
