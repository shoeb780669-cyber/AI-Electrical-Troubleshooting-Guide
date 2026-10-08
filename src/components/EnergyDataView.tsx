import React, { useState } from 'react';
import { EnergyRecord, ApplianceCategory } from '../types/energy';
import { CATEGORY_METADATA, SAMPLE_CSV_TEMPLATE, INITIAL_DEMO_RECORDS } from '../data/demoData';
import {
  Database,
  Plus,
  Upload,
  Download,
  RotateCcw,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  FileText,
  X,
  Calendar,
  Clock,
  Layers,
} from 'lucide-react';

interface EnergyDataViewProps {
  records: EnergyRecord[];
  onAddRecord: (record: EnergyRecord) => void;
  onUploadCsv: (newRecords: EnergyRecord[]) => void;
  onResetDemo: () => void;
}

export const EnergyDataView: React.FC<EnergyDataViewProps> = ({
  records,
  onAddRecord,
  onUploadCsv,
  onResetDemo,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);

  // Manual Add Form State
  const [formDate, setFormDate] = useState<string>('2026-10-08');
  const [formTime, setFormTime] = useState<string>('12:00');
  const [formCategory, setFormCategory] = useState<ApplianceCategory>('Air Conditioning');
  const [formKwh, setFormKwh] = useState<string>('11.5');
  const [formExpected, setFormExpected] = useState<string>('11.0');
  const [formOccupancy, setFormOccupancy] = useState<'Occupied' | 'Unoccupied' | 'Low Occupancy'>('Occupied');
  const [formWorkingHours, setFormWorkingHours] = useState<boolean>(true);
  const [formNotes, setFormNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // CSV Upload State
  const [csvText, setCsvText] = useState<string>('');
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState<string | null>(null);

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.date.includes(searchTerm) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const displayedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const kwhNum = parseFloat(formKwh);
    const expectedNum = parseFloat(formExpected);

    if (isNaN(kwhNum) || kwhNum < 0) {
      setFormError('Please enter a valid, non-negative value for Actual kWh.');
      return;
    }
    if (isNaN(expectedNum) || expectedNum < 0) {
      setFormError('Please enter a valid, non-negative value for Expected Baseline kWh.');
      return;
    }
    if (!formDate) {
      setFormError('Please provide a valid date.');
      return;
    }

    const hour = parseInt(formTime.split(':')[0], 10) || 12;

    const newRecord: EnergyRecord = {
      id: `manual-${Date.now()}`,
      date: formDate,
      time: formTime,
      hour,
      kwh: Number(kwhNum.toFixed(2)),
      expectedKwh: Number(expectedNum.toFixed(2)),
      category: formCategory,
      occupancyStatus: formOccupancy,
      isWorkingHours: formWorkingHours,
      notes: formNotes.trim() ? formNotes.trim() : undefined,
    };

    onAddRecord(newRecord);
    setIsAddModalOpen(false);
    setFormNotes('');
  };

  const handleDownloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'energyiq_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvProcess = () => {
    setCsvError(null);
    setCsvSuccess(null);

    if (!csvText.trim()) {
      setCsvError('Please paste CSV contents or upload a file.');
      return;
    }

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setCsvError('CSV must include a header row and at least one data row.');
      return;
    }

    const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const dateIdx = header.indexOf('date');
    const timeIdx = header.indexOf('time');
    const catIdx = header.indexOf('category');
    const kwhIdx = header.indexOf('kwh');

    if (dateIdx === -1 || timeIdx === -1 || catIdx === -1 || kwhIdx === -1) {
      setCsvError('CSV header is missing mandatory columns: date, time, category, kwh');
      return;
    }

    const expIdx = header.indexOf('expectedkwh');
    const occIdx = header.indexOf('occupancystatus');
    const notesIdx = header.indexOf('notes');

    const parsed: EnergyRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const date = cols[dateIdx];
      const time = cols[timeIdx];
      const category = cols[catIdx] as ApplianceCategory;
      const kwh = parseFloat(cols[kwhIdx]);

      if (!date || !time) {
        setCsvError(`Row ${i + 1}: Missing date or time.`);
        return;
      }

      if (isNaN(kwh) || kwh < 0) {
        setCsvError(`Row ${i + 1}: Invalid or negative kWh value (${cols[kwhIdx]}).`);
        return;
      }

      const hour = parseInt(time.split(':')[0], 10) || 0;
      const expectedKwh = expIdx !== -1 && !isNaN(parseFloat(cols[expIdx])) ? parseFloat(cols[expIdx]) : kwh * 0.9;
      const occupancyStatus = (occIdx !== -1 && cols[occIdx] === 'Unoccupied') ? 'Unoccupied' : 'Occupied';
      const notes = notesIdx !== -1 ? cols[notesIdx] : undefined;

      parsed.push({
        id: `csv-${Date.now()}-${i}`,
        date,
        time,
        hour,
        category: (CATEGORY_METADATA[category] ? category : 'Other Appliances') as ApplianceCategory,
        kwh,
        expectedKwh,
        occupancyStatus,
        isWorkingHours: hour >= 9 && hour <= 18,
        notes,
      });
    }

    onUploadCsv(parsed);
    setCsvSuccess(`Successfully ingested ${parsed.length} records!`);
    setTimeout(() => {
      setIsCsvModalOpen(false);
      setCsvSuccess(null);
      setCsvText('');
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action Buttons */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Telemetry Ingestion & Management
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {records.length} Total Records
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Energy Consumption Datasets</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review sub-metered records, upload commercial logs via CSV, or insert manual meter checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </button>
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload CSV</span>
            </button>
            <button
              onClick={handleDownloadSampleTemplate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Download CSV Template"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV Template</span>
            </button>
            <button
              onClick={onResetDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Reset to Default Demo Dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search date, category, notes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Categories</option>
              {Object.keys(CATEGORY_METADATA).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="mt-4 overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Actual kWh</th>
                <th className="p-3 text-right">Expected kWh</th>
                <th className="p-3 text-right">Excess (Wastage)</th>
                <th className="p-3">Occupancy</th>
                <th className="p-3">Shift Window</th>
                <th className="p-3">Diagnostic Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No matching energy records found for your criteria.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((r) => {
                  const excess = Math.max(0, r.kwh - r.expectedKwh);
                  const isWastage = excess > 0.05;

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono text-slate-300">
                        {r.date} <span className="text-slate-400">{r.time}</span>
                      </td>
                      <td className="p-3 font-semibold text-white">
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: CATEGORY_METADATA[r.category]?.color || '#94a3b8' }}
                        />
                        {r.category}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white">{r.kwh}</td>
                      <td className="p-3 text-right font-mono text-slate-400">{r.expectedKwh}</td>
                      <td className="p-3 text-right font-mono">
                        {isWastage ? (
                          <span className="text-amber-400 font-bold">+{excess.toFixed(2)}</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">0.00</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            r.occupancyStatus === 'Occupied'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : r.occupancyStatus === 'Low Occupancy'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {r.occupancyStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">
                        {r.isWorkingHours ? 'Working Hours' : 'After-Hours'}
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate text-[11px]">
                        {r.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-xs font-mono text-slate-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-slate-300 font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Manual Sub-Meter Entry
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter individual meter readings for localized audit verification.
            </p>

            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Time</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Appliance Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ApplianceCategory)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  {Object.keys(CATEGORY_METADATA).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Actual Measured kWh</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formKwh}
                    onChange={(e) => setFormKwh(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Expected Baseline kWh</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formExpected}
                    onChange={(e) => setFormExpected(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Occupancy Status</label>
                  <select
                    value={formOccupancy}
                    onChange={(e) => setFormOccupancy(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Occupied">Occupied</option>
                    <option value="Low Occupancy">Low Occupancy</option>
                    <option value="Unoccupied">Unoccupied</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formWorkingHours}
                      onChange={(e) => setFormWorkingHours(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 accent-cyan-500"
                    />
                    <span>Normal Working Shift</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Diagnostic Notes (Optional)</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. AC running after hours during meeting"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setIsCsvModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Batch Energy CSV Ingestion
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Upload a .csv file or paste raw comma-separated values to ingest energy records.
            </p>

            {csvError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {csvSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{csvSuccess}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select CSV File from Computer</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400">Or Paste CSV Data Directly:</label>
                  <button
                    onClick={() => setCsvText(SAMPLE_CSV_TEMPLATE)}
                    className="text-[11px] text-cyan-400 hover:underline font-mono"
                  >
                    Paste Sample Template
                  </button>
                </div>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  rows={7}
                  placeholder={`date,time,category,kwh,expectedKwh,occupancyStatus\n2026-10-01,09:00,Air Conditioning,12.5,12.0,Occupied`}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsCsvModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCsvProcess}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold"
                >
                  Process & Validate CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
