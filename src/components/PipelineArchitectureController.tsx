import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sliders, 
  Layers, 
  HelpCircle, 
  Activity, 
  Zap, 
  Database, 
  Filter, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  AlertTriangle,
  Cpu,
  Radio,
  Server,
  Code
} from "lucide-react";

export default function PipelineArchitectureController() {
  const { 
    language, 
    theme, 
    filterBarrier, 
    setFilterBarrier, 
    protocolMode, 
    setProtocolMode,
    activeRemediation,
    setActiveRemediation,
    backpressureValue,
    setBackpressureValue
  } = useApp();

  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<"architecture" | "protocols" | "remediation">("architecture");
  const [remediationFeedback, setRemediationFeedback] = useState<string | null>(null);

  // Dynamic backpressure calculations based on active selections
  useEffect(() => {
    let baseBackpressure = 12;

    // After Kafka is heavily congested because of junk data ingestion
    if (filterBarrier === "after-kafka") {
      baseBackpressure += 54;
    }

    // Protocol overheads
    if (protocolMode === "tr069") {
      baseBackpressure += 28; // legacy XML overhead
    } else if (protocolMode === "gnmi") {
      baseBackpressure += 14; // high frequency spikes
    } else if (protocolMode === "otel") {
      baseBackpressure -= 5;  // highly optimized OTel structure
    } else if (protocolMode === "tr369") {
      baseBackpressure -= 8;  // binary protobuf push is ultra lean
    }

    // Ensure range is bounded
    const finalValue = Math.max(4, Math.min(98, baseBackpressure));
    setBackpressureValue(finalValue);
  }, [filterBarrier, protocolMode, setBackpressureValue]);

  // Multilingual text dictionary
  const dict = {
    en: {
      panel_title: "AuraOps Pipeline Architecture & Protocol Emulator",
      panel_subtitle: "TIM-Beegol Live Data Filtering & Remote Remediation Suite",
      tab_arch: "Ingestion & Filter Barrier",
      tab_proto: "Telemetry Protocol Emulator",
      tab_remedy: "AI Remote Remediation",
      
      // Dual Natures section
      nature_title: "Dual-Nature Data Pipeline (Boss's Blueprint)",
      nature_desc: "TIM network streams are split into two distinct Kafka topics across all CPE models:",
      nature_1: "1) Network Inventory Topic: Connects CPEs to network nodes (OLT, BRAS, Brasils, cities, regions).",
      nature_2: "2) Telemetry / Performance Topic: Dynamic physical-layer metrics (SNR, errors, attenuation).",
      
      // Filter Barrier section
      barrier_title: "Data Filtering Strategy",
      barrier_desc: "Filter non-Beegol CPE models to prevent Databricks congestion & high cloud costs.",
      barrier_before: "Before Kafka (Optimized Edge)",
      barrier_before_desc: "Apache NiFi / OTel agents filter out non-Beegol CPEs at the edge. Only target models reach Kafka.",
      barrier_after: "After Kafka (Ingress Databricks)",
      barrier_after_desc: "TIM dumps ALL CPE models into Kafka. Databricks must parse every single payload to discard junk data.",
      
      // Impact badges
      optimized: "Optimized Ingest",
      congested: "Heavy Backpressure",
      msg_load: "Kafka Ingest Load",
      cloud_cost: "Est. Ingestion Cost",
      consumer_lag: "Consumer Lag",
      
      // Protocols section
      proto_title: "Protocol emulations",
      proto_desc: "Toggle different telecommunications transport standards and observe processing lag:",
      proto_tr069: "TR-069 CWMP (Legacy)",
      proto_tr069_desc: "XML over SOAP. Pull-based polling. Massive protocol overhead and synchronous latency.",
      proto_tr369: "TR-369 USP (Modern)",
      proto_tr369_desc: "Binary Protobuf payloads. Efficient push-only. Ideal for real-time telemetry.",
      proto_mqtt: "MQTT Pub/Sub",
      proto_mqtt_desc: "Lightweight message broker pub-sub. Highly reliable and scalable.",
      proto_gnmi: "gNMI (gRPC Streaming)",
      proto_gnmi_desc: "Ultra high-frequency streaming telemetry. Best for real-time backbone monitoring.",
      proto_otel: "OTel (OpenTelemetry Philosophy)",
      proto_otel_desc: "Custom-instrumented agents. Equips device firmware to push granular physical layer metrics.",
      
      // Remediation section
      remedy_title: "Remote Remediation Tools (Closed-Loop GNN)",
      remedy_desc: "Beegol AI does not just predict faults. It triggers immediate remote remediation actions to heal physical-layer degradation without technician truck rolls.",
      remedy_btn1: "Trigger USP RPC Self-Heal",
      remedy_btn1_desc: "Reboots CPE drivers, shifts congested channels, and restarts USP broker.",
      remedy_btn2: "Tune GPON ONT Laser Range",
      remedy_btn2_desc: "Remotely recalibrates optic transceiver laser alignment on the ONT.",
      remedy_btn3: "Adjust BRAS QoS Throttle",
      remedy_btn3_desc: "Applies immediate rate-limiting policies on congested BRAS/BRAS-TIM ports.",
      remedy_btn4: "Apply Dynamic Physical Profile",
      remedy_btn4_desc: "Resets physical loop DSL/FTTH SNR parameters to counter ambient noise."
    },
    pt: {
      panel_title: "Arquitetura de Pipeline e Emulador de Protocolo",
      panel_subtitle: "TIM-Beegol Filtragem de Dados e Suíte de Remediação Remota",
      tab_arch: "Fronteira de Filtragem",
      tab_proto: "Emulador de Protocolo",
      tab_remedy: "Remediação Remota IA",
      
      // Dual Natures section
      nature_title: "Fluxos de Dupla Natureza (Diretrizes da Chefia)",
      nature_desc: "Os fluxos de rede da TIM são divididos em dois tópicos Kafka para todos os modelos de CPE:",
      nature_1: "1) Tópico de Inventário: Vincula CPEs a elementos da rede (OLT, BRAS, cidades, regiões).",
      nature_2: "2) Tópico de Telemetria / Performance: Métricas físicas dinâmicas (SNR, erros de atenuação).",
      
      // Filter Barrier section
      barrier_title: "Estratégia de Filtragem de Dados",
      barrier_desc: "Filtre modelos de CPE que não possuem Beegol para evitar congestionamento e custos altos.",
      barrier_before: "Antes do Kafka (Filtro Inteligente na Borda)",
      barrier_before_desc: "Apache NiFi ou agentes OTel filtram CPEs na borda. Apenas os modelos desejados entram no Kafka.",
      barrier_after: "Depois do Kafka (Filtro no Databricks)",
      barrier_after_desc: "TIM joga TODOS os modelos no Kafka. O Databricks precisa ler carga por carga para descartar o lixo.",
      
      // Impact badges
      optimized: "Ingestão Otimizada",
      congested: "Gargalo / Backpressure",
      msg_load: "Carga do Ingestão Kafka",
      cloud_cost: "Custo de Ingestão Est.",
      consumer_lag: "Atraso de Processamento",
      
      // Protocols section
      proto_title: "Emulações de Protocolo",
      proto_desc: "Selecione diferentes padrões de comunicação e observe a latência de rede:",
      proto_tr069: "TR-069 CWMP (Legado)",
      proto_tr069_desc: "XML sobre SOAP. Padrão baseado em polling. Alto overhead de rede e alto processamento.",
      proto_tr369: "TR-369 USP (Moderno)",
      proto_tr369_desc: "Payloads binários em Protobuf. Push eficiente em tempo real. Ideal para Beegol.",
      proto_mqtt: "MQTT Pub/Sub",
      proto_mqtt_desc: "Broker leve de mensageria pub-sub. Alta confiabilidade e escalabilidade.",
      proto_gnmi: "gNMI (gRPC Streaming)",
      proto_gnmi_desc: "Telemetria via gRPC de ultra alta frequência. Excelente para backbone de rede.",
      proto_otel: "Filosofia OTel (OpenTelemetry)",
      proto_otel_desc: "Código instrumentado no OS do CPE para enviar telemetria estendida de forma direta.",
      
      // Remediation section
      remedy_title: "Ferramentas de Remediação Remota (Malha Fechada GNN)",
      remedy_desc: "A inteligência da Beegol não apenas prevê falhas. Ela aciona remediações automáticas para corrigir a camada física de forma remota, evitando envio de técnicos.",
      remedy_btn1: "Acionar USP RPC Self-Heal",
      remedy_btn1_desc: "Reinicia drivers do CPE, muda canal Wi-Fi congestionado e reinicia o broker USP.",
      remedy_btn2: "Calibrar Laser da ONT GPON",
      remedy_btn2_desc: "Ajusta o alinhamento de frequência óptica do laser diretamente na ONT.",
      remedy_btn3: "Ajustar Limite de Banda no BRAS",
      remedy_btn3_desc: "Aplica políticas imediatas de QoS nas portas do BRAS-TIM congestionadas.",
      remedy_btn4: "Aplicar Perfil Físico Dinâmico",
      remedy_btn4_desc: "Reconfigura parâmetros de margem SNR em malhas físicas para anular ruído elétrico."
    },
    it: {
      panel_title: "Architettura Pipeline & Emulatore di Protocollo",
      panel_subtitle: "TIM-Beegol Suite di Filtraggio Dati e Remediation Remota",
      tab_arch: "Barriera di Filtraggio",
      tab_proto: "Emulatore di Protocollo",
      tab_remedy: "AI Remediation Remota",
      
      // Dual Natures section
      nature_title: "Dual-Nature Data Pipeline (TIM Blueprint)",
      nature_desc: "I flussi di rete TIM sono divisi in due distinti topic Kafka per tutti i modelli di CPE:",
      nature_1: "1) Topic Inventario: Collega CPE agli elementi di rete (OLT, BRAS, città, regioni).",
      nature_2: "2) Topic Telemetria / Performance: Metriche dinamiche del livello fisico (SNR, errori, attenuazione).",
      
      // Filter Barrier section
      barrier_title: "Strategia di Filtraggio dei Dati",
      barrier_desc: "Filtra i modelli CPE non Beegol per prevenire il sovraccarico di Databricks e ridurre i costi cloud.",
      barrier_before: "Prima di Kafka (Filtro Edge)",
      barrier_before_desc: "Apache NiFi / agenti OTel filtrano i CPE non Beegol all'edge. Solo i modelli desiderati entrano in Kafka.",
      barrier_after: "Dopo Kafka (Filtro Databricks)",
      barrier_after_desc: "TIM invia TUTTI i modelli CPE in Kafka. Databricks deve ispezionare ogni payload per scartare i dati inutili.",
      
      // Impact badges
      optimized: "Ingestione Ottimizzata",
      congested: "Sovraccarico Backpressure",
      msg_load: "Carico di Ingestione Kafka",
      cloud_cost: "Costo Ingestione Est.",
      consumer_lag: "Ritardo di Elaborazione",
      
      // Protocols section
      proto_title: "Emulazioni di Protocollo",
      proto_desc: "Seleziona diversi standard di comunicazione e osserva l'effetto sul carico del sistema:",
      proto_tr069: "TR-069 CWMP (Legacy)",
      proto_tr069_desc: "XML su SOAP. Polling sincrono. Elevato sovraccarico del protocollo e alta latenza.",
      proto_tr369: "TR-369 USP (Moderno)",
      proto_tr369_desc: "Payload Protobuf binari. Push ultra efficiente in tempo reale. Ideale per Beegol.",
      proto_mqtt: "MQTT Pub/Sub",
      proto_mqtt_desc: "Broker leggero di messaggistica pub-sub. Altamente affidabile e scalabile.",
      proto_gnmi: "gNMI (gRPC Streaming)",
      proto_gnmi_desc: "Telemetria streaming gRPC ad altissima frequenza. Ottimo per monitoraggio backbone.",
      proto_otel: "Filosofia OTel (OpenTelemetry)",
      proto_otel_desc: "Strumentazione personalizzata nel firmware del dispositivo per spingere metriche fisiche.",
      
      // Remediation section
      remedy_title: "Strumenti di Remediation Remota (Closed-Loop GNN)",
      remedy_desc: "L'intelligenza artificiale Beegol non si limita a prevedere i guasti. Avvia azioni correttive remote istantanee per risolvere il degrado fisico senza tecnici sul campo.",
      remedy_btn1: "Avvia USP RPC Self-Heal",
      remedy_btn1_desc: "Riavvia i driver del CPE, cambia canale Wi-Fi intasato e riavvia il broker USP.",
      remedy_btn2: "Calibra Laser della ONT GPON",
      remedy_btn2_desc: "Regola l'allineamento della frequenza ottica direttamente sull'ONT.",
      remedy_btn3: "Regola Limite Banda sul BRAS",
      remedy_btn3_desc: "Applica politiche di QoS sulle porte BRAS TIM congestionate.",
      remedy_btn4: "Applica Profilo Fisico Dinamico",
      remedy_btn4_desc: "Riconfigura i parametri di margine SNR per escludere i disturbi fisici."
    }
  };

  const text = dict[language] || dict.en;

  const triggerRemediation = (actionId: string, label: string) => {
    setActiveRemediation(actionId);
    setRemediationFeedback("deploying");
    
    // Broadcast message to simulated terminal logs
    const event = new CustomEvent("syslog-event", {
      detail: {
        message: `[REMEDIATION] Closed-loop action triggered: ${label.toUpperCase()} via TR-369 USP remote RPC wrapper.`,
        level: "warning"
      }
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      // Complete action
      setRemediationFeedback("success");
      
      // Temporarily drop backpressure value
      setBackpressureValue(prev => Math.max(3, prev - 15));

      // Dispatch success logs
      const successEvent = new CustomEvent("syslog-event", {
        detail: {
          message: `[REMEDIATION] Remote RPC execute command '${actionId}' returned STATUS: 200 OK. Physical degradation resolved. No technician dispatch required!`,
          level: "success"
        }
      });
      window.dispatchEvent(successEvent);

      setTimeout(() => {
        setRemediationFeedback(null);
        setActiveRemediation(null);
      }, 3000);

    }, 1500);
  };

  // Performance calculations
  const totalCPECount = "2,500,000";
  const beegolSupportedCount = "500,000";

  // Est stats based on filtering
  const estimatedMsgRate = filterBarrier === "before-kafka" ? "360,000" : "1,842,500";
  const estimatedCost = filterBarrier === "before-kafka" ? "$4,500/mo" : "$22,800/mo";
  const isBackpressureCritical = backpressureValue > 45;

  return (
    <div className={`w-full rounded-2xl border-2 shadow-2xl overflow-hidden transition-all duration-300 ${
      isLight ? "bg-white border-slate-200" : "bg-slate-950/75 border-slate-900/90"
    }`}>
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 border-b border-indigo-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="text-indigo-400 animate-pulse" size={16} />
              <span className="font-mono text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                {language === "pt" ? "GERENCIADOR DE PIPELINE TIM" : language === "it" ? "GESTIONE PIPELINE TIM" : "TIM PIPELINE MANAGEMENT"}
              </span>
            </div>
            <h3 className="text-md font-black text-white tracking-tight mt-1">
              {text.panel_title}
            </h3>
            <p className="text-[11px] font-medium text-slate-400">
              {text.panel_subtitle}
            </p>
          </div>
          
          {/* Stats Bar */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-500 uppercase">TIM CPE Pool</span>
              <span className="text-xs font-mono font-black text-indigo-300">{totalCPECount}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-500 uppercase">Beegol CPEs</span>
              <span className="text-xs font-mono font-black text-emerald-400">{beegolSupportedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Double-Nature Warning/Blueprint (Boss's feedback highlighted) */}
      <div className={`p-4 border-b ${isLight ? "bg-amber-50/40 border-amber-100" : "bg-amber-500/[0.02] border-amber-500/10"}`}>
        <div className="flex gap-3">
          <Layers className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider ${isLight ? "text-amber-800" : "text-amber-400"}`}>
              {text.nature_title}
            </h4>
            <p className={`text-[11px] mt-1 ${isLight ? "text-slate-600" : "text-slate-300"} leading-relaxed`}>
              {text.nature_desc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className={`p-2 rounded-lg border text-[10.5px] font-mono ${isLight ? "bg-slate-50 border-slate-100 text-slate-700" : "bg-slate-900/60 border-slate-800/60 text-slate-300"}`}>
                <span className="font-bold text-sky-400">🏢 Topic A: TIM.INVENTORY.RAW</span>
                <p className="text-[9.5px] text-slate-500 mt-0.5">{text.nature_1}</p>
              </div>
              <div className={`p-2 rounded-lg border text-[10.5px] font-mono ${isLight ? "bg-slate-50 border-slate-100 text-slate-700" : "bg-slate-900/60 border-slate-800/60 text-slate-300"}`}>
                <span className="font-bold text-emerald-400">📊 Topic B: TIM.TELEMETRY.RAW</span>
                <p className="text-[9.5px] text-slate-500 mt-0.5">{text.nature_2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Segment Tab Headers */}
      <div className={`flex border-b text-xs font-mono font-black ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/30 border-slate-900"}`}>
        <button
          onClick={() => setActiveTab("architecture")}
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "architecture"
              ? "border-sky-500 text-sky-400 bg-sky-500/[0.03]"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Filter size={13} />
            {text.tab_arch}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("protocols")}
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "protocols"
              ? "border-sky-500 text-sky-400 bg-sky-500/[0.03]"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Radio size={13} />
            {text.tab_proto}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("remediation")}
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "remediation"
              ? "border-sky-500 text-sky-400 bg-sky-500/[0.03]"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Zap size={13} className="text-amber-400" />
            {text.tab_remedy}
          </span>
        </button>
      </div>

      {/* 4. Tab Contents */}
      <div className="p-5">
        
        {/* TAB 1: ARCHITECTURE FILTERING BARRIER */}
        {activeTab === "architecture" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h4 className={`text-sm font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                {text.barrier_title}
              </h4>
              <p className="text-xs text-slate-400">
                {text.barrier_desc}
              </p>
            </div>

            {/* Toggle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option A: Before Kafka */}
              <button
                onClick={() => {
                  setFilterBarrier("before-kafka");
                  const event = new CustomEvent("syslog-event", {
                    detail: {
                      message: "[PIPELINE] Filtering barrier shifted to BEFORE KAFKA (Edge Filtering via NiFi). Non-Beegol models discarded at source.",
                      level: "info"
                    }
                  });
                  window.dispatchEvent(event);
                }}
                className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  filterBarrier === "before-kafka"
                    ? "border-emerald-500 bg-emerald-500/[0.02] ring-2 ring-emerald-500/20"
                    : isLight
                    ? "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    : "border-slate-900 hover:border-slate-800 bg-slate-950/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    {text.barrier_before}
                  </span>
                  {filterBarrier === "before-kafka" && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                      ACTIVE (RECOMMENDED)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {text.barrier_before_desc}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-500/10 flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Kafka Topic Rate: ~360k msg/s</span>
                  <span className="text-emerald-400 font-bold">TIM OpEx: Optimized</span>
                </div>
              </button>

              {/* Option B: After Kafka */}
              <button
                onClick={() => {
                  setFilterBarrier("after-kafka");
                  const event = new CustomEvent("syslog-event", {
                    detail: {
                      message: "[PIPELINE] ALERT: Filtering barrier shifted to AFTER KAFKA (Post-Ingest Databricks). 1.8M msg/s hitting Kafka. High database backpressure detected.",
                      level: "danger"
                    }
                  });
                  window.dispatchEvent(event);
                }}
                className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  filterBarrier === "after-kafka"
                    ? "border-rose-500 bg-rose-500/[0.02] ring-2 ring-rose-500/20"
                    : isLight
                    ? "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    : "border-slate-900 hover:border-slate-800 bg-slate-950/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    {text.barrier_after}
                  </span>
                  {filterBarrier === "after-kafka" && (
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
                      CONGESTED STATE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {text.barrier_after_desc}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-500/10 flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Kafka Topic Rate: ~1.84M msg/s</span>
                  <span className="text-rose-400 font-bold">TIM OpEx: Wasted Cloud compute</span>
                </div>
              </button>

            </div>

            {/* Simulated Live Impact Gauges */}
            <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/40 border-slate-900"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-sky-400" />
                <span className="text-xs font-mono font-black uppercase tracking-wider">
                  {language === "pt" ? "MONITOR DE IMPACTO DE INGESTÃO" : "INGESTION IMPACT MONITOR"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Gauge 1: Msg Rate */}
                <div className="flex flex-col bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500">{text.msg_load}</span>
                  <span className={`text-lg font-black font-mono tracking-tight mt-1 ${
                    filterBarrier === "before-kafka" ? "text-emerald-400" : "text-rose-400 animate-pulse"
                  }`}>
                    {estimatedMsgRate} <span className="text-[10px] font-normal">msg/s</span>
                  </span>
                </div>

                {/* Gauge 2: Costs */}
                <div className="flex flex-col bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500">{text.cloud_cost}</span>
                  <span className={`text-lg font-black font-mono tracking-tight mt-1 ${
                    filterBarrier === "before-kafka" ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {estimatedCost}
                  </span>
                </div>

                {/* Gauge 3: Backpressure / Lag */}
                <div className="flex flex-col bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500">{text.consumer_lag}</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-md font-black font-mono ${
                      isBackpressureCritical ? "text-rose-400 animate-pulse" : "text-emerald-400"
                    }`}>
                      {backpressureValue}%
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black ${
                      isBackpressureCritical ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {isBackpressureCritical ? "BACKPRESSURE" : "HEALED"}
                    </span>
                  </div>
                  {/* Progress Bar bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${
                        isBackpressureCritical ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                      }`}
                      style={{ width: `${backpressureValue}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROTOCOLS EMULATION */}
        {activeTab === "protocols" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h4 className={`text-sm font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                {text.proto_title}
              </h4>
              <p className="text-xs text-slate-400">
                {text.proto_desc}
              </p>
            </div>

            {/* Protocol Picker Rows */}
            <div className="flex flex-col gap-3">
              {[
                { id: "tr369", name: text.proto_tr369, desc: text.proto_tr369_desc, overhead: "Extremely Low", format: "Protobuf over WebSockets/MQTT", status: "Highly Optimized", color: "text-emerald-400" },
                { id: "otel", name: text.proto_otel, desc: text.proto_otel_desc, overhead: "Low (Pushed)", format: "OTLP physical metric payloads", status: "Next-Gen OTel", color: "text-teal-400" },
                { id: "mqtt", name: text.proto_mqtt, desc: text.proto_mqtt_desc, overhead: "Medium-Low", format: "JSON over lightweight TCP", status: "Standard Pub/Sub", color: "text-sky-400" },
                { id: "gnmi", name: text.proto_gnmi, desc: text.proto_gnmi_desc, overhead: "Medium", format: "gRPC Stream Protocol", status: "High Frequency", color: "text-indigo-400" },
                { id: "tr069", name: text.proto_tr069, desc: text.proto_tr069_desc, overhead: "High (Sync Polling)", format: "SOAP XML over HTTP Post", status: "Legacy Bottleneck", color: "text-rose-400" }
              ].map(proto => (
                <button
                  key={proto.id}
                  onClick={() => {
                    setProtocolMode(proto.id as any);
                    const event = new CustomEvent("syslog-event", {
                      detail: {
                        message: `[PROTOCOL] Switched driver parsing protocol mode to: ${proto.id.toUpperCase()} (Payload format: ${proto.format}).`,
                        level: proto.id === "tr069" ? "warning" : "info"
                      }
                    });
                    window.dispatchEvent(event);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all cursor-pointer ${
                    protocolMode === proto.id
                      ? "border-sky-500 bg-sky-500/[0.02] ring-1 ring-sky-500/20"
                      : isLight
                      ? "border-slate-200 hover:border-slate-250 bg-slate-50/20"
                      : "border-slate-900 hover:border-slate-800 bg-slate-950/10"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1">
                      {protocolMode === proto.id ? (
                        <Check className="text-sky-400 animate-pulse" size={15} />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-500/40" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-black tracking-tight ${protocolMode === proto.id ? "text-sky-400" : isLight ? "text-slate-800" : "text-slate-200"}`}>
                        {proto.name}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal max-w-xl">
                        {proto.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto text-right">
                    <div className="flex flex-col text-[10px] font-mono">
                      <span className="text-slate-500">Overhead</span>
                      <span className={`font-black ${proto.color}`}>{proto.overhead}</span>
                    </div>
                    <div className="w-[1px] h-6 bg-slate-800" />
                    <div className="flex flex-col text-[10px] font-mono">
                      <span className="text-slate-500">Status</span>
                      <span className="text-slate-300 font-bold">{proto.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: REMOTE REMEDIATION AI ENGINE */}
        {activeTab === "remediation" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h4 className={`text-sm font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                {text.remedy_title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {text.remedy_desc}
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { 
                  id: "usp-rpc-selfheal", 
                  label: text.remedy_btn1, 
                  desc: text.remedy_btn1_desc, 
                  icon: Code, 
                  color: "from-sky-500 to-indigo-600",
                  textColor: "text-sky-400",
                  bgHover: "hover:border-sky-500/40"
                },
                { 
                  id: "gpon-laser-tune", 
                  label: text.remedy_btn2, 
                  desc: text.remedy_btn2_desc, 
                  icon: Radio, 
                  color: "from-emerald-500 to-teal-600",
                  textColor: "text-emerald-400",
                  bgHover: "hover:border-emerald-500/40"
                },
                { 
                  id: "bras-qos-throttle", 
                  label: text.remedy_btn3, 
                  desc: text.remedy_btn3_desc, 
                  icon: Server, 
                  color: "from-indigo-500 to-purple-600",
                  textColor: "text-indigo-400",
                  bgHover: "hover:border-indigo-500/40"
                },
                { 
                  id: "dynamic-profile-apply", 
                  label: text.remedy_btn4, 
                  desc: text.remedy_btn4_desc, 
                  icon: Cpu, 
                  color: "from-fuchsia-500 to-pink-600",
                  textColor: "text-fuchsia-400",
                  bgHover: "hover:border-fuchsia-500/40"
                }
              ].map(remedy => {
                const RemedyIcon = remedy.icon;
                const isThisDeploying = activeRemediation === remedy.id;
                
                return (
                  <div
                    key={remedy.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                      isThisDeploying 
                        ? "border-sky-500 bg-sky-500/[0.02]" 
                        : isLight 
                        ? `bg-slate-50 border-slate-200/80 ${remedy.bgHover}` 
                        : `bg-slate-950/20 border-slate-900 ${remedy.bgHover}`
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-black flex items-center gap-1.5 ${remedy.textColor}`}>
                        <RemedyIcon size={14} />
                        {remedy.label}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {remedy.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => triggerRemediation(remedy.id, remedy.label)}
                      disabled={activeRemediation !== null}
                      className={`w-full py-1.5 rounded-lg text-[10.5px] font-mono font-black tracking-widest uppercase transition-all shadow-md cursor-pointer ${
                        isThisDeploying
                          ? "bg-amber-500 text-slate-950 animate-pulse"
                          : activeRemediation !== null
                          ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-40"
                          : `bg-gradient-to-r ${remedy.color} text-white hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]`
                      }`}
                    >
                      {isThisDeploying 
                        ? (remediationFeedback === "deploying" ? "EXECUTING..." : "SUCCESS!") 
                        : "EXECUTE REMOTE REMEDIATION"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick success status feedback banner */}
            {remediationFeedback === "success" && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2.5 animate-bounce">
                <Check className="text-emerald-400 shrink-0" size={16} />
                <span className="text-[11px] font-bold text-emerald-400">
                  {language === "pt" 
                    ? "Remediação GNN Concluída! Loop de falhas físico isolado e mitigado com sucesso no CPE." 
                    : "GNN closed-loop remediation completed successfully! Physical loop faults isolated and resolved on the CPE."}
                </span>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
