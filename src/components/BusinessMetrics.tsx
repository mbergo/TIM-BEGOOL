import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { TrendingUp, Percent, Zap, DollarSign, Activity, Sliders } from "lucide-react";

// Local translation dictionary for standard and cohesive multilingual support
const localDict = {
  en: {
    kafka_throughput: "Kafka Throughput",
    live_msg_rate: "Live Message Rate",
    total_processed: "Total Processed",
    load_control: "Load Control",
    normal: "Normal",
    high: "High",
    spike: "Spike",
    partitions: "Partitions",
    lag: "Consumer Lag",
    healthy: "Healthy",
    brokers: "Brokers",
    active_consumers: "Consumers",
  },
  pt: {
    kafka_throughput: "Vazão do Kafka",
    live_msg_rate: "Taxa de Mensagens",
    total_processed: "Total Processado",
    load_control: "Controle de Carga",
    normal: "Normal",
    high: "Alta",
    spike: "Pico",
    partitions: "Partições",
    lag: "Atraso do Consumidor",
    healthy: "Saudável",
    brokers: "Brokers",
    active_consumers: "Consumidores",
  },
  it: {
    kafka_throughput: "Throughput Kafka",
    live_msg_rate: "Frequenza Messaggi",
    total_processed: "Elaborati Totali",
    load_control: "Controllo Carico",
    normal: "Normale",
    high: "Alto",
    spike: "Picco",
    partitions: "Partizioni",
    lag: "Ritardo Consumatore",
    healthy: "In Salute",
    brokers: "Broker",
    active_consumers: "Consumatori",
  }
};

interface KafkaThroughputWidgetProps {
  isLight: boolean;
  language: string;
  formatNumber: (num: number) => string;
}

