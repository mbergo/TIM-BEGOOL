import React, { useEffect, useRef, useState } from "react";
import { NetworkEdge, Particle } from "../types";
import { getLocalizedPipelineSteps } from "../data/pipelineData";
import { useApp, Language } from "../context/AppContext";
import { 
  Router, 
  Wifi, 
  Tv, 
  Server, 
  HardDrive, 
  Database, 
  Cpu, 
  Brain, 
  XCircle, 
  Share2, 
  Globe2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3,
  ToggleLeft,
  ToggleRight,
  Hand,
  Layers,
  Network,
  Cable
} from "lucide-react";
import { GlossaryTerm } from "./GlossaryTerm";

export interface SimNode {
  id: string;
  label: string;
  acronym: string;
  x: number;
  y: number;
  type: "cpe" | "access" | "transport" | "broker" | "kafka" | "etl" | "ai";
  color: string;
  icon: React.ElementType;
}

// Localized Nodes generator
function getLocalizedNodes(language: Language): SimNode[] {
  const isPt = language === "pt";
  const isIt = language === "it";

  return [
    // 1. CLIENT HOME SUITE (CPE Level - Columns 1 & 2)
    { 
      id: "home-gateway", 
      acronym: "RDK", 
      label: isPt ? "Gateway RDK-B Doméstico" : isIt ? "Gateway RDK-B Domestico" : "RDK-B Home Gateway", 
      x: 100, 
      y: 150, 
      type: "cpe", 
      color: "#38bdf8", 
      icon: Router 
    },
    { 
      id: "iot-mesh", 
      acronym: "CPE", 
      label: isPt ? "Nó IoT de Casa Inteligente" : isIt ? "Nodo IoT Smart Home" : "Smart Home IoT Node", 
      x: 100, 
      y: 300, 
      type: "cpe", 
      color: "#818cf8", 
      icon: Wifi 
    },
    { 
      id: "stb-tv", 
      acronym: "CPE", 
      label: isPt ? "Set-Top Box de Vídeo RDK-V" : isIt ? "Decoder Video RDK-V" : "RDK-V Video Set-Top", 
      x: 100, 
      y: 450, 
      type: "cpe", 
      color: "#4ade80", 
      icon: Tv 
    },
    { 
      id: "enterprise-edge", 
      acronym: "CPE", 
      label: isPt ? "Gateway SD-WAN de Negócios" : isIt ? "Gateway SD-WAN Aziendale" : "Business SD-WAN Gateway", 
      x: 100, 
      y: 600, 
      type: "cpe", 
      color: "#2dd4bf", 
      icon: HardDrive 
    },
    
    // 2. FIELD DISTRIBUTION & ACCESS LAYER (Column 3)
    { 
      id: "gpon-ont", 
      acronym: "CPE", 
      label: isPt ? "ONT GPON Óptica" : isIt ? "ONT GPON Ottica" : "Optical GPON ONT", 
      x: 300, 
      y: 220, 
      type: "access", 
      color: "#34d399", 
      icon: Cable 
    },
    { 
      id: "splitter-1", 
      acronym: "GPON", 
      label: isPt ? "Splitter Óptico 1:64 A" : isIt ? "Divisore Ottico 1:64 A" : "1:64 Optical Splitter A", 
      x: 300, 
      y: 380, 
      type: "access", 
      color: "#c084fc", // Adjusted to purple to reduce red/laser look
      icon: Layers 
    },
    { 
      id: "splitter-2", 
      acronym: "GPON", 
      label: isPt ? "Splitter Óptico 1:64 B" : isIt ? "Divisore Ottico 1:64 B" : "1:64 Optical Splitter B", 
      x: 300, 
      y: 530, 
      type: "access", 
      color: "#fbbf24", // Adjusted to yellow to reduce red/laser look
      icon: Layers 
    },

    // 3. CENTRAL OFFICE ACCESS AGGREGATION (Column 4)
    { 
      id: "olt-chassis", 
      acronym: "OLT", 
      label: isPt ? "OLT GPON Central" : isIt ? "OLT GPON Centrale" : "Central GPON OLT", 
      x: 500, 
      y: 300, 
      type: "access", 
      color: "#60a5fa", 
      icon: Server 
    },
    { 
      id: "vccap-node", 
      acronym: "vCCAP", 
      label: isPt ? "Core de Software vCCAP" : isIt ? "Core Software vCCAP" : "vCCAP Software Core", 
      x: 500, 
      y: 480, 
      type: "access", 
      color: "#c084fc", // Adjusted to purple to reduce red/laser look
      icon: Server 
    },

    // 4. METRO EDGE TRANSPORT PLATES (Column 5)
    { 
      id: "provider-edge-1", 
      acronym: "PHY", 
      label: isPt ? "Borda do Provedor ISP Norte" : isIt ? "Edge Provider ISP Nord" : "ISP Provider Edge North", 
      x: 700, 
      y: 240, 
      type: "transport", 
      color: "#64748b", 
      icon: Share2 
    },
    { 
      id: "provider-edge-2", 
      acronym: "PHY", 
      label: isPt ? "Borda do Provedor ISP Sul" : isIt ? "Edge Provider ISP Sud" : "ISP Provider Edge South", 
      x: 700, 
      y: 520, 
      type: "transport", 
      color: "#64748b", 
      icon: Share2 
    },

    // 5. CONTROL & BROKER PLANE (Column 6)
    { 
      id: "legacy-acs", 
      acronym: "SOAP", 
      label: isPt ? "ACS TR-069 Legado" : isIt ? "ACS TR-069 Legacy" : "Legacy TR-069 ACS", 
      x: 900, 
      y: 150, 
      type: "broker", 
      color: "#94a3b8", 
      icon: Server 
    },
    { 
      id: "usp-controller", 
      acronym: "USP", 
      label: isPt ? "Controlador TR-369 USP" : isIt ? "Controllore USP TR-369" : "TR-369 USP Controller", 
      x: 900, 
      y: 400, 
      type: "broker", 
      color: "#2dd4bf", 
      icon: Globe2 
    },
    { 
      id: "mqtt-broker", 
      acronym: "MQTT", 
      label: isPt ? "Broker MQTT Ativo" : isIt ? "Broker MQTT Attivo" : "Active MQTT Broker", 
      x: 900, 
      y: 580, 
      type: "broker", 
      color: "#34d399", 
      icon: Network 
    },

    // 6. STREAM INGESTION & PIPELINE (Column 7)
    { 
      id: "kafka-modem", 
      acronym: "KAFKA-M", 
      label: isPt ? "Tópico: Telemetria de Modem" : isIt ? "Topic: Telemetria Modem" : "Topic: Modem Telemetry", 
      x: 1120, 
      y: 260, 
      type: "kafka", 
      color: "#fbbf24", 
      icon: Database 
    },
    { 
      id: "kafka-docs", 
      acronym: "KAFKA-D", 
      label: isPt ? "Tópico: Docs de Alta Fidelidade" : isIt ? "Topic: Docs Alta Fedeltà" : "Topic: High-Fidelity Docs", 
      x: 1120, 
      y: 460, 
      type: "kafka", 
      color: "#38bdf8", 
      icon: Database 
    },

    // 7. BIG DATA REFINERY LAYER (Column 8)
    { 
      id: "databricks-lake", 
      acronym: "Databricks", 
      label: isPt ? "Refinaria Delta Databricks" : isIt ? "Raffineria Delta Databricks" : "Databricks Delta Refinery", 
      x: 1300, 
      y: 240, 
      type: "etl", 
      color: "#818cf8", 
      icon: Cpu 
    },
    { 
      id: "discard-bin", 
      acronym: "ETL", 
      label: isPt ? "Filtro de Descarte de Ruído" : isIt ? "Cestino Filtro Rumore" : "Noise Filter Bin", 
      x: 1300, 
      y: 520, 
      type: "etl", 
      color: "#fbbf24", // Adjusted to yellow to reduce red/laser look
      icon: XCircle 
    },

    // 8. BEEGOL DEEP INTELLIGENCE EDGE (Column 9)
    { 
      id: "beegol-gnn-core", 
      acronym: "GNN", 
      label: isPt ? "Mecanismo GNN RCA Beegol" : isIt ? "Motore GNN RCA Beegol" : "Beegol GNN RCA Engine", 
      x: 1480, 
      y: 360, 
      type: "ai", 
      color: "#e879f9", 
      icon: Brain 
    }
  ];
}

