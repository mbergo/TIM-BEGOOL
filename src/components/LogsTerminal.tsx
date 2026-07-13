import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { getLocalizedPipelineSteps } from "../data/pipelineData";
import { Terminal, Activity, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { renderInteractiveText } from "./GlossaryTerm";

interface LogsTerminalProps {
  activeStepId: string;
}

export default function LogsTerminal({ activeStepId }: LogsTerminalProps) {
  const { language, theme, t, filterBarrier } = useApp();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const rawEndAnchorRef = useRef<HTMLDivElement>(null);
  const filteredEndAnchorRef = useRef<HTMLDivElement>(null);

  const [customLogs, setCustomLogs] = React.useState<{ id: number; log: string; level: string; time: string }[]>([]);
  const [viewMode, setViewMode] = useState<"standard" | "efficiency">("standard");

  const [rawLogs, setRawLogs] = useState<{ id: string; time: string; payload: string }[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<{ id: string; time: string; payload: string; type: "forwarded" | "dropped" | "flood" }[]>([]);

  const steps = getLocalizedPipelineSteps(language);
  const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

  const isLight = theme === "light";
  const isFilteringActive = filterBarrier === "before-kafka";
  const reductionPercent = isFilteringActive ? 80 : 0;

  // Listen to dynamic syslog events dispatched from user interactive controls
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; level: string }>;
      if (customEvent.detail) {
        setCustomLogs(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            log: customEvent.detail.message,
            level: customEvent.detail.level,
            time: new Date().toLocaleTimeString([], { hour12: false })
          }
        ]);
      }
    };

    window.addEventListener("syslog-event", handleEvent);
    return () => window.removeEventListener("syslog-event", handleEvent);
  }, []);

  // Generate real-time mock telemetry packets for the Filtering Efficiency view
  useEffect(() => {
    const devices = ["GPON-CPE-12", "GPON-CPE-84", "GPON-CPE-39", "GPON-CPE-10"];
    let packetCount = 0;

    const interval = setInterval(() => {
      packetCount++;
      const timeStr = new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 1 } as any);
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      
      // Determine if this is a redundant heartbeat or a state change
      const isRedundant = packetCount % 5 !== 0; // 80% are redundant duplicate heartbeats
      
      let rawPayload = "";
      let filteredPayload = "";
      
      if (isRedundant) {
        rawPayload = `{"id":"${randomDevice}","hb":true,"rssi":-68,"temp":41.8,"ch_idx":3}`;
        
        if (isFilteringActive) {
          // If pre-Kafka filtering is ON, duplicate is dropped at CPE
          filteredPayload = `[CPE DROP] Redundant heartbeat dropped`;
        } else {
          // If pre-Kafka filtering is OFF, duplicates are flooded into Kafka!
          filteredPayload = rawPayload;
        }
      } else {
        // State change
        const newRssi = -68 + Math.floor(Math.random() * 5) - 2;
        rawPayload = `{"id":"${randomDevice}","hb":false,"rssi":${newRssi},"temp":42.1,"ch_idx":3}`;
        filteredPayload = `{"id":"${randomDevice}","rssi_change":${newRssi},"dispatch":true}`;
      }

      const logId = Math.random().toString(36).substring(2, 9);
      
      setRawLogs(prev => {
        const next = [...prev, { id: logId, time: timeStr, payload: rawPayload }];
        return next.slice(-25); // Limit logs
      });

      setFilteredLogs(prev => {
        const next = [...prev, {
          id: logId,
          time: timeStr,
          payload: filteredPayload,
          type: isRedundant 
            ? (isFilteringActive ? ("dropped" as const) : ("flood" as const))
            : ("forwarded" as const)
        }];
        return next.slice(-25); // Limit logs
      });
    }, 750);

    return () => clearInterval(interval);
  }, [isFilteringActive]);

  // Clear custom logs when active step changes to prevent mixing steps
  useEffect(() => {
    setCustomLogs([]);
  }, [activeStepId]);

  // Auto scroll standard terminal logs
  useEffect(() => {
    if (viewMode === "standard" && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeStepId, customLogs, viewMode]);

  // Auto scroll side-by-side logs
  useEffect(() => {
    if (viewMode === "efficiency" && rawEndAnchorRef.current) {
      rawEndAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [rawLogs, viewMode]);

  useEffect(() => {
    if (viewMode === "efficiency" && filteredEndAnchorRef.current) {
      filteredEndAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs, viewMode]);

  return (
    <div id="logs-terminal" className={`flex flex-col h-full p-4 rounded-xl border shadow-2xl relative overflow-hidden transition-colors duration-300 ${
      isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800"
    }`}>
      
      {/* Console Header */}
      <div className={`flex items-center justify-between border-b pb-2 shrink-0 ${
        isLight ? "border-slate-100" : "border-slate-900"
      }`}>
        <div className="flex items-center gap-2">
          <Terminal size={14} className={isLight ? "text-sky-600" : "text-sky-400"} />
          <h4 className={`text-[10px] font-bold font-mono tracking-widest uppercase ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}>
            {viewMode === "standard" ? t("platform_logs_header") : "Filtering Efficiency Spectrogram"}
          </h4>
        </div>
        
        {/* Dynamic View Toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-500/10 p-0.5 rounded-lg border border-slate-500/15">
            <button 
              onClick={() => setViewMode("standard")}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase transition-all cursor-pointer ${
                viewMode === "standard" 
                  ? "bg-sky-500 text-slate-950 shadow-sm font-black" 
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Console
            </button>
            <button 
              onClick={() => setViewMode("efficiency")}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === "efficiency" 
                  ? "bg-sky-500 text-slate-950 shadow-sm font-black" 
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity size={10} className={viewMode === "efficiency" ? "animate-pulse" : ""} />
              Efficiency
            </button>
          </div>

          {/* Terminal Mac-Style Control Dots */}
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-[8px] font-mono text-slate-400 mr-1 uppercase">{t("live_sockets")}</span>
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {viewMode === "standard" ? (
        /* Standard Console Mode */
        <div className={`flex-grow mt-3 rounded-lg p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2 shadow-inner transition-colors duration-300 ${
          isLight ? "bg-slate-50 text-slate-800" : "bg-slate-950 text-slate-100"
        }`}>
          <div className={`text-[9px] font-mono select-none pb-1 border-b ${
            isLight ? "text-slate-400 border-slate-200" : "text-slate-600 border-slate-900/40"
          }`}>
            {t("terminal_connected")}
          </div>

          {activeStep.technicalLogs.map((log, idx) => {
            let logColor = isLight ? "text-slate-700" : "text-slate-300";
            if (log.startsWith("WARN:")) logColor = isLight ? "text-amber-700 font-bold" : "text-amber-400";
            if (log.startsWith("SUCCESS:")) logColor = isLight ? "text-emerald-700 font-extrabold" : "text-emerald-400";
            if (log.startsWith("CONNECT:") || log.startsWith("SUBSCRIBE:")) logColor = isLight ? "text-sky-700 font-bold" : "text-sky-400";
            if (log.startsWith("BEEGOL_AI:")) logColor = isLight ? "text-purple-700 font-black" : "text-purple-400 font-bold";

            return (
              <div 
                key={idx} 
                className={`leading-relaxed break-words font-mono transition-colors duration-150 py-0.5 px-1 rounded ${
                  isLight ? "hover:bg-slate-200/50" : "hover:bg-slate-900/30"
                }`}
                style={{ fontSize: "15px" }}
              >
                <span className={`select-none mr-2 ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                  [{new Date().toLocaleTimeString([], { hour12: false })}]
                </span>
                <span className={logColor}>{renderInteractiveText(log)}</span>
              </div>
            );
          })}

          {customLogs.map((item) => {
            let logColor = isLight ? "text-slate-700" : "text-slate-300";
            if (item.level === "warning") logColor = isLight ? "text-amber-700 font-bold" : "text-amber-400 font-bold";
            if (item.level === "success") logColor = isLight ? "text-emerald-700 font-extrabold" : "text-emerald-400 font-extrabold";
            if (item.level === "danger") logColor = isLight ? "text-rose-700 font-black" : "text-rose-400 font-black";
            if (item.level === "info") logColor = isLight ? "text-sky-700 font-bold" : "text-sky-400";

            return (
              <div 
                key={item.id} 
                className={`leading-relaxed break-words font-mono transition-colors duration-150 py-0.5 px-1 rounded ${
                  isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/10"
                }`}
                style={{ fontSize: "15px" }}
              >
                <span className={`select-none mr-2 ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                  [{item.time}]
                </span>
                <span className={logColor}>{renderInteractiveText(item.log)}</span>
              </div>
            );
          })}

          <div 
            className={`leading-relaxed break-words font-mono select-none py-0.5 ${
              isLight ? "text-slate-400" : "text-slate-500"
            }`}
            style={{ fontSize: "15px" }}
          >
            <span className={`mr-2 ${isLight ? "text-slate-300" : "text-slate-600"}`}>
              [{new Date().toLocaleTimeString([], { hour12: false })}]
            </span>
            <span>{t("heartbeat_ok")}</span>
          </div>

          <div ref={terminalEndRef} />
        </div>
      ) : (
        /* Filtering Efficiency Dual Screen Mode */
        <div className="flex flex-col flex-grow mt-2 overflow-hidden min-h-0">
          
          {/* Real-time stats bar */}
          <div className={`p-1.5 px-2 rounded-lg border flex flex-wrap items-center justify-between gap-2 shrink-0 font-mono text-[9px] ${
            isLight 
              ? "bg-slate-100/80 border-slate-200 text-slate-700" 
              : "bg-slate-900/60 border-slate-800/80 text-slate-200"
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">EDGE GATEWAY:</span>
              <span className={`px-1 rounded text-[8px] font-black uppercase tracking-wider ${
                isFilteringActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
              }`}>
                {isFilteringActive ? "Active (Filtering ON)" : "Bypassed (RAW PASS-THROUGH)"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">REDUCTION RATE:</span>
              <span className={`font-black tracking-wide ${isFilteringActive ? "text-emerald-400" : "text-amber-500"}`}>
                {reductionPercent}% Volume Saved
              </span>
              <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden inline-block relative border border-slate-700/30">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isFilteringActive ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${reductionPercent}%` }}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <span className="text-slate-500">SAVINGS RATIO:</span>
              <span className="font-bold text-sky-400">
                {isFilteringActive ? "5:1 Ratio" : "1:1 Raw Output"}
              </span>
            </div>
          </div>

          {/* Dual Columns */}
          <div className="grid grid-cols-2 gap-2.5 flex-grow min-h-0 mt-2 overflow-hidden">
            
            {/* Left Column: RAW CPE STREAM */}
            <div className={`flex flex-col h-full rounded-lg border p-2 overflow-hidden ${
              isLight ? "bg-slate-50 border-slate-200/80" : "bg-slate-950/60 border-slate-900/60"
            }`}>
              <div className="flex items-center justify-between border-b pb-1 mb-1 border-slate-500/10 text-[8px] font-mono font-bold text-slate-400 shrink-0">
                <span className="flex items-center gap-1 select-none">
                  <Activity size={10} className="text-amber-500 animate-pulse" />
                  RAW CLIENT PACKETS (1.84M PKTS/S)
                </span>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-1">
                {rawLogs.map(log => (
                  <div key={log.id} className="text-[11px] font-mono leading-tight whitespace-nowrap overflow-x-hidden text-ellipsis">
                    <span className="text-[9px] text-slate-500 select-none mr-1">[{log.time}]</span>
                    <span className={isLight ? "text-amber-800" : "text-amber-300"}>{log.payload}</span>
                  </div>
                ))}
                <div ref={rawEndAnchorRef} />
              </div>
            </div>

            {/* Right Column: KAFKA INGESTED TOPIC */}
            <div className={`flex flex-col h-full rounded-lg border p-2 overflow-hidden ${
              isLight ? "bg-slate-50 border-slate-200/80" : "bg-slate-950/60 border-slate-900/60"
            }`}>
              <div className="flex items-center justify-between border-b pb-1 mb-1 border-slate-500/10 text-[8px] font-mono font-bold text-slate-400 shrink-0">
                <span className="flex items-center gap-1 select-none">
                  <Terminal size={10} className={isFilteringActive ? "text-emerald-400" : "text-rose-500 animate-pulse"} />
                  INGESTED TOPIC ({isFilteringActive ? "368K PKTS/S" : "1.84M PKTS/S"})
                </span>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-1">
                {filteredLogs.map(log => {
                  let payloadStyle = isLight ? "text-slate-700" : "text-slate-300";
                  if (log.type === "dropped") payloadStyle = isLight ? "text-slate-400 italic text-[10px]" : "text-slate-500/70 italic text-[10px]";
                  else if (log.type === "forwarded") payloadStyle = isLight ? "text-emerald-700 font-bold" : "text-emerald-400 font-bold";
                  else if (log.type === "flood") payloadStyle = isLight ? "text-rose-700" : "text-rose-400/90";

                  return (
                    <div key={log.id} className="text-[11px] font-mono leading-tight whitespace-nowrap overflow-x-hidden text-ellipsis">
                      <span className="text-[9px] text-slate-500 select-none mr-1">[{log.time}]</span>
                      <span className={payloadStyle}>{log.payload}</span>
                    </div>
                  );
                })}
                <div ref={filteredEndAnchorRef} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