function KafkaThroughputWidget({ isLight, language, formatNumber }: KafkaThroughputWidgetProps) {
  // Translate helper
  const lang = (language === "pt" || language === "it" ? language : "en") as "en" | "pt" | "it";
  const label = localDict[lang];

  const { filterBarrier, protocolMode, backpressureValue } = useApp();

  // Dynamic values
  const [msgRate, setMsgRate] = useState(1842512);
  const [totalProcessed, setTotalProcessed] = useState(1482049102);
  const [sparklineData, setSparklineData] = useState<number[]>(
    Array.from({ length: 18 }, () => 1840000 + Math.floor(Math.random() * 5000))
  );
  
  // Consumer lag in milliseconds
  const [consumerLag, setConsumerLag] = useState(12);

  // Partition states
  const [partitionRates, setPartitionRates] = useState<number[]>([460128, 459950, 461214, 461220]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate dynamic base value based on filtering barrier & protocol modes
      let baseRate = filterBarrier === "before-kafka" ? 368500 : 1842512;
      
      if (protocolMode === "tr069") {
        baseRate = Math.floor(baseRate * 1.35); // synchronous CWMP XML overhead
      } else if (protocolMode === "snmp") {
        baseRate = Math.floor(baseRate * 1.25); // legacy UDP polling overhead
      } else if (protocolMode === "mqtt") {
        baseRate = Math.floor(baseRate * 1.05); // standard lightweight pubsub
      } else if (protocolMode === "gnmi") {
        baseRate = Math.floor(baseRate * 1.15); // streaming spikes
      } else if (protocolMode === "otel") {
        baseRate = Math.floor(baseRate * 0.9);  // highly optimized OTel payload
      } else if (protocolMode === "tr369") {
        baseRate = Math.floor(baseRate * 0.95); // optimized USP protobuf push
      }

      // Live rate with minor fluctuation
      const rateFluctuation = Math.floor(Math.random() * 6000 - 3000);
      const currentRate = Math.max(80000, Math.floor(baseRate + rateFluctuation));
      setMsgRate(currentRate);

      // Increment total processed
      setTotalProcessed(prev => prev + Math.floor(currentRate / 2));

      // Append to sparkline
      setSparklineData(prev => {
        const next = [...prev.slice(1), currentRate];
        return next;
      });

      // Update partition distribution
      setPartitionRates(() => {
        const p0 = Math.floor(currentRate * 0.25 + (Math.random() * 400 - 200));
        const p1 = Math.floor(currentRate * 0.24 + (Math.random() * 400 - 200));
        const p2 = Math.floor(currentRate * 0.26 + (Math.random() * 400 - 200));
        const p3 = Math.max(10, currentRate - (p0 + p1 + p2));
        return [p0, p1, p2, p3];
      });

      // Consumer lag synced to global backpressureValue state
      const targetLag = Math.floor(backpressureValue * 2.8 + Math.random() * 4 - 2);
      setConsumerLag(Math.max(1, targetLag));
    }, 500);

    return () => clearInterval(interval);
  }, [filterBarrier, protocolMode, backpressureValue]);

  // SVG dimensions for real-time sparkline
  const width = 310;
  const height = 48;
  const maxVal = Math.max(...sparklineData, 100000);
  const minVal = Math.min(...sparklineData, 0);
  const range = maxVal - minVal || 1;

  const points = sparklineData.map((val, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 8) - 4; // leave 4px padding top/bottom
    return { x, y };
  });

  const pathLine = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const pathArea = points.length > 0 
    ? `${pathLine} L ${width} ${height} L 0 ${height} Z`
    : "";

  // Color theme for widget based on backpressure thresholds
  const isCongested = backpressureValue > 45;
  const isCritical = backpressureValue > 70;
  const color = isCritical ? "#ef4444" : isCongested ? "#fbbf24" : "#10b981";

  return (
    <div className={`rounded-xl border p-4 flex flex-col justify-between shadow-lg relative overflow-hidden h-full transition-all duration-300 ${
      isLight 
        ? "bg-white border-slate-200/80 hover:border-slate-300" 
        : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80"
    }`}>
      {/* Background radial highlight */}
      <div 
        className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-[0.04] blur-2xl transition-all duration-500" 
        style={{ backgroundColor: color }}
      />

      {/* Widget Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
          </div>
          <span className={`text-[10px] uppercase font-mono tracking-widest font-black ${
            isLight ? "text-slate-800" : "text-slate-200"
          }`}>
            {label.kafka_throughput}
          </span>
        </div>
        
        {/* Dynamic Status Badge */}
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
          isCritical
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : isCongested
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }`}>
          {isCritical ? "CRITICAL LAG" : isCongested ? "HIGH LOAD" : "OPTIMAL"}
        </span>
      </div>

      {/* Main Stats Display */}
      <div className="flex justify-between items-end mb-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">{label.live_msg_rate}</span>
          <span className="text-xl font-black font-mono tracking-tight leading-none mt-1 transition-colors duration-350" style={{ color }}>
            {formatNumber(msgRate)} <span className="text-xs font-normal text-slate-500">msg/s</span>
          </span>
        </div>
        
        <div className="flex flex-col items-end text-right">
          <span className="text-[9px] text-slate-500 font-mono">{label.total_processed}</span>
          <span className={`text-[12px] font-bold font-mono tracking-tight mt-0.5 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
            {formatNumber(totalProcessed)}
          </span>
        </div>
      </div>

      {/* Sparkline Canvas / Real-Time Animated Graph */}
      <div className={`relative h-12 w-full rounded-lg border overflow-hidden mb-3 ${
        isLight ? "bg-slate-50 border-slate-100" : "bg-slate-950/40 border-slate-800/40"
      }`}>
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-kafka-svg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Transparent Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)"} strokeDasharray="3 3" />
          
          {/* Sparkline Area path */}
          {pathArea && <path d={pathArea} fill="url(#gradient-kafka-svg)" className="transition-all duration-300" />}
          
          {/* Sparkline Line path */}
          {pathLine && <path d={pathLine} fill="none" stroke={color} strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />}
          
          {/* Glow point on last element */}
          {points.length > 0 && (
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} className="animate-pulse" />
          )}
        </svg>

        {/* Floating lag indicator */}
        <div className="absolute bottom-1 right-2 flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-slate-500">{label.lag}:</span>
          <span className={`text-[9px] font-mono font-black ${
            consumerLag > 120 ? "text-rose-500" : consumerLag > 35 ? "text-amber-500" : "text-emerald-500"
          }`}>
            {consumerLag} ms
          </span>
        </div>
      </div>

      {/* Partition Distribution Indicators - Tiny live-flashing dots */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1 text-[9px] font-mono text-slate-500">
          <span>{label.partitions} (0-3)</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {partitionRates.map((rate, i) => {
            const percentage = Math.min(100, Math.max(10, Math.floor((rate / (msgRate * 0.35)) * 100)));
            // Dynamic animation duration based on rate
            const animDuration = Math.max(0.2, 1.2 - (rate / 350000)) + "s";
            
            return (
              <div 
                key={i}
                className={`rounded-lg border px-1.5 py-1 flex flex-col gap-0.5 justify-center relative overflow-hidden ${
                  isLight ? "bg-slate-50 border-slate-150" : "bg-slate-950/20 border-slate-800/60"
                }`}
              >
                <div className="flex justify-between items-center z-10">
                  <span className="text-[8px] font-mono text-slate-500">P{i}</span>
                  {/* Blinking indicator dot */}
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      backgroundColor: color, 
                      animation: `pulse ${animDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
                    }} 
                  />
                </div>
                <span className="text-[9px] font-bold font-mono text-slate-400 leading-none truncate z-10">
                  {Math.round(rate / 1000)}k
                </span>
                
                {/* Horizontal progress bar showing capacity load of the partition */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-slate-200/50 dark:bg-slate-800/50 w-full">
                  <div 
                    className="h-full rounded-r transition-all duration-300" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic System Optimization Indicator */}
      <div className={`p-2 rounded-xl border flex items-center justify-between text-[10px] font-mono ${
        isLight ? "bg-slate-50 border-slate-100" : "bg-slate-950/60 border-slate-850"
      }`}>
        <span className="text-slate-500">Filtering Barrier:</span>
        <span className={`font-black uppercase tracking-wider ${filterBarrier === "before-kafka" ? "text-emerald-400" : "text-rose-450 animate-pulse"}`}>
          {filterBarrier === "before-kafka" ? "EDGE (NiFi)" : "POST (DBR)"}
        </span>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  badgeColor: string;
  isLight: boolean;
  subValue?: string;
  progressPercent?: number;
  historyData?: number[];
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  badge, 
  badgeColor, 
  isLight,
  subValue,
  progressPercent,
  historyData = []
}: MetricCardProps) {
  const sparklineHeight = 28;
  const sparklineMax = Math.max(...historyData) * 1.01 || 1;
  const sparklineMin = Math.min(...historyData) * 0.99 || 0;
  const sparklineRange = sparklineMax - sparklineMin || 1;

  return (
    <div className={`rounded-xl border p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group transition-all duration-300 min-h-[148px] ${
      isLight 
        ? "bg-white border-slate-200/80 hover:border-slate-300" 
        : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80"
    }`}>
      {/* Background glow */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] blur-xl transition-all duration-500 group-hover:scale-125" 
        style={{ backgroundColor: color }}
      />
      
      {/* Top row: Title and Icon */}
      <div className="flex items-center justify-between w-full mb-1">
        <span className={`text-[9px] uppercase font-mono tracking-widest leading-none ${
          isLight ? "text-slate-500 font-bold" : "text-slate-400"
        }`}>{title}</span>
        
        <div 
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${
            isLight ? "border-slate-200" : "border-slate-800"
          }`}
          style={{ 
            backgroundColor: `${color}10`, 
            borderColor: `${color}30`,
            boxShadow: `0 0 12px ${color}12`
          }}
        >
          <Icon size={13} style={{ color }} />
        </div>
      </div>

      {/* Middle row: Primary value and Badge */}
      <div className="flex flex-col gap-1 z-10 my-0.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span 
            className={`font-black font-mono tracking-tight leading-none ${
              isLight ? "text-slate-900" : "text-white"
            }`}
            style={{ fontSize: '15px' }}
          >
            {value}
          </span>
          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${badgeColor} border ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/40 border-slate-800/50"
          }`}>
            {badge}
          </span>
        </div>
      </div>

      {/* Dynamic 60-Second Trend Sparkline Graph */}
      {historyData.length > 1 && (
        <div className="w-full h-7 my-1 relative overflow-visible select-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 28" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`spark-grad-${title.replace(/\s+/g, "-")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Sparkline Area path */}
            <path
              d={`M 0,28 ${historyData.map((val, i) => {
                const x = (i / (historyData.length - 1)) * 100;
                const y = sparklineHeight - ((val - sparklineMin) / sparklineRange) * (sparklineHeight - 6) - 3;
                return `L ${x},${y}`;
              }).join(" ")} L 100,28 Z`}
              fill={`url(#spark-grad-${title.replace(/\s+/g, "-")})`}
              className="transition-all duration-300"
            />
            
            {/* Sparkline Line path */}
            <path
              d={historyData.map((val, i) => {
                const x = (i / (historyData.length - 1)) * 100;
                const y = sparklineHeight - ((val - sparklineMin) / sparklineRange) * (sparklineHeight - 6) - 3;
                return `${i === 0 ? "M" : "L"} ${x},${y}`;
              }).join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Glowing lead point at the current active data spot */}
            <circle
              cx="100"
              cy={sparklineHeight - ((historyData[historyData.length - 1] - sparklineMin) / sparklineRange) * (sparklineHeight - 6) - 3}
              r="2"
              fill={color}
              className="animate-pulse"
            />
          </svg>
        </div>
      )}

      {/* Bottom row: Sub value and animated progress bar */}
      {subValue && (
        <div className="w-full mt-1.5 pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800/50 flex flex-col gap-1 z-10">
          <div className="flex justify-between items-center text-[9px] font-mono leading-none">
            <span className={isLight ? "text-slate-500" : "text-slate-400"}>{subValue}</span>
            {progressPercent !== undefined && (
              <span className="font-bold font-mono" style={{ color }}>{progressPercent}%</span>
            )}
          </div>
          {progressPercent !== undefined && (
            <div className={`h-1 w-full rounded-full overflow-hidden mt-1 ${
              isLight ? "bg-slate-100" : "bg-slate-950"
            }`}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercent}%`, 
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}30`
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BusinessMetrics() {
  const { t, theme, language, filterBarrier, protocolMode, backpressureValue } = useApp();
  
  // Real-time values upgraded to 1.8M baseline
  const [ingestRate, setIngestRate] = useState(1842512);
  const [accuracy, setAccuracy] = useState(98.42);
  const [fixesRate, setFixesRate] = useState(1842);
  const [opexRetained, setOpexRetained] = useState(180000);

  // 60-second real-time history data arrays (25 items each, updated every 2.5s)
  const [ingestHistory, setIngestHistory] = useState<number[]>(() => 
    Array.from({ length: 25 }, () => 1840000 + Math.floor(Math.random() * 8000 - 4000))
  );
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>(() => 
    Array.from({ length: 25 }, () => 98.38 + Math.random() * 0.08)
  );
  const [fixesHistory, setFixesHistory] = useState<number[]>(() => 
    Array.from({ length: 25 }, () => 1830 + Math.floor(Math.random() * 24 - 12))
  );
  const [opexHistory, setOpexHistory] = useState<number[]>(() => 
    Array.from({ length: 25 }, () => 180000 + Math.floor(Math.random() * 400 - 200))
  );

  const isLight = theme === "light";

  // Real-time telemetry generator
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Kafka Ingest Rate (~1.84M msg/s) synced to global filtering states!
      let baseRate = filterBarrier === "before-kafka" ? 368500 : 1842512;
      
      if (protocolMode === "tr069") {
        baseRate = Math.floor(baseRate * 1.35); // SOAP CWMP XML overhead
      } else if (protocolMode === "snmp") {
        baseRate = Math.floor(baseRate * 1.25); // legacy UDP polling overhead
      } else if (protocolMode === "mqtt") {
        baseRate = Math.floor(baseRate * 1.05); // standard lightweight pubsub
      } else if (protocolMode === "gnmi") {
        baseRate = Math.floor(baseRate * 1.15); // streaming spikes
      } else if (protocolMode === "otel") {
        baseRate = Math.floor(baseRate * 0.9);  // optimal OTel push
      } else if (protocolMode === "tr369") {
        baseRate = Math.floor(baseRate * 0.95); // optimized USP protobuf push
      }

      const rateFluctuation = Math.floor(Math.random() * 10000 - 5000);
      const newIngest = Math.max(80000, Math.floor(baseRate + rateFluctuation));
      setIngestRate(newIngest);
      setIngestHistory(prev => [...prev.slice(1), newIngest]);

      // 2. Beegol ML Accuracy (higher with clean edge telemetry)
      const isFiltered = filterBarrier === "before-kafka";
      const baseAccuracy = isFiltered ? 99.12 : 98.38;
      const newAccuracy = Number((baseAccuracy + Math.random() * 0.08).toFixed(2));
      setAccuracy(newAccuracy);
      setAccuracyHistory(prev => [...prev.slice(1), newAccuracy]);

      // 3. Automated self-heals per hour (~1,842 devices/hour)
      const baseFixes = isFiltered ? 2120 : 1842;
      const newFixes = Math.floor(baseFixes + (Math.random() * 20 - 10));
      setFixesRate(newFixes);
      setFixesHistory(prev => [...prev.slice(1), newFixes]);

      // 4. TIM Monthly OPEX retained (~€180,000/month)
      // If we are filtering before Kafka (edge NiFi), TIM saves a lot of cloud ingress fees!
      const baseOpex = isFiltered ? 245000 : 180000;
      const newOpex = Math.floor(baseOpex + (Math.random() * 600 - 300));
      setOpexRetained(newOpex);
      setOpexHistory(prev => [...prev.slice(1), newOpex]);
    }, 2500);

    return () => clearInterval(timer);
  }, [filterBarrier, protocolMode]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Subvalue translations for KPI Cards to keep language synced
  const lang = (language === "pt" || language === "it" ? language : "en") as "en" | "pt" | "it";
  const subMetricsDict = {
    en: {
      kafka_buf: "CPE Ingest Filter Ratio",
      rca_conf: "GNN Inference Confidence",
      heal_rate: "Self-Heal Resolution Rate",
      saving_target: "OpEx Savings vs. Target"
    },
    pt: {
      kafka_buf: "Filtro de Ingestão de CPE",
      rca_conf: "Confiança da Inferência GNN",
      heal_rate: "Taxa de Sucesso Auto-Heal",
      saving_target: "Economia vs. Meta OpEx"
    },
    it: {
      kafka_buf: "Filtro Ingestione CPE",
      rca_conf: "Affidabilità Inferenza GNN",
      heal_rate: "Risoluzione Auto-Heal",
      saving_target: "Risparmio vs. Target OpEx"
    }
  };

  const currentSub = subMetricsDict[lang];

  // Fluctuating buffer percent (just to keep it looking live and highly sophisticated)
  const dynamicBufferPercent = Math.max(88, Math.min(94, Math.floor(90 + (ingestRate % 5))));

  return (
    <div id="business-metrics" className="w-full grid grid-cols-1 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 xl:gap-6 items-stretch">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 xl:gap-6 xl:col-span-4">
        <MetricCard
          title={t("kafka_ingest")}
          value={`${formatNumber(ingestRate)} msg/s`}
          icon={Activity}
          color="#38bdf8"
          badge="5.88 GB/s"
          badgeColor="text-sky-500"
          isLight={isLight}
          subValue={currentSub.kafka_buf}
          progressPercent={dynamicBufferPercent}
          historyData={ingestHistory}
        />
        <MetricCard
          title={t("beegol_ml_rca")}
          value={`${accuracy}% Accuracy`}
          icon={Percent}
          color="#c084fc"
          badge="DNN Active"
          badgeColor="text-purple-500"
          isLight={isLight}
          subValue={currentSub.rca_conf}
          progressPercent={98}
          historyData={accuracyHistory}
        />
        <MetricCard
          title={t("automated_self_heals")}
          value={`${formatNumber(fixesRate)}${t("devices_hr")}`}
          icon={Zap}
          color="#4ade80"
          badge="Loop Fixed"
          badgeColor="text-emerald-500"
          isLight={isLight}
          subValue={currentSub.heal_rate}
          progressPercent={99}
          historyData={fixesHistory}
        />
        <MetricCard
          title={t("tim_opex_retained")}
          value={`€${formatNumber(opexRetained)}${t("per_month")}`}
          icon={DollarSign}
          color="#fbbf24"
          badge={`€2.16M${t("per_year")}`}
          badgeColor="text-amber-500"
          isLight={isLight}
          subValue={currentSub.saving_target}
          progressPercent={84}
          historyData={opexHistory}
        />
      </div>

      {/* Persistent Kafka Throughput Widget */}
      <div className="xl:col-span-1 h-full">
        <KafkaThroughputWidget isLight={isLight} language={language} formatNumber={formatNumber} />
      </div>
    </div>
  );
}
