import { substations } from "./substations";

// Real-time electrical readings for the Live Grid Map telemetry strip
// (Figma 101:437).
//
// SCHEMA GAP: of the seven readings the design shows, only MW LOAD and
// TRANSFORMER TEMP map to fields in the CLAUDE.md entity list (Substation.loadMW
// and Transformer.temperatureC). Voltage, current, frequency, MVAR and power
// factor have no home in the schema, so they are static display values here.
// If the telemetry strip is kept, these five belong on Substation as real
// fields — at which point voltageKV and currentA would be sensible additions
// to the LIVE list alongside loadMW.

export interface SubstationTelemetry {
  voltageKV: number;
  currentA: number;
  frequencyHz: number;
  mvar: number;
  powerFactor: number;
}

/** Nameplate values per substation. Static — see the schema note above. */
const nameplate: Record<string, { voltageKV: number; frequencyHz: number; powerFactor: number }> = {
  "SUB-MIRPUR": { voltageKV: 132.4, frequencyHz: 50.01, powerFactor: 0.96 },
  "SUB-GULSHAN": { voltageKV: 132.9, frequencyHz: 49.98, powerFactor: 0.97 },
  "SUB-UTTARA": { voltageKV: 131.2, frequencyHz: 50.04, powerFactor: 0.92 },
  "SUB-BANANI": { voltageKV: 133.1, frequencyHz: 50.0, powerFactor: 0.98 },
};

const fallback = { voltageKV: 132.0, frequencyHz: 50.0, powerFactor: 0.95 };

// Current and reactive power are derived from the static load so the strip is
// electrically coherent: I = P / (sqrt(3) x V x pf), Q = P x tan(acos(pf)).
export const substationTelemetry: Record<string, SubstationTelemetry> =
  Object.fromEntries(
    substations.map((substation) => {
      const base = nameplate[substation.id] ?? fallback;
      const currentA =
        (substation.loadMW * 1_000_000) /
        (Math.sqrt(3) * base.voltageKV * 1000 * base.powerFactor);
      const mvar = substation.loadMW * Math.tan(Math.acos(base.powerFactor));

      return [
        substation.id,
        {
          ...base,
          currentA: Math.round(currentA),
          mvar: Number(mvar.toFixed(1)),
        },
      ];
    })
  );
