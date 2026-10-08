export interface MonthlyEnergyRecord {
  id: string;
  month: string; // YYYY-MM or "Oct 2026"
  monthLabel: string; // e.g. "October 2026"
  kwh: number; // Electricity consumption
  billAmount: number; // Bill in Rupees (₹)
  voltage: number; // Measured voltage in Volts (e.g., 230V or 415V)
  frequency: number; // Measured frequency in Hz (nominal 50.0 Hz)
  equipmentCount: number; // Active equipment / appliances count
  phaseType: 'Single Phase (230V)' | 'Three Phase (415V)';
  notes?: string;
  createdAt: string;
}

export interface ComputedMonthlyMetric {
  record: MonthlyEnergyRecord;
  costPerKwh: number; // billAmount / kwh in ₹/kWh
  kwhPerEquipment: number; // kwh / equipmentCount
  kwhMoMChangePercent: number | null; // % change compared to previous month
  billMoMChangePercent: number | null; // % change compared to previous month
  voltageDeviationPercent: number; // % deviation from nominal (230V or 415V)
  frequencyDeviationPercent: number; // % deviation from nominal 50Hz
  estimatedWastageKwh: number; // kWh lost due to voltage stress / load anomalies
  estimatedWastageCost: number; // In ₹
  powerQualityStatus: 'Optimal' | 'Acceptable' | 'Sub-optimal' | 'Critical Warning';
  powerQualityReason: string;
}

export interface DashboardSummaryKPIs {
  totalKwh: number;
  totalBill: number;
  averageMonthlyKwh: number;
  averageMonthlyBill: number;
  latestMoMChangePercent: number | null;
  latestBillMoMChangePercent: number | null;
  totalEstimatedWastageKwh: number;
  totalEstimatedWastageCost: number;
  wastagePercentage: number;
  averageVoltage: number;
  averageFrequency: number;
  totalEquipmentTracked: number;
  avgCostPerKwh: number;
  powerQualityScore: number; // 0 - 100
  powerQualityStatus: 'Optimal' | 'Acceptable' | 'Sub-optimal' | 'Critical Warning';
  recordCount: number;
  earliestMonth: string;
  latestMonth: string;
}

export type TroubleCategory =
  | 'Breakers & Protection'
  | 'Motors & Pumps'
  | 'Wiring & Panels'
  | 'Voltage & Power Quality'
  | 'HVAC & Refrigeration'
  | 'Earthing & Safety'
  | 'Lighting & Fixtures';

export type SafetyHazardLevel = 'CRITICAL HAZARD' | 'HIGH RISK' | 'MODERATE' | 'CAUTION';

export interface TroubleshootingStep {
  step: number;
  title: string;
  detail: string;
  caution?: string;
}

export interface TroubleshootingIssue {
  id: string;
  title: string;
  category: TroubleCategory;
  symptoms: string[];
  probableCauses: string[];
  safetyLevel: SafetyHazardLevel;
  safetyWarnings: string[];
  resolutionSteps: TroubleshootingStep[];
  toolsRequired: string[];
  preventiveMaintenance: string;
  whenToCallProfessional: string;
  source?: 'Local Electrical Knowledge Base' | 'AI Diagnostics Engine';
}
