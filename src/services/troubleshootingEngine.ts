import {
  TroubleshootingIssue,
  TroubleCategory,
  SafetyHazardLevel,
} from '../types/electrical';

export const ELECTRICAL_KNOWLEDGE_BASE: TroubleshootingIssue[] = [
  {
    id: 'issue-mcb-trip',
    title: 'Frequent MCB / Circuit Breaker Tripping',
    category: 'Breakers & Protection',
    symptoms: [
      'Circuit breaker trips immediately upon turning on an appliance',
      'Breaker trips after 10-20 minutes of running air conditioner or water heater',
      'Breaker switch feels warm to touch or loose',
    ],
    probableCauses: [
      'Circuit overload exceeding rated amperes (e.g., 16A breaker loaded with > 3.6 kW)',
      'Short circuit caused by damaged wire insulation or appliance heating element failure',
      'Loose terminal screw inside distribution box causing localized thermal heating',
      'Aging, worn-out, or weak bimetallic strip inside the MCB',
    ],
    safetyLevel: 'HIGH RISK',
    safetyWarnings: [
      'NEVER repeatedly force or tape a tripped circuit breaker into the ON position.',
      'NEVER replace an MCB with a higher ampere rating (e.g., swapping 16A with 32A) without upgrading the cable gauge, as this creates a serious fire hazard.',
      'Before opening any distribution panel, isolate the upstream main breaker and verify zero voltage using a calibrated non-contact voltage detector.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Unplug and Isolate Connected Loads',
        detail:
          'Disconnect all appliances and electronic devices plugged into the affected circuit. Switch off all wall outlets.',
      },
      {
        step: 2,
        title: 'Reset Breaker and Test No-Load State',
        detail:
          'Firmly flip the MCB lever to full OFF, then switch to ON. If it trips immediately with zero load connected, suspect a direct short circuit in the internal wall wiring or a faulty MCB.',
        caution: 'Stand to the side of the panel door when resetting high-current breakers to avoid arc flash exposure.',
      },
      {
        step: 3,
        title: 'Sequential Load Reconnection (Half-Split Method)',
        detail:
          'Plug in and power on devices one by one. The specific appliance that causes the breaker to trip immediately possesses an internal fault (shorted capacitor, failed motor winding, or grounded heater).',
      },
      {
        step: 4,
        title: 'Inspect Terminal Tightness with Insulated Screwdriver',
        detail:
          'With main power de-energized and locked out, verify terminal screws on the MCB. Loose copper connections cause resistive heating that trips thermal overload mechanisms.',
      },
    ],
    toolsRequired: ['True-RMS Clamp Multimeter', 'Insulated Screwdriver (1000V rated)', 'Non-Contact Voltage Detector'],
    preventiveMaintenance:
      'Balance electrical loads across circuits; do not daisy-chain heavy heaters or air conditioners onto multi-plug extension strips.',
    whenToCallProfessional:
      'If the breaker trips with all appliances unplugged, if there is a burnt plastic odor, or if sparking occurs inside the panel box.',
  },
  {
    id: 'issue-voltage-fluctuation',
    title: 'Voltage Fluctuations, Dips & Flickering Lights',
    category: 'Voltage & Power Quality',
    symptoms: [
      'LED lights dim, buzz, or flicker rapidly when high-draw equipment kicks on',
      'Air conditioners or refrigerators cut out on low-voltage error codes (E1/E2)',
      'Multimeter reading drops below 205V or spikes above 250V on single phase',
    ],
    probableCauses: [
      'Loose or corroded Neutral wire connection at the main service entrance or energy meter',
      'High inrush starting current (Locked Rotor Amperes) from heavy compressors on undersized wiring',
      'Overloaded neighborhood distribution transformer or phase unbalance in grid lines',
      'High impedance in internal building wiring from undersized cable runs (> 3% voltage drop)',
    ],
    safetyLevel: 'CRITICAL HAZARD',
    safetyWarnings: [
      'A floating or loose Neutral wire can cause line voltage to surge up to 400V across single-phase appliances, causing fires and exploding capacitors!',
      'Wear insulated dielectric safety footwear and eye protection when checking distribution boards.',
      'Do not touch exposed copper neutral links with bare hands—a disconnected neutral carries dangerous return current.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Measure Line-to-Neutral & Line-to-Earth Voltage',
        detail:
          'Set a digital multimeter to AC Voltage (750V range). Measure between Phase and Neutral (nominal 230V ±6%). Measure Phase to Earth (should match P-N). Measure Neutral to Earth (must be < 2V to 3V).',
      },
      {
        step: 2,
        title: 'Identify Load-Correlation Timing',
        detail:
          'Observe if voltage dips specifically when a water pump, AC compressor, or welding machine starts. If so, inspect wire gauge and consider installing a hard-start capacitor kit or soft starter.',
      },
      {
        step: 3,
        title: 'Inspect Neutral Terminal Block and Busbars',
        detail:
          'Power down the facility and inspect the main neutral busbar. Look for black carbon discoloration, melted PVC insulation, or loose lug crimps.',
        caution: 'Ensure total isolation before tightening lugs with torque-rated tools.',
      },
      {
        step: 4,
        title: 'Install Voltage Protection Relay or Automatic Voltage Stabilizer (AVS)',
        detail:
          'For sensitive electronics and refrigeration units, deploy an Under/Over Voltage Protection relay (UV/OV) set to trip below 190V and above 260V with a 3-minute delay timer.',
      },
    ],
    toolsRequired: ['Digital True-RMS Multimeter', 'Infrared Thermal Thermometer', 'Phase Rotation Tester'],
    preventiveMaintenance:
      'Conduct annual thermal scanning of busbars and upgrade incoming wire to a minimum of 10 sq.mm for high-draw facilities.',
    whenToCallProfessional:
      'Immediately if Neutral-to-Earth voltage exceeds 5V, or if light bulbs glow unusually bright (indicates floating neutral phase shift).',
  },
  {
    id: 'issue-motor-overheating',
    title: 'Electric Motor / Pump Overheating & Humming',
    category: 'Motors & Pumps',
    symptoms: [
      'Motor refuses to rotate and produces a loud humming/buzzing sound',
      'Motor housing temperature exceeds 75°C and trips thermal overload relay',
      'Burning enamel smell from motor end-bell',
      'Current draw on clamp meter is 3x to 5x higher than nameplate Full Load Amperes (FLA)',
    ],
    probableCauses: [
      'Single-phasing condition (one phase missing in 3-phase motor supply)',
      'Defective, shorted, or open run/start capacitor on single-phase motor',
      'Mechanical bearing seizure, impeller jamming, or debris obstruction',
      'Low supply voltage forcing higher current draw to maintain torque output',
    ],
    safetyLevel: 'HIGH RISK',
    safetyWarnings: [
      'Disconnect power immediately when a motor hums without rotating; locked rotor current can burn motor windings within 30 seconds.',
      'DISCHARGE all motor start and run capacitors using a 20k-ohm 5W resistor before touching terminals. Charged capacitors can deliver lethal shocks even when unplugged!',
      'Ensure lockout-tagout (LOTO) is enforced on motor starter disconnect before inspecting mechanical shafts.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Immediate Power Isolation & Shaft Freedom Check',
        detail:
          'Turn off motor starter switch. With power strictly OFF, attempt to rotate motor shaft/fan by hand using insulated gloves. The shaft must spin freely without grinding or axial play.',
      },
      {
        step: 2,
        title: 'Test Start/Run Capacitor (Single Phase Motors)',
        detail:
          'Discharge capacitor safely. Disconnect one wire and set multimeter to Capacitance (μF) mode. Compare reading to capacitor label rating (e.g., 36μF ±5%). A swollen or ruptured capacitor body confirms failure.',
      },
      {
        step: 3,
        title: 'Verify Phase Voltages & Balance (3-Phase Motors)',
        detail:
          'Check voltage between all three phases: L1-L2, L2-L3, L3-L1. Voltage imbalance must not exceed 2%. A blown fuse on one phase causes deadly single-phasing.',
      },
      {
        step: 4,
        title: 'Perform Insulation Resistance (Megger) Test',
        detail:
          'Use a 500V insulation resistance tester between each winding terminal and the motor chassis ground. Reading must exceed 1.0 Mega-ohm. Lower values indicate degraded varnish insulation.',
      },
    ],
    toolsRequired: ['Multimeter with Capacitance (μF) setting', '500V Insulation Resistance Megger', 'AC Clamp Meter'],
    preventiveMaintenance:
      'Lubricate motor bearings according to manufacturer intervals; inspect cooling fan shroud for dust accumulation.',
    whenToCallProfessional:
      'If winding resistance between phases is unbalanced, or if Megger test registers < 1.0 MΩ (requires winding rewinding).',
  },
  {
    id: 'issue-earthing-shock',
    title: 'Electric Shock or Tingle from Appliance Metal Body',
    category: 'Earthing & Safety',
    symptoms: [
      'Tingling sensation or static shock when touching refrigerator, washing machine, or computer casing',
      'Voltage measured between appliance metal body and floor or water tap',
      'RCCB / ELCB fails to trip during leakage condition',
    ],
    probableCauses: [
      'Broken or disconnected Earth/Ground conductor in the 3-pin plug or wall socket',
      'Dry, corroded, or disconnected Earth Pit (Earth electrode resistance > 5 ohms)',
      'Internal insulation breakdown in appliance heating element, compressor, or EMI filter',
      'Absent or bypassed Residual Current Circuit Breaker (RCCB / ELCB)',
    ],
    safetyLevel: 'CRITICAL HAZARD',
    safetyWarnings: [
      'THIS IS A LETHAL SHOCK HAZARD. Current as low as 30mA passing through the chest can cause ventricular fibrillation and death.',
      'IMMEDIATELY unplug the offending appliance from mains power.',
      'DO NOT use bare hands or wet feet to test if a shock is present. Always test with a calibrated multimeter set to AC volts.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Isolate Appliance & Verify Wall Socket Grounding',
        detail:
          'Unplug appliance. Test wall receptacle with a 3-pin socket tester or multimeter. Measure AC voltage between Phase and Earth (must equal Phase to Neutral, ~230V). Measure Neutral to Earth (must be < 2V).',
      },
      {
        step: 2,
        title: 'Check Appliance Plug Earth Pin Continuity',
        detail:
          'Set multimeter to Continuity/Resistance mode (Ω). Place one probe on the appliance plug’s large earth pin, and the other on the metal chassis. Resistance must be virtually 0.0 ohms (< 0.2 Ω).',
      },
      {
        step: 3,
        title: 'Test Residual Current Circuit Breaker (RCCB)',
        detail:
          'Press the monthly "T" (Test) push-button on your distribution board RCCB. It must snap open instantly. If it fails to trip, the RCCB mechanism is jammed and offers zero personal protection.',
        caution: 'Replace faulty RCCBs immediately with a 30mA sensitivity rating for domestic/office spaces.',
      },
      {
        step: 4,
        title: 'Inspect Earth Electrode Pit Resistance',
        detail:
          'Locate the external earth pit. Check if copper grounding clamp is oxidized or loose. In dry climates, pour water with conductive bentonite or charcoal/salt solution to reduce soil resistance.',
      },
    ],
    toolsRequired: ['Digital Multimeter', '3-Pin Receptacle Wiring Tester', 'Earth Resistance Clamp Tester'],
    preventiveMaintenance:
      'Test all RCCB test buttons monthly; verify earth pit resistance is under 2.0 to 5.0 ohms annually.',
    whenToCallProfessional:
      'Immediately if you feel continuous shocks, if wall socket earth pin has no continuity, or if the main earth pit has broken cables.',
  },
  {
    id: 'issue-hot-switchboard',
    title: 'Hot Switchboard, Burning Plastic Smell & Scorched Wires',
    category: 'Wiring & Panels',
    symptoms: [
      'Switch plate feels distinctly warm or hot to the palm',
      'Pungent, fishy, or burning plastic odor near electrical panel or socket',
      'Black soot marks, discoloration, or melting around plug pin receptacles',
    ],
    probableCauses: [
      'Loose screw terminal creating high contact resistance (I²R localized heating)',
      'Undersized wire gauge (e.g. 1.0 sq.mm wire used for a 15A water heater or heavy heater)',
      'Overcrowded junction box with poor heat dissipation',
      'Corroded brass spring contacts inside the wall socket',
    ],
    safetyLevel: 'CRITICAL HAZARD',
    safetyWarnings: [
      'IMMINENT FIRE HAZARD. Loose electrical connections can reach temperatures exceeding 350°C and ignite surrounding wall materials.',
      'IMMEDIATELY switch off the dedicated circuit breaker or master isolation switch.',
      'Do not throw water on electrical fires—use only CO2 or Dry Chemical Powder (DCP) Class C/E extinguishers.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'De-energize Circuit at Main Panel',
        detail:
          'Locate the branch breaker feeding the affected switchboard and turn it OFF. Test with a non-contact voltage pen to verify conductors are completely dead.',
      },
      {
        step: 2,
        title: 'Remove Faceplate and Visually Inspect',
        detail:
          'Unscrew the switchboard faceplate. Inspect for burnt insulation, brittle copper conductors, melted plastic bodies, or loose screw terminals.',
      },
      {
        step: 3,
        title: 'Cut Back Heat-Damaged Copper & Replace Switch/Socket',
        detail:
          'Never re-tighten annealed, oxidized, or blackened copper wire. Cut back the cable to clean, bright copper. Strip 10mm of fresh insulation and replace the damaged switch with a high-grade polycarbonate fire-retardant unit.',
      },
      {
        step: 4,
        title: 'Check Load vs Conductor Cross-Section Area',
        detail:
          'Verify conductor sizing: Lighting/Fans (1.5 sq.mm), General Plugs (2.5 sq.mm), Heavy Power Plugs like AC/Geysers (4.0 sq.mm minimum copper).',
      },
    ],
    toolsRequired: ['Non-Contact Voltage Detector', 'Wire Strippers', 'Insulated Screwdriver Set', 'Infrared Thermometer'],
    preventiveMaintenance:
      'Perform periodic thermal scanning of electrical distribution panels; avoid multi-pin adapters on 15A power sockets.',
    whenToCallProfessional:
      'If burning odor originates inside walls, if main meter wiring is scorched, or if cables cannot be safely cut back.',
  },
  {
    id: 'issue-high-bill-wastage',
    title: 'Unexplained Spike in Monthly Electricity Bill',
    category: 'Voltage & Power Quality',
    symptoms: [
      'Monthly bill or kWh consumption jumps by > 20% without adding new equipment',
      'Electricity meter LED pulses rapidly even when all visible appliances are switched off',
      'High monthly bill despite low facility occupancy or normal shift hours',
    ],
    probableCauses: [
      'Continuous underground or wall cable leakage to ground bypassing unmonitored circuits',
      'Faulty refrigerator or freezer door gasket causing compressor to run 24/7 without cycling',
      'Submersible water pump running dry or defective automatic float switch stuck in ON position',
      'Water heater / geyser thermostat stuck closed, boiling water through pressure release valve',
      'Poor power factor or high reactive power drawn by aging motor capacitors',
    ],
    safetyLevel: 'MODERATE',
    safetyWarnings: [
      'Do not touch utility energy meter seals or service entrance cables—tampering is illegal and dangerous.',
      'Exercise caution when checking water heaters or submerged pump tanks; isolate power before inspecting floats.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Conduct The Whole-House Zero-Load Meter Test',
        detail:
          'Turn off every switch and unplug every device in the facility. Go to the main utility energy meter. The impulse LED (imp/kWh) should stop flashing completely. If it continues blinking, there is a wiring leakage to earth or unauthorized load tapping.',
      },
      {
        step: 2,
        title: 'Inspect Thermostatic Appliances for Continuous Run',
        detail:
          'Check refrigerators, deep freezers, and water heaters. Place your hand near the compressor; if it is scorching hot and runs uninterrupted for hours, replace the thermostat or door magnetic seal.',
      },
      {
        step: 3,
        title: 'Measure Individual Circuit Current with Clamp Meter',
        detail:
          'Clamp individual branch phase conductors at the distribution board during after-hours to detect phantom standby drains or stuck pumps.',
      },
      {
        step: 4,
        title: 'Audit Effective Tariff Surcharges & Power Factor',
        detail:
          'Check utility bill line items. In commercial meters, a low power factor (< 0.85) attracts heavy monthly penalty surcharges.',
      },
    ],
    toolsRequired: ['AC True-RMS Clamp Meter', 'Plug-in Kill-A-Watt Power Meter', 'Thermal Leak Detector'],
    preventiveMaintenance:
      'Install smart digital sub-meters; replace worn refrigerator gaskets; service AC air filters monthly to reduce compressor load by 15%.',
    whenToCallProfessional:
      'If the meter continues registering units with all branch breakers turned off (faulty utility meter or service leak).',
  },
  {
    id: 'issue-hvac-compressor-fail',
    title: 'Air Conditioner Blowing Warm Air / Compressor Failing to Start',
    category: 'HVAC & Refrigeration',
    symptoms: [
      'Indoor blower fan runs normally, but outdoor compressor unit does not kick on',
      'Outdoor unit makes a sharp clicking sound followed by a quiet hum every 2 minutes',
      'Room temperature does not drop despite thermostat set to 20°C',
    ],
    probableCauses: [
      'Blown dual run capacitor (Hermetic terminal open or degraded μF value)',
      'Low line voltage (< 200V) triggering internal compressor thermal overload protection',
      'Pitted, burnt, or stuck magnetic contactor points in outdoor condenser',
      'Refrigerant loss causing low-pressure safety switch cutoff',
    ],
    safetyLevel: 'HIGH RISK',
    safetyWarnings: [
      'Air conditioner dual capacitors store up to 450V DC and must be discharged safely with an insulated resistor before handling.',
      'Rotating condenser fan blades can cause severe injury; isolate outdoor isolator switch before removing sheet metal panels.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Check Line Voltage Under Compressor Attempt',
        detail:
          'Measure AC voltage at outdoor unit disconnect switch. If voltage drops from 230V to < 195V when the compressor attempts to start, line conductors are undersized or neighborhood grid is sagging.',
      },
      {
        step: 2,
        title: 'Inspect Dual Run Capacitor Terminals',
        detail:
          'De-energize unit. Discharge capacitor. Inspect top dome for bulging or oil leakage. Measure capacitance between C (Common) and HERM with multimeter. If reading is > 10% below rated μF, replace immediately.',
      },
      {
        step: 3,
        title: 'Examine Outdoor Contactor & 24V Control Signal',
        detail:
          'Inspect contactor contacts for black pitting or insect intrusion (ants frequently bridge contactor contacts).',
      },
    ],
    toolsRequired: ['Multimeter with Capacitance & AC Volts', 'Insulated Capacitor Discharge Tool', 'Nut Driver Set'],
    preventiveMaintenance:
      'Wash condenser coils quarterly to maintain proper heat exchange and reduce compressor discharge head pressure.',
    whenToCallProfessional:
      'If capacitor and voltage test normal but compressor remains seized (requires hard-start kit or compressor replacement).',
  },
  {
    id: 'issue-power-factor-penalty',
    title: 'Low Power Factor Penalty on Commercial Electricity Bill',
    category: 'Voltage & Power Quality',
    symptoms: [
      'Electricity bill contains extra charges labeled "Low PF Penalty" or "kVAh billing surge"',
      'Power factor measured on panel power analyzer is < 0.85 lag',
      'Transformers and busbars running hotter than normal under inductive loads',
    ],
    probableCauses: [
      'Inductive loads (induction motors, air conditioners, welding machines, transformers) operating without capacitor compensation',
      'Failed capacitors in Automatic Power Factor Correction (APFC) panel',
      'Blown HRC fuses on capacitor banks or faulty APFC relay controller',
    ],
    safetyLevel: 'MODERATE',
    safetyWarnings: [
      'Capacitor banks store massive electrical energy! Always wait 5 minutes after de-energizing and verify residual voltage < 50V before touching APFC terminals.',
      'Ensure discharge resistors are intact across all power capacitor terminals.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Check APFC Relay Controller Display',
        detail:
          'Observe target PF setting (should be set to 0.98 or 0.99 lag). Check current power factor reading on all three phases.',
      },
      {
        step: 2,
        title: 'Test Current on Each Capacitor Step',
        detail:
          'With capacitors energized, use an AC clamp meter to measure current on all 3 phases of each capacitor bank. Compare measured current against rated capacitor current: I = kVAr / (1.732 * kV). Zero current indicates blown HRC fuse or defective contactor.',
      },
      {
        step: 3,
        title: 'Inspect Capacitor Bank Swelling and Vent Plugs',
        detail:
          'Power off and isolate APFC panel. Check each cylindrical/box capacitor for bulging tops or ruptured pressure-sensitive disconnectors.',
      },
    ],
    toolsRequired: ['AC Clamp Meter', 'Power Quality Analyzer', 'Torque Wrench'],
    preventiveMaintenance:
      'Audit APFC panel capacitors every 6 months; replace aging units that have lost > 10% rated kVAr.',
    whenToCallProfessional:
      'For designing tuned harmonic detuning reactors if VFDs and non-linear electronics exceed 25% of facility load.',
  },
];

