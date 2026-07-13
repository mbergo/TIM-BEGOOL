import React, { useState, useEffect } from "react";
import BusinessMetrics from "./components/BusinessMetrics";
import NetworkSimulation from "./components/NetworkSimulation";
import FaultVisualizer from "./components/FaultVisualizer";
import LogsTerminal from "./components/LogsTerminal";
import ActiveStepSidebar from "./components/ActiveStepSidebar";
import { useApp } from "./context/AppContext";
import { getLocalizedPipelineSteps } from "./data/pipelineData";
import { 
  Activity, 
  Play, 
  Pause, 
  ArrowRight, 
  RotateCcw, 
  TrendingUp, 
  Sun, 
  Moon,
  Briefcase,
  HelpCircle
} from "lucide-react";
import DeveloperResume from "./components/DeveloperResume";
import TelemetryTicker from "./components/TelemetryTicker";
import WalkthroughTour from "./components/WalkthroughTour";
import PipelineArchitectureController from "./components/PipelineArchitectureController";

export default function App() {
  const { language, setLanguage, theme, setTheme, t } = useApp();
  const [activeStepId, setActiveStepId] = useState("user-cpe");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(() => {
    return localStorage.getItem("beegol_walkthrough_completed") !== "true";
  });

  const steps = getLocalizedPipelineSteps(language);
  const activeIndex = steps.findIndex((s) => s.id === activeStepId);
  const activeStep = steps[activeIndex] || steps[0];

  const isLight = theme === "light";

  // Auto-Cycle Flow Logic: advances steps every 5 seconds when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepId((prevId) => {
          const currentIndex = steps.findIndex((s) => s.id === prevId);
          const nextIndex = (currentIndex + 1) % steps.length;
          return steps[nextIndex].id;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps]);

  // Handler for advancing step manually
  const handleNextStep = () => {
    setIsPlaying(false); // Pause auto-play during manual navigation
    const nextIndex = (activeIndex + 1) % steps.length;
    setActiveStepId(steps[nextIndex].id);
  };

  // Handler for resetting flow
  const handleResetFlow = () => {
    setIsPlaying(false);
    setActiveStepId(steps[0].id);
  };

  return (
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden border-4 transition-colors duration-300 selection:bg-sky-500/30 ${
      isLight ? "bg-slate-50 text-slate-800 border-slate-200" : "bg-[#020617] text-slate-100 border-slate-950"
    }`}>
      
      {/* 1. MASTER HEADER - Replicating iFood high-fidelity styling */}
      <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 z-30 relative select-none transition-colors duration-300 ${
        isLight ? "border-slate-200 bg-white/70 backdrop-blur-md" : "border-slate-900 bg-slate-950/60 backdrop-blur-md"
      }`}>
        
        {/* Left Side: Brand Logo & Title Blocks */}
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-sky-400/30">
            <Activity size={22} className="text-white" strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`text-base font-black tracking-widest uppercase ${isLight ? "text-slate-900" : "text-white"}`}>
                BEERGO'L AURORAOPS
              </span>
              <span className="text-xs font-bold font-mono bg-sky-500/15 text-sky-500 dark:text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
                {t("active_pipeline_badge")}
              </span>
            </div>
            <span className={`text-xs font-bold font-mono uppercase tracking-wider leading-none mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {t("header_sub")}
            </span>
          </div>
        </div>

        {/* Right Side: Market dropdown, Language switcher, Theme Switcher & ROI Target */}
        <div className="flex items-center gap-4">
          
          {/* Market selector pill */}
          <div className={`hidden md:flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-colors ${
            isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-slate-900 border-slate-800 text-slate-200"
          }`}>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>{t("market_title")}</span>
          </div>

          {/* Dynamic Language Switcher Segment */}
          <div className={`flex items-center gap-1 border rounded-lg p-0.5 transition-colors ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
          }`}>
            {(["en", "pt", "it"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded text-[11px] font-mono font-black transition-all ${
                  language === lang
                    ? "bg-sky-500 text-slate-950 shadow-md font-extrabold"
                    : isLight 
                    ? "text-slate-500 hover:text-slate-950" 
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Onboarding Guided Tour Button */}
          <button
            onClick={() => setIsTourActive(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 text-xs font-mono font-black transition-all cursor-pointer shadow-md"
            title="Start Interactive Onboarding Tour"
          >
            <HelpCircle size={13} className="text-indigo-500 animate-pulse" />
            <span>QUICK TOUR</span>
          </button>

          {/* Developer CV Button */}
          <button
            onClick={() => setIsResumeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 dark:text-sky-400 border border-sky-500/30 text-xs font-mono font-black transition-all cursor-pointer shadow-md"
            title="View Developer CV / Resume"
          >
            <Briefcase size={13} />
            <span>DEV RESUME</span>
          </button>

          {/* Interactive Light / Dark Theme Switcher */}
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={`p-2 rounded-lg border transition-all shadow-sm ${
              isLight 
                ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
            title="Toggle App Theme"
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Green highlight ROI Target pill (Matches iFood high ROI badge) */}
          <div className="flex items-center gap-2 bg-emerald-500/10 border-2 border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>ROI TARGET: 480% (Year 3)</span>
          </div>

          {/* Platform tag */}
          <span className={`text-xs font-mono border px-3 py-1.5 rounded transition-colors ${
            isLight ? "bg-slate-100 border-slate-200 text-slate-500" : "bg-slate-950/50 border-slate-800 text-slate-400"
          }`}>
            v5.4-AURA
          </span>
        </div>
      </header>

      {/* 2. MAIN SPLIT BODY (Left dashboard viewport + Right sidebar panel) */}
      <div className="flex-grow flex overflow-hidden min-h-0 relative">
        
        {/* LEFT COLUMN: Takes ~72% width and fits all visuals, simulations, and consoles */}
        <main className={`flex-grow flex flex-col p-5 gap-4 overflow-y-auto min-w-0 select-none transition-all duration-500 ${
          isLight 
            ? "bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#e2e8f0_100%)]" 
            : "bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_100%)]"
        }`}>
          
          {/* Section A: Live Stat Cards (Row on top) */}
          <div className="shrink-0 flex flex-col gap-4">
            <BusinessMetrics />
            <TelemetryTicker />
          </div>

          {/* Section B: Simulation Frame Header & Active Map Explorer */}
          <div className={`flex-grow flex flex-col border rounded-xl p-5 shadow-2xl relative overflow-hidden min-h-[420px] transition-colors duration-300 ${
            isLight ? "border-slate-200 bg-white" : "border-slate-900 bg-slate-950/30"
          }`}>
            
            {/* Simulation Block Header Control Card */}
            <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 mb-4 select-none shrink-0 ${
              isLight ? "border-slate-100" : "border-slate-900"
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded border border-sky-500/20 font-black">
                    {t("interaction_title")}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    // {t("interaction_sub")}
                  </span>
                </div>
                <h3 className={`text-lg font-black tracking-tight mt-1.5 flex items-center gap-2 ${
                  isLight ? "text-slate-950" : "text-slate-100"
                }`}>
                  {t("sim_title")}
                </h3>
              </div>

              {/* Simulation Player / Stepper Interface */}
              <div className="flex items-center gap-2.5">
                
                {/* Auto Cycle Button */}
                <button
                  id="autocycle-flow-button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[11px] font-black tracking-wider uppercase transition-all duration-300 border cursor-pointer select-none overflow-visible hover:scale-[1.05] active:scale-[0.97] ${
                    isPlaying
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:bg-amber-400"
                      : "bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.55)] hover:from-sky-400 hover:to-indigo-500"
                  }`}
                  title={isPlaying ? "Pause automatic step transition" : "Auto cycle steps from CPE to cloud AI"}
                >
                  {/* Subtle breathing background ring for emphasis when not playing */}
                  {!isPlaying && (
                    <span className="absolute inset-0 rounded-xl bg-sky-400/30 blur-md -z-10 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: "2.5s" }} />
                  )}
                  {isPlaying ? (
                    <>
                      <Pause size={13} fill="currentColor" className="animate-pulse" />
                      <span>{t("pause_auto_cycle")}</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} fill="currentColor" className="animate-bounce" style={{ animationDuration: "2s" }} />
                      <span className="relative z-10">{t("auto_cycle_flow")}</span>
                    </>
                  )}
                </button>

                {/* Manual Next Step Button (Matches iFood styled button) */}
                <button
                  onClick={handleNextStep}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                    isLight 
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950" 
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700 hover:text-white"
                  }`}
                  title="Advance to next step"
                >
                  <span>{t("next_step")}</span>
                  <ArrowRight size={13} className="text-sky-500" />
                </button>

                {/* Reset button */}
                <button
                  onClick={handleResetFlow}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    isLight 
                      ? "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700" 
                      : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-200"
                  }`}
                  title="Reset flow to Step 1"
                >
                  <RotateCcw size={13} />
                </button>

                <div className={`w-[1px] h-6 mx-1 ${isLight ? "bg-slate-200" : "bg-slate-900"}`} />

                {/* Step indicator box */}
                <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
                  isLight ? "bg-slate-50 border-slate-200 text-sky-600" : "bg-slate-950 border-slate-900 text-sky-400"
                }`}>
                  {t("step_badge_prefix")} {activeIndex + 1} / {steps.length}
                </div>

              </div>
            </div>

            {/* Simulation Canvas / Map Content area */}
            <div className="flex-grow min-h-0">
              <NetworkSimulation activeStepId={activeStepId} />
            </div>

          </div>

          {/* Real-time Ingestion Filter Strategy & Multi-Protocol Emulator */}
          <div className="shrink-0">
            <PipelineArchitectureController />
          </div>

          {/* Section C: Dual Diagnostic & Logging Consoles (Bottom Row) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[240px] shrink-0">
            {/* Bottom-Left: Live AI Anomaly spectrum graph */}
            <div className="min-h-0">
              <FaultVisualizer />
            </div>

            {/* Bottom-Right: Raw terminal logging console */}
            <div className="min-h-0">
              <LogsTerminal activeStepId={activeStepId} />
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN: Takes ~28% width, dedicated to detailed step parameters and ROI explanations */}
        <aside className="w-[400px] shrink-0 h-full z-20">
          <ActiveStepSidebar activeStepId={activeStepId} />
        </aside>

      </div>

      {/* Developer Resume Overlay */}
      <DeveloperResume isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} isLight={isLight} />

      {/* Guided Walkthrough Tour */}
      <WalkthroughTour active={isTourActive} onClose={() => setIsTourActive(false)} />
    </div>
  );
}
