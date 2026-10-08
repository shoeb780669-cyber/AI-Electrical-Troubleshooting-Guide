import { EnergyRecord, ApplianceCategory, TariffConfig } from '../types/energy';

export const DEFAULT_TARIFF: TariffConfig = {
  currency: 'INR',
  currencySymbol: '₹',
  baseRatePerKwh: 8.50,
  peakRatePerKwh: 11.50, // 14:00 - 19:00
  offPeakRatePerKwh: 6.20, // 22:00 - 06:00
  useTimeOfUse: true,
  peakStartHour: 14,
  peakEndHour: 19,
  offPeakStartHour: 22,
  offPeakEndHour: 6,
};

export const CATEGORY_METADATA: Record<ApplianceCategory, { color: string; bgLight: string; icon: string; expectedIdleKwh: number; expectedActiveKwh: number }> = {
  'Air Conditioning': {
    color: '#06b6d4', // Cyan
    bgLight: 'rgba(6, 182, 212, 0.15)',
    icon: 'Snowflake',
    expectedIdleKwh: 0.8,
    expectedActiveKwh: 12.5,
  },
  'Lighting': {
    color: '#f59e0b', // Amber
    bgLight: 'rgba(245, 158, 11, 0.15)',
    icon: 'Lightbulb',
    expectedIdleKwh: 0.4,
    expectedActiveKwh: 4.8,
  },
  'Computers': {
    color: '#3b82f6', // Blue
    bgLight: 'rgba(59, 130, 246, 0.15)',
    icon: 'Monitor',
    expectedIdleKwh: 0.6,
    expectedActiveKwh: 5.5,
  },
  'Servers': {
    color: '#8b5cf6', // Violet
    bgLight: 'rgba(139, 92, 246, 0.15)',
    icon: 'Server',
    expectedIdleKwh: 3.2,
    expectedActiveKwh: 3.6,
  },
  'Printers': {
    color: '#ec4899', // Pink
    bgLight: 'rgba(236, 72, 153, 0.15)',
    icon: 'Printer',
    expectedIdleKwh: 0.1,
    expectedActiveKwh: 1.2,
  },
  'Kitchen Equipment': {
    color: '#10b981', // Emerald
    bgLight: 'rgba(16, 185, 129, 0.15)',
    icon: 'Coffee',
    expectedIdleKwh: 0.2,
    expectedActiveKwh: 2.4,
  },
  'Other Appliances': {
    color: '#64748b', // Slate
    bgLight: 'rgba(100, 116, 139, 0.15)',
    icon: 'Cpu',
    expectedIdleKwh: 0.3,
    expectedActiveKwh: 1.8,
  },
};

/**
 * Generates a realistic 7-day dataset simulating Amjad Ali Khan College of Business Administration
 * or a typical corporate business floor (e.g. 50 occupants, 10,000 sq ft).
 */
