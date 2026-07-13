import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { useApp } from "../context/AppContext";
import { getLocalizedPipelineSteps } from "../data/pipelineData";
import { Download, FileText, CheckCircle2, Globe, File, Sparkles } from "lucide-react";

interface StepConfig {
  group: string;
  sub: string;
  roiHighlight: string;
  calculations: string[];
  impactMetrics: { label: string; value: string }[];
}

export default function ExecutivePdfEngine() {
  const { language, theme, t } = useApp();
  const [reportLang, setReportLang] = useState<"en" | "pt" | "it">(language);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [reportType, setReportType] = useState<"executive" | "technical">("executive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = getLocalizedPipelineSteps(reportLang);
  const isLight = theme === "light";

  // Translate step-specific configurations
  const getSidebarConfigs = (lang: "en" | "pt" | "it"): Record<string, StepConfig> => {
    const isPt = lang === "pt";
    const isIt = lang === "it";

    return {
      "user-cpe": {
        group: isPt ? "HARDWARE DE BORDA DO CLIENTE" : isIt ? "HARDWARE DI BORDA DEL CLIENTE" : "CLIENT EDGE HARDWARE",
        sub: isPt ? "Captura de Borda e Sondas de Driver" : isIt ? "Acquisizione di Bordo e Sonde Driver" : "Edge Capture & Driver Probes",
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
          "Sincronizza i record su 12 broker distribuiti per mantenere una tolleranza ai guasti a 3 via."
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
  };

  const pdfDict = {
    en: {
      title: "Beegol AuraOps Executive Report",
      subtitle: "High-Fidelity Telemetry, Real-time Hot-Path RCA & Business Inferences",
      techTitle: "Beegol AuraOps Technical Engineering Factsheet",
      techSubtitle: "Low-Level Metrics, Architecture Specs, and Mathematical Calculations",
      metaDate: "Generated Date: July 13, 2026",
      metaMarket: "Target Market: Europe - Telecom Italia (TIM) GPON Core",
      metaVersion: "Platform Version: v5.4-AURA (Production)",
      execTitle: "1. EXECUTIVE SUMMARY & ROI REPORT",
      execBody1: "This document compiles the business insights, economic savings, and core engineering operations of the Beegol AuraOps telemetry and RCA (Root Cause Analysis) pipeline deployed on TIM's GPON and subscriber CPE networks.",
      execBody2: "With a target ROI of 480% by Year 3, this platform solves Wi-Fi issues and physical line degradations proactively, drastically cutting support overhead and operational friction.",
      techExecTitle: "1. SYSTEM ARCHITECTURE & LOW-LEVEL PIPELINE SPECIFICATION",
      techExecBody1: "This document compiles the low-level technical specifications, physical calculations, and system logs of the Beegol AuraOps telemetry and Root Cause Analysis (RCA) pipeline. It details the ingestion of 1.5 million messages per second, which are pre-filtered at the edge to reduce central resource congestion.",
      techExecBody2: "Using advanced Graph Neural Networks (GNN) and real-time Kafka partition groups, the pipeline isolates physical coax/optical degradation within sub-seconds, securing TIM's GPON network reliability.",
      hotPathTitle: "STREAMING INGESTION ARCHITECTURE (DUAL-PATH):",
      hotPathBody: "• Hot Path (Sub-second RCA): Beegol Cloud direct-consumes telemetry streams from high-frequency Kafka partition topics for instant, sub-second neural diagnosis and self-healing. This completely bypasses traditional batch latencies.\n• Cold/Warm Path (Delta Lake): Databricks runs in parallel, ingesting streams into structured Delta tables for historical reporting, SLA auditing, and continuous GNN model training.",
      metricsTitle: "OVERALL ROI & PIPELINE IMPACT",
      techMetricsTitle: "OVERALL PIPELINE PERFORMANCE INDICATORS",
      savings: "Savings",
      operation: "Operation",
      outcome: "Outcome",
      roiHighlight: "ROI Highlight",
      keyMetrics: "Performance Metrics",
      engineeringCalcs: "Engineering Process",
      footer: "Beegol AI Research Group  |  Confidential  |  Authorized Executive Briefing",
      techFooter: "Beegol Engineering Team  |  Confidential  |  Authorized System Factsheet"
    },
    pt: {
      title: "Relatório Executivo Beegol AuraOps",
      subtitle: "Telemetria de Alta Fidelidade, RCA em Tempo Real (Hot-Path) & Inferências de Negócio",
      techTitle: "Ficha Técnica de Engenharia Beegol AuraOps",
      techSubtitle: "Métricas de Baixo Nível, Especificações de Arquitetura e Cálculos Matemáticos",
      metaDate: "Data de Geração: 13 de Julho de 2026",
      metaMarket: "Mercado Alvo: Europa - Telecom Italia (TIM) Core GPON",
      metaVersion: "Versão da Plataforma: v5.4-AURA (Produção)",
      execTitle: "1. SUMÁRIO EXECUTIVO E RELATÓRIO DE ROI",
      execBody1: "Este documento compila os insights de negócios, economias financeiras e operações de engenharia do pipeline de telemetria e RCA (Análise de Causa Raiz) Beegol AuraOps implantado nas redes GPON e CPE residencial da TIM.",
      execBody2: "Com um ROI projetado de 480% no Ano 3, esta plataforma resolve falhas de Wi-Fi e degradações físicas de linha de forma proativa, reduzindo drasticamente custos de chamados de suporte e atrito operacional.",
      techExecTitle: "1. ARQUITETURA DO SISTEMA E ESPECIFICAÇÃO DO PIPELINE",
      techExecBody1: "Este documento de engenharia compila as especificações técnicas de baixo nível, cálculos físicos e logs de sistema do pipeline de telemetria e Análise de Causa Raiz (RCA) Beegol AuraOps. Detalha a ingestão de 1,5 milhão de mensagens por segundo, pré-filtradas na borda para mitigar o congestionamento central.",
      techExecBody2: "Usando Redes Neurais Gráficas (GNN) avançadas e grupos de partições Kafka em tempo real, o pipeline isola degradações coaxiais/ópticas físicas em sub-segundos, garantindo a resiliência de rede da TIM.",
      hotPathTitle: "ARQUITETURA DE INGESTÃO CONTÍNUA (DUAL-PATH):",
      hotPathBody: "• Caminho Quente (RCA Sub-segundo): A nuvem Beegol consome streams de telemetria diretamente dos tópicos de partição de alta velocidade do Kafka para diagnóstico neural imediato e autocorreções, ignorando latências tradicionais de lote.\n• Caminho Frio/Morno (Delta Lake): O Databricks atua em paralelo, inserindo os fluxos no Delta Lake para relatórios de longo prazo, auditorias de SLA e treinamento contínuo de modelos GNN.",
      metricsTitle: "MÉTRICAS GERAIS DE ROI E IMPACTO NO PIPELINE",
      techMetricsTitle: "INDICADORES DE PERFORMANCE DO PIPELINE",
      savings: "Economia",
      operation: "Operação",
      outcome: "Resultado",
      roiHighlight: "Destaque de ROI",
      keyMetrics: "Métricas de Performance",
      engineeringCalcs: "Processo de Engenharia",
      footer: "Grupo de Pesquisa Beegol AI  |  Confidencial  |  Briefing Executivo Autorizado",
      techFooter: "Time de Engenharia Beegol  |  Confidencial  |  Ficha Técnica de Sistema Autorizada"
    },
    it: {
      title: "Rapporto Esecutivo Beegol AuraOps",
      subtitle: "Telemetria Alta Fedeltà, RCA Real-time Hot-Path & Inferenze di Business",
      techTitle: "Scheda Tecnica Ingegneristica Beegol AuraOps",
      techSubtitle: "Metriche di Basso Livello, Specifiche di Architettura e Calcoli Matematici",
      metaDate: "Data di Generazione: 13 Luglio 2026",
      metaMarket: "Mercato Target: Europa - Telecom Italia (TIM) GPON Core",
      metaVersion: "Versione Piattaforma: v5.4-AURA (Produzione)",
      execTitle: "1. SOMMARIO ESECUTIVO E RAPPORTO ROI",
      execBody1: "Questo documento raccoglie le analisi aziendali, i risparmi economici e le operazioni ingegneristiche della pipeline di telemetria e RCA Beegol AuraOps distribuita sulle reti GPON e CPE residenziali di TIM.",
      execBody2: "Con un target ROI del 480% entro l'Anno 3, questa piattaforma risolve proattivamente i problemi Wi-Fi e le degradazioni della linea fisica, riducendo drasticamente i costi di supporto.",
      techExecTitle: "1. ARCHITETTURA DEL SISTEMA E SPECIFICHE DELLA PIPELINE",
      techExecBody1: "Questo documento ingegneristico raccoglie le specifiche tecniche di basso livello, i calcoli fisici e i log di sistema della pipeline di telemetria e Root Cause Analysis (RCA) Beegol AuraOps. Delinea l'ingestione di 1.5 milioni di messaggi al secondo, pre-filtrati all'edge per ottimizzare le risorse centrali.",
      techExecBody2: "Utilizzando reti neurali grafiche (GNN) avanzate e partizioni Kafka in tempo reale, la pipeline isola il degrado coassiale/ottico in frazioni di secondo, garantendo l'affidabilità di TIM.",
      hotPathTitle: "ARCHITETTURA DI INGESTIONE CONTINUA (DUAL-PATH):",
      hotPathBody: "• Hot Path (RCA in sub-secondi): La nuvola Beegol consuma direttamente flussi di telemetria dai topic di partizione Kafka ad alta velocità per diagnosi neurali e auto-correzioni istantanee, bypassando la l'attesa batch.\n• Cold/Warm Path (Delta Lake): Databricks opera in parallelo, scrivendo i flussi in tabelle Delta strutturate per report storici, audit SLA e addestramento continuo del modello GNN.",
      metricsTitle: "METRICHE GENERALI DI ROI E IMPATTO",
      techMetricsTitle: "INDICATORI DI PRESTAZIONE DELLA PIPELINE",
      savings: "Risparmio",
      operation: "Operazione",
      outcome: "Risultato",
      roiHighlight: "Evidenza ROI",
      keyMetrics: "Metriche di Performance",
      engineeringCalcs: "Processo Ingegneria",
      footer: "Gruppo di Ricerca Beegol AI  |  Riservato  |  Briefing Esecutivo Autorizzato",
      techFooter: "Team Ingegneria Beegol  |  Riservato  |  Scheda Tecnica di Sistema Autorizzata"
    }
  };

  const generatePDFDirect = (
    type: "executive" | "technical",
    lang: "en" | "pt" | "it",
    domain: string
  ) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const dict = pdfDict[lang];
    const isAll = domain === "all";
    const totalPages = isAll ? 3 : 1;
    const sConfigs = getSidebarConfigs(lang);
    const localizedSteps = getLocalizedPipelineSteps(lang);

    // Decorate each page with premium margins and header/footers
    const drawPageDecorations = (pageNum: number) => {
      // Deep Slate Header Bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 18, "F");
      
      // Indigo accent line
      doc.setFillColor(79, 70, 229); // indigo-600
      doc.rect(0, 18, 210, 1.2, "F");

      // Header Brand text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      const headerText = type === "technical"
        ? "BEEGOL AURAOPS  //  TECHNICAL SYSTEM FACTSHEET"
        : "BEEGOL AURAOPS  //  EXECUTIVE BUSINESS BRIEFING";
      doc.text(headerText, 12, 11);

      // Metadata right aligned
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(199, 210, 254); // indigo-200
      doc.text(`v5.4-AURA  |  ${dict.metaDate.toUpperCase()}`, 130, 11);

      // Bottom Footer Bar
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(0, 280, 210, 17, "F");
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(0, 280, 210, 280);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      const footerText = type === "technical" ? dict.techFooter : dict.footer;
      doc.text(footerText, 12, 290);
      doc.text(`${pageNum} / ${totalPages}`, 192, 290);
    };

    if (isAll) {
      // ==========================================
      // PAGE 1: TITLE & PIPELINE SUMMARY OVERVIEW
      // ==========================================
      drawPageDecorations(1);

      // Main Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      const mainTitle = type === "technical" ? dict.techTitle : dict.title;
      doc.text(mainTitle.toUpperCase(), 12, 34);

      // Subtitle
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // indigo-600
      const subTitle = type === "technical" ? dict.techSubtitle : dict.subtitle;
      doc.text(subTitle, 12, 41);

      // Meta Info Card Block
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.rect(12, 47, 186, 24, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(dict.metaDate, 16, 53);
      doc.text(dict.metaMarket, 16, 59);
      doc.text(dict.metaVersion, 16, 65);

      // Executive Summary section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      const section1Title = type === "technical" ? dict.techExecTitle : dict.execTitle;
      doc.text(section1Title, 12, 81);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      const body1 = type === "technical" ? dict.techExecBody1 : dict.execBody1;
      const body2 = type === "technical" ? dict.techExecBody2 : dict.execBody2;
      doc.text(body1, 12, 88, { maxWidth: 186 });
      doc.text(body2, 12, 99, { maxWidth: 186 });

      // Parallel Architecture Callout Box (Dual Path)
      doc.setFillColor(240, 253, 250); // emerald-50
      doc.setDrawColor(167, 243, 208); // emerald-200
      doc.rect(12, 115, 186, 36, "FD");

      doc.setFillColor(16, 185, 129); // emerald-500 Left vertical bar
      doc.rect(12, 115, 1.8, 36, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text(dict.hotPathTitle, 18, 121);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(dict.hotPathBody, 18, 128, { maxWidth: 176 });

      // KPI Matrix Cards
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      const metricsHeader = type === "technical" ? dict.techMetricsTitle : dict.metricsTitle;
      doc.text(metricsHeader.toUpperCase(), 12, 164);

      // Draw Grid of 4 KPIs
      const drawKpiCard = (x: number, y: number, kpiTitle: string, value: string, desc: string) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.rect(x, y, 88, 22, "FD");

        // Mini accent left line
        doc.setFillColor(99, 102, 241); // indigo-500
        doc.rect(x, y, 1.5, 22, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(kpiTitle.toUpperCase(), x + 6, y + 6);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(16, 185, 129); // emerald-500
        doc.text(value, x + 6, y + 13);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(desc, x + 6, y + 18);
      };

      const kpiLabels = lang === "pt" ? {
        t1: "Resolução Wi-Fi Borda", v1: "1 Segundo", d1: "Captura direta proativa sem polling lento",
        t2: "Visitas Técnicas Salvas", v2: "1.450 / Mês TIM", d2: "Economia líquida de €101.500/mês",
        t3: "Redução Tráfego WAN", v3: "84% Menos Egress", d3: "USP TR-369 via MQTT binário compacto",
        t4: "Filtro de Ruído ETL", v4: "94% Descartado", d4: "Databricks Delta Lake em paralelo"
      } : lang === "it" ? {
        t1: "Risoluzione Wi-Fi Bordo", v1: "1 Secondo", d1: "Acquisizione diretta proattiva",
        t2: "Uscite Tecnici Evitate", v2: "1.450 / Mese", d2: "Risparmio di €101.500/mese per TIM",
        t3: "Riduzione Traffico Cloud", v3: "84% di Egress", d3: "Protocollo USP TR-369 MQTT binario",
        t4: "Filtro Rumore ETL", v4: "94% Rimosso", d4: "Databricks Delta Lake in parallelo"
      } : {
        t1: "Edge Wi-Fi Resolution", v1: "1 Second", d1: "Direct proactive capture bypassing slow polling",
        t2: "Truck Rolls Avoided", v2: "1,450 / Month", d2: "Líquid savings of €101,500/mo for TIM",
        t3: "WAN Data Reduction", v3: "84% Egress Saved", d3: "USP TR-369 over compact binary MQTT",
        t4: "ETL Noise Filter", v4: "94% Dropped", d4: "Parallel Databricks Delta Lake pipeline"
      };

      const techKpiLabels = lang === "pt" ? {
        t1: "Taxa Bruta de Eventos", v1: "1.5M msgs/s", d1: "Total de dados capturados antes do filtro",
        t2: "Pré-filtro Apache MiNiFi", v2: "90% Descartado na Borda", d2: "Minimiza tráfego WAN desnecessário",
        t3: "Latência Média de Loop", v3: "1.2 ms de Borda", d3: "Transmissão rápida de anomalias críticas",
        t4: "Acurácia RCA da GNN", v4: "98.42% Acc", d4: "Classificação imediata em sub-segundos"
      } : lang === "it" ? {
        t1: "Velocità Grezza Eventi", v1: "1.5M msgs/s", d1: "Eventi catturati prima della filtrazione",
        t2: "Pre-filtro Apache MiNiFi", v2: "90% Rimosso all'Edge", d2: "Riduce al minimo il traffico WAN inutile",
        t3: "Latenza Media del Loop", v3: "1.2 ms di Bordo", d3: "Trasmissione rapida di anomalie critiche",
        t4: "Accuratezza GNN RCA", v4: "98.42% Acc", d4: "Classificazione automatica immediata"
      } : {
        t1: "Raw Event Flow Rate", v1: "1.5M msgs/s", d1: "Total captured events before ingestion",
        t2: "Apache MiNiFi Pre-Filter", v2: "90% Static Dropped", d2: "Minimizes unnecessary central WAN transit",
        t3: "Average Loop Latency", v3: "1.2 ms Edge Latency", d3: "Fast delivery of critical core anomalies",
        t4: "GNN RCA Accuracy", v4: "98.42% Acc", d4: "Sub-second physical fault isolation"
      };

      const selectedKpis = type === "technical" ? techKpiLabels : kpiLabels;

      drawKpiCard(12, 172, selectedKpis.t1, selectedKpis.v1, selectedKpis.d1);
      drawKpiCard(110, 172, selectedKpis.t2, selectedKpis.v2, selectedKpis.d2);
      drawKpiCard(12, 199, selectedKpis.t3, selectedKpis.v3, selectedKpis.d3);
      drawKpiCard(110, 199, selectedKpis.t4, selectedKpis.v4, selectedKpis.d4);

      // GNN model block at the bottom of Page 1
      doc.setFillColor(245, 243, 255); // purple-50
      doc.setDrawColor(217, 70, 239); // purple-200
      doc.rect(12, 230, 186, 33, "FD");
      doc.setFillColor(124, 58, 237); // purple-600 left bar
      doc.rect(12, 230, 1.5, 33, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(107, 33, 168);
      const brainLabel = type === "technical"
        ? (lang === "pt" ? "ESPECIFICAÇÕES DE REDE NEURAL GRÁFICA (GNN):" : lang === "it" ? "SPECIFICHE RETE NEURALE GRAFICA (GNN):" : "GRAPH NEURAL NETWORK RCA SPECIFICATIONS:")
        : (lang === "pt" ? "MECANISMO DE CAUSA RAIZ NEURAL (GNN):" : lang === "it" ? "MOTORE RCA NEURALE (GNN):" : "GRAPH NEURAL NETWORK RCA CORE:");
      doc.text(brainLabel, 18, 236);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(110, 48, 171);
      const brainDesc = type === "technical"
        ? (lang === "pt"
          ? "Executa Redes Neurais Gráficas espacialmente mapeadas sobre splitters ópticos e cabos coaxiais físicos. Taxa de aprendizado alpha=0.001, isolando atenuações físicas de linha com precisão de ±2.4 metros."
          : lang === "it"
          ? "Esegue reti neurali grafiche spazialmente mappate su ripartitori ottici e cavi coassiali fisici. Tasso di apprendimento alpha=0.001, isolando l'attenuazione entro ±2.4 metri."
          : "Executes spatially-mapped Graph Neural Networks on fiber splitters and physical coax trunks. Training learning rate alpha=0.001 with custom loss functions, isolating line attenuations within ±2.4 meters.")
        : (lang === "pt" 
          ? "Identifica automaticamente falhas elétricas coaxiais com precisão de ±2.4 metros e dispara comandos automáticos de autocorreção em canais de rádio Wi-Fi domésticos."
          : lang === "it"
          ? "Identifica automaticamente i guasti fisici coassiali entro ±2.4 metri e avvia la guarigione automatica dello spettro Wi-Fi."
          : "Automatically pinpoints physical coaxial and fiber infrastructure damage to ±2.4 meters and triggers automated background healing on subscribers' Wi-Fi channels.");
      doc.text(brainDesc, 18, 242, { maxWidth: 176 });

      // ==========================================
      // PAGE 2: STEPS 1 - 3 DETAILS
      // ==========================================
      doc.addPage();
      drawPageDecorations(2);

      const renderStepSection = (stepIdx: number, y: number) => {
        const step = localizedSteps[stepIdx];
        const cfg = sConfigs[step.id];

        // Step Name & Subtitle
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${step.name}`, 12, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(79, 70, 229); // indigo-600
        doc.text(`${cfg.group}  //  ${cfg.sub.toUpperCase()}`, 12, y + 4.5);

        // Divider
        doc.setDrawColor(241, 245, 249);
        doc.line(12, y + 6.5, 198, y + 6.5);

        // Left Column: Business Inferences / Outcomes OR Technical logs
        let bulletY = y + 11.5;
        const logsToRender = type === "technical" ? step.technicalLogs : step.ceoLogs;
        
        logsToRender.forEach((bullet) => {
          let label = type === "technical" ? "LOG" : dict.outcome;
          let dotColor = [99, 102, 241]; // indigo-500
          
          if (type === "technical") {
            const hasInit = bullet.startsWith("INIT:") || bullet.startsWith("BEEGOL_AI:") || bullet.startsWith("PRODUCER:") || bullet.startsWith("SPARK:") || bullet.startsWith("SUBSCRIBE:") || bullet.startsWith("CONNECT:");
            const hasWarn = bullet.includes("WARN:") || bullet.includes("DEBUG:");
            const hasSuccess = bullet.includes("SUCCESS:") || bullet.includes("INFO:");
            
            if (hasInit) {
              label = bullet.split(":")[0];
              dotColor = [168, 85, 247]; // purple
            } else if (hasWarn) {
              label = bullet.split(":")[0];
              dotColor = [245, 158, 11]; // amber
            } else if (hasSuccess) {
              label = bullet.split(":")[0];
              dotColor = [6, 182, 212]; // cyan
            } else {
              label = "SYS";
              dotColor = [100, 116, 139]; // slate
            }
          } else {
            if (bullet.includes("SAVINGS:") || bullet.includes("ECONOMIA:") || bullet.includes("RISPARMIO:")) {
              label = dict.savings;
              dotColor = [16, 185, 129]; // emerald-500
            } else if (bullet.includes("WHAT IT DOES:") || bullet.includes("O QUE FAZ:") || bullet.includes("COSA FA:")) {
              label = dict.operation;
              dotColor = [168, 85, 247]; // purple-500
            }
          }

          const cleanText = type === "technical"
            ? bullet.replace(/^(INIT:|BEEGOL_AI:|PRODUCER:|SPARK:|SUBSCRIBE:|CONNECT:|DEBUG:|WARN:|INFO:|SUCCESS:|TRACE:)\s*/, "")
            : bullet.replace(/^(💰 SAVINGS:|💰 ECONOMIA:|💰 RISPARMIO:|🚀 WHAT IT DOES:|🚀 O QUE FAZ:|🚀 COSA FA:|🎯 BUSINESS OUTCOME:|🎯 RESULTADO COMERCIAL:|🎯 RISULTATO COMMERCIALE:)\s*/, "");

          // Mini bullet indicator
          doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
          doc.circle(15, bulletY - 1, 0.8, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(dotColor[0], dotColor[1], dotColor[2]);
          doc.text(`${label}:`, 18, bulletY);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(71, 85, 105);
          doc.text(cleanText, 38, bulletY, { maxWidth: 102 });

          // Calculate height of text block to advance Y
          const splitLines = doc.splitTextToSize(cleanText, 102);
          const linesCount = splitLines.length;
          bulletY += Math.max(linesCount * 3.4, 5.5);
        });

        // Right Column: Fact box (Metrics & ROI Banner)
        const boxX = 146;
        const boxY = y + 9;
        const boxW = 52;
        const boxH = 58;

        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(226, 232, 240);
        doc.rect(boxX, boxY, boxW, boxH, "FD");

        // Box Accent Header
        doc.setFillColor(241, 245, 249);
        doc.rect(boxX, boxY, boxW, 5.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(dict.roiHighlight.toUpperCase(), boxX + 3.5, boxY + 3.5);

        // Highlight Body text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.3);
        doc.setTextColor(51, 65, 85);
        doc.text(cfg.roiHighlight, boxX + 3.5, boxY + 9, { maxWidth: boxW - 7 });

        // Highlight Metrics block inside Box
        doc.setDrawColor(241, 245, 249);
        doc.line(boxX, boxY + 28, boxX + boxW, boxY + 28);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(dict.keyMetrics.toUpperCase(), boxX + 3.5, boxY + 32);

        // Render two metrics
        let metY = boxY + 37;
        cfg.impactMetrics.forEach((m) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(71, 85, 105);
          doc.text(m.label, boxX + 3.5, metY);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(16, 185, 129); // emerald-500
          doc.text(m.value, boxX + 3.5, metY + 3.5);
          metY += 8.5;
        });
      };

      renderStepSection(0, 26);
      renderStepSection(1, 110);
      renderStepSection(2, 194);

      // ==========================================
      // PAGE 3: STEPS 4 - 6 DETAILS
      // ==========================================
      doc.addPage();
      drawPageDecorations(3);

      renderStepSection(3, 26);
      renderStepSection(4, 110);
      renderStepSection(5, 194);

    } else {
      // ==========================================
      // 1-PAGE SPECIFIC DOMAIN FACTSHEET
      // ==========================================
      drawPageDecorations(1);
      const stepIdx = localizedSteps.findIndex((s) => s.id === domain);
      const step = localizedSteps[stepIdx === -1 ? 0 : stepIdx];
      const cfg = sConfigs[step.id];

      // Sheet Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text(type === "technical" ? "AURAOPS PIPELINE FACTSHEET  //  TECHNICAL DOMAIN BRIEF" : "AURAOPS PIPELINE FACTSHEET  //  DOMAIN BRIEF", 12, 33);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(step.name, 12, 40);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(step.description, 12, 46, { maxWidth: 186 });

      doc.setDrawColor(226, 232, 240);
      doc.line(12, 53, 198, 53);

      // Section 1: Business Inferences / Technical Logs
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(type === "technical" ? "LOW-LEVEL TELEMETRY LOGS & EVENTS" : "BUSINESS VALUE INFERENCES", 12, 61);

      let bulletY = 68;
      const logsToRender = type === "technical" ? step.technicalLogs : step.ceoLogs;
      logsToRender.forEach((bullet) => {
        let label = type === "technical" ? "LOG" : dict.outcome;
        let dotColor = [99, 102, 241]; // indigo-500
        
        if (type === "technical") {
          const hasInit = bullet.startsWith("INIT:") || bullet.startsWith("BEEGOL_AI:") || bullet.startsWith("PRODUCER:") || bullet.startsWith("SPARK:") || bullet.startsWith("SUBSCRIBE:") || bullet.startsWith("CONNECT:");
          const hasWarn = bullet.includes("WARN:") || bullet.includes("DEBUG:");
          const hasSuccess = bullet.includes("SUCCESS:") || bullet.includes("INFO:");
          
          if (hasInit) {
            label = bullet.split(":")[0];
            dotColor = [168, 85, 247]; // purple
          } else if (hasWarn) {
            label = bullet.split(":")[0];
            dotColor = [245, 158, 11]; // amber
          } else if (hasSuccess) {
            label = bullet.split(":")[0];
            dotColor = [6, 182, 212]; // cyan
          } else {
            label = "SYS";
            dotColor = [100, 116, 139]; // slate
          }
        } else {
          if (bullet.includes("SAVINGS:") || bullet.includes("ECONOMIA:") || bullet.includes("RISPARMIO:")) {
            label = dict.savings;
            dotColor = [16, 185, 129]; // emerald-500
          } else if (bullet.includes("WHAT IT DOES:") || bullet.includes("O QUE FAZ:") || bullet.includes("COSA FA:")) {
            label = dict.operation;
            dotColor = [168, 85, 247]; // purple-500
          }
        }

        const cleanText = type === "technical"
          ? bullet.replace(/^(INIT:|BEEGOL_AI:|PRODUCER:|SPARK:|SUBSCRIBE:|CONNECT:|DEBUG:|WARN:|INFO:|SUCCESS:|TRACE:)\s*/, "")
          : bullet.replace(/^(💰 SAVINGS:|💰 ECONOMIA:|💰 RISPARMIO:|🚀 WHAT IT DOES:|🚀 O QUE FAZ:|🚀 COSA FA:|🎯 BUSINESS OUTCOME:|🎯 RESULTADO COMERCIAL:|🎯 RISULTATO COMMERCIALE:)\s*/, "");

        doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
        doc.circle(15, bulletY - 1, 0.8, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(dotColor[0], dotColor[1], dotColor[2]);
        doc.text(`${label}:`, 18, bulletY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(cleanText, 42, bulletY, { maxWidth: 90 });

        const splitLines = doc.splitTextToSize(cleanText, 90);
        bulletY += Math.max(splitLines.length * 3.8, 8.0);
      });

      // Side Box: Metrics and ROI Highlight Banner
      const boxX = 140;
      const boxY = 57;
      const boxW = 58;
      const boxH = 75;

      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(226, 232, 240);
      doc.rect(boxX, boxY, boxW, boxH, "FD");

      doc.setFillColor(241, 245, 249);
      doc.rect(boxX, boxY, boxW, 6.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(dict.roiHighlight.toUpperCase(), boxX + 4.5, boxY + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(cfg.roiHighlight, boxX + 4.5, boxY + 11, { maxWidth: boxW - 9 });

      doc.setDrawColor(226, 232, 240);
      doc.line(boxX, boxY + 36, boxX + boxW, boxY + 36);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(dict.keyMetrics.toUpperCase(), boxX + 4.5, boxY + 41);

      let metY = boxY + 47;
      cfg.impactMetrics.forEach((m) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(m.label, boxX + 4.5, metY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(16, 185, 129); // Emerald-500
        doc.text(m.value, boxX + 4.5, metY + 4.0);
        metY += 10.0;
      });

      // Section 2: Calculations
      const bottomY = Math.max(bulletY + 8, 142);
      doc.setDrawColor(226, 232, 240);
      doc.line(12, bottomY, 198, bottomY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(dict.engineeringCalcs.toUpperCase(), 12, bottomY + 8);

      let calcY = bottomY + 15;
      cfg.calculations.forEach((calc, idx) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(79, 70, 229); // Indigo
        doc.text(`0${idx + 1}`, 12, calcY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(calc, 22, calcY, { maxWidth: 176 });
        
        const splitLines = doc.splitTextToSize(calc, 176);
        calcY += Math.max(splitLines.length * 4.2, 7.5);
      });

      // Section 3: Beegol Insight
      doc.setFillColor(240, 253, 250); // Emerald 50
      doc.setDrawColor(167, 243, 208); // Emerald 200
      doc.rect(12, calcY + 3, 186, 22, "FD");
      doc.setFillColor(16, 185, 129); // Emerald left vertical bar
      doc.rect(12, calcY + 3, 1.5, 22, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(6, 95, 70);
      doc.text("BEEGOL COGNITIVE AURA PIPELINE INSIGHT:", 17, calcY + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(5, 150, 105);
      doc.text(step.beegolInsight, 17, calcY + 13, { maxWidth: 176 });
    }

    // Save File
    const reportFilename = isAll
      ? `AuraOps_${type === "technical" ? "Technical_Factsheet" : "Executive_Report"}_${lang.toUpperCase()}_TIM.pdf`
      : `AuraOps_${type === "technical" ? "Technical_Factsheet" : "DomainFactsheet"}_${domain}_${lang.toUpperCase()}.pdf`;
    doc.save(reportFilename);
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setProgress(10);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 100);

    setTimeout(() => {
      try {
        generatePDFDirect(reportType, reportLang, selectedDomain);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
        }, 400);
      } catch (err) {
        console.error("PDF Generation failed:", err);
        setIsGenerating(false);
        setProgress(0);
      }
    }, 800);
  };

  const handleDownloadAllDomains = async () => {
    setIsGenerating(true);
    setProgress(5);
    try {
      const domains = ["all", ...steps.map((st) => st.id)];
      const totalSteps = domains.length;
      
      for (let i = 0; i < domains.length; i++) {
        setProgress(Math.round(((i + 1) / totalSteps) * 100));
        generatePDFDirect(reportType, reportLang, domains[i]);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } catch (err) {
      console.error("Batch download failed:", err);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownloadAllLanguagesAndTypes = async () => {
    setIsGenerating(true);
    setProgress(5);
    try {
      const targets = [
        { type: "executive" as const, lang: "en" as const },
        { type: "executive" as const, lang: "pt" as const },
        { type: "executive" as const, lang: "it" as const },
        { type: "technical" as const, lang: "en" as const },
        { type: "technical" as const, lang: "pt" as const },
        { type: "technical" as const, lang: "it" as const },
      ];
      
      for (let i = 0; i < targets.length; i++) {
        setProgress(Math.round(((i + 1) / targets.length) * 100));
        const target = targets[i];
        generatePDFDirect(target.type, target.lang, "all");
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } catch (err) {
      console.error("Bulk export failed:", err);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const generateKafkaSetupPDF = (lang: "en" | "pt" | "it") => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const isPt = lang === "pt";
    const isIt = lang === "it";
    const title = isPt 
      ? "GUIA DE IMPLEMENTACAO: KAFKA 1.8M MSGS/S COM 3 BROKERS & ZOOKEEPER" 
      : isIt 
      ? "GUIDA IMPLEMENTAZIONE: KAFKA 1.8M MSGS/S CON 3 BROKER & ZOOKEEPER" 
      : "KAFKA SETUP BLUEPRINT: 1.8M MSGS/S WITH 3 BROKERS & ZOOKEEPER";
    
    const drawDecorations = () => {
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 18, "F");
      doc.setFillColor(244, 63, 94); // rose-500 accent line
      doc.rect(0, 18, 210, 1.2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("BEEGOL AURAOPS ARCHITECTURE BLUEPRINTS", 12, 11);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(254, 205, 211); // rose-200
      doc.text("v5.4-AURA  |  KAFKA CLUSTER BLUEPRINT  |  CONFIDENTIAL", 110, 11);

      // Footer
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 280, 210, 17, "F");
      doc.setDrawColor(226, 232, 240);
      doc.line(0, 280, 210, 280);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Beegol AI & Infrastructure Team  |  Target: TIM Brasil Core  |  Strictly Confidential", 12, 290);
      doc.text("Page 1 of 1", 192, 290);
    };

    drawDecorations();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), 12, 34);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(244, 63, 94);
    doc.text(isPt 
      ? "Sizing de Infraestrutura e Arquitetura para Alta Vazao e Baixa Latencia em Producao da TIM" 
      : isIt 
      ? "Dimensionamento Infrastruttura e Architettura per High-Throughput e Bassa Latenza in Produzione TIM"
      : "High-Throughput, Low-Latency Sizing & Linux Kernel Configuration for TIM Production CPEs", 12, 41);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(12, 47, 186, 32, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(isPt ? "RESUMO EXECUTIVO DE ESCALABILIDADE:" : isIt ? "RIASSUNTO ESECUTIVO DI SCALABILITA:" : "EXECUTIVE SCALABILITY SUMMARY:", 16, 53);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const summaryText = isPt 
      ? "Este documento especifica a configuracao exata para processar 1,8 milhao de mensagens por segundo de telemetria CPE usando 3 brokers fisicos gerenciados com ZooKeeper. Isso otimiza o custo de hardware em 78%, atingindo latencias na casa de sub-segundos via otimizacoes criticas no JVM, sistema operacional e configuracoes internas do Kafka."
      : isIt
      ? "Questo documento specifica la configurazione esatta per elaborare 1,8 milioni di messaggi al secondo di telemetria CPE utilizzando 3 broker fisici gestiti con ZooKeeper. Cio riduce il costo dell'hardware del 78%, ottenendo latenze inferiori al secondo grazie a ottimizzazioni critiche della JVM, del sistema operativo e di Kafka."
      : "This specification outlines the configuration required to sustain a continuous load of 1.8M msgs/s of raw CPE telemetry across 3 physical Kafka brokers managed by ZooKeeper. This achieves a 78% saving in cluster infrastructure overhead, maintaining sub-second delivery latencies via hyper-optimized JVM settings, socket buffers, and zero-copy pagecache transfers.";
    doc.text(summaryText, 16, 58, { maxWidth: 178 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "1. REQUISITOS DE HARDWARE DOS BROKERS (MINIMO RECOMENDADO):" : isIt ? "1. REQUISITI HARDWARE DEL BROKER (MINIMO CONSIGLIATO):" : "1. RECOMMENDED MINIMUM HARDWARE SIZING (PER BROKER):", 12, 86);

    const drawSpecs = (y: number) => {
      const specs = [
        { name: "vCPU / Threads", val: "32 Cores (Intel Xeon Gold or AMD EPYC)" },
        { name: "RAM", val: "128 GB DDR4 ECC (Allocate 16GB to JVM, leave remainder for Linux OS PageCache)" },
        { name: "Disk / Storage", val: "2x 1.6TB NVMe SSDs in RAID 0 (XFS filesystem with noatime option)" },
        { name: "Network Interfaces", val: "2x 25 Gbps Ethernet Cards with Bonding (LACP) & Receive Side Scaling" }
      ];

      let cy = y;
      specs.forEach(s => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(241, 245, 249);
        doc.rect(12, cy, 186, 7, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(s.name, 16, cy + 4.8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(s.val, 65, cy + 4.8);

        cy += 7;
      });
    };
    drawSpecs(91);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "2. CONFIGURACAO E AJUSTES DO KERNEL DO LINUX:" : isIt ? "2. CONFIGURAZIONE E REGOLAZIONI DEL KERNEL LINUX:" : "2. OS KERNEL & SOCKET NETWORK TUNING:", 12, 126);

    doc.setFillColor(244, 245, 246);
    doc.setDrawColor(209, 213, 219);
    doc.rect(12, 131, 186, 38, "FD");

    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.setTextColor(31, 41, 55);
    const kernelConfigs = [
      "# /etc/sysctl.conf - Peak Network Socket and Memory Tuning",
      "fs.file-max = 1000000",
      "vm.dirty_background_ratio = 5      # Start background flush of pagecache early",
      "vm.dirty_ratio = 10                 # Block writers at 10% to prevent giant flush latency spikes",
      "net.core.somaxconn = 32768          # Prevent socket backlog queue dropping CPE connections",
      "net.ipv4.tcp_max_syn_backlog = 16384",
      "net.ipv4.tcp_rmem = 4096 87380 16777216  # Large window scale socket memory buffers",
      "net.ipv4.tcp_wmem = 4096 65536 16777216  # Critical for 1.8M msgs/s raw bandwidth"
    ];
    let kY = 135;
    kernelConfigs.forEach(line => {
      doc.text(line, 16, kY);
      kY += 4.2;
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "3. PARAMETROS DO KAFKA (SERVER.PROPERTIES):" : isIt ? "3. PARAMETRI KAFKA (SERVER.PROPERTIES):" : "3. ULTRA-PERFORMANCE SERVER.PROPERTIES CONFIGURATION:", 12, 176);

    doc.setFillColor(244, 245, 246);
    doc.setDrawColor(209, 213, 219);
    doc.rect(12, 181, 186, 42, "FD");

    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.setTextColor(31, 41, 55);
    const kafkaProps = [
      "num.network.threads=16             # Handles network epoll select threads",
      "num.io.threads=32                  # Handles intensive local NVMe disk writes",
      "socket.send.buffer.bytes=1048576   # 1MB send buffer",
      "socket.receive.buffer.bytes=1048576# 1MB receive buffer to prevent buffer overruns",
      "log.flush.interval.messages=9223372036854775807 # Leave flushes to OS pagecache",
      "log.flush.interval.ms=null         # Leverage background OS flushes",
      "compression.type=lz4               # Extremely fast, CPU-efficient compress codec",
      "num.partitions=96                  # Distributed across 3 brokers (32 partitions per broker)"
    ];
    let pY = 185;
    kafkaProps.forEach(line => {
      doc.text(line, 16, pY);
      pY += 4.2;
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "4. OTIMIZACAO DE PRODUCER (BORDAS CPE):" : isIt ? "4. OTTIMIZZAZIONE PRODUTTORI (CPE EDGE):" : "4. CLIENT PRODUCER SIZING FOR TIM CPES:", 12, 229);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const prodDesc = isPt 
      ? "- batch.size: Aumente para 131072 (128 KB) para agrupar multiplas mensagens CPE em lotes compactos.\n- linger.ms: Ajuste para 15-25 ms para forcar a agregacao de telemetria sem adicionar latencia perceptivel.\n- compression.type: Use lz4 ou zstd para minimizar o uso de banda WAN de saida residencial.\n- acks: Configure para 1 para taxa maxima de vazao sem sobrecarga de coordenacao de replica."
      : isIt
      ? "- batch.size: Aumentare a 131072 (128 KB) per raggruppare piu messaggi CPE in batch compatti.\n- linger.ms: Impostare su 15-25 ms per costringere l'aggregazione di telemetria senza ritardi evidenti.\n- compression.type: Usare lz4 o zstd per ridurre al minimo l'uso della banda WAN residenziale.\n- acks: Configurare a 1 per ottenere la massima velocita di invio e ridurre i tempi di attesa."
      : "- batch.size: Increase to 131072 (128 KB) to pack multiple high-frequency CPE records into compact batches.\n- linger.ms: Set to 15-25 ms to enforce telemetry consolidation on the subscriber's gateway before WAN egress.\n- compression.type: Set to lz4 (or zstd) to optimize residential upload transit sizes and protect home user speed.\n- acks: Set to 1 (or acks=all with min.insync.replicas=1) to achieve peak writing throughput with 3 brokers.";
    doc.text(prodDesc, 12, 235, { maxWidth: 186 });

    doc.save(`Beegol_AuraOps_Sizing_Kafka_1.8M_3Brokers_${lang.toUpperCase()}.pdf`);
  };

  const generateETLFilterPDF = (lang: "en" | "pt" | "it") => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const isPt = lang === "pt";
    const isIt = lang === "it";
    const title = isPt 
      ? "ARQUITETURA DE FILTRO DE RUIDO: PRE-INGESTAO KAFKA" 
      : isIt 
      ? "ARCHITETTURA FILTRAZIONE RUMORE: PRE-INGESTIONE KAFKA" 
      : "PRE-KAFKA EDGE ETL BLUEPRINT: THE 90% TELEMETRY FILTER";
    
    const drawDecorations = () => {
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 18, "F");
      doc.setFillColor(16, 185, 129); // emerald-500 accent line
      doc.rect(0, 18, 210, 1.2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("BEEGOL AURAOPS ARCHITECTURE BLUEPRINTS", 12, 11);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(167, 243, 208); // emerald-200
      doc.text("v5.4-AURA  |  PRE-INGEST EDGE FILTER BLUEPRINT", 110, 11);

      // Footer
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 280, 210, 17, "F");
      doc.setDrawColor(226, 232, 240);
      doc.line(0, 280, 210, 280);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Beegol AI Research & Data Engineering  |  Confidential", 12, 290);
      doc.text("Page 1 of 1", 192, 290);
    };

    drawDecorations();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), 12, 34);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(16, 185, 129);
    doc.text(isPt 
      ? "Reducao Estrategica de OpEx Cloud via Filtragem de Anomalias na Borda (CPE/OLT)" 
      : isIt 
      ? "Riduzione Strategica dell'OpEx Cloud tramite Filtrazione di Anomalie all'Edge (CPE/OLT)"
      : "Strategic Cloud OpEx Minimization via Dynamic Anomaly Filtering at the Network Edge", 12, 41);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(12, 47, 186, 32, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
        const summaryText = isPt 
      ? "Esta arquitetura move o processo de extracao e descarte de ruido para as CPEs residenciais e servidores de borda OLT. Em vez de enviar 1.8M msgs/s continuamente, as CPEs filtram a telemetria redundante. Apenas deltas significativos, alteracoes criticas e falhas de sinal fisico sao transmitidos imediatamente. Isso reduz a carga central em 90%, baixando a vazao para 180k msgs/s."
      : isIt
      ? "Questa architettura sposta il processo di filtrazione e rimozione del rumore direttamente sui CPE residenziali e sui server di bordo OLT. Invece di inviare 1,8 milioni di messaggi al secondo, i CPE filtrano la telemetria ripetitiva. Vengono inviati solo i delta significativi e i guasti fisici di linea. Cio riduce il carico sui sistemi centrali del 90%, portando il flusso a 180k msgs/s."
      : "By shifting data cleansing and deduplication directly into subscriber CPE gateways and edge OLT aggregation nodes, this design eliminates massive central overhead. Instead of flooding Kafka with a continuous stream of 1.8M msgs/s (mostly consisting of identical, flat-line telemetry), the edge agent drops static values. It sends only state-changes and abnormal signals, slashing central ingest rates by 90% down to 180k msgs/s.";
    doc.text(summaryText, 16, 58, { maxWidth: 178 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "1. ANALISE COMPARATIVA DE ARQUITETURA:" : isIt ? "1. ANALISI COMPARATIVA DELL'ARCHITETTURA:" : "1. COMPARATIVE FLOW ANALYSIS (TRADITIONAL VS. EDGE-FILTERED):", 12, 86);

    const drawComparison = (y: number) => {
      doc.setFillColor(241, 245, 249);
      doc.rect(12, y, 186, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("METRIC", 16, y + 4.2);
      doc.text("TRADITIONAL PLAIN INGEST", 65, y + 4.2);
      doc.text("PRE-KAFKA EDGE FILTERED", 130, y + 4.2);

      const rows = [
        { name: "CPE Ingest Rate", r1: "1.8M msgs/s (Continuous flood)", r2: "180k msgs/s (State-change delta stream)" },
        { name: "Kafka Sizing Req.", r1: "12 Distributed Large VM Brokers", r2: "3 Standard Cost-Effective VM Brokers (ZooKeeper)" },
        { name: "WAN Bandwidth (TIM)", r1: "100% Raw Volume (High Egress)", r2: "10% Filtered Volume (90% WAN Bandwidth Saved)" },
        { name: "Database Storage", r1: "74.8 TB / Month raw ingestion", r2: "7.5 TB / Month structured parquet Delta" },
        { name: "AI GNN Latency", r1: "Queue lag can reach 1500+ ms", r2: "Sub-second hot-path real-time RCA" }
      ];

      let cy = y + 6;
      rows.forEach(r => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(241, 245, 249);
        doc.rect(12, cy, 186, 7, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.2);
        doc.setTextColor(15, 23, 42);
        doc.text(r.name, 16, cy + 4.8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(71, 85, 105);
        doc.text(r.r1, 65, cy + 4.8);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129); // emerald-500
        doc.text(r.r2, 130, cy + 4.8);

        cy += 7;
      });
    };
    drawComparison(91);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "2. ALGORITMO E LOGICA DE DETECCAO DA BORDA:" : isIt ? "2. ALGORITMO E LOGICA DI RILEVAMENTO ALL'EDGE:" : "2. DETAILED EDGE-FILTERING ALGORITHM LOGIC:", 12, 137);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const algDesc = isPt
      ? "- Filtro de Janela Deslizante (Deduplicacao de Telemetria):\n  O agente embarcado Beegol armazena o ultimo estado de RSSI Wi-Fi, SNR e taxas de erro PHY na memoria RAM da CPE. Se as leituras subsequentes permanecerem constantes ou dentro de uma margem de +-1.5% do baseline, a mensagem de telemetria e descartada no dispositivo.\n- Envio com Base em Pulsacao (Heartbeat Mode):\n  A telemetria normal estavel e transmitida em uma frequencia extremamente reduzida (uma vez a cada 10 minutos) apenas para atestar a liveness do modem.\n- Hot-Path de Gatilho de Anomalia:\n  Se qualquer indicador cruzar limites de falha ou degradar abruptamente (queda de >3dB em RSSI ou pico de erro FEC), o dispositivo entra instantaneamente no modo de transmissao em sub-segundos, enviando dados criticos acionaveis ao Kafka."
      : isIt
      ? "- Filtro a Finestra Scorrevole (Deduplicazione Telemetria):\n  L'agente integrato memorizza gli ultimi valori di RSSI Wi-Fi, SNR e tassi di errore PHY nella memoria RAM del CPE. Se i valori successivi rimangono entro un intervallo del +-1,5% rispetto al valore di riferimento, il messaggio viene scartato a livello locale.\n- Trasmissione basata su Battito Cardiaco (Heartbeat Mode):\n  I dati stabili vengono trasmessi con frequenza molto bassa (una volta ogni 10 minuti) solo per segnalare lo stato attivo del dispositivo.\n- Innesco di Anomalia Hot-Path:\n  Se un indicatore scende al di sotto della soglia o si degrada all'improvviso (ad esempio un calo di >3dB di RSSI o picco di errori FEC), il dispositivo entra istantaneamente in modalita di trasmissione in sub-secondi, inviando i dati critici a Kafka."
      : "- Sliding-Window Deduplication Filter:\n  The embedded Beegol edge agent caches the last-known RSSI, physical line SNR, and FEC error rates in the CPE's local RAM. If succeeding reads are identical or within a +-1.5% margin of the running baseline, the telemetry message is silently discarded locally.\n- Periodic Heartbeat Mode:\n  Under optimal, stable network conditions, the CPE transmits state data only once every 10 minutes to verify gateway liveness.\n- Preemptive Anomaly Trigger (Hot-Path Bypass):\n  The absolute millisecond that any metric violates predefined safety envelopes (e.g., a sudden drop of >3dB in Wi-Fi signal power or a rapid spike in uncorrectable FEC frame counters), the agent instantly triggers the high-frequency streaming pipeline to stream telemetry directly to Kafka for sub-second GNN RCA.";
    doc.text(algDesc, 12, 143, { maxWidth: 186 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(isPt ? "3. PROJECAO DE RETORNO ECONOMICO (ROI TIM):" : isIt ? "3. PROIEZIONE DI RITORNO ECONOMICO (ROI TIM):" : "3. TIM BUSINESS & FINANCIAL IMPACT PROJECTION:", 12, 210);

    doc.setFillColor(240, 253, 250); // emerald-50
    doc.setDrawColor(167, 243, 208); // emerald-200
    doc.rect(12, 215, 186, 30, "FD");
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(12, 215, 1.5, 30, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text(isPt ? "METRICAS FINANCEIRAS DO DIRETOR GERAL (TIM CEO):" : isIt ? "METRICHE FINANZIARIE AMMINISTRATORE DELEGATO (TIM):" : "KEY OPERATIONAL METRICS FOR THE CHIEF EXECUTIVE:", 18, 221);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105); // emerald-600
    const financialDesc = isPt
      ? "- Cloud Data Ingress & Egress Savings: Economia direta de €1.200.000 por ano devido a 90% menos dados em transito.\n- Broker Infrastructure Savings: Substituicao de servidores caros por instancias padrao, economizando €240.000/ano.\n- Estabilidade da Rede TIM: Reducao total de chamados repetitivos de assinantes e maior fidelidade (Churn Reduzido de 1.8%)."
      : isIt
      ? "- Cloud Data Ingress & Egress Savings: Risparmio diretto di €1.200.000 all'anno grazie alla riduzione del 90% dei dati in transito.\n- Risparmio Infrastruttura Kafka: Sostituzione di server costosi con istanze standard, risparmiando €240.000 all'anno.\n- Stabilita della Rete TIM: Riduzione dei reclami ripetitivi da parte degli abbonati e fidelizzazione migliorata (Churn ridotto dell'1.8%)."
      : "- Cloud Data Ingress & Egress Savings: Direct saving of €1,200,000 per year due to a 90% reduction in data volume.\n- Broker Infrastructure Savings: Replaces expensive, high-throughput cloud resources with standard VMs, saving €240,000/year.\n- TIM Network Health: Eliminates duplicate client claims while retaining high-fidelity alerting, lowering customer churn by 1.8%.";
    doc.text(financialDesc, 18, 227, { maxWidth: 176 });

    doc.save(`Beegol_AuraOps_Architecture_ETL_Edge_Filter_${lang.toUpperCase()}.pdf`);
  };

  const handleDownloadKafkaSetup = () => {
    setIsGenerating(true);
    setProgress(30);
    setTimeout(() => {
      try {
        generateKafkaSetupPDF(reportLang);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
        }, 400);
      } catch (err) {
        console.error("Kafka PDF failed:", err);
        setIsGenerating(false);
        setProgress(0);
      }
    }, 500);
  };

  const handleDownloadETLFilter = () => {
    setIsGenerating(true);
    setProgress(30);
    setTimeout(() => {
      try {
        generateETLFilterPDF(reportLang);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
        }, 400);
      } catch (err) {
        console.error("ETL PDF failed:", err);
        setIsGenerating(false);
        setProgress(0);
      }
    }, 500);
  };

  return (
    <div className={`mt-5 rounded-xl border p-4.5 shadow-lg select-none transition-all duration-300 ${
      isLight 
        ? "bg-gradient-to-b from-white to-slate-50 border-slate-200" 
        : "bg-gradient-to-b from-slate-950/90 to-slate-900/60 border-slate-900"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-500 animate-pulse">
          <FileText size={14} />
        </div>
        <span className="text-[10px] font-mono tracking-wider font-black uppercase text-sky-500 dark:text-sky-400">
          {reportLang === "pt" ? "GERADOR DE DOCUMENTOS PDF" : reportLang === "it" ? "GENERATORE DOCUMENTI PDF" : "PDF DOCUMENT GENERATOR"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Row 1: Language Selection */}
        <div className="flex flex-col gap-1.5">
          <span className={`text-[9px] font-mono font-bold uppercase ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            {reportLang === "pt" ? "Idioma do Relatório" : reportLang === "it" ? "Lingua Report" : "Report Language"}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(["en", "pt", "it"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setReportLang(lang)}
                className={`py-1 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                  reportLang === lang
                    ? "bg-sky-500 text-slate-950 border-sky-400 font-black shadow-sm"
                    : isLight 
                    ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-600" 
                    : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                {lang === "en" ? "EN (English)" : lang === "pt" ? "PT (Português)" : "IT (Italiano)"}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1.5: Report Type Selection */}
        <div className="flex flex-col gap-1.5">
          <span className={`text-[9px] font-mono font-bold uppercase ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            {reportLang === "pt" ? "Tipo de Relatório" : reportLang === "it" ? "Tipo Report" : "Report Type / Audience"}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setReportType("executive")}
              className={`py-2 rounded-lg text-[10px] font-mono font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                reportType === "executive"
                  ? "bg-sky-500 text-slate-950 border-sky-400 font-black shadow-sm"
                  : isLight 
                  ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-600" 
                  : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <Sparkles size={11} />
              <span>{reportLang === "pt" ? "Executivo (ROI)" : reportLang === "it" ? "Esecutivo (ROI)" : "Executive (ROI)"}</span>
            </button>
            <button
              onClick={() => setReportType("technical")}
              className={`py-2 rounded-lg text-[10px] font-mono font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                reportType === "technical"
                  ? "bg-sky-500 text-slate-950 border-sky-400 font-black shadow-sm"
                  : isLight 
                  ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-600" 
                  : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <File size={11} />
              <span>{reportLang === "pt" ? "Técnico (Sistemas)" : reportLang === "it" ? "Tecnico (Sistemi)" : "Technical (Systems)"}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Domain Scope Selection */}
        <div className="flex flex-col gap-1.5">
          <span className={`text-[9px] font-mono font-bold uppercase ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            {reportLang === "pt" ? "Escopo do Domínio" : reportLang === "it" ? "Ambito Domini" : "Report Scope / Domain"}
          </span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className={`w-full p-2 rounded-lg border font-sans text-xs font-semibold cursor-pointer outline-none transition-colors ${
              isLight 
                ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300" 
                : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
            }`}
          >
            <option value="all">
              {reportLang === "pt" ? "★ Todos os Domínios (Sumário Completo)" : reportLang === "it" ? "★ Tutti i Domini (Rapporto Completo)" : "★ All Domains (Full Executive Report)"}
            </option>
            {steps.map((st) => (
              <option key={st.id} value={st.id}>
                {st.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button: Compile & Download - EXTREMELY CHAMATIVO / EYE-CATCHING */}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className={`w-full py-3.5 mt-1 relative rounded-xl font-mono text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.04] active:scale-[0.97] ${
            isGenerating
              ? "bg-slate-500/15 text-slate-400 border border-slate-500/20"
              : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-2 border-emerald-400/30 shadow-[0_0_25px_rgba(16,185,129,0.55)]"
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>{reportLang === "pt" ? `COMPILANDO... ${progress}%` : reportLang === "it" ? `COMPILANDO... ${progress}%` : `COMPILING... ${progress}%`}</span>
            </div>
          ) : (
            <>
              <Download size={14} strokeWidth={3} className="animate-bounce" />
              <span>{reportLang === "pt" ? "GERAR DOCUMENTO PDF" : reportLang === "it" ? "GENERA DOCUMENTO PDF" : "COMPILE PDF DOCUMENT"}</span>
            </>
          )}
        </button>

        {/* Divider for Architectural Blueprints */}
        <div className={`h-px my-1.5 ${isLight ? "bg-slate-200" : "bg-slate-800"}`} />

        <span className={`text-[9px] font-mono font-bold uppercase ${isLight ? "text-slate-400" : "text-slate-500"}`}>
          {reportLang === "pt" ? "Série de Blueprints de Arquitetura" : reportLang === "it" ? "Serie Blueprint di Architettura" : "Architecture Blueprint Series"}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadKafkaSetup}
            disabled={isGenerating}
            title="Download the official step-by-step low-latency tuning guide for 1.5M msgs/s with only 2 brokers"
            className={`py-3.5 rounded-xl font-mono text-[10px] font-black tracking-wider uppercase border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              isLight
                ? "bg-white border-slate-200 text-slate-800 hover:border-rose-500 hover:text-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "bg-slate-950 border-slate-800 text-slate-200 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]"
            }`}
          >
            <FileText size={13} className="text-rose-500 animate-pulse" />
            <span>{reportLang === "pt" ? "Kafka 1.5M (2 Brokers)" : reportLang === "it" ? "Kafka 1.5M (2 Broker)" : "Kafka 1.5M/s (2 Nodes)"}</span>
          </button>

          <button
            onClick={handleDownloadETLFilter}
            disabled={isGenerating}
            title="Download the official blueprint for edge-filtering and deduplication that drops 90% of background noise before Kafka"
            className={`py-3.5 rounded-xl font-mono text-[10px] font-black tracking-wider uppercase border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              isLight
                ? "bg-white border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            }`}
          >
            <CheckCircle2 size={13} className="text-emerald-500 animate-pulse" />
            <span>{reportLang === "pt" ? "Filtro ETL Pré-Kafka" : reportLang === "it" ? "Filtro ETL Pre-Kafka" : "Pre-Kafka ETL Filter"}</span>
          </button>
        </div>

        {/* Divider for Batch Importers */}
        <div className={`h-px my-1.5 ${isLight ? "bg-slate-200" : "bg-slate-800"}`} />

        <span className={`text-[9px] font-mono font-bold uppercase ${isLight ? "text-slate-400" : "text-slate-500"}`}>
          {reportLang === "pt" ? "Exportador em Lote (Todos os Relatórios)" : reportLang === "it" ? "Esportazione in Lotto" : "Batch Exporter Pack"}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadAllDomains}
            disabled={isGenerating}
            title="Downloads separate PDFs for each individual step domain factsheet"
            className={`py-3.5 rounded-xl font-mono text-[10px] font-black tracking-wider uppercase border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              isLight
                ? "bg-white border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            }`}
          >
            <Download size={13} className="text-emerald-500" />
            <span>{reportLang === "pt" ? "Todos os Domínios" : reportLang === "it" ? "Tutti i Domini" : "All Domain Sheets"}</span>
          </button>

          <button
            onClick={handleDownloadAllLanguagesAndTypes}
            disabled={isGenerating}
            title="Downloads 6 main reports: Executive & Technical in EN, PT, and IT"
            className={`py-3.5 rounded-xl font-mono text-[10px] font-black tracking-wider uppercase border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              isLight
                ? "bg-white border-slate-200 text-slate-800 hover:border-sky-500 hover:text-sky-600 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                : "bg-slate-950 border-slate-800 text-slate-200 hover:border-sky-500 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            }`}
          >
            <Globe size={13} className="text-sky-500" />
            <span>{reportLang === "pt" ? "Multi-Idioma Pack" : reportLang === "it" ? "Pack Multilingua" : "Multi-Lang Pack"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
