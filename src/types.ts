export type TelemetrySource = "legacy" | "rdkb" | "rdkv" | "prpl";

export interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "cpe" | "access" | "kafka" | "etl" | "ai" | "drop";
  color: string;
}

export interface NetworkEdge {
  from: string;
  to: string;
  color: string;
  particleRate: number; // spawn probability per frame
  particleColor: string;
  particleSize: number;
}

export interface Particle {
  id: number;
  edge: NetworkEdge;
  progress: number; // 0 to 1
  speed: number;
}

export interface BusinessMetricsData {
  time: string;
  truckRolls: number;
  automatedFixes: number;
}

export interface TelemetryMetric {
  label: string;
  value: string;
  status: "nominal" | "warning" | "optimal" | "critical";
}

export interface FlowStep {
  id: string;
  name: string;
  shortName: string;
  description: string;
  sourceNodes: string[];
  activeEdges: string[];
  metrics: TelemetryMetric[];
  technicalLogs: string[];
  ceoLogs: string[];
  businessImpact: string;
  beegolInsight: string;
}