export function generateRealisticDemoData(): EnergyRecord[] {
  const records: EnergyRecord[] = [];
  const categories: ApplianceCategory[] = [
    'Air Conditioning',
    'Lighting',
    'Computers',
    'Servers',
    'Printers',
    'Kitchen Equipment',
    'Other Appliances',
  ];

  // 7 days: Monday 2026-10-01 to Sunday 2026-10-07
  const baseDate = new Date('2026-10-01T00:00:00');

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + dayOffset);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (let hour = 0; hour < 24; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      const isWorkingHours = !isWeekend && hour >= 9 && hour <= 18;
      
      let occupancyStatus: 'Occupied' | 'Unoccupied' | 'Low Occupancy' = 'Unoccupied';
      if (isWorkingHours) {
        occupancyStatus = (hour >= 10 && hour <= 16) ? 'Occupied' : 'Low Occupancy';
      } else if (!isWeekend && (hour === 8 || hour === 19 || hour === 20)) {
        occupancyStatus = 'Low Occupancy';
      }

      // Generate for each category or grouped representative records
      for (const cat of categories) {
        const meta = CATEGORY_METADATA[cat];
        let expected = isWorkingHours ? meta.expectedActiveKwh : meta.expectedIdleKwh;
        
        // Servers run 24/7 baseline
        if (cat === 'Servers') {
          expected = 3.4;
        }

        let actual = expected;
        let notes: string | undefined = undefined;

        // Realistic variations & anomalies for Business Analytics investigation:
        if (isWorkingHours) {
          // Normal business operation with slight natural variance (+/- 10%)
          const variance = 1 + (Math.sin(hour + dayOffset) * 0.12);
          actual = Number((expected * variance).toFixed(2));
        } else {
          // Off-hours base load
          actual = Number((meta.expectedIdleKwh * (1 + (Math.random() * 0.15))).toFixed(2));

          // Injected Real-world business wastage scenarios:
          // Anomaly 1: AC left running on Tuesday night (dayOffset = 1, hour 20-03)
          if (dayOffset === 1 && cat === 'Air Conditioning' && (hour >= 20 || hour <= 3)) {
            actual = Number((9.8 + Math.random() * 1.5).toFixed(2));
            notes = 'Anomaly: AC left ON in conference room while building unoccupied';
          }

          // Anomaly 2: Computer labs not powered down on Thursday night (dayOffset = 3, hour 19-23)
          if (dayOffset === 3 && cat === 'Computers' && hour >= 19 && hour <= 23) {
            actual = Number((4.6 + Math.random() * 0.8).toFixed(2));
            notes = 'Anomaly: 24 desktop systems left on high performance standby overnight';
          }

          // Anomaly 3: Weekend lighting left on Saturday afternoon (dayOffset = 5, hour 12-18)
          if (dayOffset === 5 && cat === 'Lighting' && hour >= 12 && hour <= 18) {
            actual = Number((3.9 + Math.random() * 0.5).toFixed(2));
            notes = 'Anomaly: High-intensity hallway floodlights illuminated on empty floor';
          }

          // Anomaly 4: Standby printers and water dispensers on Sunday (dayOffset = 6, hour 02-06)
          if (dayOffset === 6 && cat === 'Other Appliances' && hour >= 2 && hour <= 6) {
            actual = Number((1.4 + Math.random() * 0.3).toFixed(2));
            notes = 'Standby drain: Water heaters and legacy transformers drawing power';
          }
        }

        // Add small rounding
        actual = Math.max(0.05, Number(actual.toFixed(2)));
        expected = Math.max(0.05, Number(expected.toFixed(2)));

        records.push({
          id: `rec-${dateStr}-${hour}-${cat.replace(/\s+/g, '').toLowerCase()}`,
          date: dateStr,
          time: timeStr,
          hour,
          kwh: actual,
          category: cat,
          occupancyStatus,
          isWorkingHours,
          expectedKwh: expected,
          notes,
        });
      }
    }
  }

  return records;
}

export const INITIAL_DEMO_RECORDS: EnergyRecord[] = generateRealisticDemoData();

export const SAMPLE_CSV_TEMPLATE = `date,time,category,kwh,expectedKwh,occupancyStatus,isWorkingHours,notes
2026-10-01,09:00,Air Conditioning,12.5,12.0,Occupied,true,Normal morning AC
2026-10-01,09:00,Lighting,4.6,4.5,Occupied,true,Office lighting active
2026-10-01,09:00,Computers,5.2,5.0,Occupied,true,Workstations active
2026-10-01,09:00,Servers,3.5,3.4,Occupied,true,Server rack normal
2026-10-01,21:00,Air Conditioning,10.2,0.8,Unoccupied,false,AC running after-hours
2026-10-01,22:00,Lighting,3.4,0.4,Unoccupied,false,Hallway lights left ON
2026-10-01,23:00,Computers,4.1,0.6,Unoccupied,false,PCs left awake overnight`;
