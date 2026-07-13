import React, { useEffect, useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Check, 
  BookOpen, 
  Gamepad2, 
  HelpCircle 
} from "lucide-react";

interface WalkthroughTourProps {
  active: boolean;
  onClose: () => void;
}

interface TourStep {
  targetId: string;
  placement: "above" | "below" | "left" | "right";
  title: {
    en: string;
    pt: string;
    it: string;
  };
  description: {
    en: string;
    pt: string;
    it: string;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "business-metrics",
    placement: "below",
    title: {
      en: "Live Operational KPIs",
      pt: "KPIs Operacionais Ativos",
      it: "KPI Operativi Live"
    },
    description: {
      en: "Track the core pipeline performance in real-time. This includes telemetry ingestion speeds, Beegol's ML root-cause-analysis precision, auto-triggered USP self-heals, and TIM OpEx direct savings.",
      pt: "Acompanhe o desempenho do pipeline em tempo real. Isso inclui velocidades de ingestão, precisão do Beegol ML RCA, auto-correções USP automáticas e economia TIM OpEx.",
      it: "Monitora le prestazioni della pipeline in tempo reale. Include velocità di ingestione della telemetria, precisione Beegol ML RCA, auto-healing USP e risparmio OpEx TIM."
    }
  },
  {
    targetId: "telemetry-ticker",
    placement: "below",
    title: {
      en: "Live RDK-B Telemetry Feed",
      pt: "Feed de Telemetria RDK-B",
      it: "Feed di Telemetria RDK-B"
    },
    description: {
      en: "Watch physical-layer events scroll in real-time. This custom ticker displays RDK-B firmware anomalies, SNR channel drops, optical pre-failure warnings, and automated healing notifications.",
      pt: "Veja eventos da camada física rolarem em tempo real. Este ticker exibe anomalias de firmware RDK-B, quedas de canal SNR, avisos de pré-falha óptica e ações de auto-healing.",
      it: "Guarda gli eventi del livello fisico scorrere in tempo reale. Mostra anomalie firmware RDK-B, cali del canale SNR, avvisi pre-guasto ottico e notifiche di auto-healing."
    }
  },
  {
    targetId: "simulation-viewport",
    placement: "below",
    title: {
      en: "Carrier Topology Explorer",
      pt: "Explorador de Topologia de Rede",
      it: "Esploratore di Topologia di Rete"
    },
    description: {
      en: "Interact with the telemetry distribution graph. Drag and relocate nodes (CPE Gateways, GPON Access, Metro Core, USP Brokers, and Beegol GNN AI) on the grid to recalculate dynamic latency values.",
      pt: "Interaja com o gráfico de distribuição de telemetria. Arraste e reposicione nós (CPE Borda, Acesso GPON, Metro Core, USP Brokers e Beegol GNN AI) para recalcular latências de forma dinâmica.",
      it: "Interagisci con il grafico di telemetria. Trascina e riposiziona i nodi (CPE Gateways, Accesso GPON, Metro Core, USP Brokers e Beegol GNN AI) per ricalcolare dinamicamente la latenza."
    }
  },
  {
    targetId: "autocycle-flow-button",
    placement: "below",
    title: {
      en: "Automatic Player Controls",
      pt: "Controle de Sequência Automática",
      it: "Controlli Sequenza Automatica"
    },
    description: {
      en: "Activate the automatic player to loop through all 5 key stages of the network telemetry pipeline, or step through manually at your own pace to inspect granular diagnostics.",
      pt: "Ative a reprodução automática para ciclar entre todas as 5 etapas do pipeline de telemetria, ou avance manualmente para inspecionar parâmetros detalhados.",
      it: "Attiva la riproduzione automatica per scorrere le 5 fasi chiave della pipeline di telemetria, oppure avanza manualmente per esaminare i dettagli granulari."
    }
  },
  {
    targetId: "fault-visualizer",
    placement: "above",
    title: {
      en: "Pre-emptive Fault Analyzer",
      pt: "Analisador Preventivo de Falhas",
      it: "Analizzatore Preventivo dei Guasti"
    },
    description: {
      en: "Monitor live physical coax frequency spectrums and trigger GNN-based physical line analyses. Isolate sub-layer degradation coordinates dynamically and mitigate failures instantly.",
      pt: "Monitore espectros de frequência física e execute análises baseadas em GNN. Isole coordenadas de degradação física e evite o envio presencial de técnicos.",
      it: "Monitora lo spettro di frequenza coassiale e avvia analisi basate su GNN. Isola le coordinate di degrado fisico ed evita l'uscita dei tecnici."
    }
  },
  {
    targetId: "logs-terminal",
    placement: "above",
    title: {
      en: "Platform Logs & Syslog Stream",
      pt: "Logs da Plataforma e Terminal Syslog",
      it: "Log di Piattaforma e Terminale Syslog"
    },
    description: {
      en: "Inspect low-level platform sockets and live daemon logs. Witness the precise byte operations, MQTT transactions, and API payloads generated at each step of the lifecycle.",
      pt: "Inspecione soquetes de baixo nível da plataforma e logs ativos do daemon. Veja operações de bytes, transações MQTT e payloads de API gerados a cada etapa.",
      it: "Ispeziona log socket di basso livello e log attivi del demone. Osserva operazioni byte, transazioni MQTT e payload API generati in tempo reale in ogni fase."
    }
  },
  {
    targetId: "active-step-sidebar",
    placement: "left",
    title: {
      en: "Business Value & ROI Sidebar",
      pt: "Barra Lateral de ROI e Engenharia",
      it: "Sidebar di ROI e Ingegneria"
    },
    description: {
      en: "Review granular executive value propositions, in-depth engineering calculations, and projected KPI adjustments for the active step. You can also export a high-fidelity Executive Summary PDF.",
      pt: "Revise propostas de valor executivo, cálculos matemáticos de engenharia e projeções de KPI para a etapa ativa. Também é possível exportar um PDF do Sumário Executivo.",
      it: "Esamina proposte di valore aziendale, calcoli di ingegneria e proiezioni di KPI per la fase attiva. Puoi anche esportare un report PDF del Sumario."
    }
  }
];

