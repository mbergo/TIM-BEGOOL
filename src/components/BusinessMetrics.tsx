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

  // Load mode state
  const [loadMode, setLoadMode] = useState<"normal" | "high" | "critical">("normal");

  // Dynamic values
  const [msgRate, setMsgRate] = useState(840512);
  const [totalProcessed, setTotalProcessed] = useState(1482049102);
  const [sparklineData, setSparklineData] = useState<number[]>(
    Array.from({ length: 18 }, () => 840000 + Math.floor(Math.random() * 5000))
  );
  
  // Consumer lag in milliseconds
  const [consumerLag, setConsumerLag] = useState(12);

  // Partition states
  const [partitionRates, setPartitionRates] = useState<number[]>([210128, 209950, 210214, 210220]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate dynamic base value based on loadMode
      let baseRate = 840512;
      let multiplier = 1;
      let lagBase = 12;
      
      if (loadMode === "high") {
        baseRate = 1245000;
        multiplier = 1.5;
        lagBase = 45;
      } else if (loadMode === "critical") {
        baseRate = 1890000;
        multiplier = 2.2;
        lagBase = 280;
      }

      // Live rate with minor fluctuation
      const rateFluctuation = Math.floor(Math.random() * 4000 - 2000) * multiplier;
      const currentRate = Math.max(100000, Math.floor(baseRate + rateFluctuation));
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
        const p0 = Math.floor(currentRate * 0.25 + (Math.random() * 800 - 400));
        const p1 = Math.floor(currentRate * 0.24 + (Math.random() * 800 - 400));
        const p2 = Math.floor(currentRate * 0.26 + (Math.random() * 800 - 400));
        const p3 = currentRate - (p0 + p1 + p2);
        return [p0, p1, p2, p3];
      });

      // Consumer lag fluctuation
      setConsumerLag(prev => {
        const targetLag = lagBase + Math.floor(Math.random() * 10 - 5);
        return Math.max(1, targetLag);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loadMode]);

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

  // Color theme for widget
  const color = loadMode === "critical" ? "#ef4444" : loadMode === "high" ? "#fbbf24" : "#38bdf8";

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
          loadMode === "critical"
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : loadMode === "high"
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }`}>
          {loadMode === "critical" ? "CRITICAL" : loadMode === "high" ? "HIGH LOAD" : "OPTIMAL"}
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
            <linearGradient id={`gradient-${loadMode}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Transparent Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)"} strokeDasharray="3 3" />
          
          {/* Sparkline Area path */}
          {pathArea && <path d={pathArea} fill={`url(#gradient-${loadMode})`} className="transition-all duration-300" />}
          
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
            consumerLag > 200 ? "text-rose-500" : consumerLag > 35 ? "text-amber-500" : "text-emerald-500"
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Sync
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
                    className="w-1.5 h-1.5 rounded-full animate-ping" 
                    style={{ 
                      backgroundColor: color, 
                      animationDuration: animDuration 
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

      {/* Interactive Load Control Panel */}
      <div className={`p-1.5 rounded-xl border flex items-center justify-between gap-1.5 ${
        isLight ? "bg-slate-50 border-slate-100" : "bg-slate-950/60 border-slate-850"
      }`}>
        <span className="text-[9px] font-black font-mono uppercase tracking-wider text-slate-500 pl-1.5 flex items-center gap-1">
          <Sliders size={10} className="text-slate-500" />
          {label.load_control}
        </span>
        
        <div className="flex gap-1 flex-grow justify-end">
          {(["normal", "high", "critical"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLoadMode(mode)}
              className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                loadMode === mode
                  ? mode === "critical"
                    ? "bg-red-500 text-white shadow-md font-black"
                    : mode === "high"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "bg-sky-500 text-slate-950 shadow-md font-black"
                  : isLight 
                  ? "text-slate-600 hover:bg-slate-100" 
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              {mode === "normal" ? label.normal : mode === "high" ? label.high : label.spike}
            </button>
          ))}
        </div>
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
}

function MetricCard({ title, value, icon: Icon, color, badge, badgeColor, isLight }: MetricCardProps) {
  return (
    <div className={`rounded-xl border p-4 flex items-center justify-between shadow-lg relative overflow-hidden group transition-all duration-300 ${
      isLight 
        ? "bg-white border-slate-200/80 hover:border-slate-300" 
        : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80"
    }`}>
      {/* Background glow */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] blur-xl transition-all duration-500 group-hover:scale-125" 
        style={{ backgroundColor: color }}
      />
      
      <div className="flex flex-col gap-1.5 z-10">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${
          isLight ? "text-slate-500 font-bold" : "text-slate-500"
        }`}>{title}</span>
        {/* Core requirement: Data font size is exactly 16px */}
        <div className="flex items-baseline gap-2">
          <span 
            className={`text-[16px] font-black font-mono tracking-tight flex items-center gap-1.5 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
            style={{ fontSize: '16px' }}
          >
            {value}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${badgeColor} border ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/40 border-slate-800/50"
          }`}>
            {badge}
          </span>
        </div>
      </div>

      <div 
        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${
          isLight ? "border-slate-200" : "border-slate-800"
        }`}
        style={{ 
          backgroundColor: `${color}10`, 
          borderColor: `${color}30`,
          boxShadow: `0 0 15px ${color}15`
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  );
}

export default function BusinessMetrics() {
  const { t, theme, language } = useApp();
  const [ingestRate, setIngestRate] = useState(840512);
  const [fixesRate, setFixesRate] = useState(1842);

  const isLight = theme === "light";

  // Fluctuations to make data live and complex
  useEffect(() => {
    const timer = setInterval(() => {
      setIngestRate(prev => Math.floor(prev + (Math.random() * 2000 - 1000)));
      setFixesRate(prev => Math.floor(prev + (Math.random() * 10 - 5)));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 items-stretch">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
        <MetricCard
          title={t("kafka_ingest")}
          value={`${formatNumber(ingestRate)} msg/s`}
          icon={Activity}
          color="#38bdf8"
          badge="4.82 GB/s"
          badgeColor="text-sky-500"
          isLight={isLight}
        />
        <MetricCard
          title={t("beegol_ml_rca")}
          value="98.42% Accuracy"
          icon={Percent}
          color="#c084fc"
          badge="DNN Active"
          badgeColor="text-purple-500"
          isLight={isLight}
        />
        <MetricCard
          title={t("automated_self_heals")}
          value={`${formatNumber(fixesRate)}${t("devices_hr")}`}
          icon={Zap}
          color="#4ade80"
          badge="Loop Fixed"
          badgeColor="text-emerald-500"
          isLight={isLight}
        />
        <MetricCard
          title={t("tim_opex_retained")}
          value={`€2,000,000${t("per_month")}`}
          icon={DollarSign}
          color="#fbbf24"
          badge={`€24.0M${t("per_year")}`}
          badgeColor="text-amber-500"
          isLight={isLight}
        />
      </div>

      {/* Persistent Kafka Throughput Widget */}
      <div className="w-full xl:w-[350px] shrink-0">
        <KafkaThroughputWidget isLight={isLight} language={language} formatNumber={formatNumber} />
      </div>
    </div>
  );
}
