import React, { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { getLocalizedPipelineSteps } from "../data/pipelineData";
import { Terminal } from "lucide-react";
import { renderInteractiveText } from "./GlossaryTerm";

interface LogsTerminalProps {
  activeStepId: string;
}

export default function LogsTerminal({ activeStepId }: LogsTerminalProps) {
  const { language, theme, t } = useApp();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [customLogs, setCustomLogs] = React.useState<{ id: number; log: string; level: string; time: string }[]>([]);

  const steps = getLocalizedPipelineSteps(language);
  const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

  const isLight = theme === "light";

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

  // Clear custom logs when active step changes to prevent mixing steps
  useEffect(() => {
    setCustomLogs([]);
  }, [activeStepId]);

  // Auto scroll terminal logs when step or custom logs change
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeStepId, customLogs]);

  return (
    <div id="logs-terminal" className={`flex flex-col h-full p-4 rounded-xl border shadow-2xl relative overflow-hidden transition-colors duration-300 ${
      isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800"
    }`}>
      
      {/* Console Header */}
      <div className={`flex items-center justify-between border-b pb-2.5 shrink-0 ${
        isLight ? "border-slate-100" : "border-slate-900"
      }`}>
        <div className="flex items-center gap-2">
          <Terminal size={14} className={isLight ? "text-sky-600" : "text-sky-400"} />
          <h4 className={`text-[10px] font-bold font-mono tracking-widest uppercase ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}>
            {t("platform_logs_header")}
          </h4>
        </div>
        
        {/* Terminal Mac-Style Control Dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-mono text-slate-400 mr-2 uppercase">{t("live_sockets")}</span>
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/85 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/85 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/85 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
        </div>
      </div>

      {/* Terminal logs content container - Mandated large 22px font */}
      <div className={`flex-grow mt-3 rounded-lg p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 shadow-inner transition-colors duration-300 ${
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
              style={{ fontSize: "15px" }} // Mandated large font size exactly applied, decreased by 30% per user request
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

        {/* Dummy heartbeat log to add real-time feeling */}
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
    </div>
  );
}