export default function WalkthroughTour({ active, onClose }: WalkthroughTourProps) {
  const { language, theme } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const isLight = theme === "light";

  const currentStep = TOUR_STEPS[currentIndex];

  const updateCoords = () => {
    if (!active || !currentStep) return;

    const element = document.getElementById(currentStep.targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setCoords({
        top: rect.top + scrollY,
        left: rect.left + scrollX,
        width: rect.width,
        height: rect.height
      });

      // Smoothly scroll targeted element into viewport focus
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setCoords(null);
    }
  };

  // Recalculate coordinates on step change, resize, or inner scroll
  useEffect(() => {
    if (!active) return;
    
    // Tiny delay to allow state and scroll adjustments to complete
    const timer = setTimeout(() => {
      updateCoords();
    }, 100);

    // Capture scroll events at the window/document tree level (third argument = true)
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [currentIndex, active]);

  // Handle popover positioning and arrow placement
  useEffect(() => {
    if (!coords || !popoverRef.current) return;

    const popoverRect = popoverRef.current.getBoundingClientRect();
    const gap = 14;
    let top = 0;
    let left = 0;

    const { top: targetTop, left: targetLeft, width: targetWidth, height: targetHeight } = coords;
    const popoverWidth = popoverRect.width || 380;
    const popoverHeight = popoverRect.height || 220;

    switch (currentStep.placement) {
      case "below":
        top = targetTop + targetHeight + gap;
        left = targetLeft + targetWidth / 2 - popoverWidth / 2;
        break;
      case "above":
        top = targetTop - popoverHeight - gap;
        left = targetLeft + targetWidth / 2 - popoverWidth / 2;
        break;
      case "left":
        top = targetTop + targetHeight / 2 - popoverHeight / 2;
        left = targetLeft - popoverWidth - gap;
        break;
      case "right":
        top = targetTop + targetHeight / 2 - popoverHeight / 2;
        left = targetLeft + targetWidth + gap;
        break;
    }

    // Keep popover safely inside visible screen boundaries
    const margin = 16;
    left = Math.max(margin, Math.min(window.innerWidth - popoverWidth - margin, left));
    top = Math.max(margin, Math.min(window.innerHeight - popoverHeight - margin, top));

    setPopoverStyle({
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
      zIndex: 100
    });
  }, [coords, currentIndex]);

  if (!active || !currentStep || !coords) return null;

  const handleNext = () => {
    if (currentIndex < TOUR_STEPS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("beegol_walkthrough_completed", "true");
    onClose();
    setCurrentIndex(0);
  };

  const stepTitle = currentStep.title[language] || currentStep.title.en;
  const stepDesc = currentStep.description[language] || currentStep.description.en;

  const progressPercent = ((currentIndex + 1) / TOUR_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none select-none">
      
      {/* 1. THE PERFECT SPOTLIGHT PORTAL */}
      <div 
        className="absolute pointer-events-auto rounded-2xl border-2 border-sky-400 transition-all duration-300 ease-out"
        style={{
          boxShadow: "0 0 0 9999px rgba(3, 7, 18, 0.72)",
          top: `${coords.top - 6}px`,
          left: `${coords.left - 6}px`,
          width: `${coords.width + 12}px`,
          height: `${coords.height + 12}px`
        }}
      >
        {/* Glowing pulse aura effect on the targeted block */}
        <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/40 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
      </div>

      {/* 2. FLOATING POPOVER CARD */}
      <div 
        ref={popoverRef}
        style={popoverStyle}
        className={`pointer-events-auto border-2 rounded-2xl p-5 shadow-3xl select-none transition-all duration-300 ${
          isLight 
            ? "bg-white border-sky-200 text-slate-800" 
            : "bg-slate-950/95 border-sky-500/45 text-slate-100 backdrop-blur-xl"
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3 border-b border-sky-500/10 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="text-sky-500 animate-pulse" size={15} />
            <span className="font-mono text-[10px] font-black tracking-widest text-sky-500 uppercase">
              {language === "pt" ? "GUIA INTERATIVO" : language === "it" ? "GUIDA INTERATTIVA" : "INTERACTIVE WALKTHROUGH"}
            </span>
          </div>
          
          <button 
            onClick={handleComplete}
            className="text-slate-500 hover:text-sky-400 p-1 rounded-lg hover:bg-slate-500/10 transition-colors"
            title="Skip onboarding tour"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step Title & Details */}
        <div className="mb-4">
          <h4 className="text-sm font-black tracking-tight mb-2 flex items-center gap-2">
            <span className="text-xs font-mono font-black bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2 py-0.5 rounded">
              {currentIndex + 1}
            </span>
            <span className={isLight ? "text-slate-950" : "text-white"}>{stepTitle}</span>
          </h4>
          <p className={`text-[12px] leading-relaxed font-sans font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {stepDesc}
          </p>
        </div>

        {/* Custom Progress Bar Indicator */}
        <div className="w-full bg-slate-500/10 rounded-full h-1 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-sky-500 to-indigo-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between">
          {/* Progress badge text */}
          <span className="font-mono text-[10px] font-bold text-slate-500">
            {currentIndex + 1} / {TOUR_STEPS.length}
          </span>

          <div className="flex items-center gap-2">
            {/* Skip Link Button */}
            <button
              onClick={handleComplete}
              className="text-[11px] font-mono font-bold text-slate-500 hover:text-rose-500 px-2.5 py-1.5 transition-colors rounded-lg"
            >
              {language === "pt" ? "Pular" : language === "it" ? "Salta" : "Skip"}
            </button>

            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-all ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed border-transparent text-slate-600"
                  : isLight
                  ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ChevronLeft size={13} />
              <span>{language === "pt" ? "Voltar" : language === "it" ? "Indietro" : "Back"}</span>
            </button>

            {/* Next / Finish Button */}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-sky-500 text-slate-950 hover:bg-sky-400 text-[11px] font-mono font-black shadow-md transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>
                {currentIndex === TOUR_STEPS.length - 1
                  ? (language === "pt" ? "Concluir" : language === "it" ? "Fine" : "Finish")
                  : (language === "pt" ? "Avançar" : language === "it" ? "Avanti" : "Next")}
              </span>
              {currentIndex === TOUR_STEPS.length - 1 ? (
                <Check size={13} strokeWidth={2.5} />
              ) : (
                <ChevronRight size={13} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