// Connection topology representing a real multi-tier ISP infrastructure
const EDGES: NetworkEdge[] = [
  // Home to distribution ONT/Splitters
  { from: "home-gateway", to: "gpon-ont", color: "#0284c7", particleRate: 0.45, particleColor: "#38bdf8", particleSize: 3 },
  { from: "iot-mesh", to: "home-gateway", color: "#4338ca", particleRate: 0.35, particleColor: "#818cf8", particleSize: 2.5 },
  { from: "stb-tv", to: "gpon-ont", color: "#166534", particleRate: 0.4, particleColor: "#4ade80", particleSize: 2.5 },
  { from: "enterprise-edge", to: "splitter-2", color: "#0f766e", particleRate: 0.5, particleColor: "#2dd4bf", particleSize: 3.5 },
  
  // ONT/Splitters to central office aggregates
  { from: "gpon-ont", to: "olt-chassis", color: "#1e3a8a", particleRate: 0.55, particleColor: "#60a5fa", particleSize: 3.5 },
  { from: "splitter-1", to: "olt-chassis", color: "#581c87", particleRate: 0.5, particleColor: "#c084fc", particleSize: 3 }, // Adjusted to purple
  { from: "splitter-2", to: "vccap-node", color: "#713f12", particleRate: 0.5, particleColor: "#f59e0b", particleSize: 3.5 }, // Adjusted to yellow

  // Central aggregates to Transport Edges
  { from: "olt-chassis", to: "provider-edge-1", color: "#1e293b", particleRate: 0.7, particleColor: "#a1a1aa", particleSize: 4 },
  { from: "vccap-node", to: "provider-edge-2", color: "#334155", particleRate: 0.75, particleColor: "#cbd5e1", particleSize: 4 },

  // Transport Edges to Management Brokers
  { from: "provider-edge-1", to: "legacy-acs", color: "#334155", particleRate: 0.35, particleColor: "#94a3b8", particleSize: 2.5 },
  { from: "provider-edge-1", to: "usp-controller", color: "#0f766e", particleRate: 0.65, particleColor: "#2dd4bf", particleSize: 4 },
  { from: "provider-edge-2", to: "mqtt-broker", color: "#065f46", particleRate: 0.6, particleColor: "#34d399", particleSize: 3.5 },

  // Management Brokers to Ingestion Plane (Split into Modem Telemetry vs High-Fidelity Documentation Topics)
  { from: "legacy-acs", to: "kafka-modem", color: "#475569", particleRate: 0.4, particleColor: "#94a3b8", particleSize: 2.5 },
  { from: "legacy-acs", to: "kafka-docs", color: "#475569", particleRate: 0.25, particleColor: "#38bdf8", particleSize: 2.5 },

  { from: "usp-controller", to: "kafka-modem", color: "#b45309", particleRate: 0.75, particleColor: "#fbbf24", particleSize: 4 },
  { from: "usp-controller", to: "kafka-docs", color: "#0369a1", particleRate: 0.45, particleColor: "#38bdf8", particleSize: 4 },

  { from: "mqtt-broker", to: "kafka-modem", color: "#047857", particleRate: 0.65, particleColor: "#34d399", particleSize: 3.5 },
  { from: "mqtt-broker", to: "kafka-docs", color: "#0369a1", particleRate: 0.35, particleColor: "#38bdf8", particleSize: 3.5 },

  // Kafka Ingestion Topics to Databricks Refinery
  { from: "kafka-modem", to: "databricks-lake", color: "#312e81", particleRate: 0.8, particleColor: "#fbbf24", particleSize: 4.5 },
  { from: "kafka-modem", to: "discard-bin", color: "#713f12", particleRate: 0.35, particleColor: "#fbbf24", particleSize: 3 }, // Adjusted to yellow

  { from: "kafka-docs", to: "databricks-lake", color: "#1e1b4b", particleRate: 0.55, particleColor: "#38bdf8", particleSize: 4.5 },
  { from: "kafka-docs", to: "discard-bin", color: "#713f12", particleRate: 0.2, particleColor: "#fbbf24", particleSize: 3 }, // Adjusted to yellow

  // Refinery output to Beegol Cloud RCA Core
  { from: "databricks-lake", to: "beegol-gnn-core", color: "#701a75", particleRate: 0.9, particleColor: "#e879f9", particleSize: 5 }
];

