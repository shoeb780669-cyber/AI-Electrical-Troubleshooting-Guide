export type ApplianceCategory = 
  | 'Air Conditioning'
  | 'Lighting'
  | 'Computers'
  | 'Servers'
  | 'Printers'
  | 'Kitchen Equipment'
  | 'Other Appliances';

export interface EnergyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:00
  hour: number; // 0-23
  kwh: number;
  category: ApplianceCategory;
  occupancyStatus: 'Occupied' | 'Unoccupied' | 'Low Occupancy';
  isWorkingHours: boolean; // true if 09:00 - 18:00 on weekdays
  expectedKwh: number; // Baseline benchmark
  notes?: string;
}

export interface TariffConfig {
  currency: string;
  currencySymbol: string;
  baseRatePerKwh: number;
  peakRatePerKwh: number;
  offPeakRatePerKwh: number;
  useTimeOfUse: boolean;
  peakStartHour: number; // e.g. 14
  peakEndHour: number; // e.g. 19
  offPeakStartHour: number; // e.g. 22
  offPeakEndHour: number; // e.g. 6
}

export interface WastageIssue {
  id: string;
  date: string;
  time: string;
  category: ApplianceCategory;
  actualKwh: number;
  expectedKwh: number;
  excessKwh: number;
  costImpact: number;
  severity: 'High' | 'Medium' | 'Low';
  reason: string;
  recommendedAction: string;
  resolved?: boolean;
}

export interface ActionPlanItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  issue: string;
  action: string;
  category: ApplianceCategory;
  potentialImpact: 'High' | 'Medium' | 'Low';
  estimatedMonthlySaving: number;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface KPIStats {
  totalKwh: number;
  totalCost: number;
  potentialWastageKwh: number;
  potentialWastageCost: number;
  wastagePercentage: number;
  efficiencyScore: number;
  potentialMonthlySavings: number;
  avgDailyKwh: number;
  avgHourlyKwh: number;
  peakKwh: number;
  minKwh: number;
  afterHoursKwh: number;
  afterHoursCost: number;
  afterHoursWastageKwh: number;
  topWastageCategory: string;
  co2EmissionsKg: number;
  recordCount: number;
  dateRange: { start: string; end: string };
  currencySymbol?: string;
}

export interface CategoryBreakdown {
  category: ApplianceCategory;
  kwh: number;
  percentage: number;
  cost: number;
  wastageKwh: number;
  wastageCost: number;
  aiInsight: string;
  recommendation: string;
  color: string;
}

export interface EfficiencyBreakdown {
  overall: number;
  consumptionEfficiency: number;
  afterHoursDiscipline: number;
  wastageControl: number;
  peakLoadManagement: number;
  categoryBalance: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: ApplianceCategory;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  action: string;
  estimatedSavingKwh: number;
  estimatedSavingCost: number;
  co2ReductionKg: number;
  implementationEase: 'Immediate' | 'Short-Term' | 'Strategic';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  dataPoints?: {
    metric: string;
    value: string;
  }[];
  isAiGenerated?: boolean;
  source?: 'Local Analytics Engine' | 'Gemini AI';
}
