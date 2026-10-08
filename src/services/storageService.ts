import { MonthlyEnergyRecord } from '../types/electrical';

export const STORAGE_KEY = 'ai_electrical_monthly_energy_data_v1';

export const DEFAULT_MONTHLY_RECORDS: MonthlyEnergyRecord[] = [
  {
    id: 'rec-2026-05',
    month: '2026-05',
    monthLabel: 'May 2026',
    kwh: 1420,
    billAmount: 11360, // ~ ₹8.00 per unit
    voltage: 228.4,
    frequency: 49.95,
    equipmentCount: 18,
    phaseType: 'Single Phase (230V)',
    notes: 'Baseline summer period, cooling units operational.',
    createdAt: '2026-05-31T18:00:00Z',
  },
  {
    id: 'rec-2026-06',
    month: '2026-06',
    monthLabel: 'Jun 2026',
    kwh: 1680,
    billAmount: 13944, // Peak summer HVAC loads
    voltage: 224.2, // Voltage sag due to high neighborhood transformer load
    frequency: 49.88,
    equipmentCount: 20,
    phaseType: 'Single Phase (230V)',
    notes: 'Voltage dropped slightly during peak afternoon hours.',
    createdAt: '2026-06-30T18:00:00Z',
  },
  {
    id: 'rec-2026-07',
    month: '2026-07',
    monthLabel: 'Jul 2026',
    kwh: 1510,
    billAmount: 12382,
    voltage: 229.1,
    frequency: 50.02,
    equipmentCount: 20,
    phaseType: 'Single Phase (230V)',
    notes: 'Monsoon cooling demand tempered; grid voltage stabilized.',
    createdAt: '2026-07-31T18:00:00Z',
  },
  {
    id: 'rec-2026-08',
    month: '2026-08',
    monthLabel: 'Aug 2026',
    kwh: 1440,
    billAmount: 11808,
    voltage: 231.5,
    frequency: 50.05,
    equipmentCount: 21,
    phaseType: 'Single Phase (230V)',
    notes: 'Added one new backup pump; regular inspection completed.',
    createdAt: '2026-08-31T18:00:00Z',
  },
  {
    id: 'rec-2026-09',
    month: '2026-09',
    monthLabel: 'Sep 2026',
    kwh: 1390,
    billAmount: 11259,
    voltage: 230.2,
    frequency: 50.01,
    equipmentCount: 21,
    phaseType: 'Single Phase (230V)',
    notes: 'Steady operation, minimal power quality fluctuations.',
    createdAt: '2026-09-30T18:00:00Z',
  },
  {
    id: 'rec-2026-10',
    month: '2026-10',
    monthLabel: 'Oct 2026',
    kwh: 1530,
    billAmount: 12852,
    voltage: 226.8,
    frequency: 49.92,
    equipmentCount: 23,
    phaseType: 'Single Phase (230V)',
    notes: 'Slight jump in consumption due to 2 additional high-draw appliances.',
    createdAt: '2026-10-07T18:00:00Z',
  },
];

export function loadStoredMonthlyRecords(): MonthlyEnergyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveMonthlyRecords(DEFAULT_MONTHLY_RECORDS);
      return DEFAULT_MONTHLY_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored monthly energy records:', err);
  }
  return DEFAULT_MONTHLY_RECORDS;
}

export function saveMonthlyRecords(records: MonthlyEnergyRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save monthly energy records to localStorage:', err);
  }
}

export function resetToDefaultRecords(): MonthlyEnergyRecord[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MONTHLY_RECORDS));
  } catch (err) {
    console.error('Failed to reset monthly energy records:', err);
  }
  return DEFAULT_MONTHLY_RECORDS;
}