const isNodeActiveInStep = (nodeId: string, stepId: string): boolean => {
  if (stepId === "user-cpe") {
    return ["home-gateway", "iot-mesh", "stb-tv", "enterprise-edge", "gpon-ont"].includes(nodeId);
  }
  if (stepId === "access-transport") {
    return ["gpon-ont", "splitter-1", "splitter-2", "olt-chassis", "vccap-node", "provider-edge-1", "provider-edge-2"].includes(nodeId);
  }
  if (stepId === "control-broker") {
    return ["provider-edge-1", "provider-edge-2", "legacy-acs", "usp-controller", "mqtt-broker"].includes(nodeId);
  }
  if (stepId === "kafka-cluster") {
    return ["legacy-acs", "usp-controller", "mqtt-broker", "kafka-modem", "kafka-docs"].includes(nodeId);
  }
  if (stepId === "databricks-etl") {
    return ["kafka-modem", "kafka-docs", "databricks-lake", "discard-bin"].includes(nodeId);
  }
  if (stepId === "beegol-cloud") {
    return ["databricks-lake", "beegol-gnn-core"].includes(nodeId);
  }
  return false;
};

const isEdgeActiveInStep = (from: string, to: string, stepId: string): boolean => {
  if (stepId === "user-cpe") {
    return ["home-gateway", "iot-mesh", "stb-tv", "enterprise-edge"].includes(from) && ["home-gateway", "gpon-ont", "splitter-2"].includes(to);
  }
  if (stepId === "access-transport") {
    return ["gpon-ont", "splitter-1", "splitter-2", "olt-chassis", "vccap-node"].includes(from) && ["olt-chassis", "vccap-node", "provider-edge-1", "provider-edge-2"].includes(to);
  }
  if (stepId === "control-broker") {
    return ["provider-edge-1", "provider-edge-2"].includes(from) && ["legacy-acs", "usp-controller", "mqtt-broker"].includes(to);
  }
  if (stepId === "kafka-cluster") {
    return ["legacy-acs", "usp-controller", "mqtt-broker"].includes(from) && ["kafka-modem", "kafka-docs"].includes(to);
  }
  if (stepId === "databricks-etl") {
    return ["kafka-modem", "kafka-docs"].includes(from) && ["databricks-lake", "discard-bin"].includes(to);
  }
  if (stepId === "beegol-cloud") {
    return from === "databricks-lake" && to === "beegol-gnn-core";
  }
  return false;
};

interface NetworkSimulationProps {
  activeStepId: string;
}

