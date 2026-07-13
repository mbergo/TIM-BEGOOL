import React from "react";
import { getLocalizedPipelineSteps } from "../data/pipelineData";
import { renderInteractiveText } from "./GlossaryTerm";
import { useApp, Language } from "../context/AppContext";
import { Shield, ShieldAlert, Cpu, Heart, CheckCircle, Flame, Target, Star, DollarSign, ArrowRight } from "lucide-react";
import ExecutivePdfEngine from "./ExecutivePdfEngine";

interface ActiveStepSidebarProps {
  activeStepId: string;
}

interface StepDetailConfig {
  group: string;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  roiHighlight: string;
  calculations: string[];
  impactMetrics: { label: string; value: string }[];
}

function getLocalizedSidebarConfigs(language: Language): Record<string, StepDetailConfig> {
  const isPt = language === "pt";
  const isIt = language === "it";

  return {
    "user-cpe": {
      group: isPt ? "HARDWARE DE BORDA DO CLIENTE" : isIt ? "HARDWARE DI BORDA DEL CLIENTE" : "CLIENT EDGE HARDWARE",
      sub: isPt ? "Captura de Borda e Sondas de Driver" : isIt ? "Acquisizione di Bordo e Sonde Driver" : "Edge Capture & Driver Probes",
      icon: ShieldAlert,
      iconColor: "text-sky-500",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      roiHighlight: isPt 
        ? "Economiza custos massivos para a TIM (queda de 35% no envio de técnicos) enquanto permite que a Beegol escale com eficiência."
        : isIt 
        ? "Consente enormi risparmi per TIM (calo del 35% delle uscite dei tecnici) consentendo a Beegol di scalare in modo efficiente."
        : "Saves massive costs for TIM (35% drop in truck dispatches) while allowing Beegol to scale efficiently.",
      calculations: isPt ? [
        "Extrai piso de ruído Wi-Fi, potência óptica recebida (Rx) e registradores FEC de kernels do roteador em intervalos de 1s.",
        "Compila o módulo de telemetria diretamente no firmware de gateway de código aberto RDK-B ou prplMesh.",
        "Armazena anomalias localmente em RAM para minimizar a largura de banda de upload na rede WAN durante picos."
      ] : isIt ? [
        "Estrae il rumore di fondo Wi-Fi, la potenza ottica Rx e i registri FEC dal kernel del router a intervalli di 1s.",
        "Compila il modulo di telemetria direttamente nel firmware del gateway open source RDK-B o prplMesh.",
        "Memorizza localmente le anomalie in RAM per ridurre al minimo la banda di caricamento WAN durante i picchi."
      ] : [
        "Extract Wi-Fi noise floor, Rx Optical Power, and FEC registers from router kernels at 1s intervals.",
        "Compile telemetry module directly into open-source RDK-B or prplMesh gateway firmware.",
        "Buffer anomalies locally in RAM, minimizing WAN upload bandwidth during high-stress periods."
      ],
      impactMetrics: [
        { label: isPt ? "Resolução Wi-Fi" : isIt ? "Risoluzione Wi-Fi" : "Wi-Fi Resolution", value: "1s Realtime" },
        { label: isPt ? "Técnicos Evitados" : isIt ? "Tecnici Evitati" : "Dispatch Saved", value: "1,450 / mo" }
      ]
    },
    "access-transport": {
      group: isPt ? "CAMADA DE ACESSO E GPON" : isIt ? "LIVELLO DI ACCESSO E GPON" : "ACCESS & GPON LAYER",
      sub: isPt ? "Agregação de Fibra GPON" : isIt ? "Aggregazione Fibra GPON" : "GPON Fiber Aggregation",
      icon: Cpu,
      iconColor: "text-slate-500",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
      roiHighlight: isPt
        ? "Reduz reclamações duplicadas de suporte ao agrupar imediatamente interrupções de fibra troncal."
        : isIt
        ? "Riduce i reclami di supporto duplicati identificando immediatamente le interruzioni della fibra dorsale."
        : "Reduces duplicate support claims by immediately grouping trunk fiber outages.",
      calculations: isPt ? [
        "Agrega frames brutos nos roteadores virtuais CCAP (vCCAP) e Terminais de Linha Óptica GPON (OLT).",
        "Injeta cabeçalhos geográficos nos nós locais para mapear os splitters espacialmente.",
        "Filtra o ruído individual dos dispositivos para identificar degradação física em troncos de fibra óptica."
      ] : isIt ? [
        "Aggrega frame grezzi su router vCCAP (virtual CCAP) e Terminali di Linea Ottica GPON (OLT).",
        "Inserisce intestazioni geografiche sui nodi locali per mappare spazialmente i ripartitori.",
        "Filtra il rumore dei singoli dispositivi per identificare il degrado fisico delle dorsali in fibra ottica."
      ] : [
        "Aggregate raw frames at virtual CCAP (vCCAP) routers and GPON Optical Line Terminals (OLT).",
        "Inject local node geographical headers to map spatial layout splitters.",
        "Filter out individual device noise to identify block-wide physical optical trunk degradation."
      ],
      impactMetrics: [
        { label: isPt ? "Taxa do Splitter" : isIt ? "Rapporto Splitter" : "Splitter Ratio", value: "1:64 Ports" },
        { label: isPt ? "Custos de Manut. Salvos" : isIt ? "Costi Maint. Salvati" : "Maint. Cost Saved", value: "15% OPEX" }
      ]
    },
    "control-broker": {
      group: isPt ? "PROTOCOLO E CONTROLADOR" : isIt ? "PROTOCOLLO E CONTROLLORE" : "PROTOCOL & CONTROLLER",
      sub: isPt ? "Broker Seguro USP TR-369" : isIt ? "Broker TR-369 USP Sicuro" : "TR-369 USP Secure Broker",
      icon: Shield,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
      roiHighlight: isPt
        ? "Corta os custos de tráfego de dados na nuvem em 84% ao eliminar consultas pesadas em XML TR-069."
        : isIt
        ? "Riduce i costi di traffico dati cloud dell'84% eliminando il pesante polling XML TR-069."
        : "Cuts cloud egress data bills by 84% by ditching heavy TR-069 XML polling.",
      calculations: isPt ? [
        "Serializa alterações de estado de telemetria do dispositivo em payloads Protobuf binários compactos.",
        "Mantém sockets leves persistentes sobre MQTT com sobrecarga mínima de heartbeat.",
        "Entrega eventos assíncronos de notificação USP, evitando filas de servidores baseadas em SOAP XML."
      ] : isIt ? [
        "Serializza i cambiamenti di stato della telemetria in payload Protobuf binari estremamente compatti.",
        "Mantiene socket persistenti e leggeri su MQTT con un sovraccarico di heartbeat minimo.",
        "Invia notifiche USP asincrone, evitando l'accumulo di code sui server SOAP XML."
      ] : [
        "Serialize device telemetry state changes into tiny, light binary Protobuf payloads.",
        "Maintain persistent lightweight sockets over MQTT with minimal heartbeat overhead.",
        "Deliver asynchronous USP Notify events, preventing SOAP XML polling server queues."
      ],
      impactMetrics: [
        { label: isPt ? "Compactação de Carga" : isIt ? "Compressione Payload" : "Payload Compression", value: "10x Smaller" },
        { label: isPt ? "Economia de Egress" : isIt ? "Risparmio Egress" : "Egress Cost Saved", value: "84% Saved" }
      ]
    },
    "kafka-cluster": {
      group: isPt ? "PLANO DE INGESTÃO DE EVENTOS" : isIt ? "PIANO DI INGESTIONE EVENTI" : "EVENT INGESTION PLANE",
      sub: isPt ? "Streamer de Partições de Alta Disponibilidade" : isIt ? "Streamer di Partizioni ad Alta Disponibilità" : "High-Availability Partition Streamer",
      icon: Flame,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      roiHighlight: isPt
        ? "Garante metas de SLA ao prevenir perdas de pacotes durante grandes tempestades de rede."
        : isIt
        ? "Garantisce gli obiettivi SLA prevenendo la perdita di pacchetti durante le grandi tempeste di rete."
        : "Secures SLA guarantees by preventing packet loss during major storm outages.",
      calculations: isPt ? [
        "Distribui milhões de fluxos recebidos entre 120 clusters de partição Kafka de forma equilibrada.",
        "Agrupa payloads de telemetria com codecs rápidos de compressão lz4 sem bloqueio.",
        "Sincroniza registros em 12 brokers distribuídos para manter tolerância a falhas estrita de 3 vias."
      ] : isIt ? [
        "Bilancia milioni di flussi in ingresso su 120 cluster di partizioni Kafka in modo uniforme.",
        "Raggruppa i payload di telemetria con codec veloci di compressione lz4 non bloccanti.",
        "Sincronizza i record su 12 broker distribuiti per mantenere una tolleranza ai guasti a 3 vie."
      ] : [
        "Load-balance millions of incoming streams across 120 Kafka partition clusters.",
        "Batch incoming telemetry payloads with fast, non-blocking lz4 compression codecs.",
        "Sync records across 12 distributed brokers to maintain strict 3-way fault tolerance."
      ],
      impactMetrics: [
        { label: isPt ? "Limite de Ingestão" : isIt ? "Limite Ingestione" : "Ingest Limit", value: "840k msgs/s" },
        { label: isPt ? "Disp. dos Dados" : isIt ? "Disponibilità Dati" : "Data Availability", value: "99.999%" }
      ]
    },
    "databricks-etl": {
      group: isPt ? "CAMADA DE REFINARIA DE DADOS" : isIt ? "LIVELLO DI RAFFINERIA DATI" : "DATA REFINERY LAYER",
      sub: isPt ? "Refinador Spark no Delta Lake" : isIt ? "Raffinatore Spark su Delta Lake" : "Delta Lake Spark Refiner",
      icon: Target,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      roiHighlight: isPt
        ? "Reduz contas de banco de dados e armazenamento de IA em 65% ao descartar estática de fundo inútil."
        : isIt
        ? "Riduce la bolletta di archiviazione dei database di IA del 65% scartando l'elettricità statica inutile."
        : "Reduces downstream AI database storage bills by 65% by discarding static background static.",
      calculations: isPt ? [
        "Executa lotes de streaming Spark de alta velocidade para limpar, normalizar e mesclar dados.",
        "Filtra 94% do ruído eletromagnético de fundo irrelevante instantaneamente.",
        "Armazena vetores limpos estruturados no formato Parquet colunar otimizado dentro do Delta Lake."
      ] : isIt ? [
        "Esegue streaming Spark ad alta velocità per pulire, normalizzare e fondere i dati di rete.",
        "Filtra istantaneamente il 94% del rumore elettromagnetico di fondo irrilevante.",
        "Memorizza vettori strutturati puliti in formato Parquet colunare ottimizzato all'interno di Delta Lake."
      ] : [
        "Execute high-speed Spark streaming batches to cleanse, normalize, and merge input streams.",
        "Filter out 94% of irrelevant background electromagnetic noise instantly.",
        "Store structured clean vectors in optimized columnar Parquet format inside Delta Lake."
      ],
      impactMetrics: [
        { label: isPt ? "Ruído Descartado" : isIt ? "Rumore Scartato" : "Noise Filtered Out", value: "94% Dropped" },
        { label: isPt ? "Espaço Salvo" : isIt ? "Spazio Salvato" : "Storage Saved", value: "65% Saved" }
      ]
    },
    "beegol-cloud": {
      group: isPt ? "REDE DE APRENDIZADO PROFUNDO" : isIt ? "RETE DI APPRENDIMENTO PROFONDO" : "DEEP LEARNING NETWORK",
      sub: isPt ? "Mecanismo RCA de Rede Neural Gráfica (GNN)" : isIt ? "Motore RCA a Rete Neurale Grafica (GNN)" : "Graph Neural Net RCA Engine",
      icon: Star,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      roiHighlight: isPt
        ? "Automatiza a resolução de problemas, evitando técnicos dispendiosos via ajustes de canal silenciosos."
        : isIt
        ? "Automatizza la risoluzione dei problemi, evitando costosi interventi tecnici grazie a cambi di canale silenziosi."
        : "Automates issue resolution, avoiding costly truck rolls via background channel heals.",
      calculations: isPt ? [
        "Alimenta matrizes de features limpas no modelo de Rede Neural Profunda da Beegol Cloud.",
        "Executa análise de Rede Neural Gráfica (GNN) para localizar falhas coaxiais físicas com precisão de ±2.4 metros.",
        "Aciona alterações automáticas de canal Wi-Fi ou gera ordens de serviço detalhadas para engenharia."
      ] : isIt ? [
        "Invia matrici di caratteristiche pulite nel modello di Rete Neurale Profonda di Beegol Cloud.",
        "Esegue l'analisi GNN (Graph Neural Network) per localizzare guasti coassiali fisici entro ±2.4 metri.",
        "Avvia modifiche automatiche del canale Wi-Fi o genera ordini di lavoro ingegneristici dettagliati."
      ] : [
        "Feed micro-cleansed feature matrices into Beegol Cloud's Deep Neural Network model.",
        "Run Graph Neural Network (GNN) analysis to locate physical coaxial faults to ±2.4 meters.",
        "Auto-trigger remote Wi-Fi channel shifts or generate rich engineering dispatch tickets."
      ],
      impactMetrics: [
        { label: isPt ? "Localização RCA" : isIt ? "Localizzazione RCA" : "RCA Localization", value: "±2.4 meters" },
        { label: isPt ? "Taxa de Auto-Heal" : isIt ? "Tasso Auto-Heal" : "Auto-Heal Rate", value: "1,840+ / hr" }
      ]
    }
  };
}