/**
 * Searches and matches issues based on text query and category.
 */
export function searchTroubleshootingKnowledge(
  query: string,
  categoryFilter?: TroubleCategory | 'All'
): TroubleshootingIssue[] {
  const cleanQ = query.toLowerCase().trim();

  return ELECTRICAL_KNOWLEDGE_BASE.filter((issue) => {
    const matchesCategory =
      !categoryFilter || categoryFilter === 'All' || issue.category === categoryFilter;

    if (!cleanQ) return matchesCategory;

    const inTitle = issue.title.toLowerCase().includes(cleanQ);
    const inSymptoms = issue.symptoms.some((s) => s.toLowerCase().includes(cleanQ));
    const inCauses = issue.probableCauses.some((c) => c.toLowerCase().includes(cleanQ));
    const inCategory = issue.category.toLowerCase().includes(cleanQ);
    const inWarnings = issue.safetyWarnings.some((w) => w.toLowerCase().includes(cleanQ));

    return matchesCategory && (inTitle || inSymptoms || inCauses || inCategory || inWarnings);
  });
}

/**
 * Intelligent Fallback & Dynamic Query Resolver:
 * Takes any user-entered electrical problem description and generates
 * structured causes, safety warnings, and step-by-step resolution.
 */
export async function resolveElectricalIssueWithAI(
  userQuery: string,
  categoryFilter?: TroubleCategory | 'All'
): Promise<TroubleshootingIssue> {
  const q = userQuery.trim();

  // 1. Try Google Gemini API if key is available in Vite environment
  const apiKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;

  if (apiKey && q.length > 5) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a certified master electrical engineer and industrial safety consultant for the "AI Electrical Troubleshooting Guide".
Analyze this electrical problem entered by the user: "${q}"

Respond strictly with a valid JSON object matching this schema:
{
  "title": "Clear diagnostic title",
  "category": "One of: Breakers & Protection, Motors & Pumps, Wiring & Panels, Voltage & Power Quality, HVAC & Refrigeration, Earthing & Safety, Lighting & Fixtures",
  "safetyLevel": "One of: CRITICAL HAZARD, HIGH RISK, MODERATE, CAUTION",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "probableCauses": ["Cause 1", "Cause 2", "Cause 3", "Cause 4"],
  "safetyWarnings": ["Mandatory Safety Rule 1 (PPE, LOTO, de-energization)", "Safety Warning 2", "Safety Warning 3"],
  "resolutionSteps": [
    {"step": 1, "title": "Step 1 Title", "detail": "Detailed practical step instructions", "caution": "Specific safety check"},
    {"step": 2, "title": "Step 2 Title", "detail": "Detailed practical step instructions"},
    {"step": 3, "title": "Step 3 Title", "detail": "Detailed practical step instructions"},
    {"step": 4, "title": "Step 4 Title", "detail": "Detailed practical step instructions"}
  ],
  "toolsRequired": ["Tool 1", "Tool 2", "Tool 3"],
  "preventiveMaintenance": "Practical preventive maintenance tip",
  "whenToCallProfessional": "Exact criteria when a licensed electrician must be called"
}
Do NOT include markdown formatting or backticks around the json, return pure raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        const textClean = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textClean);
        return {
          id: `ai-${Date.now()}`,
          title: parsed.title || q,
          category: parsed.category || 'Wiring & Panels',
          safetyLevel: parsed.safetyLevel || 'HIGH RISK',
          symptoms: parsed.symptoms || [q],
          probableCauses: parsed.probableCauses || ['Internal circuit overload or component fault'],
          safetyWarnings: parsed.safetyWarnings || [
            'Always isolate master breaker before opening panels.',
            'Wear insulated dielectric footwear and goggles.',
          ],
          resolutionSteps: parsed.resolutionSteps || [
            {
              step: 1,
              title: 'Isolate Power Supply',
              detail: 'Shut down the branch circuit breaker.',
            },
          ],
          toolsRequired: parsed.toolsRequired || ['Digital Multimeter', 'Insulated Screwdriver'],
          preventiveMaintenance: parsed.preventiveMaintenance || 'Conduct regular thermal checks.',
          whenToCallProfessional:
            parsed.whenToCallProfessional || 'If symptoms persist or burning smell occurs.',
          source: 'AI Diagnostics Engine',
        };
      }
    } catch {
      // Fallback seamlessly to local electrical heuristic solver
    }
  }

  // 2. High-precision Local Heuristic Matching
  const matches = searchTroubleshootingKnowledge(q, categoryFilter);
  if (matches.length > 0) {
    return matches[0];
  }

  // 3. Dynamic Domain Rule Solver for Unmatched Queries
  const lower = q.toLowerCase();
  let detectedCategory: TroubleCategory = 'Wiring & Panels';
  let safety: SafetyHazardLevel = 'HIGH RISK';

  if (lower.includes('breaker') || lower.includes('mcb') || lower.includes('fuse') || lower.includes('trip')) {
    detectedCategory = 'Breakers & Protection';
    safety = 'HIGH RISK';
  } else if (lower.includes('motor') || lower.includes('pump') || lower.includes('fan') || lower.includes('shaft')) {
    detectedCategory = 'Motors & Pumps';
    safety = 'HIGH RISK';
  } else if (lower.includes('shock') || lower.includes('earth') || lower.includes('ground') || lower.includes('leak')) {
    detectedCategory = 'Earthing & Safety';
    safety = 'CRITICAL HAZARD';
  } else if (lower.includes('volt') || lower.includes('flicker') || lower.includes('surge') || lower.includes('bill')) {
    detectedCategory = 'Voltage & Power Quality';
    safety = 'HIGH RISK';
  } else if (lower.includes('ac') || lower.includes('cooler') || lower.includes('compressor') || lower.includes('refrigerat')) {
    detectedCategory = 'HVAC & Refrigeration';
    safety = 'MODERATE';
  }

  return {
    id: `custom-${Date.now()}`,
    title: `Diagnostic Protocol: ${q.charAt(0).toUpperCase() + q.slice(0, 50)}`,
    category: detectedCategory,
    symptoms: [
      `User reported issue: "${q}"`,
      'Abnormal operation or erratic electrical behavior detected on circuit',
      'Possible excess current draw or high resistance contact',
    ],
    probableCauses: [
      'Loose wiring screw terminal causing localized resistive heating',
      'Overcurrent or inrush load exceeding circuit conductor capacity',
      'Degraded insulation or partial ground fault in appliance assembly',
      'Transient grid voltage sag or phase imbalance',
    ],
    safetyLevel: safety,
    safetyWarnings: [
      'LOCKOUT / TAGOUT: Turn off the main electrical isolator before physically touching conductors or opening enclosure boxes.',
      'ZERO-VOLTAGE TEST: Always verify absence of voltage across all phases and neutral with a certified multimeter or voltage pen.',
      'NEVER bypass safety devices, bridge fuses with copper strands, or oversize breakers.',
      'Wear safety glasses and insulated 1000V rated hand tools when performing diagnostics.',
    ],
    resolutionSteps: [
      {
        step: 1,
        title: 'Step 1: Safely De-energize and Visually Inspect',
        detail:
          `Disconnect the affected equipment from mains power. Perform a detailed visual inspection for black soot, discoloration, brittle insulation, or burning smell related to: "${q}".`,
        caution: 'Do not touch metallic enclosures if tingling sensation was reported without verifying grounding.',
      },
      {
        step: 2,
        title: 'Step 2: Voltage and Polarity Measurement',
        detail:
          'Using a digital multimeter set to AC Volts, measure line-to-neutral (230V nominal) and neutral-to-earth (< 2V nominal) at the supply point to verify power quality.',
      },
      {
        step: 3,
        title: 'Step 3: Insulation & Continuity Verification',
        detail:
          'Measure resistance between Phase, Neutral, and Equipment Earth. Verify continuity of the protective earth conductor from plug pin to metallic casing.',
      },
      {
        step: 4,
        title: 'Step 4: Controlled Power-Up under Amperage Monitoring',
        detail:
          'Clamp an AC amp meter onto the line conductor. Power on the circuit and verify starting inrush and steady-state operating current do not exceed manufacturer nameplate FLA.',
      },
    ],
    toolsRequired: [
      'True-RMS Digital Multimeter',
      'Non-Contact Voltage Detector',
      'AC Clamp Meter',
      'Insulated Hand Tool Kit (1000V rated)',
    ],
    preventiveMaintenance:
      'Ensure terminals are torqued annually to specifications and keep electrical panels clean and free of moisture and dust.',
    whenToCallProfessional:
      'If burning odor persists, if breakers trip immediately with no load, or if earth leakage current exceeds 30mA.',
    source: 'Local Electrical Knowledge Base',
  };
}
