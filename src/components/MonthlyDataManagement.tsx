import React, { useState } from 'react';
import { MonthlyEnergyRecord, ComputedMonthlyMetric } from '../types/electrical';
import {
  Plus,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Calendar,
  Zap,
  DollarSign,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface MonthlyDataManagementProps {
  records: MonthlyEnergyRecord[];
  metrics: ComputedMonthlyMetric[];
  onAddRecord: (record: MonthlyEnergyRecord) => void;
  onUpdateRecord: (record: MonthlyEnergyRecord) => void;
  onDeleteRecord: (id: string) => void;
  onResetDefaults: () => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingRecord: MonthlyEnergyRecord | null;
  setEditingRecord: (rec: MonthlyEnergyRecord | null) => void;
}

export const MonthlyDataManagement: React.FC<MonthlyDataManagementProps> = ({
  records,
  metrics,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onResetDefaults,
  isAddModalOpen,
  setIsAddModalOpen,
  editingRecord,
  setEditingRecord,
}) => {
  // Add Form State
  const [formMonth, setFormMonth] = useState<string>('2026-11');
  const [formKwh, setFormKwh] = useState<string>('1560');
  const [formBill, setFormBill] = useState<string>('12950');
  const [formVoltage, setFormVoltage] = useState<string>('229.5');
  const [formFrequency, setFormFrequency] = useState<string>('50.02');
  const [formEquipment, setFormEquipment] = useState<string>('24');
  const [formPhase, setFormPhase] = useState<'Single Phase (230V)' | 'Three Phase (415V)'>(
    'Single Phase (230V)'
  );
  const [formNotes, setFormNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Form State
  const [editKwh, setEditKwh] = useState<string>('');
  const [editBill, setEditBill] = useState<string>('');
  const [editVoltage, setEditVoltage] = useState<string>('');
  const [editFrequency, setEditFrequency] = useState<string>('');
  const [editEquipment, setEditEquipment] = useState<string>('');
  const [editPhase, setEditPhase] = useState<'Single Phase (230V)' | 'Three Phase (415V)'>(
    'Single Phase (230V)'
  );
  const [editNotes, setEditNotes] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);

  // Initialize edit form when an editingRecord is set
  const handleStartEdit = (rec: MonthlyEnergyRecord) => {
    setEditingRecord(rec);
    setEditKwh(rec.kwh.toString());
    setEditBill(rec.billAmount.toString());
    setEditVoltage(rec.voltage.toString());
    setEditFrequency(rec.frequency.toString());
    setEditEquipment(rec.equipmentCount.toString());
    setEditPhase(rec.phaseType);
    setEditNotes(rec.notes || '');
    setEditError(null);
  };

  // Format month YYYY-MM to readable string
  const formatMonthLabel = (m: string) => {
    try {
      const [year, month] = m.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return m;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const kwh = parseFloat(formKwh);
    const bill = parseFloat(formBill);
    const volt = parseFloat(formVoltage);
    const freq = parseFloat(formFrequency);
    const equip = parseInt(formEquipment, 10);

    if (isNaN(kwh) || kwh <= 0) {
      setFormError('Please enter a valid positive value for kWh consumption.');
      return;
    }
    if (isNaN(bill) || bill < 0) {
      setFormError('Please enter a valid bill amount in Rupees.');
      return;
    }
    if (isNaN(volt) || volt < 150 || volt > 500) {
      setFormError('Please enter a realistic voltage between 150V and 500V.');
      return;
    }
    if (isNaN(freq) || freq < 45 || freq > 55) {
      setFormError('Please enter a realistic frequency between 45.0 Hz and 55.0 Hz.');
      return;
    }
    if (isNaN(equip) || equip < 1) {
      setFormError('Equipment count must be at least 1.');
      return;
    }

    const monthLabel = formatMonthLabel(formMonth);

    // Check if month already exists
    if (records.some((r) => r.month === formMonth)) {
      setFormError(`A record for ${monthLabel} (${formMonth}) already exists. Edit the existing record or select a different month.`);
      return;
    }

    const newRecord: MonthlyEnergyRecord = {
      id: `rec-${formMonth}-${Date.now()}`,
      month: formMonth,
      monthLabel,
      kwh,
      billAmount: bill,
      voltage: volt,
      frequency: freq,
      equipmentCount: equip,
      phaseType: formPhase,
      notes: formNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddRecord(newRecord);
    setIsAddModalOpen(false);
    setFormNotes('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setEditError(null);

    const kwh = parseFloat(editKwh);
    const bill = parseFloat(editBill);
    const volt = parseFloat(editVoltage);
    const freq = parseFloat(editFrequency);
    const equip = parseInt(editEquipment, 10);

    if (isNaN(kwh) || kwh <= 0) {
      setEditError('Please enter a valid positive value for kWh consumption.');
      return;
    }
    if (isNaN(bill) || bill < 0) {
      setEditError('Please enter a valid bill amount in Rupees.');
      return;
    }
    if (isNaN(volt) || volt < 150 || volt > 500) {
      setEditError('Please enter a realistic voltage between 150V and 500V.');
      return;
    }
    if (isNaN(freq) || freq < 45 || freq > 55) {
      setEditError('Please enter a realistic frequency between 45.0 Hz and 55.0 Hz.');
      return;
    }
    if (isNaN(equip) || equip < 1) {
      setEditError('Equipment count must be at least 1.');
      return;
    }

    const updated: MonthlyEnergyRecord = {
      ...editingRecord,
      kwh,
      billAmount: bill,
      voltage: volt,
      frequency: freq,
      equipmentCount: equip,
      phaseType: editPhase,
      notes: editNotes.trim() || undefined,
    };

    onUpdateRecord(updated);
    setEditingRecord(null);
  };

  const handleExportCsv = () => {
    const headers = [
      'Month',
      'Consumption_kWh',
      'Bill_Amount_Rupees',
      'Cost_Per_kWh',
      'Voltage_V',
      'Frequency_Hz',
      'Equipment_Count',
      'Phase_Type',
      'MoM_Change_Percent',
      'Estimated_Wastage_kWh',
      'Wastage_Cost_Rupees',
      'Notes',
    ];

    const rows = metrics.map((m) => [
      `"${m.record.monthLabel}"`,
      m.record.kwh,
      m.record.billAmount,
      m.costPerKwh,
      m.record.voltage,
      m.record.frequency,
      m.record.equipmentCount,
      `"${m.record.phaseType}"`,
      m.kwhMoMChangePercent !== null ? m.kwhMoMChangePercent : '',
      m.estimatedWastageKwh,
      m.estimatedWastageCost,
      `"${m.record.notes || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Electrical_Energy_Monthly_Data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const jsonContent = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Electrical_Energy_Records_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Toolbar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Energy Ledger & Sub-Metering Records
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {records.length} Monthly Entries
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Monthly Energy & Power Quality Data</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add or edit monthly kWh, electricity bills in Rupees (₹), voltage, frequency, and equipment counts.
              All percentage changes and technical wastage calculations update dynamically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Monthly Record</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
              title="Reset to Initial Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-4 overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3 text-right">Consumption (kWh)</th>
                <th className="p-3 text-right">Bill Amount (₹)</th>
                <th className="p-3 text-right">Effective Rate</th>
                <th className="p-3 text-right">Voltage (V)</th>
                <th className="p-3 text-right">Frequency (Hz)</th>
                <th className="p-3 text-right">Equipment Count</th>
                <th className="p-3 text-right">MoM % Change</th>
                <th className="p-3 text-right">Est. Wastage</th>
                <th className="p-3 text-center">Power Quality</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {metrics.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 font-mono">
                    No energy records found. Click "Add Monthly Record" to get started.
                  </td>
                </tr>
              ) : (
                metrics.map((m) => {
                  const isKwhReduction =
                    m.kwhMoMChangePercent !== null && m.kwhMoMChangePercent < 0;
                  const isKwhIncrease =
                    m.kwhMoMChangePercent !== null && m.kwhMoMChangePercent > 0;
                  const isBillIncrease =
                    m.billMoMChangePercent !== null && m.billMoMChangePercent > 0;

                  return (
                    <tr key={m.record.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Month */}
                      <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                        {m.record.monthLabel}
                        {m.record.notes && (
                          <span
                            className="block text-[10px] text-slate-400 font-normal truncate max-w-[140px]"
                            title={m.record.notes}
                          >
                            {m.record.notes}
                          </span>
                        )}
                      </td>

                      {/* kWh */}
                      <td className="p-3 text-right font-mono font-bold text-white whitespace-nowrap">
                        {m.record.kwh.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">kWh</span>
                      </td>

                      {/* Bill */}
                      <td className="p-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        ₹{m.record.billAmount.toLocaleString()}
                      </td>

                      {/* Effective Rate */}
                      <td className="p-3 text-right font-mono text-slate-300 whitespace-nowrap">
                        ₹{m.costPerKwh} / kWh
                      </td>

                      {/* Voltage */}
                      <td className="p-3 text-right font-mono whitespace-nowrap">
                        <span
                          className={
                            Math.abs(m.voltageDeviationPercent) > 6
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-200'
                          }
                        >
                          {m.record.voltage}V
                        </span>
                        <span className="block text-[9px] text-slate-500">
                          {m.voltageDeviationPercent > 0 ? '+' : ''}
                          {m.voltageDeviationPercent}%
                        </span>
                      </td>

                      {/* Frequency */}
                      <td className="p-3 text-right font-mono text-slate-300 whitespace-nowrap">
                        {m.record.frequency} Hz
                      </td>

                      {/* Equipment */}
                      <td className="p-3 text-right font-mono text-purple-400 whitespace-nowrap">
                        {m.record.equipmentCount}{' '}
                        <span className="text-[10px] text-slate-400">({m.kwhPerEquipment}/eq)</span>
                      </td>

                      {/* MoM % Change */}
                      <td className="p-3 text-right font-mono whitespace-nowrap">
                        {m.kwhMoMChangePercent === null ? (
                          <span className="text-slate-500 text-[10px]">Baseline</span>
                        ) : (
                          <div className="space-y-0.5">
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                isKwhReduction
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : isKwhIncrease
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              kWh: {m.kwhMoMChangePercent > 0 ? '+' : ''}
                              {m.kwhMoMChangePercent}%
                            </span>
                            {m.billMoMChangePercent !== null && (
                              <span className="block text-[9px] text-slate-400">
                                Bill: {m.billMoMChangePercent > 0 ? '+' : ''}
                                {m.billMoMChangePercent}%
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Estimated Wastage */}
                      <td className="p-3 text-right font-mono whitespace-nowrap">
                        {m.estimatedWastageKwh > 0 ? (
                          <div>
                            <span className="text-amber-400 font-bold">
                              {m.estimatedWastageKwh} kWh
                            </span>
                            <span className="block text-[10px] text-rose-400 font-semibold">
                              ₹{m.estimatedWastageCost.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-medium">0 kWh</span>
                        )}
                      </td>

                      {/* Power Quality Badge */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            m.powerQualityStatus === 'Optimal'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : m.powerQualityStatus === 'Acceptable'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : m.powerQualityStatus === 'Sub-optimal'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                          title={m.powerQualityReason}
                        >
                          {m.powerQualityStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(m.record)}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete the record for ${m.record.monthLabel}?`
                                )
                              ) {
                                onDeleteRecord(m.record.id);
                              }
                            }}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footnote on Calculations */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>* Automatic Wastage formula factors voltage I²R heating stress and uncharacteristic equipment surges.</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-saved to browser LocalStorage
          </span>
        </div>
      </div>

      {/* ADD RECORD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Add Monthly Energy & Electrical Record
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter utility billing data and sub-meter telemetry for automated analytics.
            </p>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Billing Month (YYYY-MM)</label>
                  <input
                    type="month"
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Phase Type</label>
                  <select
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Single Phase (230V)">Single Phase (230V Nominal)</option>
                    <option value="Three Phase (415V)">Three Phase (415V Nominal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Total Consumption (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formKwh}
                    onChange={(e) => setFormKwh(e.target.value)}
                    placeholder="e.g. 1520"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Total Bill Amount (₹ Rupees)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formBill}
                    onChange={(e) => setFormBill(e.target.value)}
                    placeholder="e.g. 12450"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formVoltage}
                    onChange={(e) => setFormVoltage(e.target.value)}
                    placeholder="230.0"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Frequency (Hz)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    placeholder="50.00"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Equipment Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operational Notes (Optional)</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. High cooling demand, installed 2 new servers..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold"
                >
                  Save & Compute KPIs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RECORD MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-cyan-400" />
              Edit Energy Data: {editingRecord.monthLabel}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update monthly values. All dependent averages, percentage changes, and wastage will update instantly.
            </p>

            {editError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Consumption (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={editKwh}
                    onChange={(e) => setEditKwh(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Bill Amount (₹ Rupees)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editBill}
                    onChange={(e) => setEditBill(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editVoltage}
                    onChange={(e) => setEditVoltage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Frequency (Hz)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFrequency}
                    onChange={(e) => setEditFrequency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Equipment Count</label>
                  <input
                    type="number"
                    min="1"
                    value={editEquipment}
                    onChange={(e) => setEditEquipment(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operational Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Update & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