export default function ActiveStepSidebar({ activeStepId }: ActiveStepSidebarProps) {
  const { language, theme, t } = useApp();
  const steps = getLocalizedPipelineSteps(language);
  const step = steps.find(s => s.id === activeStepId) || steps[0];
  const sidebarConfigs = getLocalizedSidebarConfigs(language);
  const config = sidebarConfigs[activeStepId] || sidebarConfigs["user-cpe"];
  const HeaderIcon = config.icon;

  const isLight = theme === "light";

  return (
    <div className={`h-full border-l flex flex-col p-6 overflow-y-auto select-none gap-6 transition-colors duration-300 ${
      isLight ? "bg-white border-slate-200 text-slate-800" : "bg-slate-950/80 border-slate-900 text-slate-100"
    }`}>
      
      {/* Category / Icon Top Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${config.bgColor} ${config.borderColor}`}>
            <HeaderIcon size={18} className={config.iconColor} />
          </div>
          <span className={`text-[11px] font-mono font-black tracking-widest uppercase ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {config.group}
          </span>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title={t("active_telemetry_stream")} />
      </div>

      {/* Main Step Title & Subtitle */}
      <div>
        <h2 className={`text-2xl font-black tracking-tight leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
          {step.name}
        </h2>
        <span className={`text-xs font-mono mt-1.5 block ${isLight ? "text-slate-500 font-semibold" : "text-slate-400"}`}>
          {config.sub}
        </span>
      </div>

      {/* ROI Focus Highlighting Banner */}
      <div className={`rounded-xl border p-4.5 shadow-lg flex gap-3 ${config.borderColor} ${config.bgColor}`}>
        <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center border ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
        }`}>
          <Target size={13} className="text-amber-500" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider font-black">
            {t("roi_partnership_highlight")}
          </span>
          <p className={`text-[13px] leading-relaxed font-sans font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            {renderInteractiveText(config.roiHighlight)}
          </p>
        </div>
      </div>

      {/* BUSINESS VALUE OUTCOMES */}
      <div className="flex flex-col gap-3.5">
        <div className={`flex items-center gap-1.5 uppercase tracking-widest text-[11px] font-black font-mono ${isLight ? "text-slate-700" : "text-slate-300"}`}>
          <DollarSign size={14} className="text-emerald-500" />
          <span>{t("business_value_details")}</span>
        </div>
        <div className="flex flex-col gap-3">
          {step.ceoLogs.map((bullet, index) => {
            let label = t("outcome_label");
            let colorTheme = "bg-sky-500/10 text-sky-500 border-sky-500/20";
            
            if (bullet.includes("SAVINGS:") || bullet.includes("ECONOMIA:") || bullet.includes("RISPARMIO:")) {
              label = t("savings_roi_label");
              colorTheme = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            } else if (bullet.includes("WHAT IT DOES:") || bullet.includes("O QUE FAZ:") || bullet.includes("COSA FA:")) {
              label = t("operation_label");
              colorTheme = "bg-purple-500/10 text-purple-600 border-purple-500/20";
            } else if (bullet.includes("OUTCOME:") || bullet.includes("RESULTADO:") || bullet.includes("RISULTATO:")) {
              label = t("outcome_label");
              colorTheme = "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
            }

            const cleanText = bullet.replace(/^(💰 SAVINGS:|💰 ECONOMIA:|💰 RISPARMIO:|🚀 WHAT IT DOES:|🚀 O QUE FAZ:|🚀 COSA FA:|🎯 BUSINESS OUTCOME:|🎯 RESULTADO COMERCIAL:|🎯 RISULTATO COMMERCIALE:)\s*/, "");

            return (
              <div key={index} className={`border rounded-xl p-3.5 flex flex-col gap-2 transition-colors ${
                isLight ? "bg-slate-50 border-slate-200 hover:border-slate-300" : "bg-slate-950 border-slate-900 hover:border-slate-800"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${colorTheme}`}>
                    {label}
                  </span>
                  <span className={`text-[9px] font-mono font-semibold ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    {t("direct_impact")}
                  </span>
                </div>
                <p className={`text-[13px] leading-relaxed font-sans font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  {renderInteractiveText(cleanText)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ENGINEERING PIPELINE PROCESS */}
      <div className="flex flex-col gap-3.5">
        <span className={`uppercase tracking-widest text-[11px] font-black font-mono block ${isLight ? "text-slate-700" : "text-slate-300"}`}>
          {t("eng_pipeline_calcs")}
        </span>
        <div className="flex flex-col gap-2.5">
          {config.calculations.map((calc, idx) => (
            <div key={idx} className={`flex gap-3.5 items-start p-3 rounded-xl border ${
              isLight ? "bg-slate-50/50 border-slate-200" : "bg-slate-950/40 border-slate-900"
            }`}>
              <span className={`w-6 h-6 rounded text-[11px] font-mono font-black flex items-center justify-center shrink-0 border ${
                isLight ? "bg-white border-slate-200 text-slate-600" : "bg-slate-900 border-slate-800 text-slate-300"
              }`}>
                0{idx + 1}
              </span>
              <p className={`text-[12px] leading-relaxed font-sans font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                {renderInteractiveText(calc)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`h-[1.5px] my-1 shrink-0 ${isLight ? "bg-slate-200" : "bg-slate-900"}`} />

      {/* PROJECTED METRICS AT THE BOTTOM */}
      <div className="mt-auto flex flex-col gap-3 shrink-0">
        <span className={`uppercase tracking-widest text-[10px] font-mono font-black ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {t("step_perf_metrics")}
        </span>
        <div className="grid grid-cols-2 gap-3.5">
          {config.impactMetrics.map((met, idx) => (
            <div key={idx} className={`border rounded-xl p-3 text-center ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-900"
            }`}>
              <span className={`text-[10px] font-mono block uppercase tracking-wider mb-1 font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {met.label}
              </span>
              <span className="text-[14px] font-mono font-black text-emerald-500 block">
                {met.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* EXECUTIVE PDF GENERATION CARD */}
      <ExecutivePdfEngine />

    </div>
  );
}
