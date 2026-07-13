import React, { useState, useEffect } from "react";
import { useApp, ProtocolMode, VirtualSensor } from "../context/AppContext";
import { 
  Network, 
  Cpu, 
  Gauge, 
  HardDrive, 
  Activity, 
  Terminal, 
  Radio, 
  Info, 
  CheckCircle2, 
  ArrowRightLeft,
  Server,
  Zap,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  X,
  Database,
  ShieldCheck
} from "lucide-react";

interface ProtocolSpec {
  id: ProtocolMode;
  name: string;
  fullName: string;
  transport: "TCP" | "UDP";
  port: number;
  avgPayloadSize: string;
  description: Record<"en" | "pt" | "it", string>;
  
  // Real-time metrics values (simulated but dynamic)
  throughputMultiplier: number;
  backpressureImpact: number;
  cpeCpuLoad: number;
  serverCpuLoad: number;
  bandwidthMbps: number;
  lossRate: string;
  
  // RAW Payload template for display
  payloadTemplate: string;
  payloadType: string;
}

export default function ProtocolResourceVisualizer() {
  const { 
    language, 
    theme, 
    protocolMode, 
    setProtocolMode,
    filterBarrier,
    backpressureValue,
    setBackpressureValue,
    virtualSensors,
    addVirtualSensor,
    removeVirtualSensor
  } = useApp();

  const isLight = theme === "light";
  const currentLang = (language === "pt" || language === "it" ? language : "en") as "en" | "pt" | "it";

  // Telemetry Schema Editor Modal States
  const [isSchemaEditorOpen, setIsSchemaEditorOpen] = useState(false);
  const [newSensorName, setNewSensorName] = useState("");
  const [newSensorField, setNewSensorField] = useState("");
  const [newSensorType, setNewSensorType] = useState("float");
  const [newSensorUnit, setNewSensorUnit] = useState("°C");
  const [newSensorValue, setNewSensorValue] = useState("35.0");
  const [newSensorTarget, setNewSensorTarget] = useState<"user-cpe" | "access-transport" | "control-broker" | "databricks-etl">("user-cpe");
  const [newSensorAddedCost, setNewSensorAddedCost] = useState(5);

  // Dynamic state for live sparkline / metrics fluctuations
  const [pulse, setPulse] = useState(0);
  const [activeTab, setActiveTab] = useState<"visualization" | "comparison">("visualization");
  // Local translations
  const tLocal = {
    en: {
      title: "CPE Telemetry Protocol & Resource Visualizer",
      subtitle: "Observe live network transport overhead, CPU load, and ingestion queue backpressure",
      select_protocol: "Select Active Telemetry Driver",
      metrics_title: "Live Transport & Resource Footprint",
      payload_title: "Ingested Kafka Payload Structure",
      throughput: "Telemetry Ingestion Speed",
      backpressure: "Kafka Queue Backpressure",
      cpe_cpu: "Home CPE Gateway CPU Load",
      server_cpu: "Kafka/Databricks Server Load",
      wan_bandwidth: "WAN Bandwidth Overhead",
      packet_loss: "UDP Packet Loss / Retries",
      optimized: "Optimal",
      critical: "High Load Warning",
      active_status: "ACTIVE DRIVER",
      not_active: "STANDBY DRIVER",
      comparison_tab: "Side-by-Side Benchmark",
      visualizer_tab: "Live Emulation Engine",
      architecture_alert: "Filtering Barrier Impact",
      barrier_active: "Apache NiFi filtering at edge shields Databricks. Direct ingress is healthy.",
      barrier_congested: "TIM is pushing unfiltered raw payloads. High database parser backpressure!",
      payload_format: "Format:",
      cop_success: "System driver re-configured successfully.",
      metric_legend: "Resource Overhead Analysis",
      cpe_res: "CPE Device",
      stream_res: "Server Node",
      otel_strategy_title: "OTel Instrumentation Strategy & Sampling",
      otel_strategy_desc: "Calibrate dynamic metric ingestion density. Align cloud parser costs with AI model training fidelity.",
      prof_aggressive: "Aggressive Filtering",
      prof_aggressive_desc: "Suppresses steady states. Only relays critical anomalies, maximizing budget savings.",
      prof_minimal: "Minimal Payload (Balanced)",
      prof_minimal_desc: "Compresses physical state telemetry into 5-minute averages. Solid default baseline.",
      prof_full: "Full Diagnostic",
      prof_full_desc: "Continuous, high-frequency physical layer telemetry stream. Uncompromised root-cause analysis.",
      est_savings: "Estimated Cloud Ingestion Savings",
      data_fidelity: "Downstream AI Model Fidelity",
      roi_projection: "ROI Projection (5.5M Devices)"
    },
    pt: {
      title: "Visualizador de Recursos e Protocolos CPE",
      subtitle: "Observe em tempo real o overhead de transporte, carga de CPU e backpressure da fila Kafka",
      select_protocol: "Selecione o Driver de Telemetria Ativo",
      metrics_title: "Impacto em Tempo Real e Recursos",
      payload_title: "Estrutura do Payload Ingerido no Kafka",
      throughput: "Velocidade de Ingestão de Telemetria",
      backpressure: "Backpressure da Fila Kafka",
      cpe_cpu: "Carga de CPU no CPE Doméstico",
      server_cpu: "Carga de CPU no Servidor Kafka/Databricks",
      wan_bandwidth: "Uso de Banda WAN (Overhead)",
      packet_loss: "Perda de Pacotes UDP / Re-envio",
      optimized: "Otimizado",
      critical: "Alerta de Sobrecarga",
      active_status: "DRIVER ATIVO",
      not_active: "DRIVER EM ESPERA",
      comparison_tab: "Benchmark Comparativo",
      visualizer_tab: "Motor de Emulação ao Vivo",
      architecture_alert: "Impacto da Barreira de Filtragem",
      barrier_active: "Filtro Apache NiFi ativo na borda protege o Databricks. Ingestão saudável.",
      barrier_congested: "TIM enviando payloads brutos sem filtro. Alto backpressure no parser do DB!",
      payload_format: "Formato:",
      cop_success: "Driver do sistema reconfigurado com sucesso.",
      metric_legend: "Análise de Overhead de Recursos",
      cpe_res: "Dispositivo CPE",
      stream_res: "Nó do Servidor",
      otel_strategy_title: "Estratégia de Instrumentação e Amostragem OTel",
      otel_strategy_desc: "Calibre a granularidade de ingestão. Alinhe custos de nuvem com a fidelidade dos modelos de IA.",
      prof_aggressive: "Filtragem Agressiva",
      prof_aggressive_desc: "Suprime estados estáveis. Transmite apenas anomalias críticas, maximizando economia.",
      prof_minimal: "Payload Mínimo (Equilibrado)",
      prof_minimal_desc: "Compacta métricas em médias de 5 minutos. Excelente cobertura diagnóstica padrão.",
      prof_full: "Diagnóstico Completo",
      prof_full_desc: "Fluxo contínuo de alta frequência. Resolução profunda e irrestrita de problemas na camada física.",
      est_savings: "Economia de Ingestão na Nuvem (Estimada)",
      data_fidelity: "Fidelidade do Modelo de IA de Destino",
      roi_projection: "Projeção de Retorno (5,5M Dispositivos)"
    },
    it: {
      title: "Visualizzatore Risorse & Protocolli CPE",
      subtitle: "Osserva l'effetto del trasporto di rete, carico CPU e backpressure nella coda Kafka",
      select_protocol: "Seleziona Driver di Telemetria Attivo",
      metrics_title: "Impatto in Tempo Reale e Risorse",
      payload_title: "Struttura Payload Ingerito in Kafka",
      throughput: "Velocità Ingestione Telemetria",
      backpressure: "Backpressure della Coda Kafka",
      cpe_cpu: "Carico CPU del Gateway CPE",
      server_cpu: "Carico CPU del Server Kafka/Databricks",
      wan_bandwidth: "Overhead della Banda WAN",
      packet_loss: "Perdita Pacchetti UDP / Rinvii",
      optimized: "Ottimizzato",
      critical: "Avviso Carico Elevato",
      active_status: "DRIVER ATTIVO",
      not_active: "DRIVER IN STANDBY",
      comparison_tab: "Benchmark Comparativo",
      visualizer_tab: "Motore Emulazione Live",
      architecture_alert: "Impatto Barriera di Filtraggio",
      barrier_active: "Il filtraggio Apache NiFi all'edge protegge Databricks. Ingestione sana.",
      barrier_congested: "TIM invia payload grezzi non filtrati. Elevata backpressure nel parser del DB!",
      payload_format: "Formato:",
      cop_success: "Driver del sistema riconfigurato con successo.",
      metric_legend: "Analisi dell'Overhead delle Risorse",
      cpe_res: "Dispositivo CPE",
      stream_res: "Nodo Server",
      otel_strategy_title: "Strategia di Campionamento e Strumentazione OTel",
      otel_strategy_desc: "Calibra la densità di telemetria. Bilancia i costi di cloud parsing con l'accuratezza dei modelli AI.",
      prof_aggressive: "Filtraggio Aggressivo",
      prof_aggressive_desc: "Sopprime gli stati stabili. Invia solo anomalie critiche, massimizzando il risparmio.",
      prof_minimal: "Payload Minimo (Bilanciato)",
      prof_minimal_desc: "Raggruppa metriche in medie di 5 minuti. Copertura diagnostica standard ideale.",
      prof_full: "Diagnostica Completa",
      prof_full_desc: "Flusso continuo di dati fisici ad alta frequenza. Analisi profonda delle cause primarie.",
      est_savings: "Risparmio di Ingestione Cloud Stimato",
      data_fidelity: "Fedeltà del Modello AI di Destinazione",
      roi_projection: "Proiezione ROI (5,5M Dispositivi)"
    }
  };

  const text = tLocal[currentLang];

  // Listener to set OTel sampling strategy from external components
  useEffect(() => {
    const handleSetOTelSampling = (e: Event) => {
      const customEvent = e as CustomEvent<{ profile: "aggressive" | "minimal" | "full" }>;
      if (customEvent.detail && customEvent.detail.profile) {
        const profile = customEvent.detail.profile;
        setSamplingProfile(profile);
        let targetDensity = 60;
        if (profile === "aggressive") targetDensity = 25;
        else if (profile === "full") targetDensity = 100;
        setTelemetryDensity(targetDensity);
        
        const profileLabels = {
          aggressive: "Aggressive Filtering",
          minimal: "Minimal Payload (Balanced)",
          full: "Full Diagnostic (Raw Core)"
        };
        const syslogEvent = new CustomEvent("syslog-event", {
          detail: {
            message: `[OTel-STRATEGY] Configured dynamic OTel sampling to '${profileLabels[profile]}' via closed-loop Backpressure Monitor feedback. Rescaling physical metric bandwidth threshold to ${targetDensity}%.`,
            level: "info"
          }
        });
        window.dispatchEvent(syslogEvent);
      }
    };
    window.addEventListener("set-otel-sampling", handleSetOTelSampling);
    return () => {
      window.removeEventListener("set-otel-sampling", handleSetOTelSampling);
    };
  }, []);

  // Fluctuations interval to simulate active streams
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  interface OTelPoint {
    id: string;
    name: string;
    field: string;
    type: string;
    unit: string;
    value: string;
    addedCpu: number;
    minDensity: number;
  }

  const STANDARD_OTEL_POINTS: OTelPoint[] = [
    { id: "1", name: "DSL Status", field: "dsl_status", type: "enum", unit: "string", value: "UP", addedCpu: 1.0, minDensity: 10 },
    { id: "2", name: "SNR Margin", field: "snr_margin_db", type: "float", unit: "dB", value: "12.5", addedCpu: 1.2, minDensity: 25 },
    { id: "3", name: "Attenuation", field: "attenuation_db", type: "float", unit: "dB", value: "24.2", addedCpu: 1.5, minDensity: 40 },
    { id: "4", name: "Wi-Fi Noise Floor", field: "wifi_noise_floor_dbm", type: "int32", unit: "dBm", value: "-98", addedCpu: 1.8, minDensity: 55 },
    { id: "5", name: "FEC Errors", field: "uncorrectable_fec_errors", type: "uint32", unit: "errors", value: "42", addedCpu: 2.2, minDensity: 70 },
    { id: "6", name: "Rx Optical Power", field: "rx_optical_power_dbm", type: "float", unit: "dBm", value: "-18.4", addedCpu: 2.0, minDensity: 85 }
  ];

  const [telemetryDensity, setTelemetryDensity] = useState(80);
  const [samplingProfile, setSamplingProfile] = useState<"aggressive" | "minimal" | "full">("minimal");

  // Sync profile when telemetryDensity changes
  useEffect(() => {
    if (telemetryDensity <= 35) {
      if (samplingProfile !== "aggressive") setSamplingProfile("aggressive");
    } else if (telemetryDensity < 85) {
      if (samplingProfile !== "minimal") setSamplingProfile("minimal");
    } else {
      if (samplingProfile !== "full") setSamplingProfile("full");
    }
  }, [telemetryDensity]);

  const handleSelectProfile = (profile: "aggressive" | "minimal" | "full") => {
    setSamplingProfile(profile);
    let targetDensity = 60;
    if (profile === "aggressive") targetDensity = 25;
    else if (profile === "full") targetDensity = 100;
    setTelemetryDensity(targetDensity);

    // Dispatch a syslog event for high transparency
    const profileLabels = {
      aggressive: "Aggressive Filtering",
      minimal: "Minimal Payload (Balanced)",
      full: "Full Diagnostic (Raw Core)"
    };
    const event = new CustomEvent("syslog-event", {
      detail: {
        message: `[OTel-STRATEGY] Configured dynamic OTel sampling to '${profileLabels[profile]}'. Rescaling physical metric bandwidth threshold to ${targetDensity}%.`,
        level: "info"
      }
    });
    window.dispatchEvent(event);
  };

  const enabledStandardPoints = STANDARD_OTEL_POINTS.filter(p => telemetryDensity >= p.minDensity);
  const enabledVirtualSensors = virtualSensors.filter((_, idx) => {
    const minD = Math.min(100, 85 + idx * 3);
    return telemetryDensity >= minD;
  });

  const activeStandardCpuImpact = enabledStandardPoints.reduce((acc, p) => acc + p.addedCpu, 0);
  const activeVirtualCpuImpact = enabledVirtualSensors.length * 2.5;

  const otelCpu = Math.round(Math.min(45, 4 + activeStandardCpuImpact * 0.8 + activeVirtualCpuImpact * 0.4));
  const mqttCpu = Math.round(Math.min(65, 12 + activeStandardCpuImpact * 1.8 + activeVirtualCpuImpact * 0.9));
  const snmpCpu = Math.round(Math.min(85, 28 + activeStandardCpuImpact * 3.2 + activeVirtualCpuImpact * 1.6));
  const tr069Cpu = Math.round(Math.min(98, 38 + activeStandardCpuImpact * 4.5 + activeVirtualCpuImpact * 2.2));

  // CPU History for the real-time graph
  interface GraphPoint {
    otel: number;
    active: number;
    legacy: number;
    pulseIndex: number;
  }

  const [cpuHistory, setCpuHistory] = useState<GraphPoint[]>(() => 
    Array.from({ length: 15 }, (_, i) => ({
      otel: 3 + (STANDARD_OTEL_POINTS.length * 0.8 * 80 / 100),
      active: 3 + (STANDARD_OTEL_POINTS.length * 0.8 * 80 / 100),
      legacy: 38 + (STANDARD_OTEL_POINTS.length * 4.5 * 80 / 100),
      pulseIndex: i
    }))
  );

  useEffect(() => {
    setCpuHistory(prev => {
      const noise = (pulse % 3) - 1;
      const currentOtel = Math.max(2, otelCpu + noise * 0.4);
      const currentActive = Math.max(2, (protocolMode === "otel" ? otelCpu : protocolMode === "mqtt" ? mqttCpu : protocolMode === "snmp" ? snmpCpu : tr069Cpu) + noise * 0.8);
      const currentLegacy = Math.max(2, tr069Cpu + noise * 1.2);

      const nextPoint: GraphPoint = {
        otel: +currentOtel.toFixed(1),
        active: +currentActive.toFixed(1),
        legacy: +currentLegacy.toFixed(1),
        pulseIndex: prev.length > 0 ? prev[prev.length - 1].pulseIndex + 1 : 0
      };

      const updated = [...prev, nextPoint];
      if (updated.length > 15) {
        return updated.slice(updated.length - 15);
      }
      return updated;
    });
  }, [pulse, telemetryDensity, virtualSensors, protocolMode]);

  const renderCpuChart = () => {
    const chartWidth = 500;
    const chartHeight = 120;
    const paddingX = 35;
    const paddingY = 20;

    const maxVal = 100;
    const minVal = 0;
    const pointsCount = cpuHistory.length;

    const getX = (index: number) => {
      if (pointsCount <= 1) return paddingX;
      return paddingX + (index / (pointsCount - 1)) * (chartWidth - paddingX * 2);
    };

    const getY = (val: number) => {
      const scale = (val - minVal) / (maxVal - minVal);
      return chartHeight - paddingY - scale * (chartHeight - paddingY * 2);
    };

    const activeLinePoints = cpuHistory.map((p, i) => `${getX(i)},${getY(p.active)}`).join(" ");
    const otelLinePoints = cpuHistory.map((p, i) => `${getX(i)},${getY(p.otel)}`).join(" ");
    const legacyLinePoints = cpuHistory.map((p, i) => `${getX(i)},${getY(p.legacy)}`).join(" ");

    return (
      <div className="relative w-full h-[120px]">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
          {/* Y Grid lines */}
          {[0, 25, 50, 75, 100].map(level => {
            const y = getY(level);
            return (
              <g key={level} className="opacity-40">
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={chartWidth - paddingX} 
                  y2={y} 
                  stroke={isLight ? "#e2e8f0" : "#1e293b"} 
                  strokeWidth="0.8" 
                  strokeDasharray="3 3" 
                />
                <text 
                  x={paddingX - 6} 
                  y={y + 3} 
                  textAnchor="end" 
                  className="text-[8px] font-mono fill-slate-500 font-bold"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Curves */}
          {/* Legacy XML/SOAP line (Red) */}
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
            points={legacyLinePoints}
          />

          {/* Benchmark OTel Line (Dashed Green) */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="4 2"
            points={otelLinePoints}
          />

          {/* Active Protocol Line (Thick & Solid) */}
          <polyline
            fill="none"
            stroke={protocolMode === "otel" ? "#10b981" : protocolMode === "tr069" ? "#ef4444" : protocolMode === "snmp" ? "#f59e0b" : "#0284c7"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={activeLinePoints}
          />

          {/* Latest values marker dot */}
          {cpuHistory.length > 0 && (
            <circle 
              cx={getX(pointsCount - 1)} 
              cy={getY(cpuHistory[pointsCount - 1].active)} 
              r="3.5" 
              fill={protocolMode === "otel" ? "#10b981" : protocolMode === "tr069" ? "#ef4444" : protocolMode === "snmp" ? "#f59e0b" : "#38bdf8"} 
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    );
  };

  const protocols: ProtocolSpec[] = [
    {
      id: "tr069",
      name: "TR-069 (CWMP)",
      fullName: "CPE WAN Management Protocol",
      transport: "TCP",
      port: 7547,
      avgPayloadSize: `${(28.4 + (enabledVirtualSensors.length * 1.2)).toFixed(1)} KB / msg`,
      description: {
        en: "Legacy SOAP/XML over HTTP. Uses synchronous polling queues which generate severe CPU interrupts on the gateway and huge serialized payload blocks in Kafka.",
        pt: "Legado SOAP/XML sobre HTTP. Usa filas de polling síncronas que geram interrupções severas de CPU no gateway e grandes blocos serializados no Kafka.",
        it: "Legacy SOAP/XML su HTTP. Utilizza code di polling sincrone che generano interruzioni CPU elevate sul gateway e blocchi di payload serializzati pesanti in Kafka."
      },
      throughputMultiplier: 0.7,
      backpressureImpact: 78,
      cpeCpuLoad: tr069Cpu,
      serverCpuLoad: Math.min(95, 72 + enabledVirtualSensors.length * 4),
      bandwidthMbps: +(22.4 + (enabledVirtualSensors.length * 1.5)).toFixed(2),
      lossRate: "0.01% (Reliable TCP)",
      payloadType: "SOAP / XML Structure",
      payloadTemplate: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <cwmp:ID soap:mustUnderstand="1">Beegol_TR069_Tx_8921</cwmp:ID>
  </soap:Header>
  <soap:Body>
    <cwmp:SetParameterValues>
      <ParameterList>
        <ParameterValueStruct>
          <Name>Device.DSL.Line.1.Status</Name>
          <Value>Up</Value>
        </ParameterValueStruct>
        ${enabledStandardPoints.map(p => `
        <ParameterValueStruct>
          <Name>Device.Custom.${p.field}</Name>
          <Value>${p.value}</Value>
        </ParameterValueStruct>`).join("")}
        ${enabledVirtualSensors.map(s => `
        <ParameterValueStruct>
          <Name>Device.Virtual.${s.protoFieldName}</Name>
          <Value>${s.value}</Value>
        </ParameterValueStruct>`).join("")}
      </ParameterList>
    </cwmp:SetParameterValues>
  </soap:Body>
</soap:Envelope>`
    },
    {
      id: "mqtt",
      name: "MQTT (Pub/Sub)",
      fullName: "Message Queuing Telemetry Transport",
      transport: "TCP",
      port: 1883,
      avgPayloadSize: `${(2.3 + (enabledVirtualSensors.length * 0.15)).toFixed(1)} KB / msg`,
      description: {
        en: "Lightweight pub/sub protocol over TCP. Devices push compact JSON telemetry messages to an MQTT broker proxy which streams directly into Kafka.",
        pt: "Protocolo pub/sub leve sobre TCP. Dispositivos publicam mensagens compactas de telemetria JSON para um broker MQTT que repassa ao Kafka.",
        it: "Protocollo pub/sub leggero su TCP. I dispositivi pubblicano metriche compatte in JSON su un broker MQTT que reindirizza direttamente in Kafka."
      },
      throughputMultiplier: 1.05,
      backpressureImpact: 35,
      cpeCpuLoad: mqttCpu,
      serverCpuLoad: Math.min(95, 42 + enabledVirtualSensors.length * 3),
      bandwidthMbps: +(4.8 + (enabledVirtualSensors.length * 0.35)).toFixed(2),
      lossRate: "0.02% (Reliable TCP)",
      payloadType: "JSON Key-Value Document",
      payloadTemplate: `{
  "client_id": "TIM-CPE-098251-A2",
  "timestamp": ${Math.floor(Date.now() / 1000)},
  "topic": "tim/telemetry/phys",
  "qos_level": 1,
  "metrics": {
    "dsl_line_status": "Up",
    ${enabledStandardPoints.map(p => `"${p.field}": ${isNaN(Number(p.value)) ? `"${p.value}"` : p.value}`).join(",\n    ")}${enabledVirtualSensors.length > 0 ? ",\n    " + enabledVirtualSensors.map(s => `"${s.protoFieldName}": ${isNaN(Number(s.value)) ? `"${s.value}"` : s.value}`).join(",\n    ") : ""}
  }
}`
    },
    {
      id: "snmp",
      name: "SNMPv3 (UDP Polling)",
      fullName: "Simple Network Management Protocol",
      transport: "UDP",
      port: 161,
      avgPayloadSize: "12.1 KB / message",
      description: {
        en: "Legacy UDP polling standard. High bandwidth overhead due to redundant OID mappings, prone to silent UDP packet loss and processing spikes under heavy network loads.",
        pt: "Padrão legado de polling UDP. Alto consumo de banda devido a mapeamentos OID redundantes, propício a perda silenciosa de pacotes UDP e picos de processamento sob carga alta.",
        it: "Standard di polling legacy basat su UDP. Consumo di banda elevato a causa di mapping OID ridondanti, soggetto a perdite silenziose di pacchetti UDP e picchi sotto carico."
      },
      throughputMultiplier: 0.85,
      backpressureImpact: 62,
      cpeCpuLoad: snmpCpu,
      serverCpuLoad: 68,
      bandwidthMbps: 14.2,
      lossRate: "3.45% (UDP Drops/Retry)",
      payloadType: "ASN.1 BER Binary Stream",
      payloadTemplate: `// Raw ASN.1 Basic Encoding Rules (BER) mapped to standard MIB Object Identifiers (OIDs)
SNMPv3 Message [Length: 184 bytes]
  SecurityParameters: User="tim-beegol-snmp", EngineID=8000000903000b45d2
  PDUType: GetResponseRequest-PDU
    VarBindList:
      - 1.3.6.1.2.1.10.94.1.1.1.1.2 (adslAtucPhysStatus): INTEGER [1] (Up)
      ${enabledStandardPoints.map((p, idx) => `- 1.3.6.1.4.1.41112.1.3.1.1.${idx + 3} (${p.field}): INTEGER [${Math.abs(parseFloat(p.value))}] (${p.value} ${p.unit})`).join("\n      ")}
      ${enabledVirtualSensors.map((s, idx) => `- 1.3.6.1.4.1.41112.1.3.1.2.${idx + 1} (${s.protoFieldName}): INTEGER [${Math.abs(parseFloat(s.value)) || 0}] (${s.value} ${s.unit})`).join("\n      ")}`
    },
    {
      id: "otel",
      name: "OTel / gRPC Stream",
      fullName: "OpenTelemetry over gRPC Protobuf",
      transport: "TCP",
      port: 4317,
      avgPayloadSize: `${(0.8 + (enabledVirtualSensors.length * 0.05)).toFixed(2)} KB / msg`,
      description: {
        en: "HTTP/2 streaming telemetry using Google's binary Protobuf. Extremely low hardware overhead, multiplexed persistent connections, and instantaneous non-blocking ingestion.",
        pt: "Telemetria via stream HTTP/2 usando Protobuf binário do Google. Overhead de hardware extremamente baixo, conexões persistentes multiplexadas e ingestão instantânea síncrona.",
        it: "Telemetria in streaming HTTP/2 tramite Protobuf binario di Google. Overhead hardware minimo, connessioni persistenti multiplex e ingestione asincrona non bloccante."
      },
      throughputMultiplier: 1.25,
      backpressureImpact: 10,
      cpeCpuLoad: otelCpu,
      serverCpuLoad: Math.min(85, 18 + enabledVirtualSensors.length * 1.5),
      bandwidthMbps: +(1.2 + (enabledVirtualSensors.length * 0.12)).toFixed(2),
      lossRate: "0.00% (HTTP/2 Stream OK)",
      payloadType: "Protocol Buffers (Proto3)",
      payloadTemplate: `syntax = "proto3";
package opentelemetry.proto.metrics.v1;

message CpePhysicalMetrics {
  string gateway_uuid = 1; // "TIM-CPE-098251-A2"
  uint64 timestamp_ns = 2; // Nano clock precision
  
  enum Status { UP = 0; DOWN = 1; FAULT = 2; }
  Status dsl_status = 3;   // UP
  
${enabledStandardPoints.filter(p => p.field !== "dsl_status").map((p, idx) => `  ${p.type === "enum" ? "string" : p.type} ${p.field} = ${idx + 4}; // Unit: ${p.unit}, Value: ${p.value}`).join("\n")}
${enabledVirtualSensors.length > 0 ? `\n  // Dynamic OTel Virtual Sensors attached:\n` + enabledVirtualSensors.map((s, idx) => `  ${s.protoFieldType} ${s.protoFieldName} = ${idx + 10}; // Unit: ${s.unit}, Value: ${s.value} (${s.name})`).join("\n") : ""}
}`
    }
  ];

  const activeSpec = protocols.find(p => p.id === protocolMode) || protocols[1];

  const presets = [
    { name: "Laser Temp", field: "gpon_laser_temp", type: "float", unit: "°C", value: "48.2", target: "access-transport" as const, cost: 8 },
    { name: "Laser Bias", field: "gpon_laser_bias_ma", type: "float", unit: "mA", value: "12.4", target: "access-transport" as const, cost: 12 },
    { name: "Wi-Fi Airtime", field: "wifi_airtime_util", type: "float", unit: "%", value: "32.5", target: "user-cpe" as const, cost: 6 },
    { name: "USP Ping RTT", field: "usp_ping_rtt_ms", type: "int32", unit: "ms", value: "14", target: "control-broker" as const, cost: 5 },
    { name: "Memory Usage", field: "cpe_mem_util_percent", type: "float", unit: "%", value: "68.4", target: "user-cpe" as const, cost: 4 },
    { name: "Spark Latency", field: "spark_microbatch_lat_ms", type: "int32", unit: "ms", value: "185", target: "databricks-etl" as const, cost: 25 },
  ];

  const handlePresetSelect = (preset: {
    name: string;
    field: string;
    type: string;
    unit: string;
    value: string;
    target: "user-cpe" | "access-transport" | "control-broker" | "databricks-etl";
    cost: number;
  }) => {
    setNewSensorName(preset.name);
    setNewSensorField(preset.field);
    setNewSensorType(preset.type);
    setNewSensorUnit(preset.unit);
    setNewSensorValue(preset.value);
    setNewSensorTarget(preset.target);
    setNewSensorAddedCost(preset.cost);
  };

  const handleAddSensorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensorName.trim()) return;

    let fieldName = newSensorField.trim();
    if (!fieldName) {
      fieldName = newSensorName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    }

    const currentMaxNum = virtualSensors.reduce((max, s) => Math.max(max, s.protoFieldNumber), 8);
    const fieldNumber = currentMaxNum + 1;

    const sensor: VirtualSensor = {
      id: "v_" + Date.now(),
      name: newSensorName.trim(),
      protoFieldName: fieldName,
      protoFieldType: newSensorType,
      protoFieldNumber: fieldNumber,
      unit: newSensorUnit,
      value: newSensorValue,
      targetAppliance: newSensorTarget,
      addedCost: newSensorAddedCost
    };

    addVirtualSensor(sensor);

    setNewSensorName("");
    setNewSensorField("");
    setNewSensorValue("");
    
    const event = new CustomEvent("syslog-event", {
      detail: {
        message: `[OTEL-COMPILER] Dynamic Schema Expansion OK: Attached '${sensor.name}' as Field #${fieldNumber} (${sensor.protoFieldType} ${sensor.protoFieldName}) targeting [${sensor.targetAppliance.toUpperCase()}]. Active streams compiled dynamically.`,
        level: "success"
      }
    });
    window.dispatchEvent(event);
  };

  const selectProtocol = (mode: ProtocolMode, name: string) => {
    setProtocolMode(mode);
    
    // Auto scale backpressure base based on protocol + current barrier
    let baseBP = 12;
    if (filterBarrier === "after-kafka") baseBP += 54;
    
    if (mode === "tr069") baseBP += 28;
    else if (mode === "snmp") baseBP += 20;
    else if (mode === "mqtt") baseBP += 8;
    else if (mode === "gnmi") baseBP += 14;
    else if (mode === "otel") baseBP -= 5;

    setBackpressureValue(Math.max(4, Math.min(98, baseBP)));

    // Emit event to terminal logs
    const event = new CustomEvent("syslog-event", {
      detail: {
        message: `[SYS-DRIVER] RE-ROUTING PIPELINE TO TELEMETRY DRIVER: ${name.toUpperCase()} (Port: ${protocols.find(p => p.id === mode)?.port}, Format: ${protocols.find(p => p.id === mode)?.payloadType}). Syncing Kafka stream compression and parsing schema.`,
        level: mode === "tr069" || mode === "snmp" ? "warning" : "success"
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className={`w-full rounded-2xl border-2 shadow-2xl overflow-hidden transition-all duration-300 ${
      isLight ? "bg-white border-slate-200" : "bg-slate-950/75 border-slate-900/90"
    }`}>
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 p-4 border-b border-sky-900/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="text-sky-400 animate-pulse" size={16} />
              <span className="font-mono text-[10px] font-black tracking-widest text-sky-400 uppercase">
                {language === "pt" ? "EMULAÇÃO DE PROTOCOLO CPE" : language === "it" ? "EMULAZIONE PROTOCOLLO CPE" : "CPE PROTOCOL EMULATION SUITE"}
              </span>
            </div>
            <h3 className="text-md font-black text-white tracking-tight mt-1">
              {text.title}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              {text.subtitle}
            </p>
          </div>

          {/* Tab selectors */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab("visualization")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeTab === "visualization"
                  ? "bg-sky-500 text-slate-950 shadow-md font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {text.visualizer_tab}
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeTab === "comparison"
                  ? "bg-sky-500 text-slate-950 shadow-md font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {text.comparison_tab}
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      {activeTab === "visualization" ? (
        <div className="p-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          
          {/* Left panel: Protocol Selection Cards (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-3">
            <h4 className={`text-xs font-mono font-black uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5`}>
              <Radio size={13} className="text-slate-500" />
              {text.select_protocol}
            </h4>

            {protocols.map(proto => {
              const isActive = protocolMode === proto.id;
              let activeBorderColor = "border-sky-500 ring-2 ring-sky-500/20";
              let badgeBg = "bg-sky-500/10 text-sky-400 border-sky-500/20";
              
              if (isActive) {
                if (proto.id === "tr069") activeBorderColor = "border-rose-500 ring-2 ring-rose-500/20";
                else if (proto.id === "snmp") activeBorderColor = "border-amber-500 ring-2 ring-amber-500/20";
                else if (proto.id === "otel") activeBorderColor = "border-emerald-500 ring-2 ring-emerald-500/20";
              }

              return (
                <button
                  key={proto.id}
                  onClick={() => selectProtocol(proto.id, proto.name)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-2.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                    isActive
                      ? `${activeBorderColor} bg-sky-500/[0.02]`
                      : isLight
                      ? "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                      : "border-slate-900 hover:border-slate-800 bg-slate-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-tight flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isActive
                          ? proto.id === "tr069" ? "bg-rose-500 animate-pulse" : proto.id === "snmp" ? "bg-amber-500 animate-pulse" : proto.id === "otel" ? "bg-emerald-500" : "bg-sky-400"
                          : "bg-slate-500"
                      }`} />
                      <span className={isActive ? "text-sky-400 font-extrabold" : isLight ? "text-slate-800" : "text-slate-200"}>
                        {proto.name}
                      </span>
                    </span>

                    <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded border ${
                      isActive 
                        ? proto.id === "tr069" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : proto.id === "snmp" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : proto.id === "otel" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                        : "bg-slate-500/5 text-slate-500 border-slate-500/10"
                    }`}>
                      {isActive ? text.active_status : text.not_active}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-medium">
                    {proto.description[currentLang]}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-500/10 text-[9.5px] font-mono text-slate-500">
                    <div>
                      <span>Socket:</span> <span className="font-bold text-slate-400">{proto.transport} / {proto.port}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-slate-800" />
                    <div>
                      <span>Avg Frame:</span> <span className="font-bold text-slate-400">{proto.avgPayloadSize}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Dynamic Telemetry Schema Editor Button */}
            <div className={`mt-2 p-3.5 rounded-xl border border-dashed flex flex-col gap-2.5 transition-all ${
              isLight ? "bg-slate-50 border-slate-300" : "bg-slate-900/10 border-slate-800/30"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-slate-400 flex items-center gap-1.5">
                  <Database size={12} className="text-emerald-400 animate-pulse" />
                  OTel Schema Extensibility
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 text-[8px] font-mono px-2 py-0.5 rounded border border-emerald-500/25">
                  DYNAMIC
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                Add virtual sensors dynamically to live OTel & MQTT streams to collect granular physical/transceiver metrics in real-time.
              </p>
              <button
                onClick={() => setIsSchemaEditorOpen(true)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Settings size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
                TELEMETRY SCHEMA EDITOR
              </button>
            </div>
          </div>

          {/* Middle panel: Live Impact Gauges (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <h4 className={`text-xs font-mono font-black uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5`}>
              <Gauge size={13} className="text-slate-500" />
              {text.metrics_title}
            </h4>

            <div className={`p-4 rounded-2xl border flex-grow flex flex-col justify-between gap-4 ${
              isLight ? "bg-slate-50/50 border-slate-200/80" : "bg-slate-900/30 border-slate-900"
            }`}>
              {/* Metric 1: Telemetry Ingest Rate */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Activity size={12} className="text-sky-400" />
                    {text.throughput}
                  </span>
                  <span className={`font-bold ${
                    activeSpec.id === "tr069" || activeSpec.id === "snmp" ? "text-amber-500" : "text-emerald-400"
                  }`}>
                    {activeSpec.id === "tr069" ? "~497k msg/s" : activeSpec.id === "snmp" ? "~820k msg/s" : activeSpec.id === "otel" ? "~2.12M msg/s" : "~1.84M msg/s"}
                  </span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-700 ${
                      activeSpec.id === "tr069" ? "bg-rose-500" : activeSpec.id === "snmp" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${activeSpec.throughputMultiplier * 80}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Queue Backpressure */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <HardDrive size={12} className="text-indigo-400" />
                    {text.backpressure}
                  </span>
                  <span className={`font-black ${
                    backpressureValue > 45 ? "text-rose-500 animate-pulse" : "text-emerald-400"
                  }`}>
                    {backpressureValue}%
                  </span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-700 ${
                      backpressureValue > 70 ? "bg-rose-500 animate-pulse" : backpressureValue > 45 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${backpressureValue}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: CPE CPU Load */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Cpu size={12} className="text-teal-400" />
                    {text.cpe_cpu}
                  </span>
                  <span className="font-bold text-slate-300">
                    {activeSpec.cpeCpuLoad + (pulse % 3 - 1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div 
                    className="h-2 rounded-full bg-teal-400 transition-all duration-700"
                    style={{ width: `${activeSpec.cpeCpuLoad}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Ingestion Server CPU Load */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Server size={12} className="text-purple-400" />
                    {text.server_cpu}
                  </span>
                  <span className="font-bold text-slate-300">
                    {activeSpec.serverCpuLoad + (pulse % 5 - 2)}%
                  </span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-700 ${
                      activeSpec.serverCpuLoad > 75 ? "bg-rose-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${activeSpec.serverCpuLoad}%` }}
                  />
                </div>
              </div>

              {/* Metric 5: WAN Overhead & Losses */}
              <div className="flex flex-col bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <div className="flex justify-between text-[9.5px] font-mono text-slate-500">
                  <span>{text.wan_bandwidth}:</span>
                  <span className="font-bold text-slate-300">{activeSpec.bandwidthMbps} Mbps / CPE</span>
                </div>
                <div className="flex justify-between text-[9.5px] font-mono text-slate-500 mt-1.5">
                  <span>{text.packet_loss}:</span>
                  <span className={`font-black ${
                    activeSpec.id === "snmp" ? "text-rose-400" : "text-slate-400"
                  }`}>
                    {activeSpec.lossRate}
                  </span>
                </div>
              </div>

              {/* Dynamic Filtering Sync Info */}
              <div className={`p-2.5 rounded-lg border text-[10px] flex items-start gap-2 ${
                filterBarrier === "before-kafka"
                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/90"
                  : "bg-rose-500/5 border-rose-500/10 text-rose-400/90"
              }`}>
                <Info size={13} className="shrink-0 mt-0.5" />
                <p className="leading-normal font-medium">
                  {filterBarrier === "before-kafka" ? text.barrier_active : text.barrier_congested}
                </p>
              </div>

            </div>
          </div>

          {/* Right panel: Raw Ingestion Payload Structure (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h4 className={`text-xs font-mono font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5`}>
                <Terminal size={13} className="text-slate-500" />
                {text.payload_title}
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {text.payload_format} <span className="font-black text-sky-400 uppercase">{activeSpec.payloadType}</span>
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-900/80 shadow-inner flex-grow flex flex-col">
              {/* Terminal Window Header Bar */}
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-950">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-[9px] text-slate-500">kafka-ingest-inspector // {activeSpec.id}.log</span>
              </div>

              {/* Code Panel */}
              <pre className="bg-slate-950 p-4 font-mono text-[10px] text-slate-300 leading-normal overflow-auto flex-grow h-[260px] max-h-[350px]">
                <code>{activeSpec.payloadTemplate}</code>
              </pre>
            </div>
          </div>
        </div>

          {/* OTel Instrumentation Strategy & Sampling Profile Panel */}
          <div className={`p-5 rounded-2xl border ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/40 border-slate-900"
          } flex flex-col gap-4 mt-1`}>
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-500/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <ShieldCheck size={16} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-black uppercase tracking-wider text-sky-400">
                    {text.otel_strategy_title}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium mt-0.5">
                    {text.otel_strategy_desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                  DYNAMIC COUPLING
                </span>
              </div>
            </div>

            {/* Profile Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  id: "aggressive" as const,
                  name: text.prof_aggressive,
                  desc: text.prof_aggressive_desc,
                  fidelity: 25,
                  savings: 80,
                  monthlySavingsVal: "$14,800",
                  volume: "0.84 TB/day",
                  color: "sky",
                  fidelityDesc: language === "pt" ? "Apenas anomalias críticas" : language === "it" ? "Solo anomalie critiche" : "Anomalies & Exceptions only",
                  badge: language === "pt" ? "Econômico" : language === "it" ? "Economico" : "Budget-Saver"
                },
                {
                  id: "minimal" as const,
                  name: text.prof_minimal,
                  desc: text.prof_minimal_desc,
                  fidelity: 70,
                  savings: 46,
                  monthlySavingsVal: "$8,500",
                  volume: "2.26 TB/day",
                  color: "indigo",
                  fidelityDesc: language === "pt" ? "Métricas agregadas em 5 min" : language === "it" ? "Metriche aggregate a 5 min" : "5-min aggregated stats",
                  badge: language === "pt" ? "Recomendado" : language === "it" ? "Consigliato" : "Optimal Balanced"
                },
                {
                  id: "full" as const,
                  name: text.prof_full,
                  desc: text.prof_full_desc,
                  fidelity: 100,
                  savings: 0,
                  monthlySavingsVal: "$0 (Baseline)",
                  volume: "4.20 TB/day",
                  color: "rose",
                  fidelityDesc: language === "pt" ? "Telemetria bruta contínua" : language === "it" ? "Telemetria grezza continua" : "Raw continuous streams",
                  badge: language === "pt" ? "Máxima Resolução" : language === "it" ? "Massima Risoluzione" : "High-Res Diagnostic"
                }
              ].map((strategy) => {
                const isSelected = samplingProfile === strategy.id;
                let activeBorder = "border-sky-500 shadow-lg shadow-sky-500/5 bg-sky-500/[0.01]";
                let badgeStyle = "bg-sky-500/15 text-sky-400 border border-sky-500/25";
                
                if (strategy.color === "indigo") {
                  if (isSelected) activeBorder = "border-indigo-500 shadow-lg shadow-indigo-500/5 bg-indigo-500/[0.01]";
                  badgeStyle = "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25";
                } else if (strategy.color === "rose") {
                  if (isSelected) activeBorder = "border-rose-500 shadow-lg shadow-rose-500/5 bg-rose-500/[0.01]";
                  badgeStyle = "bg-rose-500/15 text-rose-400 border border-rose-500/25";
                }

                return (
                  <button
                    key={strategy.id}
                    type="button"
                    onClick={() => handleSelectProfile(strategy.id)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] group ${
                      isSelected
                        ? activeBorder
                        : isLight
                        ? "border-slate-200 hover:border-slate-300 bg-slate-100/30"
                        : "border-slate-900/60 hover:border-slate-800 bg-slate-900/20"
                    }`}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black tracking-tight text-slate-200 group-hover:text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            isSelected 
                              ? strategy.color === "sky" ? "bg-sky-400" : strategy.color === "indigo" ? "bg-indigo-400" : "bg-rose-400"
                              : "bg-slate-600"
                          }`} />
                          <span className={isSelected ? "text-slate-100 font-extrabold" : "text-slate-300 font-bold"}>
                            {strategy.name}
                          </span>
                        </span>
                        <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded ${badgeStyle}`}>
                          {strategy.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1.5">
                        {strategy.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-500/10 w-full flex flex-col gap-1 text-[9px] font-mono text-slate-500">
                      <div className="flex justify-between">
                        <span>{language === "pt" ? "Fidelidade de IA:" : language === "it" ? "Fedeltà AI:" : "AI Model Fidelity:"}</span>
                        <span className={`font-bold ${
                          strategy.fidelity >= 90 ? "text-emerald-400" : strategy.fidelity >= 60 ? "text-indigo-400" : "text-sky-400"
                        }`}>{strategy.fidelity}% ({strategy.fidelityDesc})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === "pt" ? "Uso de Banda:" : language === "it" ? "Banda WAN:" : "WAN Bandwidth:"}</span>
                        <span className="font-semibold text-slate-300">
                          {strategy.id === "aggressive" ? "0.2 Mbps" : strategy.id === "minimal" ? "1.1 Mbps" : "3.5 Mbps"} / device
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Savings & Fidelity Comparison Visualizer bars */}
            <div className={`p-4 rounded-xl border ${
              isLight ? "bg-white border-slate-100" : "bg-slate-900/40 border-slate-900"
            } grid grid-cols-1 lg:grid-cols-2 gap-5`}>
              
              {/* Cost savings visualization */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="font-bold text-slate-400 flex items-center gap-1">
                    <DollarSign size={13} className="text-emerald-400" />
                    {text.est_savings}
                  </span>
                  <span className="font-extrabold text-emerald-400 text-xs">
                    {samplingProfile === "aggressive" ? "80% Savings" : samplingProfile === "minimal" ? "46% Savings" : "0% Savings (Baseline)"}
                  </span>
                </div>
                
                {/* Visual bar */}
                <div className="w-full bg-slate-950/60 rounded-full h-3 border border-slate-800 overflow-hidden relative">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${samplingProfile === "aggressive" ? 80 : samplingProfile === "minimal" ? 46 : 0}%` }}
                  />
                  {/* Dynamic Save Indicators */}
                  <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none text-[8.5px] font-mono text-slate-500/80 font-extrabold">
                    <span>Baseline</span>
                    <span>Minimal ($8.5k/mo)</span>
                    <span>Aggressive ($14.8k/mo)</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal mt-1">
                  {language === "pt" 
                    ? "Economiza custos operacionais significativos no parser Kafka e no pipeline de dados ETL Databricks reduzindo pacotes redundantes." 
                    : language === "it"
                    ? "Riduce i costi operativi nel parser Kafka e nelle pipeline dati Databricks eliminando i pacchetti ridondanti."
                    : "Reduces operational ingestion parser load and Databricks ETL streaming costs by discarding redundant heartbeat metrics."}
                </p>
              </div>

              {/* Data Fidelity visualization */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="font-bold text-slate-400 flex items-center gap-1">
                    <Activity size={13} className="text-indigo-400" />
                    {text.data_fidelity}
                  </span>
                  <span className={`font-extrabold text-xs ${
                    samplingProfile === "full" ? "text-emerald-400" : samplingProfile === "minimal" ? "text-indigo-400" : "text-sky-400"
                  }`}>
                    {samplingProfile === "full" ? "100% High-Fidelity" : samplingProfile === "minimal" ? "70% Balanced" : "25% Degraded Coverage"}
                  </span>
                </div>
                
                {/* Visual bar */}
                <div className="w-full bg-slate-950/60 rounded-full h-3 border border-slate-800 overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      samplingProfile === "full" 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                        : samplingProfile === "minimal" 
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-400" 
                        : "bg-gradient-to-r from-sky-500 to-sky-400"
                    }`}
                    style={{ width: `${samplingProfile === "aggressive" ? 25 : samplingProfile === "minimal" ? 70 : 100}%` }}
                  />
                  {/* Dynamic Fidelity Markers */}
                  <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none text-[8.5px] font-mono text-slate-500/80 font-extrabold">
                    <span>Critical Alerts Only</span>
                    <span>Anomalies Isolated</span>
                    <span>Continuous High-Res</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal mt-1">
                  {language === "pt"
                    ? "Níveis mais altos permitem que os algoritmos de Deep Learning da Beegol prevejam e isolem anomalias de rede sub-milissegundo."
                    : language === "it"
                    ? "I livelli più alti consentono agli algoritmi di Deep Learning Beegol di prevedere ed isolare anomalie sub-millisecondo."
                    : "Higher fidelity levels empower Beegol Deep Learning models to execute proactive root-cause isolation and sub-millisecond anomaly detection."}
                </p>
              </div>

            </div>

            {/* Ingestion Projections Banner */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10.5px] font-mono">
              <span className="text-slate-400 uppercase font-black flex items-center gap-1.5">
                <Zap size={13} className="text-amber-400 animate-pulse" />
                {text.roi_projection}:
              </span>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{language === "pt" ? "Volume:" : language === "it" ? "Volume:" : "Data Volume:"}</span>
                  <strong className="text-slate-200">
                    {samplingProfile === "aggressive" ? "0.84 TB/day" : samplingProfile === "minimal" ? "2.26 TB/day" : "4.20 TB/day"}
                  </strong>
                </div>
                <div className="w-[1px] h-3 bg-slate-800 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{language === "pt" ? "Economia Realizada:" : language === "it" ? "Risparmio:" : "Saving Realized:"}</span>
                  <strong className="text-emerald-400">
                    {samplingProfile === "aggressive" ? "$14,800 / mo" : samplingProfile === "minimal" ? "$8,500 / mo" : "$0 (Baseline)"}
                  </strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* COMPARATIVE BENCHMARK TAB */
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-sky-400" size={14} />
            <span className="text-xs font-mono font-black uppercase tracking-wider">{text.metric_legend}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className={`border-b ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/60"}`}>
                  <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">Protocol</th>
                  <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">{text.cpe_res} CPU</th>
                  <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">{text.stream_res} CPU</th>
                  <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">Bandwidth (WAN)</th>
                  <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">Frame Size</th>
                  <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">Kafka Queue State</th>
                </tr>
              </thead>
              <tbody>
                {protocols.map(p => {
                  const isCurrent = protocolMode === p.id;
                  
                  let cpuColor = "text-emerald-400";
                  if (p.cpeCpuLoad > 25) cpuColor = "text-rose-400";
                  else if (p.cpeCpuLoad > 10) cpuColor = "text-amber-400";

                  let serverCpuColor = "text-emerald-400";
                  if (p.serverCpuLoad > 75) serverCpuColor = "text-rose-400 animate-pulse font-black";
                  else if (p.serverCpuLoad > 45) serverCpuColor = "text-amber-400";

                  let stateBadge = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                  let stateLabel = "Optimal Ingestion";
                  if (p.id === "tr069") {
                    stateBadge = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                    stateLabel = "Severe Congestion";
                  } else if (p.id === "snmp") {
                    stateBadge = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                    stateLabel = "UDP Retries / Loss";
                  }

                  return (
                    <tr 
                      key={p.id} 
                      className={`border-b transition-colors ${
                        isCurrent 
                          ? isLight ? "bg-sky-500/5 font-bold" : "bg-sky-500/[0.04] font-bold"
                          : isLight ? "border-slate-100 hover:bg-slate-50/50" : "border-slate-900/60 hover:bg-slate-900/20"
                      }`}
                    >
                      <td className="p-3">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            isCurrent ? "bg-sky-400 animate-ping" : "bg-slate-600"
                          }`} />
                          <span className={isCurrent ? "text-sky-400" : isLight ? "text-slate-800" : "text-slate-200"}>
                            {p.name} {isCurrent && "✓"}
                          </span>
                        </span>
                      </td>
                      <td className={`p-3 font-bold ${cpuColor}`}>{p.cpeCpuLoad}%</td>
                      <td className={`p-3 font-bold ${serverCpuColor}`}>{p.serverCpuLoad}%</td>
                      <td className="p-3 text-slate-300">{p.bandwidthMbps} Mbps / CPE</td>
                      <td className="p-3 text-slate-400">{p.avgPayloadSize}</td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${stateBadge}`}>
                          {stateLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-xl border border-slate-900/60 bg-slate-950/40 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
            <Info size={15} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-300 mb-0.5">Architectural Conclusion on Telemetry Standards:</p>
              <p>
                Ditching legacy <strong>TR-069</strong> or <strong>SNMP</strong> UDP polling in favor of OpenTelemetry (<strong>OTel over gRPC</strong> with binary Protobuf) decreases WAN bandwidth overhead by over <strong>94%</strong>, lowers home gateway CPU interrupts by <strong>10x</strong>, and relieves critical Kafka cluster backpressure. This guarantees the highest ML inference precision inside Beegol Cloud by supplying steady, uncorrupted physical SNR metrics in real-time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Schema Editor Modal Overlay */}
      {isSchemaEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-2xl border border-sky-500/30 shadow-2xl overflow-hidden transition-all duration-300 ${
            isLight ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900 border-slate-800 text-slate-100"
          }`}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 p-4 border-b border-sky-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} size={18} />
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight font-mono">
                    TELEMETRY SCHEMA INSTRUMENTATION ENGINE
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 font-mono">
                    OTel Protobuf & MQTT Topic Extensibility Module
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSchemaEditorOpen(false)}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer border border-slate-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto flex flex-col gap-5">
              {/* Telemetry Density Control & Real-time CPU overhead panel */}
              <div className={`p-4 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/40 border-slate-800"
              } flex flex-col gap-4`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Activity size={14} className="text-sky-400 animate-pulse" />
                    CPE TELEMETRY DENSITY & OVERHEAD MONITOR
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-black border ${
                    telemetryDensity < 35
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : telemetryDensity < 65
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      : telemetryDensity < 90
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {telemetryDensity < 35
                      ? "LIGHT TELEMETRY"
                      : telemetryDensity < 65
                      ? "BALANCED DETECT"
                      : telemetryDensity < 90
                      ? "FINE-GRAINED TRACING"
                      : "RAW CHIP DUMP"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Left block - Slider */}
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Adjust the **CPE Telemetry Density** slider to enable or disable individual OTel instrumentation points dynamically. Observe how increased granularity triggers processing spikes and memory contention inside the subscriber appliance.
                    </p>

                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 mb-1">
                        <span>Telemetry Density Slider</span>
                        <span className="text-sky-400 font-black">{telemetryDensity}%</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={telemetryDensity}
                        onChange={(e) => setTelemetryDensity(Number(e.target.value))}
                        className="w-full accent-sky-400 cursor-ew-resize bg-slate-900 rounded-lg h-2"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                        <span>10% (Minimal)</span>
                        <span>50% (Standard)</span>
                        <span>100% (Raw Core)</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900/60 flex flex-col">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Active Core Points</span>
                        <span className="text-xs font-bold text-slate-200 mt-0.5">
                          {enabledStandardPoints.length} / {STANDARD_OTEL_POINTS.length}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900/60 flex flex-col">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Virtual Attached</span>
                        <span className="text-xs font-bold text-slate-200 mt-0.5">
                          {enabledVirtualSensors.length} / {virtualSensors.length} active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right block - Realtime Graph */}
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-900/60 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400">REAL-TIME OVERHEAD (% CPU)</span>
                      <span className="flex items-center gap-1.5 text-[8px] font-mono text-slate-500">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
                        LIVE STREAMING
                      </span>
                    </div>

                    {renderCpuChart()}

                    {/* Graph Legend */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center justify-center text-[9px] font-mono mt-1 pt-1.5 border-t border-slate-900/30">
                      <span className="flex items-center gap-1 text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          protocolMode === "otel" ? "bg-emerald-400" : protocolMode === "tr069" ? "bg-rose-400" : protocolMode === "snmp" ? "bg-amber-400" : "bg-sky-400"
                        }`} />
                        Active ({activeSpec.name}): <strong className="text-slate-100">{cpuHistory[cpuHistory.length - 1]?.active}%</strong>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full" />
                        OTel Stream (Ref): <strong className="text-slate-400">{cpuHistory[cpuHistory.length - 1]?.otel}%</strong>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-1.5 h-1.5 bg-rose-500/40 rounded-full" />
                        Legacy TR-069 (Ref): <strong className="text-slate-400">{cpuHistory[cpuHistory.length - 1]?.legacy}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-block: Instrumentation Points Toggles list */}
                <div className="mt-1">
                  <span className="text-[10px] font-mono font-black uppercase text-slate-400 block mb-2">
                    🎯 OTel Point Activation Grid (Based on Density Slider Threshold)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STANDARD_OTEL_POINTS.map(p => {
                      const active = telemetryDensity >= p.minDensity;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setTelemetryDensity(p.minDensity)}
                          className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            active
                              ? isLight
                                ? "bg-emerald-50/60 border-emerald-200 text-slate-800"
                                : "bg-emerald-500/5 border-emerald-500/20 text-slate-200"
                              : isLight
                              ? "bg-slate-50 border-slate-100 text-slate-400 opacity-60 hover:opacity-100"
                              : "bg-slate-900/40 border-slate-900 text-slate-500 opacity-50 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-mono text-[9px] text-slate-500 font-bold">Thresh: {p.minDensity}%</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-slate-700"}`} />
                          </div>
                          <span className="text-[10px] font-bold mt-1 truncate">{p.name}</span>
                          <span className="font-mono text-[8px] text-slate-400 mt-0.5 truncate">{p.field} (+{p.addedCpu}% CPU)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Sensors Table */}
              <div>
                <h4 className="text-xs font-mono font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Database size={13} className="text-emerald-400" />
                  Currently Instrumenting parameters ({virtualSensors.length})
                </h4>
                {virtualSensors.length === 0 ? (
                  <div className={`p-4 rounded-xl text-center border border-dashed ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-slate-950/40 border-slate-900 text-slate-500"
                  } text-xs`}>
                    No custom virtual sensors attached. Use the form below or choose a preset to add instrumentation parameters.
                  </div>
                ) : (
                  <div className={`overflow-x-auto rounded-xl border ${
                    isLight ? "border-slate-200" : "border-slate-800 bg-slate-950/30"
                  }`}>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-800 text-slate-450"}`}>
                          <th className="p-2 font-mono text-[10px]">Sensor Name</th>
                          <th className="p-2 font-mono text-[10px]">Appliance Node</th>
                          <th className="p-2 font-mono text-[10px]">Protobuf Field Spec</th>
                          <th className="p-2 font-mono text-[10px]">Simulated Value</th>
                          <th className="p-2 font-mono text-[10px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {virtualSensors.map(sensor => (
                          <tr key={sensor.id} className={`border-b ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-slate-800/50 hover:bg-slate-900/40"}`}>
                            <td className="p-2 font-semibold">{sensor.name}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                sensor.targetAppliance === "user-cpe"
                                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/15"
                                  : sensor.targetAppliance === "access-transport"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                                  : sensor.targetAppliance === "control-broker"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/15"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                              }`}>
                                {sensor.targetAppliance === "user-cpe" ? "Home CPE" : sensor.targetAppliance === "access-transport" ? "OLT GPON" : sensor.targetAppliance === "control-broker" ? "USP Broker" : "Databricks"}
                              </span>
                            </td>
                            <td className="p-2 font-mono text-slate-400">
                              <span className="text-emerald-400">{sensor.protoFieldType}</span> {sensor.protoFieldName} = {sensor.protoFieldNumber};
                            </td>
                            <td className="p-2 font-mono text-slate-300 font-bold">{sensor.value} {sensor.unit}</td>
                            <td className="p-2 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nodeIdMap: Record<string, string> = {
                                      "user-cpe": "home-gateway",
                                      "access-transport": "gpon-ont",
                                      "control-broker": "vccap-node",
                                      "databricks-etl": "vccap-node"
                                    };
                                    const targetNodeId = nodeIdMap[sensor.targetAppliance] || "home-gateway";
                                    const event = new CustomEvent("open-appliance-terminal", {
                                      detail: { nodeId: targetNodeId }
                                    });
                                    window.dispatchEvent(event);
                                  }}
                                  className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 cursor-pointer transition-all border border-emerald-500/15"
                                  title="Open Remote Remediation Terminal"
                                >
                                  <Terminal size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeVirtualSensor(sensor.id);
                                    const event = new CustomEvent("syslog-event", {
                                      detail: {
                                        message: `[OTEL-COMPILER] Hot-Detached '${sensor.name}' (Field #${sensor.protoFieldNumber}). Removed from binary Protobuf serializations.`,
                                        level: "warning"
                                      }
                                    });
                                    window.dispatchEvent(event);
                                  }}
                                  className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer transition-all border border-rose-500/10"
                                  title="Remove sensor parameter"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Presets List */}
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-slate-400 block mb-2">
                  ⚡ Load Telemetry Presets (One-Click Auto-Fill)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {presets.map(p => (
                    <button
                      key={p.field}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`p-1.5 rounded-lg border text-left text-[11px] flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                        isLight
                          ? "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                          : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <span className="font-semibold text-slate-300 truncate">{p.name}</span>
                      <span className="font-mono text-[9px] text-emerald-400 truncate mt-0.5">{p.type} {p.field}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add New Sensor Form */}
              <form onSubmit={handleAddSensorSubmit} className={`p-4 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/30 border-slate-800"
              } flex flex-col gap-4`}>
                <h5 className="text-xs font-mono font-black text-slate-350 uppercase tracking-wide">
                  ➕ Instrument New Custom Metric Parameter
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Sensor Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Laser Bias Current"
                      value={newSensorName}
                      onChange={(e) => {
                        setNewSensorName(e.target.value);
                        const autoField = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "_")
                          .replace(/^_+|_+$/g, "");
                        setNewSensorField(autoField);
                      }}
                      className={`w-full p-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isLight ? "bg-white border border-slate-200" : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                      required
                    />
                  </div>

                  {/* Field Name Input */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Proto / JSON Key Name</label>
                    <input
                      type="text"
                      placeholder="e.g. gpon_laser_bias_ma"
                      value={newSensorField}
                      onChange={(e) => setNewSensorField(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      className={`w-full p-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isLight ? "bg-white border border-slate-200" : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                      required
                    />
                  </div>

                  {/* Type Select */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Field Data Type</label>
                    <select
                      value={newSensorType}
                      onChange={(e) => setNewSensorType(e.target.value)}
                      className={`w-full p-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isLight ? "bg-white border border-slate-200" : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                    >
                      <option value="float">float (32-bit floating point)</option>
                      <option value="int32">int32 (32-bit signed integer)</option>
                      <option value="string">string (UTF-8 character stream)</option>
                      <option value="bool">bool (boolean True/False flags)</option>
                    </select>
                  </div>

                  {/* Target Node Select */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Target Network Appliance Node</label>
                    <select
                      value={newSensorTarget}
                      onChange={(e) => setNewSensorTarget(e.target.value as any)}
                      className={`w-full p-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isLight ? "bg-white border border-slate-200" : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                    >
                      <option value="user-cpe">Home Subscriber CPE Modem</option>
                      <option value="access-transport">OLT GPON Access Node</option>
                      <option value="control-broker">USP Management Broker Node</option>
                      <option value="databricks-etl">Databricks Delta Lake Storage Layer</option>
                    </select>
                  </div>

                  {/* Simulated Value */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Simulated Value</label>
                    <input
                      type="text"
                      placeholder="e.g. 12.4"
                      value={newSensorValue}
                      onChange={(e) => setNewSensorValue(e.target.value)}
                      className={`w-full p-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isLight ? "bg-white border border-slate-200" : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                      required
                    />
                  </div>

                  {/* Unit of measure */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Unit of Measurement</label>
                    <input
                      type="text"
                      placeholder="e.g. mA, °C, %, ms"
                      value={newSensorUnit}
                      onChange={(e) => setNewSensorUnit(e.target.value)}
                      className={`w-full p-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isLight ? "bg-white border border-slate-200" : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Storage and Warning Section */}
                <div className={`p-3 rounded-lg border text-xs leading-relaxed flex flex-col gap-2 ${
                  isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-950/20 border-amber-900/40 text-amber-300"
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                    <span>Dynamic Cost Ingestion Impact: +${newSensorAddedCost}/mo per 10k appliances</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ⚠️ <strong>Ingestion Volume Alert:</strong> Cross-aggregating this metric unfiltered on 1M home gateways generates over <strong>750 million daily rows</strong>. This will bloat cold datalake retention storage costs by <strong>+$24,000/year</strong> unless you activate <strong>Edge-Filtered Processing</strong> or <strong>Pre-Kafka Filtering</strong> to discard identical steady-state records!
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <Plus size={14} />
                  ATTACH VIRTUAL SENSOR & RE-COMPILE OTel SCHEMAS
                </button>
              </form>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex justify-end gap-2.5 ${isLight ? "bg-slate-50 border-slate-100" : "bg-slate-950 border-slate-850"}`}>
              <button
                type="button"
                onClick={() => setIsSchemaEditorOpen(false)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-all ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                CLOSE EDITOR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