export default function NetworkSimulation({ activeStepId }: NetworkSimulationProps) {
  const { language, theme, t, filterBarrier, protocolMode, backpressureValue, setFilterBarrier, setBackpressureValue } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLight = theme === "light";

  // States
  const [nodes, setNodes] = useState<SimNode[]>(() => getLocalizedNodes(language));
  const [scale, setScale] = useState(0.72); // Perfectly fit the high-density map
  const [pan, setPan] = useState({ x: 30, y: 15 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activePathsOnly, setActivePathsOnly] = useState(false);

  // Derive modem and DOCS flows congestion status from global backpressure and filtering states!
  const modemImpact = filterBarrier === "before-kafka" ? "optimized" : (backpressureValue > 45 ? "congested" : "optimized");
  const docsImpact = filterBarrier === "before-kafka" ? "optimized" : (backpressureValue > 25 ? "congested" : "optimized");

  // Real-time Load (representing dynamic messages throughput)
  const [realTimeLoad, setRealTimeLoad] = useState(1842512);

  // Utility to format throughput rate with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuates around a baseline of 1.8M depending on the network toggles
      let baseline = filterBarrier === "before-kafka" ? 368500 : 1842512;
      
      if (protocolMode === "tr069") {
        baseline = Math.floor(baseline * 1.35); // SOAP CWMP XML overhead
      } else if (protocolMode === "gnmi") {
        baseline = Math.floor(baseline * 1.15); // streaming spikes
      } else if (protocolMode === "otel") {
        baseline = Math.floor(baseline * 0.9);  // optimal telemetry agents
      }

      const fluctuation = Math.floor(Math.random() * 24000 - 12000);
      setRealTimeLoad(Math.max(80000, baseline + fluctuation));
    }, 1000);
    return () => clearInterval(interval);
  }, [filterBarrier, protocolMode]);

  // Synchronize localized nodes when language changes
  useEffect(() => {
    const updated = getLocalizedNodes(language);
    setNodes(prev => prev.map(p => {
      const u = updated.find(x => x.id === p.id);
      return u ? { ...p, label: u.label } : p;
    }));
  }, [language]);

  // References for render loop
  const activeStepIdRef = useRef(activeStepId);
  const nodesRef = useRef(nodes);
  const activePathsOnlyRef = useRef(activePathsOnly);
  const isLightRef = useRef(isLight);
  const modemImpactRef = useRef(modemImpact);
  const docsImpactRef = useRef(docsImpact);
  const realTimeLoadRef = useRef(realTimeLoad);

  useEffect(() => {
    activeStepIdRef.current = activeStepId;
  }, [activeStepId]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    activePathsOnlyRef.current = activePathsOnly;
  }, [activePathsOnly]);

  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  useEffect(() => {
    modemImpactRef.current = modemImpact;
  }, [modemImpact]);

  useEffect(() => {
    docsImpactRef.current = docsImpact;
  }, [docsImpact]);

  useEffect(() => {
    realTimeLoadRef.current = realTimeLoad;
  }, [realTimeLoad]);

  // Latency helper computations
  const calcClusterLatency = () => {
    let latency = 0.28;
    if (modemImpact === "congested") latency += 124.5;
    if (docsImpact === "congested") latency += 345.8;
    return latency.toFixed(2);
  };

  const totalLatency = parseFloat(calcClusterLatency());
  const isCongested = modemImpact === "congested" || docsImpact === "congested";
  const isCritical = modemImpact === "congested" && docsImpact === "congested";

  const getLatencyText = () => {
    const lat = calcClusterLatency();
    if (isCritical) {
      return language === "pt" 
        ? `LATÊNCIA: ${lat}ms // CONGESTIONAMENTO CRÍTICO`
        : language === "it"
        ? `LATENZA: ${lat}ms // CONGESTIONE CRITICA`
        : `LATENCY: ${lat}ms // CRITICAL CONGESTION`;
    }
    if (isCongested) {
      return language === "pt"
        ? `LATÊNCIA: ${lat}ms // FLUXO DEGRADADO`
        : language === "it"
        ? `LATENZA: ${lat}ms // FLUSSO DEGRADATO`
        : `LATENCY: ${lat}ms // DEGRADED FLOW`;
    }
    return language === "pt"
      ? `LATÊNCIA: ${lat}ms // SINCRONIA REAL`
      : language === "it"
      ? `LATENZA: ${lat}ms // SYNC REALTIME`
      : `LATENCY: ${lat}ms // REALTIME SYNC`;
  };

  // Main High-Performance Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let particleIdCounter = 0;

    const drawEdge = (edge: NetworkEdge, stepId: string) => {
      const currentNodes = nodesRef.current;
      const fromNode = currentNodes.find(n => n.id === edge.from);
      const toNode = currentNodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isActive = isEdgeActiveInStep(edge.from, edge.to, stepId);
      const isFilteredOut = activePathsOnlyRef.current && !isActive;

      if (isFilteredOut) return;

      // Check congestion for this edge
      const isModemFlow = edge.from === "kafka-modem" || edge.to === "kafka-modem";
      const isDocsFlow = edge.from === "kafka-docs" || edge.to === "kafka-docs";

      let flowCongestion = false;
      if (isModemFlow && modemImpactRef.current === "congested") {
        flowCongestion = true;
      }
      if (isDocsFlow && docsImpactRef.current === "congested") {
        flowCongestion = true;
      }

      ctx.beginPath();
      if (isActive) {
        // Incorporate realTimeLoad throughput ratio
        const loadRatio = realTimeLoadRef.current / 1842512;
        ctx.lineWidth = (flowCongestion ? 5.5 : 4.0) * Math.sqrt(loadRatio); // Thicker if congested and scaled with load
        ctx.strokeStyle = flowCongestion ? "#d946ef" : edge.particleColor; // Glowing purple if congested
        ctx.shadowBlur = (flowCongestion ? 6 : 4) * loadRatio; // Glowing intensity based on load
        ctx.shadowColor = flowCongestion ? "#d946ef" : edge.particleColor;
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isLightRef.current ? "rgba(148, 163, 184, 0.25)" : "rgba(71, 85, 105, 0.25)";
        ctx.setLineDash([6, 10]);
      }
      
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      const currentStepId = activeStepIdRef.current;
      const currentNodes = nodesRef.current;

      // Clear the 1700x750 Virtual Canvas
      ctx.clearRect(0, 0, 1700, 750);

      // Render Edges
      EDGES.forEach(edge => drawEdge(edge, currentStepId));

      // Spawn Telemetry Particles dynamically
      EDGES.forEach(edge => {
        const isActive = isEdgeActiveInStep(edge.from, edge.to, currentStepId);
        const isFilteredOut = activePathsOnlyRef.current && !isActive;
        if (isFilteredOut) return;

        // Check congestion for this edge
        const isModemFlow = edge.from === "kafka-modem" || edge.to === "kafka-modem";
        const isDocsFlow = edge.from === "kafka-docs" || edge.to === "kafka-docs";

        let flowCongestion = false;
        if (isModemFlow && modemImpactRef.current === "congested") {
          flowCongestion = true;
        }
        if (isDocsFlow && docsImpactRef.current === "congested") {
          flowCongestion = true;
        }

        const rateModifier = isActive ? 0.4 : 0.08; 
        const congestionRateBonus = flowCongestion ? 0.35 : 0;
        
        // Scale probability dynamically with the realTimeLoad throughput ratio
        const loadRatio = realTimeLoadRef.current / 1842512;
        const spawnProbability = (edge.particleRate * rateModifier + (isActive ? 0.3 : 0) + congestionRateBonus) * loadRatio;

        if (Math.random() < spawnProbability) {
          particles.push({
            id: particleIdCounter++,
            edge,
            progress: 0,
            // If congested, particles move much slower to represent backlog delay
            speed: (flowCongestion
              ? 0.0012 + (Math.random() * 0.0006)
              : (isActive ? 0.007 : 0.0035) + (Math.random() * 0.003)) * Math.sqrt(loadRatio)
          });
        }
      });

      // Update & Render Flying Particles
      particles = particles.filter(p => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;

        const fromNode = currentNodes.find(n => n.id === p.edge.from);
        const toNode = currentNodes.find(n => n.id === p.edge.to);
        if (!fromNode || !toNode) return false;

        const isActive = isEdgeActiveInStep(p.edge.from, p.edge.to, currentStepId);
        const isFilteredOut = activePathsOnlyRef.current && !isActive;
        if (isFilteredOut) return false;

        // Check congestion for this particle
        const isModemFlow = p.edge.from === "kafka-modem" || p.edge.to === "kafka-modem";
        const isDocsFlow = p.edge.from === "kafka-docs" || p.edge.to === "kafka-docs";

        let flowCongestion = false;
        if (isModemFlow && modemImpactRef.current === "congested") {
          flowCongestion = true;
        }
        if (isDocsFlow && docsImpactRef.current === "congested") {
          flowCongestion = true;
        }

        const cx = fromNode.x + (toNode.x - fromNode.x) * p.progress;
        const cy = fromNode.y + (toNode.y - fromNode.y) * p.progress;

        ctx.beginPath();
        const size = isActive ? p.edge.particleSize * 1.6 : p.edge.particleSize;
        ctx.arc(cx, cy, size, 0, 2 * Math.PI);

        // Render congested particles as glowing purple
        const particleColor = flowCongestion ? "#d946ef" : p.edge.particleColor;

        ctx.fillStyle = particleColor;
        ctx.shadowBlur = flowCongestion ? 8 : (isActive ? 6 : 2); // Reduced particle glow
        ctx.shadowColor = particleColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Long particle tracer tail
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const tailX = fromNode.x + (toNode.x - fromNode.x) * Math.max(0, p.progress - (isActive ? 0.06 : 0.04));
        const tailY = fromNode.y + (toNode.y - fromNode.y) * Math.max(0, p.progress - (isActive ? 0.06 : 0.04));
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = particleColor;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.globalAlpha = flowCongestion ? 0.9 : (isActive ? 0.75 : 0.35);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        return true;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Zoom functions
  const zoomIn = () => setScale(s => Math.min(2.0, s + 0.1));
  const zoomOut = () => setScale(s => Math.max(0.4, s - 0.1));
  const resetZoom = () => {
    setScale(0.72);
    setPan({ x: 30, y: 15 });
  };

  // Canvas Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggingNodeId) return;
    const target = e.target as HTMLElement;
    if (target.closest(".interactive-node") || target.closest(".hud-button")) return;

    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggingNodeId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseXInCanvas = (e.clientX - rect.left - pan.x) / scale;
      const mouseYInCanvas = (e.clientY - rect.top - pan.y) / scale;

      setNodes(prevNodes => prevNodes.map(node => {
        if (node.id === draggingNodeId) {
          return {
            ...node,
            x: Math.max(20, Math.min(1680, mouseXInCanvas - dragOffset.x)),
            y: Math.max(20, Math.min(730, mouseYInCanvas - dragOffset.y))
          };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Node Drag Handlers
  const startNodeDrag = (nodeId: string, nodeX: number, nodeY: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseXInCanvas = (e.clientX - rect.left - pan.x) / scale;
    const mouseYInCanvas = (e.clientY - rect.top - pan.y) / scale;

    setDraggingNodeId(nodeId);
    setDragOffset({
      x: mouseXInCanvas - nodeX,
      y: mouseYInCanvas - nodeY
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const direction = e.deltaY > 0 ? -1 : 1;
    setScale(prevScale => Math.max(0.4, Math.min(2.0, prevScale + direction * zoomIntensity)));
  };

  const steps = getLocalizedPipelineSteps(language);
  const activeStep = steps.find(s => s.id === activeStepId);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] rounded-2xl border-2 overflow-hidden shadow-3xl select-none transition-colors duration-300 ${
        isLight ? "bg-white border-slate-200" : "bg-slate-950/80 border-slate-800/80"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      id="simulation-viewport"
    >
      {/* SVG Linear Gradients Definition for multi color icons on the right */}
      <svg className="absolute w-0 h-0 opacity-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="kafkaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="etlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="35%" stopColor="#8b5cf6" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      {/* High-Contrast Dynamic Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(${isLight ? "#64748b" : "#0284c7"} 2px, transparent 2px)`, 
          backgroundSize: "36px 36px",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "0 0"
        }}
      />

      {/* FLOATING HUD: Title panel */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <Grid3X3 size={18} className={isLight ? "text-sky-600" : "text-sky-400"} />
          <h4 className={`text-[14px] font-extrabold font-mono tracking-widest uppercase ${isLight ? "text-slate-800" : "text-slate-200"}`}>
            {t("carrier_topo_explorer")}
          </h4>
        </div>
        <p className={`text-[11px] font-mono font-bold uppercase tracking-widest border px-3 py-1 rounded backdrop-blur-md shadow-2xl ${
          isLight ? "bg-white/90 border-slate-200 text-sky-600" : "bg-sky-950/70 border-sky-500/30 text-sky-400"
        }`}>
          {activeStep ? `${t("step_prefix")}: ${activeStep.shortName}` : t("live_sockets")}
        </p>
      </div>

      {/* FLOATING HUD: Active-Path Filtering Control Block - EXTREMELY CHAMATIVO */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
        <button 
          onClick={() => setActivePathsOnly(!activePathsOnly)}
          className={`hud-button flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-xs font-mono font-black tracking-wider uppercase transition-all shadow-2xl pointer-events-auto cursor-pointer hover:scale-[1.05] active:scale-[0.96] ${
            activePathsOnly
              ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.55)]"
              : isLight 
              ? "border-slate-200 bg-white text-slate-700 hover:text-sky-600 hover:border-sky-500" 
              : "border-slate-700 bg-slate-950 text-slate-200 hover:text-sky-400 hover:border-sky-500 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          }`}
        >
          {activePathsOnly ? <ToggleRight className="text-white" size={18} /> : <ToggleLeft className="text-slate-400" size={18} />}
          <span>{t("active_nodes_only")}</span>
        </button>

        <span className={`text-[10px] font-mono border px-3 py-1.5 rounded-xl shadow-2xl font-black transition-colors duration-300 ${
          isCritical
            ? "bg-rose-500/10 border-rose-500/40 text-rose-500 dark:text-rose-400 animate-pulse"
            : isCongested
            ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
            : isLight 
            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        }`}>
          {getLatencyText()}
        </span>

        {/* Live 1.8M Throughput representation indicator */}
        <span className={`text-[10px] font-mono border px-3 py-1.5 rounded-xl shadow-2xl font-black transition-all duration-300 flex items-center gap-1.5 ${
          isCritical
            ? "bg-rose-500/10 border-rose-500/40 text-rose-500 dark:text-rose-400 animate-pulse"
            : isLight
            ? "bg-sky-50 border-sky-200 text-sky-700"
            : "bg-sky-950/40 border-sky-500/30 text-sky-400"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
          <span>THROUGHPUT: {formatNumber(realTimeLoad)} MSG/S</span>
        </span>
      </div>

      {/* FLOATING KAFKA TOPIC CONTROL PANEL */}
      <div className={`absolute top-20 right-5 z-20 w-80 p-4 rounded-2xl border-2 shadow-3xl pointer-events-auto transition-all duration-300 backdrop-blur-md ${
        isLight 
          ? "bg-white/95 border-slate-200 text-slate-800 animate-fade-in" 
          : "bg-slate-950/90 border-slate-800/80 text-slate-200 animate-fade-in"
      }`}>
        <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-500/15">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isCritical ? "bg-rose-500" : isCongested ? "bg-amber-400" : "bg-emerald-400"}`} />
            <span className="text-[11px] font-black font-mono uppercase tracking-widest">
              {t("kafka_flow_control")}
            </span>
          </div>
          <span className="text-[9px] font-mono bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20 font-bold uppercase animate-pulse">
            {t("interactive_badge")}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Topic 1: Modem Telemetry */}
          <div className={`p-2.5 rounded-xl border transition-colors ${
            modemImpact === "congested" 
              ? "bg-rose-500/5 border-rose-500/25" 
              : "bg-slate-500/5 border-slate-500/10"
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold font-sans">
                {t("modem_telemetry_flow")}
              </span>
              <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                modemImpact === "congested"
                  ? "bg-rose-500/20 text-rose-500"
                  : "bg-emerald-500/20 text-emerald-500"
              }`}>
                {modemImpact === "congested" ? t("congested_label").toUpperCase() : t("optimized_label").toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mb-2 leading-relaxed">
              {t("topic_label")} <code className="text-sky-400 bg-sky-950/40 px-1 py-0.5 rounded text-[9px]">telemetry.modem.raw</code>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilterBarrier("before-kafka");
                  setBackpressureValue(12);
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all hover:scale-[1.04] active:scale-[0.96] cursor-pointer ${
                  modemImpact === "optimized"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
              >
                {t("optimized_label")}
              </button>
              <button
                onClick={() => {
                  setFilterBarrier("after-kafka");
                  setBackpressureValue(55);
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all hover:scale-[1.04] active:scale-[0.96] cursor-pointer ${
                  modemImpact === "congested"
                    ? "bg-rose-500 text-white shadow-md font-black shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
              >
                {t("congested_label")}
              </button>
            </div>
          </div>

          {/* Topic 2: High-Fidelity Documentation */}
          <div className={`p-2.5 rounded-xl border transition-colors ${
            docsImpact === "congested" 
              ? "bg-rose-500/5 border-rose-500/25" 
              : "bg-slate-500/5 border-slate-500/10"
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold font-sans">
                {t("hifi_docs_flow")}
              </span>
              <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                docsImpact === "congested"
                  ? "bg-rose-500/20 text-rose-500"
                  : "bg-emerald-500/20 text-emerald-500"
              }`}>
                {docsImpact === "congested" ? t("congested_label").toUpperCase() : t("optimized_label").toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mb-2 leading-relaxed">
              {t("topic_label")} <code className="text-sky-400 bg-sky-950/40 px-1 py-0.5 rounded text-[9px]">docs.hifi.raw</code>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilterBarrier("before-kafka");
                  setBackpressureValue(12);
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all hover:scale-[1.04] active:scale-[0.96] cursor-pointer ${
                  docsImpact === "optimized"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
              >
                {t("optimized_label")}
              </button>
              <button
                onClick={() => {
                  setFilterBarrier("after-kafka");
                  setBackpressureValue(82);
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all hover:scale-[1.04] active:scale-[0.96] cursor-pointer ${
                  docsImpact === "congested"
                    ? "bg-rose-500 text-white shadow-md font-black shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
              >
                {t("congested_label")}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Summary Stats Footer inside the card */}
        <div className="mt-3 pt-2.5 border-t border-slate-500/15 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">{t("latency_impact")}</span>
          <span className={`font-black ${
            isCritical ? "text-rose-400" : isCongested ? "text-amber-400" : "text-emerald-400"
          }`}>
            +{((modemImpact === "congested" ? 124.5 : 0) + (docsImpact === "congested" ? 345.8 : 0)).toFixed(1)} ms
          </span>
        </div>
      </div>

      {/* FLOATING ZOOM CONTROLLER PANEL - HIGH FIDELITY & CHAMATIVO */}
      <div className={`absolute bottom-6 left-6 z-20 flex flex-col items-center gap-2 border-2 p-2.5 rounded-2xl shadow-3xl pointer-events-auto ${
        isLight ? "bg-white border-slate-200" : "bg-slate-950/95 border-slate-800"
      }`}>
        <button
          onClick={zoomIn}
          title="Zoom In"
          className={`hud-button w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-[1.1] active:scale-[0.9] ${
            isLight 
              ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]" 
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
          }`}
        >
          <ZoomIn size={16} />
        </button>

        <span className={`text-[12px] font-mono font-black w-12 text-center py-1 text-sky-500 animate-pulse`}>
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={zoomOut}
          title="Zoom Out"
          className={`hud-button w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-[1.1] active:scale-[0.9] ${
            isLight 
              ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]" 
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
          }`}
        >
          <ZoomOut size={16} />
        </button>

        <div className={`w-8 h-[1.5px] my-1 ${isLight ? "bg-slate-200" : "bg-slate-800"}`} />

        <button
          onClick={resetZoom}
          title="Reset to Viewport Fit"
          className={`hud-button w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-[1.1] active:scale-[0.9] ${
            isLight 
              ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]" 
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
          }`}
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* MAP LEGEND - EXTREMELY POLISHED, STRUCTURED & INTERACTIVE PANEL */}
      <div className={`absolute bottom-6 left-24 z-20 hidden lg:flex flex-col gap-2.5 border-2 p-3.5 rounded-2xl backdrop-blur-md shadow-3xl pointer-events-auto transition-all hover:scale-[1.02] ${
        isLight ? "bg-white/95 border-slate-200" : "bg-slate-950/90 border-slate-800/80"
      }`}>
        {/* Legend Header */}
        <div className="flex items-center justify-between border-b pb-1.5 border-slate-500/15">
          <div className="flex items-center gap-1.5">
            <Layers size={11} className={isLight ? "text-slate-500" : "text-sky-400"} />
            <span className={`text-[9px] font-black font-mono uppercase tracking-widest ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {language === "pt" ? "Legenda do Mapa" : language === "it" ? "Legenda della Mappa" : "Map Legend"}
            </span>
          </div>
          <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold animate-pulse">
            {language === "pt" ? "Sincronizado" : language === "it" ? "Sincronizzato" : "Live Sync"}
          </span>
        </div>

        {/* Legend Grid */}
        <div className="flex items-center gap-3">
          {/* CPE */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            activeStepId === "user-cpe"
              ? isLight ? "bg-sky-50 border-sky-200 shadow-sm" : "bg-sky-500/10 border-sky-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
              : "border-transparent"
          }`}>
            <span className={`relative flex h-2.5 w-2.5`}>
              {activeStepId === "user-cpe" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400`}></span>
            </span>
            <span className={`text-[10px] font-mono font-black ${
              activeStepId === "user-cpe"
                ? isLight ? "text-sky-600 font-extrabold" : "text-sky-450 font-extrabold"
                : isLight ? "text-slate-500" : "text-slate-400"
            }`}>{t("legend_cpe")}</span>
          </div>

          {/* GPON */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            activeStepId === "access-transport"
              ? isLight ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : "border-transparent"
          }`}>
            <span className={`relative flex h-2.5 w-2.5`}>
              {activeStepId === "access-transport" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400`}></span>
            </span>
            <span className={`text-[10px] font-mono font-black ${
              activeStepId === "access-transport"
                ? isLight ? "text-emerald-600 font-extrabold" : "text-emerald-450 font-extrabold"
                : isLight ? "text-slate-500" : "text-slate-400"
            }`}>{t("legend_gpon")}</span>
          </div>

          {/* USP MQTT */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            activeStepId === "control-broker"
              ? isLight ? "bg-teal-50 border-teal-200 shadow-sm" : "bg-teal-500/10 border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]"
              : "border-transparent"
          }`}>
            <span className={`relative flex h-2.5 w-2.5`}>
              {activeStepId === "control-broker" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400`}></span>
            </span>
            <span className={`text-[10px] font-mono font-black ${
              activeStepId === "control-broker"
                ? isLight ? "text-teal-600 font-extrabold" : "text-teal-450 font-extrabold"
                : isLight ? "text-slate-500" : "text-slate-400"
            }`}>{t("legend_mgmt")}</span>
          </div>

          {/* Kafka Ingestion */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            activeStepId === "kafka-cluster"
              ? isLight ? "bg-amber-50 border-amber-200 shadow-sm" : "bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              : "border-transparent"
          }`}>
            <span className={`relative flex h-2.5 w-2.5`}>
              {activeStepId === "kafka-cluster" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400`}></span>
            </span>
            <span className={`text-[10px] font-mono font-black ${
              activeStepId === "kafka-cluster"
                ? isLight ? "text-amber-600 font-extrabold" : "text-amber-450 font-extrabold"
                : isLight ? "text-slate-500" : "text-slate-400"
            }`}>{t("legend_ingest")}</span>
          </div>

          {/* Databricks ETL */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            activeStepId === "databricks-etl"
              ? isLight ? "bg-slate-100 border-slate-300 shadow-sm" : "bg-slate-500/10 border-slate-500/30 shadow-[0_0_10px_rgba(148,163,184,0.2)]"
              : "border-transparent"
          }`}>
            <span className={`relative flex h-2.5 w-2.5`}>
              {activeStepId === "databricks-etl" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-400`}></span>
            </span>
            <span className={`text-[10px] font-mono font-black ${
              activeStepId === "databricks-etl"
                ? isLight ? "text-slate-700 font-extrabold" : "text-slate-450 font-extrabold"
                : isLight ? "text-slate-500" : "text-slate-400"
            }`}>{t("legend_metro")}</span>
          </div>

          {/* Beegol AI */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            activeStepId === "beegol-cloud"
              ? isLight ? "bg-fuchsia-50 border-fuchsia-200 shadow-sm" : "bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.2)]"
              : "border-transparent"
          }`}>
            <span className={`relative flex h-2.5 w-2.5`}>
              {activeStepId === "beegol-cloud" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-400`}></span>
            </span>
            <span className={`text-[10px] font-mono font-black ${
              activeStepId === "beegol-cloud"
                ? isLight ? "text-fuchsia-600 font-extrabold" : "text-fuchsia-450 font-extrabold"
                : isLight ? "text-slate-500" : "text-slate-400"
            }`}>{t("legend_ai")}</span>
          </div>
        </div>
      </div>

      {/* CORE CANVAS WORKSPACE CONTAINER */}
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "0 0"
        }}
      >
        {/* Dynamic Telemetry Flow Canvas */}
        <canvas 
          ref={canvasRef} 
          width={1700}
          height={750}
          className="absolute inset-0 pointer-events-none z-0 block" 
        />

        {/* Dynamic Draggable Node Components Layout */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {nodes.map((node) => {
            const Icon = node.icon;
            
            // Standardizing node sizing
            const isAILink = node.type === "ai";
            const isPlatformHub = ["kafka", "etl"].includes(node.type);
            const boxSize = isAILink ? "w-20 h-20" : isPlatformHub ? "w-16 h-16" : "w-14 h-14";
            const iconSize = isAILink ? 32 : isPlatformHub ? 26 : 22;

            const isNodeActive = isNodeActiveInStep(node.id, activeStepIdRef.current);
            const isFilteredOut = activePathsOnly && !isNodeActive;

            if (isFilteredOut) return null;

            const isRightSide = ["kafka", "etl", "ai"].includes(node.type);

            // Dynamic throughput variables based on 1.8M base msg/s load
            const loadRatio = realTimeLoad / 1842512;
            const pulseDuration = `${Math.max(0.3, Math.min(2.5, 1.2 / loadRatio))}s`;
            const pulseOpacity = Math.max(0.12, Math.min(0.85, 0.28 * loadRatio));
            const nodeOpacity = isNodeActive ? Math.min(1.0, 0.85 + (loadRatio - 1) * 0.15) : undefined;

            return (
              <div 
                key={node.id} 
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-auto interactive-node ${
                  draggingNodeId === node.id ? "z-50" : ""
                }`}
                style={{ 
                  left: `${node.x}px`, 
                  top: `${node.y}px`
                }}
              >
                {/* Node Reposition Drag Anchor overlay */}
                <div 
                  onMouseDown={(e) => startNodeDrag(node.id, node.x, node.y, e)}
                  className={`absolute -top-4 cursor-move p-1 border rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-150 z-30 flex items-center gap-1 ${
                    isLight ? "bg-white border-slate-300" : "bg-slate-900 border-slate-700"
                  }`}
                  title="Drag and relocate node on grid"
                >
                  <Hand size={10} className="text-sky-500 animate-bounce" />
                  <span className={`text-[7px] font-mono font-black ${isLight ? "text-slate-600" : "text-slate-300"}`}>DRAG</span>
                </div>

                {/* Pulsating status ring with dynamic pulse frequency and opacity */}
                {isNodeActive && (
                  <div 
                    className="absolute rounded-full pointer-events-none"
                    style={{ 
                      backgroundColor: node.color,
                      width: '96px',
                      height: '96px',
                      animation: `ping ${pulseDuration} cubic-bezier(0, 0, 0.2, 1) infinite`,
                      opacity: pulseOpacity,
                    }}
                  />
                )}

                {/* Node Box card with customized coloring */}
                <div 
                  onMouseDown={(e) => startNodeDrag(node.id, node.x, node.y, e)}
                  className={`flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 cursor-grab active:cursor-grabbing select-none relative overflow-hidden ${boxSize} ${
                    isNodeActive 
                      ? "scale-110 ring-3 ring-sky-500/35 bg-slate-950/95" 
                      : isLight 
                      ? "opacity-80 hover:opacity-100 bg-white border-slate-200" 
                      : "opacity-75 hover:opacity-100 bg-slate-950/95 border-slate-800"
                  } ${
                    isRightSide && node.type === "ai" ? "animate-pulse" : ""
                  }`}
                  style={{ 
                    borderColor: isNodeActive ? node.color : "rgba(148, 163, 184, 0.45)", 
                    opacity: nodeOpacity,
                    boxShadow: isNodeActive 
                      ? (isRightSide 
                          ? `0 0 ${Math.round(35 * loadRatio)}px ${node.color}88, 0 0 ${Math.round(15 * loadRatio)}px rgba(244,63,94,0.4)` 
                          : `0 0 ${Math.round(28 * loadRatio)}px ${node.color}55`)
                      : `0 0 10px rgba(0,0,0,0.15)`
                  }}
                >
                  {/* Decorative multi-color gradient border layer for right side icons */}
                  {isRightSide && (
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none opacity-80" 
                      style={{ 
                        padding: '1.5px', 
                        background: node.type === "ai" 
                          ? "linear-gradient(45deg, #e879f9, #8b5cf6, #06b6d4, #34d399)" 
                          : node.type === "kafka"
                          ? "linear-gradient(45deg, #fbbf24, #f97316, #ef4444)"
                          : "linear-gradient(45deg, #818cf8, #a855f7, #ec4899)",
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                        maskComposite: 'exclude', 
                        WebkitMaskComposite: 'xor', 
                        borderRadius: '16px' 
                      }} 
                    />
                  )}

                  {/* Pulsing light behind multi-color icons */}
                  {isRightSide && (
                    <div 
                      className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-full blur-xl animate-pulse"
                      style={{
                        background: node.type === "ai" 
                          ? "radial-gradient(circle, #e879f9, #06b6d4)" 
                          : node.type === "kafka"
                          ? "radial-gradient(circle, #fbbf24, #ef4444)"
                          : "radial-gradient(circle, #818cf8, #ec4899)"
                      }}
                    />
                  )}

                  <Icon 
                    size={iconSize} 
                    color={
                      isRightSide 
                        ? (node.type === "kafka" ? "url(#kafkaGrad)" : node.type === "etl" ? "url(#etlGrad)" : "url(#aiGrad)")
                        : (isNodeActive ? node.color : isLight ? "#475569" : "#64748b")
                    } 
                    strokeWidth={isNodeActive ? 2.5 : 1.5}
                    className={isRightSide ? "scale-105 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-115" : ""}
                  />
                  
                  {isAILink && (
                    <span className="absolute -top-2.5 text-[8px] font-mono text-purple-400 font-extrabold px-1.5 py-0.2 rounded bg-purple-950 border border-purple-500/30 uppercase animate-bounce">
                      BEEGOL CORE
                    </span>
                  )}

                  {/* Tiny lively blinking multi-colored dots inside right-side node frames */}
                  {isRightSide && (
                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        node.type === "ai" ? "bg-fuchsia-400" : node.type === "kafka" ? "bg-amber-400" : "bg-indigo-400"
                      }`} />
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        node.type === "ai" ? "bg-fuchsia-500" : node.type === "kafka" ? "bg-amber-500" : "bg-indigo-500"
                      }`} />
                    </span>
                  )}
                </div>

                {/* Interactive Glossary Card labels inside simulation diagram */}
                <div className="mt-2 text-center select-none pointer-events-auto">
                  <div 
                    className={`text-[8.5px] font-extrabold whitespace-nowrap leading-tight transition-all duration-300 px-3 py-1 rounded-xl border-2 shadow-2xl ${
                      isNodeActive 
                        ? "text-white border-slate-700 bg-slate-950/90" 
                        : isLight 
                        ? "text-slate-700 border-slate-200 bg-white" 
                        : "text-slate-500 border-slate-900 bg-slate-950/90"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <GlossaryTerm word={node.acronym} />
                      <span className={`text-[7px] font-medium font-sans ${isLight ? "text-slate-500" : "text-slate-400"}`}>{node.label}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
