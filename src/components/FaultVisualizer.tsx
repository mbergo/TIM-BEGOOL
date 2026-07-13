import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Play, Activity, Zap, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { renderInteractiveText } from "./GlossaryTerm";

export default function FaultVisualizer() {
  const { t, theme } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [waveSeed, setWaveSeed] = useState(0);

  const isLight = theme === "light";

  // Generate a live dynamic wave animation
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveSeed(prev => prev + 0.15);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const triggerDiagnostic = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);
  };

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setAnalysisProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisResult(t("diagnostics_success_result"));
          return 100;
        }
        return p + 4;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Construct points for a live dynamic SNR/electrical wave
  const generateWavePoints = (offset: number, amplitude: number, frequency: number) => {
    const points = [];
    for (let x = 0; x <= 320; x += 4) {
      const noise = Math.sin(x * 0.1 + offset) * Math.cos(x * 0.05 - offset * 0.5) * 5;
      const y = 45 + Math.sin(x * frequency + offset) * amplitude + noise;
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  return (
    <div id="fault-visualizer" className={`flex flex-col h-full p-5 rounded-2xl border-2 shadow-3xl relative overflow-hidden transition-all duration-300 ${
      isLight ? "bg-white border-slate-200" : "bg-slate-950/45 border-slate-800"
    }`}>
      {/* Visual Header */}
      <div className={`flex items-center justify-between border-b-2 pb-3.5 shrink-0 ${
        isLight ? "border-slate-100" : "border-slate-900"
      }`}>
        <div className="flex items-center gap-2.5">
          <Activity size={18} className="text-emerald-500 animate-pulse" />
          <h4 className={`text-[14px] font-extrabold font-mono tracking-wider uppercase ${
            isLight ? "text-slate-800" : "text-slate-300"
          }`}>
            {t("preemptive_fault")}
          </h4>
        </div>
        <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/30 px-3 py-1 rounded-xl uppercase font-black tracking-widest">
          {t("live_dielectric")}
        </span>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 min-h-0">
        
        {/* Left Side: Wave plot & impact panel (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4 min-h-0">
          
          <div className={`flex-grow border-2 rounded-2xl p-4 relative flex flex-col justify-between shadow-2xl min-h-[140px] ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-900"
          }`}>
            {/* Chart info header */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-[12px] font-mono font-bold uppercase tracking-widest ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}>
                {t("raw_phy")}
              </span>
              <span className="text-[12px] font-mono text-emerald-500 animate-pulse font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {t("stable")}
              </span>
            </div>

            {/* SVG Live Anharmonic Wave */}
            <div className="w-full h-28 my-2 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 320 90" className="w-full h-full overflow-visible">
                {/* Reference Baseline */}
                <line x1="0" y1="45" x2="320" y2="45" stroke={isLight ? "#cbd5e1" : "#1e293b"} strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Secondary wave - noise */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeOpacity={isLight ? "0.4" : "0.3"}
                  points={generateWavePoints(waveSeed * 1.5, 12, 0.08)}
                />

                {/* Primary Wi-Fi signal wave */}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeOpacity="0.85"
                  points={generateWavePoints(waveSeed, 18, 0.04)}
                />
                
                {/* Interactive scan line */}
                {isAnalyzing && (
                  <line 
                    x1={`${(analysisProgress / 100) * 320}`} 
                    y1="0" 
                    x2={`${(analysisProgress / 100) * 320}`} 
                    y2="90" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    className="opacity-80"
                    strokeDasharray="2 2"
                  />
                )}
              </svg>
              
              {/* Scan HUD Overlay if analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center backdrop-blur-[0.5px]">
                  <div className={`px-4 py-2.5 rounded-xl border-2 text-center shadow-3xl ${
                    isLight ? "bg-white border-emerald-500/40" : "bg-slate-950/95 border-emerald-500/30"
                  }`}>
                    <span className="text-[11px] font-mono text-emerald-500 uppercase tracking-widest block font-extrabold animate-pulse">
                      GNN Core Inference
                    </span>
                    <span className={`text-[13px] font-mono font-black ${isLight ? "text-slate-800" : "text-white"}`}>
                      {analysisProgress}% COMPLETE
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Summary subtext */}
            <div className={`text-[13px] font-sans z-10 border-t-2 pt-2 flex justify-between items-center ${
              isLight ? "border-slate-200" : "border-slate-900/60"
            }`}>
              <span className={isLight ? "text-slate-600 font-semibold" : "text-slate-300"}>
                {t("center_freq")}: <span className="font-mono text-sky-600 font-black">5.82 GHz</span>
              </span>
              <span className={isLight ? "text-slate-600 font-semibold" : "text-slate-300"}>
                {t("total_dist")}: <span className="font-mono text-rose-500 font-black">0.14%</span>
              </span>
            </div>
          </div>

          {/* Quick Projected ROI Stats Pill (TIM/Beegol dual-company ROI optimization) */}
          <div className={`border-2 rounded-2xl p-4 flex items-center justify-between ${
            isLight 
              ? "bg-emerald-500/5 border-emerald-500/20" 
              : "bg-gradient-to-r from-emerald-500/10 to-transparent border-2 border-emerald-500/20"
          }`}>
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-widest block font-black">
                {t("tim_opex_reduction")}
              </span>
              <span className={`text-[13px] leading-snug font-medium ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                {t("tim_opex_reduction_desc")}
              </span>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[20px] font-black font-mono text-emerald-500 leading-none">-35%</div>
              <div className={`text-[9px] font-mono uppercase tracking-widest font-bold mt-1 ${isLight ? "text-slate-400" : "text-slate-400"}`}>
                {t("truck_dispatches")}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: AI controller & outputs (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4 justify-between min-h-0">
          
          <div className={`border-2 rounded-2xl p-4.5 flex flex-col gap-3 shadow-2xl ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-900"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[12px] font-mono uppercase font-black tracking-wider ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                {t("ai_diagnostics_core")}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">// GNN Engine</span>
            </div>

            <p className={`text-[13px] leading-relaxed font-sans font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              {t("ai_diagnostics_desc")}
            </p>

            <button
              onClick={triggerDiagnostic}
              disabled={isAnalyzing}
              className={`w-full py-3 rounded-xl font-mono text-[12px] font-black uppercase flex items-center justify-center gap-2 transition-all border-2 ${
                isAnalyzing
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-wait"
                  : "bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-emerald-500" />
                  <span className="text-emerald-500">{t("processing_phy")}</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>{t("gen_diagnostic_report")}</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Box */}
          <div className={`flex-grow border-2 rounded-2xl p-4 flex flex-col gap-2 justify-center min-h-[100px] ${
            isLight ? "bg-slate-50 border-slate-200/80" : "bg-slate-950/40 border-slate-900/85"
          }`}>
            <span className={`text-[11px] font-mono uppercase tracking-widest block font-black ${isLight ? "text-slate-400" : "text-slate-400"}`}>
              {t("inference_outcome")}
            </span>
            {analysisResult ? (
              <div className="flex gap-2.5 items-start text-[13px] leading-relaxed text-emerald-600 font-sans font-semibold animate-in fade-in duration-200">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <p>{renderInteractiveText(analysisResult)}</p>
              </div>
            ) : isAnalyzing ? (
              <div className={`flex gap-2.5 items-center text-[13px] font-mono animate-pulse ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                <span>{t("calc_gnn")}</span>
              </div>
            ) : (
              <div className={`flex gap-2.5 items-start text-[13px] leading-relaxed font-sans italic ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                <AlertCircle size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{t("ready_telemetry")}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
