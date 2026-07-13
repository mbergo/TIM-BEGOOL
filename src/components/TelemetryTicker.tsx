import React, { useEffect, useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { AlertTriangle, ShieldCheck, Activity, Info, Sparkles, Cpu } from "lucide-react";

interface AnomalyItem {
  id: string;
  code: string;
  type: "CRITICAL" | "WARNING" | "MINOR" | "INFO" | "OPTIMIZATION";
  timestamp: string;
  en: string;
  pt: string;
  it: string;
}

const TEMPLATE_ANOMALIES: Omit<AnomalyItem, "id" | "timestamp">[] = [
  {
    code: "CPE-9821",
    type: "CRITICAL",
    en: "PHY SNR drop on 2.4GHz channel (-6.4 dB deviation) • TR-369 USP self-heal initiated.",
    pt: "Queda de SNR físico no canal 2.4GHz (desvio de -6.4 dB) • Auto-healing TR-369 iniciado.",
    it: "Calo SNR fisico su canale 2.4GHz (deviazione -6.4 dB) • Auto-healing TR-369 avviato."
  },
  {
    code: "CPE-1045",
    type: "WARNING",
    en: "High downstream FEC uncorrectable rate detected on DS-12 (32% packet loss).",
    pt: "Alta taxa de erros FEC incorrigíveis detectada em DS-12 (32% de perda de pacotes).",
    it: "Rilevato alto tasso di errori FEC non correggibili su DS-12 (32% pacchetti persi)."
  },
  {
    code: "CPE-4822",
    type: "MINOR",
    en: "Micro-reflection impedance degradation detected on upstream leg at 34.2 MHz.",
    pt: "Degradação de impedância por micro-reflexão no canal de upload em 34.2 MHz.",
    it: "Degrado impedenza da micro-riflessione su tratta di upload a 34.2 MHz."
  },
  {
    code: "CPE-7834",
    type: "INFO",
    en: "Local RDK-B daemon logged Wi-Fi RSSI fluctuation on subscriber gateway #1029.",
    pt: "Daemon RDK-B local registrou flutuação de Wi-Fi RSSI no gateway #1029.",
    it: "Demone RDK-B locale ha registrato fluttuazione Wi-Fi RSSI su gateway #1029."
  },
  {
    code: "CPE-2098",
    type: "MINOR",
    en: "Thermal threshold warning on Broadcom BCM3390 SoC (82°C) • CPU throttle auto-applied.",
    pt: "Alerta de temperatura limite no SoC Broadcom BCM3390 (82°C) • Limitador de CPU aplicado.",
    it: "Avviso soglia termica su SoC Broadcom BCM3390 (82°C) • CPU throttling auto-applicato."
  },
  {
    code: "CPE-3301",
    type: "WARNING",
    en: "High-frequency impulse noise spike detected on GPON upstream OLT index 412.",
    pt: "Pico de ruído impulsivo de alta frequência no index 412 do OLT GPON.",
    it: "Picco di rumore impulsivo ad alta frequenza su index OLT GPON 412."
  },
  {
    code: "CPE-1192",
    type: "OPTIMIZATION",
    en: "USP client performed preemptive physical layer channel switch to avoid Co-Channel interference.",
    pt: "Cliente USP realizou troca preventiva de canal físico para evitar interferência co-canal.",
    it: "Client USP ha eseguito cambio preventivo canale fisico per evitare interferenze Co-Canale."
  },
  {
    code: "CPE-5502",
    type: "CRITICAL",
    en: "Transmit power levels exceeded safe DOCSIS 3.1 margins • Self-adjusting upstream gain.",
    pt: "Nível de potência de transmissão excedeu margens de segurança DOCSIS 3.1 • Ganho auto-ajustado.",
    it: "Potenza di trasmissione fuori dai margini DOCSIS 3.1 • Guadagno auto-regolato."
  },
  {
    code: "CPE-4412",
    type: "OPTIMIZATION",
    en: "Downstream DOCSIS 4.0 ESD profile adjusted dynamically based on continuous SNR evaluation.",
    pt: "Perfil DOCSIS 4.0 ESD downstream ajustado dinamicamente com base na avaliação contínua de SNR.",
    it: "Profilo DOCSIS 4.0 ESD downstream regolato dinamicamente in base alla valutazione continua del SNR."
  },
  {
    code: "CPE-8824",
    type: "WARNING",
    en: "Laser bias current on optical transceiver exceeded 85mA nominal rating (pre-failure warning).",
    pt: "Corrente de polarização do laser no transceptor óptico excedeu 85mA nominais (aviso de pré-falha).",
    it: "Corrente di polarizzazione laser su ricetrasmettitore ottico superiore a 85mA (avviso pre-guasto)."
  }
];

export default function TelemetryTicker() {
  const { language, theme } = useApp();
  const isLight = theme === "light";
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const idCounter = useRef(1);

  // Initialize with some starting anomalies
  useEffect(() => {
    const initial: AnomalyItem[] = [];
    // Take 6 random ones to start
    const indices = Array.from({ length: 6 }, () => Math.floor(Math.random() * TEMPLATE_ANOMALIES.length));
    indices.forEach((idx, i) => {
      const base = TEMPLATE_ANOMALIES[idx];
      const now = new Date();
      now.setSeconds(now.getSeconds() - (i * 30));
      const padZero = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
      
      initial.push({
        ...base,
        id: `init-${idCounter.current++}`,
        timestamp
      });
    });
    setAnomalies(initial);
  }, []);

  // Inject a new live RDK-B anomaly every 4.5 seconds to make the ticker alive
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBase = TEMPLATE_ANOMALIES[Math.floor(Math.random() * TEMPLATE_ANOMALIES.length)];
      const now = new Date();
      const padZero = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;

      const newAnomaly: AnomalyItem = {
        ...randomBase,
        id: `live-${idCounter.current++}`,
        timestamp
      };

      setAnomalies((prev) => {
        // Keep the latest 10 items to prevent memory leaks or giant DOM sizes
        const updated = [newAnomaly, ...prev];
        if (updated.length > 12) {
          updated.pop();
        }
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const getTypeStyle = (type: AnomalyItem["type"]) => {
    switch (type) {
      case "CRITICAL":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-500 dark:text-rose-400",
          dot: "bg-rose-500",
          icon: AlertTriangle
        };
      case "WARNING":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-500 dark:text-amber-400",
          dot: "bg-amber-500",
          icon: AlertTriangle
        };
      case "MINOR":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
          dot: "bg-yellow-500",
          icon: Activity
        };
      case "OPTIMIZATION":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          dot: "bg-emerald-500",
          icon: Sparkles
        };
      case "INFO":
      default:
        return {
          bg: "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400",
          dot: "bg-sky-500",
          icon: Info
        };
    }
  };

  const getLabel = (anomaly: AnomalyItem) => {
    if (language === "pt") return anomaly.pt;
    if (language === "it") return anomaly.it;
    return anomaly.en;
  };

  // Duplicate items to ensure smooth infinite marquee effect
  const marqueeItems = [...anomalies, ...anomalies];

  return (
    <div id="telemetry-ticker" className={`w-full border rounded-xl overflow-hidden flex items-center relative select-none shadow-md ${
      isLight 
        ? "bg-slate-50 border-slate-200/80 text-slate-700" 
        : "bg-slate-950/60 border-slate-900/80 text-slate-300"
    }`}>
      
      {/* CSS For the Marquee and Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-scroller {
          display: flex;
          width: max-content;
          animation: marquee 90s linear infinite;
        }
        .animate-marquee-scroller:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Sticky Left Badge Indicator */}
      <div className={`shrink-0 z-20 flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-black border-r select-none tracking-widest ${
        isLight 
          ? "bg-slate-100 border-slate-200 text-slate-800" 
          : "bg-slate-900 border-slate-900 text-white"
      }`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className="text-rose-500 animate-pulse" />
          <span>LIVE RDK-B TELEMETRY FEED</span>
        </div>
      </div>

      {/* Marquee Container with custom fades at both ends */}
      <div className="flex-grow overflow-hidden relative py-2.5 flex items-center">
        {/* Left Fade Shader */}
        <div className={`absolute top-0 left-0 w-8 h-full z-10 pointer-events-none bg-gradient-to-r ${
          isLight ? "from-slate-50 to-transparent" : "from-slate-950/40 to-transparent"
        }`} />
        
        {/* Right Fade Shader */}
        <div className={`absolute top-0 right-0 w-8 h-full z-10 pointer-events-none bg-gradient-to-l ${
          isLight ? "from-slate-50 to-transparent" : "from-slate-950/40 to-transparent"
        }`} />

        {/* The Scrolling Marquee */}
        <div className="animate-marquee-scroller gap-6 pl-4">
          {marqueeItems.map((item, index) => {
            const style = getTypeStyle(item.type);
            const IconComponent = style.icon;
            return (
              <div 
                key={`${item.id}-${index}`}
                className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 hover:scale-[1.03] ${style.bg}`}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <IconComponent size={13} className="shrink-0" />
                  <span className="font-extrabold text-[10px] tracking-tight">{item.code}</span>
                </div>
                
                <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-700 shrink-0" />
                
                <span className="font-semibold whitespace-nowrap tracking-wide">
                  {getLabel(item)}
                </span>
                
                <span className="text-[9px] font-bold opacity-60 ml-1 bg-slate-500/10 px-1.5 py-0.5 rounded shrink-0">
                  {item.timestamp}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
