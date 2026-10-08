import {
  MonthlyEnergyRecord,
  ComputedMonthlyMetric,
  DashboardSummaryKPIs,
} from '../types/electrical';

/**
 * Calculates Month-over-Month percentage changes, cost per unit,
 * voltage deviations, power quality metrics, and estimated wastage.
 */
export function computeMonthlyMetrics(records: MonthlyEnergyRecord[]): ComputedMonthlyMetric[] {
  // Sort records chronologically by month
  const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));

  return sorted.map((rec, index) => {
    const prev = index > 0 ? sorted[index - 1] : null;

    // Cost per kWh
    const costPerKwh = rec.kwh > 0 ? Number((rec.billAmount / rec.kwh).toFixed(2)) : 0;

    // Consumption per equipment
    const kwhPerEquipment =
      rec.equipmentCount > 0 ? Number((rec.kwh / rec.equipmentCount).toFixed(1)) : 0;

    // MoM % change in kWh
    let kwhMoMChangePercent: number | null = null;
    if (prev && prev.kwh > 0) {
      kwhMoMChangePercent = Number((((rec.kwh - prev.kwh) / prev.kwh) * 100).toFixed(1));
    }

    // MoM % change in Bill Amount
    let billMoMChangePercent: number | null = null;
    if (prev && prev.billAmount > 0) {
      billMoMChangePercent = Number(
        (((rec.billAmount - prev.billAmount) / prev.billAmount) * 100).toFixed(1)
      );
    }

    // Nominal voltage based on phase type (230V for single phase, 415V for three phase)
    const nominalVoltage = rec.voltage >= 350 ? 415 : 230;
    const voltageDeviationPercent = Number(
      (((rec.voltage - nominalVoltage) / nominalVoltage) * 100).toFixed(1)
    );

    // Frequency deviation from 50.0 Hz
    const frequencyDeviationPercent = Number(
      (((rec.frequency - 50.0) / 50.0) * 100).toFixed(2)
    );

    // Power Quality Evaluation:
    // Voltage tolerance: ±6% is acceptable (IEC 60038 / Indian Electricity Rules)
    // Frequency tolerance: ±1% (49.5 to 50.5 Hz)
    const absVoltDev = Math.abs(voltageDeviationPercent);
    const absFreqDev = Math.abs(frequencyDeviationPercent);

    let powerQualityStatus: ComputedMonthlyMetric['powerQualityStatus'] = 'Optimal';
    let powerQualityReason = 'Voltage and grid frequency are operating within optimal limits.';

    if (absVoltDev > 10 || absFreqDev > 2.0) {
      powerQualityStatus = 'Critical Warning';
      powerQualityReason = `Severe voltage/frequency anomaly (${rec.voltage}V / ${rec.frequency}Hz). Equipment damage risk!`;
    } else if (absVoltDev > 6 || absFreqDev > 1.0) {
      powerQualityStatus = 'Sub-optimal';
      powerQualityReason = `Voltage variance exceeds ±6% threshold (${rec.voltage}V vs ${nominalVoltage}V standard).`;
    } else if (absVoltDev > 3 || absFreqDev > 0.5) {
      powerQualityStatus = 'Acceptable';
      powerQualityReason = 'Minor grid voltage sag or surge detected; within safe operating range.';
    }

    // Estimated Wastage Calculation:
    // 1. Voltage stress loss: When voltage drops, induction motors draw increased current (I) to deliver shaft power,
    //    increasing conductor heat loss proportional to I^2. Every 1% voltage sag increases motor losses by ~1.5%.
    let voltageLossPercent = 0;
    if (rec.voltage < nominalVoltage) {
      voltageLossPercent = Math.min(12, Math.abs(voltageDeviationPercent) * 1.4);
    } else if (rec.voltage > nominalVoltage) {
      // Overvoltage causes core saturation and iron losses
      voltageLossPercent = Math.min(8, Math.abs(voltageDeviationPercent) * 0.9);
    }

    // 2. Load anomaly factor: If kWh increased without an equipment increase or seasonal reason
    let loadAnomalyKwh = 0;
    if (prev && rec.equipmentCount <= prev.equipmentCount && rec.kwh > prev.kwh * 1.08) {
      loadAnomalyKwh = (rec.kwh - prev.kwh * 1.05) * 0.45;
    }

    // Total estimated wastage in kWh & Rupees
    const voltageWasteKwh = (rec.kwh * (voltageLossPercent / 100));
    const estimatedWastageKwh = Math.round(voltageWasteKwh + Math.max(0, loadAnomalyKwh));
    const estimatedWastageCost = Math.round(estimatedWastageKwh * costPerKwh);

    return {
      record: rec,
      costPerKwh,
      kwhPerEquipment,
      kwhMoMChangePercent,
      billMoMChangePercent,
      voltageDeviationPercent,
      frequencyDeviationPercent,
      estimatedWastageKwh,
      estimatedWastageCost,
      powerQualityStatus,
      powerQualityReason,
    };
  });
}

/**
 * Computes aggregate summary KPIs across all records for top-level dashboard metrics.
 */
export function calculateDashboardSummary(metrics: ComputedMonthlyMetric[]): DashboardSummaryKPIs {
  if (metrics.length === 0) {
    return {
      totalKwh: 0,
      totalBill: 0,
      averageMonthlyKwh: 0,
      averageMonthlyBill: 0,
      latestMoMChangePercent: null,
      latestBillMoMChangePercent: null,
      totalEstimatedWastageKwh: 0,
      totalEstimatedWastageCost: 0,
      wastagePercentage: 0,
      averageVoltage: 230,
      averageFrequency: 50.0,
      totalEquipmentTracked: 0,
      avgCostPerKwh: 0,
      powerQualityScore: 100,
      powerQualityStatus: 'Optimal',
      recordCount: 0,
      earliestMonth: 'N/A',
      latestMonth: 'N/A',
    };
  }

  const recordCount = metrics.length;
  let sumKwh = 0;
  let sumBill = 0;
  let sumVoltage = 0;
  let sumFrequency = 0;
  let sumWastageKwh = 0;
  let sumWastageCost = 0;
  let totalEquipment = 0;

  metrics.forEach((m) => {
    sumKwh += m.record.kwh;
    sumBill += m.record.billAmount;
    sumVoltage += m.record.voltage;
    sumFrequency += m.record.frequency;
    sumWastageKwh += m.estimatedWastageKwh;
    sumWastageCost += m.estimatedWastageCost;
    totalEquipment = Math.max(totalEquipment, m.record.equipmentCount);
  });

  const averageMonthlyKwh = Math.round(sumKwh / recordCount);
  const averageMonthlyBill = Math.round(sumBill / recordCount);
  const averageVoltage = Number((sumVoltage / recordCount).toFixed(1));
  const averageFrequency = Number((sumFrequency / recordCount).toFixed(2));
  const avgCostPerKwh = sumKwh > 0 ? Number((sumBill / sumKwh).toFixed(2)) : 0;
  const wastagePercentage = sumKwh > 0 ? Number(((sumWastageKwh / sumKwh) * 100).toFixed(1)) : 0;

  // Latest MoM changes
  const latestMetric = metrics[metrics.length - 1];
  const latestMoMChangePercent = latestMetric.kwhMoMChangePercent;
  const latestBillMoMChangePercent = latestMetric.billMoMChangePercent;

  // Overall Power Quality Score (0 to 100)
  // Penalize for severe voltage fluctuations and excessive wastage
  const voltagePenalty = Math.min(30, Math.abs(averageVoltage - 230) * 2.5);
  const freqPenalty = Math.min(20, Math.abs(averageFrequency - 50.0) * 35);
  const wastePenalty = Math.min(30, wastagePercentage * 2.5);
  const powerQualityScore = Math.max(40, Math.min(100, Math.round(100 - voltagePenalty - freqPenalty - wastePenalty)));

  let powerQualityStatus: DashboardSummaryKPIs['powerQualityStatus'] = 'Optimal';
  if (powerQualityScore < 60) powerQualityStatus = 'Critical Warning';
  else if (powerQualityScore < 75) powerQualityStatus = 'Sub-optimal';
  else if (powerQualityScore < 88) powerQualityStatus = 'Acceptable';

  return {
    totalKwh: Math.round(sumKwh),
    totalBill: Math.round(sumBill),
    averageMonthlyKwh,
    averageMonthlyBill,
    latestMoMChangePercent,
    latestBillMoMChangePercent,
    totalEstimatedWastageKwh: Math.round(sumWastageKwh),
    totalEstimatedWastageCost: Math.round(sumWastageCost),
    wastagePercentage,
    averageVoltage,
    averageFrequency,
    totalEquipmentTracked: totalEquipment,
    avgCostPerKwh,
    powerQualityScore,
    powerQualityStatus,
    recordCount,
    earliestMonth: metrics[0].record.monthLabel,
    latestMonth: latestMetric.record.monthLabel,
  };
}
