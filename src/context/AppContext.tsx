import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "pt" | "it";
export type Theme = "dark" | "light";
export type FilterBarrier = "before-kafka" | "after-kafka";
export type ProtocolMode = "tr069" | "tr369" | "mqtt" | "gnmi" | "otel";

interface AppContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
  // Dynamic Simulation & Ingestion states
  filterBarrier: FilterBarrier;
  setFilterBarrier: (barrier: FilterBarrier) => void;
  protocolMode: ProtocolMode;
  setProtocolMode: (mode: ProtocolMode) => void;
  activeRemediation: string | null;
  setActiveRemediation: (action: string | null) => void;
  backpressureValue: number;
  setBackpressureValue: (val: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Header
    beegol_auraops: "Beegol AuraOps",
    active_pipeline: "ACTIVE PIPELINE",
    domain_oriented_subtitle: "DOMAIN-ORIENTED TELECOMMUNICATIONS AI PIPELINE • FEB 2026",
    market: "MARKET: Telecom Italia",
    roi_target: "ROI TARGET: 480% (Year 3)",
    v5_4_aura: "v5.4-AURA",
    lifecycle_flow_interaction: "LIFECYCLE FLOW INTERACTION",
    cpe_telemetry_subtitle: "// CPE Telemetry to Beegol Cloud Results",
    simulation_title: "AuraOps Telemetry & Savings Pipeline Lifecycle Simulation",
    pause_auto_cycle: "PAUSE AUTO-CYCLE",
    auto_cycle_flow: "AUTO-CYCLE FLOW",
    next_step: "Next Step",
    reset_to_step_1: "Reset to Step 1",
    step_indicator: "STEP",

    // Metrics
    kafka_ingest: "Kafka Ingest Throughput",
    beegol_ml_rca: "Beegol ML RCA Precision",
    automated_self_heals: "Automated Self-Heals",
    tim_opex_retained: "TIM OpEx Retained",
    per_month: " / mo",
    per_year: " / Yr",
    devices_hr: " devices/hr",

    // Fault Visualizer
    preemptive_fault: "Pre-emptive Fault Core Visualizer",
    live_dielectric: "LIVE DIELECTRIC MONITOR",
    raw_phy: "Raw PHY SNR Frequency Spectrum",
    stable: "STABLE",
    center_freq: "Center Frequency",
    total_dist: "Total Distortion",
    tim_opex_reduction: "TIM OPEX DIRECT REDUCTION",
    tim_opex_reduction_desc: "Blocks physical engineer rolls on false positive alarms, saving both dispatch costs for TIM and cloud orchestration computing for Beegol.",
    truck_dispatches: "TRUCK DISPATCHES",
    ai_diagnostics_core: "AI Diagnostics Core",
    ai_diagnostics_desc: "Test telemetry vectors by triggering GNN-based physical line analysis directly.",
    gen_diagnostic_report: "GENERATE DIAGNOSTIC REPORT",
    processing_phy: "Processing PHY registers...",
    calc_gnn: "Calculating GNN covariance graph...",
    ready_telemetry: "Ready to receive telemetry vector parameters. Press generate above to start simulation.",
    inference_outcome: "Inference Report Outcome",
    diagnostics_success_result: "SUCCESS: Isolated physical coax shield bend on street terminal #419-B. Mitigated by auto-shifting Wi-Fi channel from 6 to 11. No technician dispatch required.",

    // Terminal
    platform_logs_header: "Platform Logs & Syslog Stream",
    live_sockets: "// Live Sockets",
    terminal_connected: "TIM CORE INFRASTRUCTURE TELEMETRY SOCKET CONNECTED OK // ADHERING TO 22PX TEXT SPEC",
    heartbeat_ok: "HEARTBEAT: socket sync pulse active ... OK",

    // Map Simulation HUD
    carrier_topo_explorer: "AURAOPS CARRIER TOPO EXPLORER",
    active_nodes_only: "Active Nodes Only",
    realtime_sync: "LATENCY: 0.28ms // REALTIME SYNC",
    drag_node: "DRAG",
    cpe_edge_client: "CPE EDGE CLIENT",
    gpon_access: "GPON/ACCESS DISTRIBUTION",
    metro_core: "METRO CORE",
    mgmt_control: "MANAGEMENT CONTROL",
    telemetry_ingest: "TELEMETRY INGESTION",
    beegol_gnn_ai: "BEEGOL GNN AI",
    beegol_core_badge: "BEEGOL CORE",
    drag_relocate: "Drag and relocate node on grid",

    // Sidebar Panels
    roi_partnership_highlight: "ROI PARTNERSHIP HIGHLIGHT",
    business_value_details: "BUSINESS VALUE / ROI DETAILS",
    eng_pipeline_calcs: "ENGINEERING PIPELINE / CALCULATIONS",
    step_perf_metrics: "Step Performance Metrics",
    direct_impact: "// Direct Impact",
    active_telemetry_stream: "Active telemetry stream",
    savings_roi_label: "Savings / ROI",
    operation_label: "Operation",
    outcome_label: "Outcome",

    // Step Translations
    // Step 1: CPE
    s1_name: "Step 1: Home CPE Edge Capture",
    s1_short: "Subscriber CPE",
    s1_desc: "Captures raw physical layer metrics at 1-second intervals from broadband gateways and video set-tops.",
    s1_impact: "Support calls are reduced by 35% via proactive pre-emptive line diagnostics.",
    s1_insight: "Bypasses slow polling cycles to extract raw radio/optical parameters directly from RDK firmware.",
    s1_sub: "Edge Capture & Driver Probes",
    s1_group: "CLIENT EDGE HARDWARE",
    s1_roi_highlight: "Saves massive costs for TIM (35% drop in truck dispatches) while allowing Beegol to scale efficiently.",
    s1_calc1: "Extract Wi-Fi noise floor, Rx Optical Power, and FEC registers from router kernels at 1s intervals.",
    s1_calc2: "Compile telemetry module directly into open-source RDK-B or prplMesh gateway firmware.",
    s1_calc3: "Buffer anomalies locally in RAM, minimizing WAN upload bandwidth during high-stress periods.",
    s1_metric1: "Wi-Fi Noise Floor",
    s1_metric2: "Rx Optical Power",
    s1_metric3: "Wi-Fi RSSI Average",
    s1_metric4: "FEC Uncorrectable",
    s1_metric5: "CPE CPU Load",
    s1_metric6: "CPE Memory Leak",

    // Step 2: GPON
    s2_name: "Step 2: GPON OLT & Edge Aggregation",
    s2_short: "GPON & Edge",
    s2_desc: "Aggregates massive physical telemetry at optical line terminals (OLT) and virtual CCAP router edges.",
    s2_impact: "Consolidates hardware dependencies, saving 15% in infrastructure maintenance costs.",
    s2_insight: "Groups disparate subscribers by fiber splitters, isolating PON-wide outages from home-specific issues.",
    s2_sub: "GPON Fiber Aggregation",
    s2_group: "ACCESS & GPON LAYER",
    s2_roi_highlight: "Reduces duplicate support claims by immediately grouping trunk fiber outages.",
    s2_calc1: "Aggregate raw frames at virtual CCAP (vCCAP) routers and GPON Optical Line Terminals (OLT).",
    s2_calc2: "Inject local node geographical headers to map spatial layout splitters.",
    s2_calc3: "Filter out individual device noise to identify block-wide physical optical trunk degradation.",
    s2_metric1: "Aggregated Link Capacity",
    s2_metric2: "Active Fiber Ports",
    s2_metric3: "Edge Gateway Latency",
    s2_metric4: "Packet Drop Ratio",
    s2_metric5: "PHY Upstream Jitter",
    s2_metric6: "EPON Power Splitter",

    // Step 3: USP
    s3_name: "Step 3: USP MQTT Control Plane",
    s3_short: "USP / MQTT Broker",
    s3_desc: "Secures transport of asynchronous telemetry state changes over the TR-369 USP protocol.",
    s3_impact: "Replaces heavy, slow HTTP polls with instant lightweight asynchronous events, saving 45% server overhead.",
    s3_insight: "Leverages binary-serialized Protobuf formats to minimize WAN bandwidth impact across connections.",
    s3_sub: "TR-369 USP Secure Broker",
    s3_group: "PROTOCOL & CONTROLLER",
    s3_roi_highlight: "Cuts cloud egress data bills by 84% by ditching heavy TR-069 XML polling.",
    s3_calc1: "Serialize device telemetry state changes into tiny, light binary Protobuf payloads.",
    s3_calc2: "Maintain persistent lightweight sockets over MQTT with minimal heartbeat overhead.",
    s3_calc3: "Deliver asynchronous USP Notify events, preventing SOAP XML polling server queues.",
    s3_metric1: "Active USP Sessions",
    s3_metric2: "Broker Queue Depth",
    s3_metric3: "TLS Handshake Speed",
    s3_metric4: "MQTT Socket Status",
    s3_metric5: "Legacy TR-069 Fallback",
    s3_metric6: "Heartbeat Interval",

    // Step 4: Kafka
    s4_name: "Step 4: Kafka Ingest & Queue Stream",
    s4_short: "Kafka Stream",
    s4_desc: "Ingests ultra-high frequency telemetry streams into partition groups with absolute high availability.",
    s4_impact: "Guarantees 99.999% telemetry availability during sudden regional weather outages.",
    s4_insight: "Batches network parameters in-memory, serving as the ultra-fast highway for Beegol's AI algorithms.",
    s4_sub: "High-Availability Partition Streamer",
    s4_group: "EVENT INGESTION PLANE",
    s4_roi_highlight: "Secures SLA guarantees by preventing packet loss during major storm outages.",
    s4_calc1: "Load-balance millions of incoming streams across 120 Kafka partition clusters.",
    s4_calc2: "Batch incoming telemetry payloads with fast, non-blocking lz4 compression codecs.",
    s4_calc3: "Sync records across 3 distributed brokers to maintain strict 3-way fault tolerance.",
    s4_metric1: "Kafka Ingest Speed",
    s4_metric2: "Partition Group Lag",
    s4_metric3: "Brokers Online",
    s4_metric4: "lz4 Compression Ratio",
    s4_metric5: "Buffer Allocation",
    s4_metric6: "Replication Factor",

    // Step 5: Databricks
    s5_name: "Step 5: Databricks Stateful ETL",
    s5_short: "Databricks ETL",
    s5_desc: "Cleanses, normalizes, and joins telemetry data with customer topology files in Delta Lake.",
    s5_impact: "Reduces raw cloud compute costs by 65% through severe, early noise filtering and delta storage.",
    s5_insight: "Extracts pure physical signals from background electrical noise, enabling clean model inputs.",
    s5_sub: "Delta Lake Spark Refiner",
    s5_group: "DATA REFINERY LAYER",
    s5_roi_highlight: "Reduces downstream AI database storage bills by 65% by discarding static background static.",
    s5_calc1: "Execute high-speed Spark streaming batches to cleanse, normalize, and merge input streams.",
    s5_calc2: "Filter out 94% of irrelevant background electromagnetic noise instantly.",
    s5_calc3: "Store structured clean vectors in optimized columnar Parquet format inside Delta Lake.",
    s5_metric1: "Deduplication Ratio",
    s5_metric2: "Delta Lake Latency",
    s5_metric3: "Spark Cluster Load",
    s5_metric4: "Active Feature Sets",
    s5_metric5: "Discarded Noise",
    s5_metric6: "Schema Compliance",

    // Step 6: Beegol AI
    s6_name: "Step 6: Beegol Cloud Results & RCA",
    s6_short: "Beegol Cloud",
    s6_desc: "Pipes cleaned features into Beegol Cloud's Deep Neural Network to pinpoint exact root causes.",
    s6_impact: "Directly avoids 30% unnecessary truck rolls, dramatically optimizing operations and customer satisfaction.",
    s6_insight: "Pins the exact root cause: distinguishes physical subscriber cable damage from wide regional noise.",
    s6_sub: "Graph Neural Net RCA Engine",
    s6_group: "DEEP LEARNING NETWORK",
    s6_roi_highlight: "Automates issue resolution, avoiding costly truck rolls via background channel heals.",
    s6_calc1: "Feed micro-cleansed feature matrices into Beegol Cloud's Deep Neural Network model.",
    s6_calc2: "Run Graph Neural Network (GNN) analysis to locate physical coaxial faults to ±2.4 meters.",
    s6_calc3: "Auto-trigger remote Wi-Fi channel shifts or generate rich engineering dispatch tickets.",
    s6_metric1: "RCA Neural Accuracy",
    s6_metric2: "Diagnosis Time",
    s6_metric3: "Self-Heal Triggers",
    s6_metric4: "Flap Detection Confidence",
    s6_metric5: "Active Field Alerts",
    s6_metric6: "Model Learning Rate",

    // Added high-fidelity HUD & Legend translation keys
    active_pipeline_badge: "ACTIVE PIPELINE",
    header_sub: "DOMAIN-ORIENTED TELECOMMUNICATIONS AI PIPELINE • FEB 2026",
    market_title: "MARKET: Telecom Italia",
    interaction_title: "LIFECYCLE FLOW INTERACTION",
    interaction_sub: "CPE Telemetry to Beegol Cloud Results",
    sim_title: "AuraOps Telemetry & Savings Pipeline Lifecycle Simulation",
    step_badge_prefix: "STEP",
    step_prefix: "Step",

    legend_cpe: "CPE Edge Client",
    legend_gpon: "GPON Access Layer",
    legend_metro: "Metro Core Transport",
    legend_mgmt: "Management & Control",
    legend_ingest: "Telemetry Ingest (Kafka)",
    legend_ai: "Beegol AI / RCA Engine",

    kafka_flow_control: "KAFKA TOPIC FLOW CONTROL",
    interactive_badge: "Interactive",
    modem_telemetry_flow: "Modem Telemetry Flow",
    hifi_docs_flow: "High-Fidelity Docs Flow",
    topic_label: "Topic:",
    optimized_label: "Optimized",
    congested_label: "Congested",
    latency_impact: "Latency Impact:"
  },
  pt: {
    // Header
    beegol_auraops: "Beegol AuraOps",
    active_pipeline: "PIPELINE ATIVO",
    domain_oriented_subtitle: "PIPELINE DE IA DE TELECOMUNICAÇÕES ORIENTADO A DOMÍNIO • FEV 2026",
    market: "MERCADO: Telecom Italia",
    roi_target: "META DE ROI: 480% (Ano 3)",
    v5_4_aura: "v5.4-AURA",
    lifecycle_flow_interaction: "INTERAÇÃO DO FLUXO DE CICLO DE VIDA",
    cpe_telemetry_subtitle: "// Telemetria de CPE para Resultados da Nuvem Beegol",
    simulation_title: "Simulação do Ciclo de Vida do Pipeline de Telemetria e Economias AuraOps",
    pause_auto_cycle: "PAUSAR AUTO-CICLO",
    auto_cycle_flow: "AUTO-CICLO DE FLUXO",
    next_step: "Próximo Passo",
    reset_to_step_1: "Reiniciar para Passo 1",
    step_indicator: "PASSO",

    // Metrics
    kafka_ingest: "Vazão de Entrada do Kafka",
    beegol_ml_rca: "Precisão de RCA de ML Beegol",
    automated_self_heals: "Auto-Correções Automatizadas",
    tim_opex_retained: "OpEx Retido pela TIM",
    per_month: " / mês",
    per_year: " / ano",
    devices_hr: " disp./hora",

    // Fault Visualizer
    preemptive_fault: "Visualizador de Falhas Pré-emptivo",
    live_dielectric: "MONITOR DIELÉTRICO AO VIVO",
    raw_phy: "Espectro de Frequência SNR de PHY Bruto",
    stable: "ESTÁVEL",
    center_freq: "Frequência Central",
    total_dist: "Distorção Total",
    tim_opex_reduction: "REDUÇÃO DIRETA DE OPEX DA TIM",
    tim_opex_reduction_desc: "Bloqueia o envio de técnicos para alarmes falsos positivos, economizando custos de despacho para a TIM e processamento de nuvem para a Beegol.",
    truck_dispatches: "DESPACHOS DE TÉCNICOS",
    ai_diagnostics_core: "Núcleo de Diagnóstico de IA",
    ai_diagnostics_desc: "Teste vetores de telemetria acionando a análise de linha física baseada em GNN diretamente.",
    gen_diagnostic_report: "GERAR RELATÓRIO DE DIAGNÓSTICO",
    processing_phy: "Processando registradores de PHY...",
    calc_gnn: "Calculando gráfico de covariância GNN...",
    ready_telemetry: "Pronto para receber parâmetros de telemetria. Pressione gerar acima para iniciar a simulação.",
    inference_outcome: "Resultado do Relatório de Inferência",
    diagnostics_success_result: "SUCESSO: Isolado amassado físico na blindagem do cabo coaxial no terminal de rua #419-B. Mitigado pela alteração automática do canal Wi-Fi do 6 para o 11. Sem necessidade de envio de técnico.",

    // Terminal
    platform_logs_header: "Logs da Plataforma e Stream de Syslog",
    live_sockets: "// Sockets Ativos",
    terminal_connected: "SOCKET DE TELEMETRIA DA INFRAESTRUTURA TIM CONECTADO COM SUCESSO // SEGUINDO FONTE DE 22PX",
    heartbeat_ok: "BATIMENTO CARDÍACO: pulso de sincronização de socket ativo ... OK",

    // Map Simulation HUD
    carrier_topo_explorer: "AURAOPS CARRIER TOPO EXPLORER",
    active_nodes_only: "Apenas Nós Ativos",
    realtime_sync: "LATÊNCIA: 0.28ms // SINCRONIA EM TEMPO REAL",
    drag_node: "ARRASTAR",
    cpe_edge_client: "CLIENTE DE BORDA CPE",
    gpon_access: "DISTRIBUIÇÃO GPON/ACESSO",
    metro_core: "NÚCLEO METROPOLITANO",
    mgmt_control: "CONTROLE DE GERENCIAMENTO",
    telemetry_ingest: "INGESTÃO DE TELEMETRIA",
    beegol_gnn_ai: "BEEGOL GNN IA",
    beegol_core_badge: "NÚCLEO BEEGOL",
    drag_relocate: "Arraste e reposicione o nó no grid",

    // Sidebar Panels
    roi_partnership_highlight: "DESTAQUE DE PARCERIA DE ROI",
    business_value_details: "DETALHES DE VALOR COMERCIAL / ROI",
    eng_pipeline_calcs: "PIPELINE DE ENGENHARIA / CÁLCULOS",
    step_perf_metrics: "Métricas de Desempenho do Passo",
    direct_impact: "// Impacto Direto",
    active_telemetry_stream: "Fluxo de telemetria ativo",
    savings_roi_label: "Economias / ROI",
    operation_label: "Operação",
    outcome_label: "Resultado",

    // Step Translations
    // Step 1: CPE
    s1_name: "Passo 1: Captura de Borda na CPE Residencial",
    s1_short: "CPE do Assinante",
    s1_desc: "Captura métricas brutas da camada física em intervalos de 1 segundo a partir de modems banda larga e set-tops de vídeo.",
    s1_impact: "Chamados de suporte são reduzidos em 35% por meio de diagnósticos proativos de linha.",
    s1_insight: "Ignora ciclos lentos de polling para extrair parâmetros ópticos/de rádio brutos diretamente do firmware RDK.",
    s1_sub: "Captura de Borda e Sondas de Driver",
    s1_group: "HARDWARE DE BORDA DO CLIENTE",
    s1_roi_highlight: "Economiza custos massivos para a TIM (queda de 35% no envio de técnicos) enquanto permite que a Beegol escale com eficiência.",
    s1_calc1: "Extrai piso de ruído Wi-Fi, potência óptica recebida (Rx) e registradores FEC de kernels do roteador em intervalos de 1s.",
    s1_calc2: "Compila o módulo de telemetria diretamente no firmware de gateway de código aberto RDK-B ou prplMesh.",
    s1_calc3: "Armazena anomalias localmente em RAM para minimizar a largura de banda de upload na rede WAN durante picos.",
    s1_metric1: "Piso de Ruído Wi-Fi",
    s1_metric2: "Potência Óptica Rx",
    s1_metric3: "Média de RSSI Wi-Fi",
    s1_metric4: "FEC Incorrigível",
    s1_metric5: "Carga de CPU do CPE",
    s1_metric6: "Vazamento Memória CPE",

    // Step 2: GPON
    s2_name: "Passo 2: OLT GPON e Agregação de Borda",
    s2_short: "GPON e Borda",
    s2_desc: "Agrega telemetria física massiva em terminais de linha óptica (OLT) e bordas de roteadores virtuais CCAP.",
    s2_impact: "Consolida dependências de hardware, economizando 15% em custos de manutenção de infraestrutura.",
    s2_insight: "Agrupa assinantes dispersos por splitters de fibra, isolando falhas gerais de PON de problemas residenciais.",
    s2_sub: "Agregação de Fibra GPON",
    s2_group: "CAMADA DE ACESSO E GPON",
    s2_roi_highlight: "Reduz reclamações duplicadas de suporte ao agrupar imediatamente interrupções de fibra troncal.",
    s2_calc1: "Agrega frames brutos nos roteadores virtuais CCAP (vCCAP) e Terminais de Linha Óptica GPON (OLT).",
    s2_calc2: "Injeta cabeçalhos geográficos nos nós locais para mapear os splitters espacialmente.",
    s2_calc3: "Filtra o ruído individual dos dispositivos para identificar degradação física em troncos de fibra óptica.",
    s2_metric1: "Capacidade de Link Agregado",
    s2_metric2: "Portas de Fibra Ativas",
    s2_metric3: "Latência do Gateway de Borda",
    s2_metric4: "Taxa de Descarte de Pacotes",
    s2_metric5: "Jitter de Upstream PHY",
    s2_metric6: "Splitter de Potência EPON",

    // Step 3: USP
    s3_name: "Passo 3: Plano de Controle USP MQTT",
    s3_short: "Broker USP / MQTT",
    s3_desc: "Garante o transporte seguro de alterações de estado de telemetria assíncrona sobre o protocolo TR-369 USP.",
    s3_impact: "Substitui consultas HTTP lentas e pesadas por eventos assíncronos leves, economizando 45% de processamento nos servidores.",
    s3_insight: "Aproveita formatos de Protobuf serializados em binário para minimizar o impacto na largura de banda da WAN.",
    s3_sub: "Broker Seguro USP TR-369",
    s3_group: "PROTOCOLO E CONTROLADOR",
    s3_roi_highlight: "Corta os custos de tráfego de dados na nuvem em 84% ao eliminar consultas pesadas em XML TR-069.",
    s3_calc1: "Serializa alterações de estado de telemetria do dispositivo em payloads Protobuf binários compactos.",
    s3_calc2: "Mantém sockets leves persistentes sobre MQTT com sobrecarga mínima de heartbeat.",
    s3_calc3: "Entrega eventos assíncronos de notificação USP, evitando filas de servidores baseadas em SOAP XML.",
    s3_metric1: "Sessões USP Ativas",
    s3_metric2: "Profundidade de Fila Broker",
    s3_metric3: "Velocidade do Handshake TLS",
    s3_metric4: "Status do Socket MQTT",
    s3_metric5: "Fallback TR-069 Legado",
    s3_metric6: "Intervalo de Heartbeat",

    // Step 4: Kafka
    s4_name: "Passo 4: Ingestão de Kafka e Stream de Fila",
    s4_short: "Stream do Kafka",
    s4_desc: "Ingere streams de telemetria de ultra-alta frequência em grupos de partições com alta disponibilidade absoluta.",
    s4_impact: "Garante 99,999% de disponibilidade de telemetria durante quedas climáticas regionais repentinas.",
    s4_insight: "Agrupa parâmetros de rede na memória, servindo como uma rodovia ultrarrápida para os algoritmos de IA da Beegol.",
    s4_sub: "Streamer de Partições de Alta Disponibilidade",
    s4_group: "PLANO DE INGESTÃO DE EVENTOS",
    s4_roi_highlight: "Garante metas de SLA ao prevenir perdas de pacotes durante grandes tempestades de rede.",
    s4_calc1: "Distribui milhões de fluxos recebidos entre 120 clusters de partição Kafka de forma equilibrada.",
    s4_calc2: "Agrupa payloads de telemetria com codecs rápidos de compressão lz4 sem bloqueio.",
    s4_calc3: "Sincroniza registros em 3 brokers distribuídos para manter tolerância a falhas estrita de 3 vias.",
    s4_metric1: "Velocidade de Ingestão Kafka",
    s4_metric2: "Atraso do Grupo de Partições",
    s4_metric3: "Brokers Online",
    s4_metric4: "Taxa de Compressão lz4",
    s4_metric5: "Alocação de Buffer",
    s4_metric6: "Fator de Replicação",

    // Step 5: Databricks
    s5_name: "Passo 5: ETL com Estado no Databricks",
    s5_short: "ETL Databricks",
    s5_desc: "Limpa, normaliza e junta dados de telemetria com arquivos de topologia de clientes no Delta Lake.",
    s5_impact: "Reduz custos de computação em nuvem bruta em 65% através de filtragem precoce de ruído e armazenamento delta.",
    s5_insight: "Extrai sinais físicos puros a partir de ruídos elétricos de fundo, possibilitando entradas limpas ao modelo.",
    s5_sub: "Refinador Spark no Delta Lake",
    s5_group: "CAMADA DE REFINARIA DE DADOS",
    s5_roi_highlight: "Reduz contas de banco de dados e armazenamento de IA em 65% ao descartar estática de fundo inútil.",
    s5_calc1: "Executa lotes de streaming Spark de alta velocidade para limpar, normalizar e mesclar dados.",
    s5_calc2: "Filtra 94% do ruído eletromagnético de fundo irrelevante instantaneamente.",
    s5_calc3: "Armazena vetores limpos estruturados no formato Parquet colunar otimizado dentro do Delta Lake.",
    s5_metric1: "Taxa de Deduplicação",
    s5_metric2: "Latência do Delta Lake",
    s5_metric3: "Carga de Cluster Spark",
    s5_metric4: "Conjuntos de Features Ativos",
    s5_metric5: "Ruído Descartado",
    s5_metric6: "Conformidade de Schema",

    // Step 6: Beegol AI
    s6_name: "Passo 6: Resultados na Nuvem e RCA Beegol",
    s6_short: "Nuvem Beegol",
    s6_desc: "Envia features limpas para a Rede Neural Profunda da Beegol para identificar as causas raiz exatas.",
    s6_impact: "Evita diretamente 30% de envios desnecessários de técnicos, otimizando drasticamente as operações e o NPS.",
    s6_insight: "Identifica a causa raiz exata: diferencia danos físicos nos cabos dos clientes de ruídos de interferência regional ampla.",
    s6_sub: "Mecanismo RCA de Rede Neural Gráfica (GNN)",
    s6_group: "REDE DE APRENDIZADO PROFUNDO",
    s6_roi_highlight: "Automatiza a resolução de problemas, evitando técnicos dispendiosos via ajustes de canal silenciosos.",
    s6_calc1: "Alimenta matrizes de features limpas no modelo de Rede Neural Profunda da Beegol Cloud.",
    s6_calc2: "Executa análise de Rede Neural Gráfica (GNN) para localizar falhas coaxiais físicas com precisão de ±2.4 metros.",
    s6_calc3: "Aciona alterações automáticas de canal Wi-Fi ou gera ordens de serviço detalhadas para engenharia.",
    s6_metric1: "Precisão Neural RCA",
    s6_metric2: "Tempo de Diagnóstico",
    s6_metric3: "Gatilhos de Auto-Correção",
    s6_metric4: "Confiança de Flap de Canal",
    s6_metric5: "Alertas de Campo Ativos",
    s6_metric6: "Taxa de Aprendizado Alpha",

    // Added high-fidelity HUD & Legend translation keys
    active_pipeline_badge: "PIPELINE ATIVO",
    header_sub: "PIPELINE DE IA DE TELECOMUNICAÇÕES ORIENTADO A DOMÍNIO • FEV 2026",
    market_title: "MERCADO: Telecom Italia",
    interaction_title: "INTERAÇÃO DO FLUXO DE CICLO DE VIDA",
    interaction_sub: "Telemetria de CPE para Resultados da Nuvem Beegol",
    sim_title: "Simulação do Ciclo de Vida do Pipeline de Telemetria e Economias AuraOps",
    step_badge_prefix: "PASSO",
    step_prefix: "Passo",

    legend_cpe: "Cliente de Borda CPE",
    legend_gpon: "Camada de Acesso GPON",
    legend_metro: "Transporte do Core Metro",
    legend_mgmt: "Gerenciamento e Controle",
    legend_ingest: "Ingestão de Telemetria (Kafka)",
    legend_ai: "IA Beegol / Motor de RCA",

    kafka_flow_control: "CONTROLE DE FLUXO DE TÓPICOS KAFKA",
    interactive_badge: "Interativo",
    modem_telemetry_flow: "Fluxo de Telemetria de Modem",
    hifi_docs_flow: "Fluxo de Docs de Alta Fidelidade",
    topic_label: "Tópico:",
    optimized_label: "Otimizado",
    congested_label: "Congestionado",
    latency_impact: "Aumento de Latência:"
  },
  it: {
    // Header
    beegol_auraops: "Beegol AuraOps",
    active_pipeline: "PIPELINE ATTIVO",
    domain_oriented_subtitle: "PIPELINE DI IA PER TELECOMUNICAZIONI ORIENTATO AL DOMINIO • FEB 2026",
    market: "MERCATO: Telecom Italia",
    roi_target: "OBIETTIVO ROI: 480% (Anno 3)",
    v5_4_aura: "v5.4-AURA",
    lifecycle_flow_interaction: "INTERAZIONE DEL FLUSSO DEL CICLO DI VITA",
    cpe_telemetry_subtitle: "// Telemetria CPE per i Risultati Cloud Beegol",
    simulation_title: "Simulazione del Ciclo de Vita della Pipeline di Telemetria e Risparmio AuraOps",
    pause_auto_cycle: "PAUSA AUTO-CICLO",
    auto_cycle_flow: "FLUSSO AUTO-CICLO",
    next_step: "Passo Successivo",
    reset_to_step_1: "Ripristina al Passo 1",
    step_indicator: "PASSO",

    // Metrics
    kafka_ingest: "Throughput Ingestione Kafka",
    beegol_ml_rca: "Precisione RCA ML Beegol",
    automated_self_heals: "Auto-Risoluzioni Automatizzate",
    tim_opex_retained: "OpEx Trattenuto da TIM",
    per_month: " / mese",
    per_year: " / anno",
    devices_hr: " disp./ora",

    // Fault Visualizer
    preemptive_fault: "Visualizzatore di Guasti Preliminare",
    live_dielectric: "MONITOR DIELETTRICO IN TEMPO REALE",
    raw_phy: "Spettro di Frequenza SNR PHY Grezzo",
    stable: "STABILE",
    center_freq: "Frequenza Centrale",
    total_dist: "Distorsione Totale",
    tim_opex_reduction: "RIDUZIONE DIRETTA OPEX TIM",
    tim_opex_reduction_desc: "Evita l'invio di tecnici per falsi allarmi, risparmiando sui costi di spedizione per TIM e sull'elaborazione cloud per Beegol.",
    truck_dispatches: "SPEDIZIONI TECNICI",
    ai_diagnostics_core: "Core di Diagnostica IA",
    ai_diagnostics_desc: "Testa i vettori di telemetria avviando direttamente l'analisi della linea fisica basata su GNN.",
    gen_diagnostic_report: "GENERA REPORT DIAGNOSTICO",
    processing_phy: "Elaborazione dei registri PHY...",
    calc_gnn: "Calcolo del grafico di covarianza GNN...",
    ready_telemetry: "Pronto a ricevere i parametri del vettore di telemetria. Premi genera qui sopra per iniziare la simulazione.",
    inference_outcome: "Risultato del Report di Inferenza",
    diagnostics_success_result: "SUCCESSO: Isolata piegatura fisica della schermatura coassiale sul terminale stradale #419-B. Mitigato dal cambio automatico del canale Wi-Fi da 6 a 11. Nessun invio di tecnici richiesto.",

    // Terminal
    platform_logs_header: "Registri di Piattaforma e Syslog Stream",
    live_sockets: "// Socket Attivi",
    terminal_connected: "SOCKET TELEMETRIA INFRASTRUTTURA TIM CONNESSO // CONFORME AL TESTO DA 22PX",
    heartbeat_ok: "HEARTBEAT: impulso di sincronizzazione socket attivo ... OK",

    // Map Simulation HUD
    carrier_topo_explorer: "AURAOPS CARRIER TOPO EXPLORER",
    active_nodes_only: "Solo Nodi Attivi",
    realtime_sync: "LATENZA: 0.28ms // SINCRONIZZAZIONE REALTIME",
    drag_node: "TRASCINA",
    cpe_edge_client: "CLIENTE DI BORDA CPE",
    gpon_access: "DISTRIBUZIONE GPON/ACCESSO",
    metro_core: "CORE METROPOLITANO",
    mgmt_control: "CONTROLLO DI GESTIONE",
    telemetry_ingest: "INGESTIONE TELEMETRIA",
    beegol_gnn_ai: "BEEGOL GNN IA",
    beegol_core_badge: "CORE BEEGOL",
    drag_relocate: "Trascina e riposiziona il nodo sulla griglia",

    // Sidebar Panels
    roi_partnership_highlight: "ROI PARTNERSHIP EVIDENZIATO",
    business_value_details: "VALORE COMMERCIALE / DETTAGLI ROI",
    eng_pipeline_calcs: "PIPELINE DI INGEGNERIA / CALCOLI",
    step_perf_metrics: "Metriche di Prestazione del Passo",
    direct_impact: "// Impatto Diretto",
    active_telemetry_stream: "Flusso di telemetria attivo",
    savings_roi_label: "Risparmio / ROI",
    operation_label: "Operazione",
    outcome_label: "Risultato",

    // Step Translations
    // Step 1: CPE
    s1_name: "Passo 1: Cattura di Bordo su CPE Residenziale",
    s1_short: "CPE dell'Abbonato",
    s1_desc: "Acquisisce parametri grezzi del livello fisico a intervalli di 1 secondo dai modem a banda larga e dai set-top box video.",
    s1_impact: "Le chiamate di supporto si riducono del 35% grazie alle diagnosi proattive di linea.",
    s1_insight: "Aggira i lenti cicli di polling per estrarre i parametri radio/ottici grezzi direttamente dal firmware RDK.",
    s1_sub: "Acquisizione di Bordo e Sonde Driver",
    s1_group: "HARDWARE DI BORDA DEL CLIENTE",
    s1_roi_highlight: "Consente enormi risparmi per TIM (calo del 35% delle uscite dei tecnici) consentendo a Beegol di scalare in modo efficiente.",
    s1_calc1: "Estrae il rumore di fondo Wi-Fi, la potenza ottica Rx e i registri FEC dal kernel del router a intervalli di 1s.",
    s1_calc2: "Compila il modulo di telemetria direttamente nel firmware del gateway open source RDK-B o prplMesh.",
    s1_calc3: "Memorizza localmente le anomalie in RAM per ridurre al minimo la banda di caricamento WAN durante i picchi.",
    s1_metric1: "Rumore di Fondo Wi-Fi",
    s1_metric2: "Potenza Ottica Rx",
    s1_metric3: "Media RSSI Wi-Fi",
    s1_metric4: "FEC Non Correggibile",
    s1_metric5: "Carico CPU CPE",
    s1_metric6: "Perdita Memoria CPE",

    // Step 2: GPON
    s2_name: "Passo 2: GPON OLT e Aggregazione di Bordo",
    s2_short: "GPON e Borda",
    s2_desc: "Aggrega massiccia telemetria fisica su terminali di linea ottica (OLT) e router virtuali CCAP di bordo.",
    s2_impact: "Consolida le dipendenze hardware, risparmiando il 15% sui costi di manutenzione dell'infrastruttura.",
    s2_insight: "Raggruppa gli abbonati in base ai ripartitori di fibra ottica, isolando i guasti generali della rete PON.",
    s2_sub: "Aggregazione Fibra GPON",
    s2_group: "LIVELLO DI ACCESSO E GPON",
    s2_roi_highlight: "Riduce i reclami di supporto duplicati identificando immediatamente le interruzioni della fibra dorsale.",
    s2_calc1: "Aggrega frame grezzi su router vCCAP (virtual CCAP) e Terminali di Linea Ottica GPON (OLT).",
    s2_calc2: "Inserisce intestazioni geografiche sui nodi locali per mappare spazialmente i ripartitori.",
    s2_calc3: "Filtra il rumore dei singoli dispositivi per identificare il degrado fisico delle dorsali in fibra ottica.",
    s2_metric1: "Capacità del Link Aggregato",
    s2_metric2: "Porte in Fibra Attive",
    s2_metric3: "Latenza del Gateway di Bordo",
    s2_metric4: "Rapporto Pacchetti Persi",
    s2_metric5: "Jitter di Upstream PHY",
    s2_metric6: "Ripartitore di Potenza EPON",

    // Step 3: USP
    s3_name: "Passo 3: Piano di Controllo USP MQTT",
    s3_short: "Broker USP / MQTT",
    s3_desc: "Garantisce il trasporto sicuro delle modifiche di stato asincrone tramite il protocollo TR-369 USP.",
    s3_impact: "Sostituisce i pesanti e lenti polling HTTP con eventi asincroni istantanei, riducendo il carico del server del 45%.",
    s3_insight: "Sfrutta formati Protobuf serializzati in binario per ridurre al minimo l'impatto sulla larghezza di banda WAN.",
    s3_sub: "Broker TR-369 USP Sicuro",
    s3_group: "PROTOCOLLO E CONTROLLORE",
    s3_roi_highlight: "Riduce i costi di traffico dati cloud dell'84% eliminando il pesante polling XML TR-069.",
    s3_calc1: "Serializza i cambiamenti di stato della telemetria in payload Protobuf binari estremamente compatti.",
    s3_calc2: "Mantiene socket persistenti e leggeri su MQTT con un sovraccarico di heartbeat minimo.",
    s3_calc3: "Invia notifiche USP asincrone, evitando l'accumulo di code sui server SOAP XML.",
    s3_metric1: "Sessioni USP Attive",
    s3_metric2: "Profondità di Coda Broker",
    s3_metric3: "Velocità Handshake TLS",
    s3_metric4: "Stato Socket MQTT",
    s3_metric5: "Fallback TR-069 Legacy",
    s3_metric6: "Intervallo di Heartbeat",

    // Step 4: Kafka
    s4_name: "Passo 4: Ingestione Kafka e Stream di Coda",
    s4_short: "Stream Kafka",
    s4_desc: "Ingloba flussi di telemetria ad altissima frequenza in gruppi di partizioni con alta disponibilità assoluta.",
    s4_impact: "Garantisce la disponibilità della telemetria al 99.999% durante improvvisi guasti meteorologici regionali.",
    s4_insight: "Raggruppa in memoria i parametri di rete, fungendo da autostrada ultraveloce per gli algoritmi di IA di Beegol.",
    s4_sub: "Streamer di Partizioni ad Alta Disponibilità",
    s4_group: "PIANO DI INGESTIONE EVENTI",
    s4_roi_highlight: "Garantisce gli obiettivi SLA prevenendo la perdita di pacchetti durante le grandi tempeste di rete.",
    s4_calc1: "Bilancia milioni di flussi in ingresso su 120 cluster di partizioni Kafka in modo uniforme.",
    s4_calc2: "Raggruppa i payload di telemetria con codec veloci di compressione lz4 non bloccanti.",
    s4_calc3: "Sincronizza i record su 3 broker distribuiti per mantenere una tolleranza ai guasti a 3 vie.",
    s4_metric1: "Velocità di Ingestione Kafka",
    s4_metric2: "Ritardo Gruppo Partizioni",
    s4_metric3: "Broker Online",
    s4_metric4: "Rapporto Compressione lz4",
    s4_metric5: "Allocazione del Buffer",
    s4_metric6: "Fattore di Replicazione",

    // Step 5: Databricks
    s5_name: "Passo 5: ETL con Stato su Databricks",
    s5_short: "ETL Databricks",
    s5_desc: "Pulisce, normalizza e unisce i dati di telemetria con i file di topologia dei clienti in Delta Lake.",
    s5_impact: "Riduce del 65% i costi lordi di elaborazione cloud grazie alla rimozione precoce del rumore statico.",
    s5_insight: "Estrae segnali fisici puri dal rumore elettrico di fondo, consentendo input puliti al modello di IA.",
    s5_sub: "Raffinatore Spark su Delta Lake",
    s5_group: "LIVELLO DI RAFFINERIA DATI",
    s5_roi_highlight: "Riduce la bolletta di archiviazione dei database di IA del 65% scartando l'elettricità statica inutile.",
    s5_calc1: "Esegue streaming Spark ad alta velocità per pulire, normalizzare e fondere i dati di rete.",
    s5_calc2: "Filtra istantaneamente il 94% del rumore elettromagnetico di fondo irrilevante.",
    s5_calc3: "Memorizza vettori strutturati puliti in formato Parquet colunare ottimizzato all'interno di Delta Lake.",
    s5_metric1: "Rapporto di Deduplica",
    s5_metric2: "Latenza Delta Lake",
    s5_metric3: "Carico Cluster Spark",
    s5_metric4: "Set di Features Attivi",
    s5_metric5: "Rumore Scartato",
    s5_metric6: "Conformità dello Schema",

    // Step 6: Beegol AI
    s6_name: "Passo 6: Risultati Cloud e RCA Beegol",
    s6_short: "Cloud Beegol",
    s6_desc: "Invia le caratteristiche pulite nella rete neurale profonda di Beegol Cloud per individuare la causa esatta.",
    s6_impact: "Evita direttamente il 30% delle uscite non necessarie dei tecnici, ottimizzando le operazioni e l'esperienza cliente.",
    s6_insight: "Individua l'esatta causa principale: distingue i danni fisici ai cavi dell'utente dall'interferenza regionale.",
    s6_sub: "Motore RCA a Rete Neurale Grafica (GNN)",
    s6_group: "RETE DI APPRENDIMENTO PROFONDO",
    s6_roi_highlight: "Automatizza la risoluzione dei problemi, evitando costosi interventi tecnici grazie a cambi di canale silenziosi.",
    s6_calc1: "Invia matrici di caratteristiche pulite nel modello di Rete Neurale Profonda di Beegol Cloud.",
    s6_calc2: "Esegue l'analisi GNN (Graph Neural Network) per localizzare guasti coassiali fisici entro ±2.4 metri.",
    s6_calc3: "Avvia modifiche automatiche del canale Wi-Fi o genera ordini di lavoro ingegneristici dettagliati.",
    s6_metric1: "Precisione Neurale RCA",
    s6_metric2: "Tempo di Diagnosi",
    s6_metric3: "Attivazioni Auto-Risoluzione",
    s6_metric4: "Affidabilità Flap Canale",
    s6_metric5: "Allarmi di Campo Attivi",
    s6_metric6: "Tasso Apprendimento Alpha",

    // Added high-fidelity HUD & Legend translation keys
    active_pipeline_badge: "PIPELINE ATTIVA",
    header_sub: "PIPELINE DI IA PER TELECOMUNICAZIONI ORIENTATO AL DOMINIO • FEB 2026",
    market_title: "MERCATO: Telecom Italia",
    interaction_title: "INTERAZIONE DEL FLUSSO DEL CICLO DI VITA",
    interaction_sub: "Telemetria CPE per i Risultati Cloud Beegol",
    sim_title: "Simulazione del Ciclo de Vita della Pipeline di Telemetria e Risparmio AuraOps",
    step_badge_prefix: "PASSO",
    step_prefix: "Passo",

    legend_cpe: "Cliente Edge CPE",
    legend_gpon: "Livello di Accesso GPON",
    legend_metro: "Trasporto Metro Core",
    legend_mgmt: "Gestione e Controllo",
    legend_ingest: "Ingestione Telemetria (Kafka)",
    legend_ai: "IA Beegol / Motore RCA",

    kafka_flow_control: "CONTROLLO FLUSSO DEI TOPIC KAFKA",
    interactive_badge: "Interattivo",
    modem_telemetry_flow: "Flusso Telemetria Modem",
    hifi_docs_flow: "Flusso Docs Alta Fedeltà",
    topic_label: "Topic:",
    optimized_label: "Ottimizzato",
    congested_label: "Congestionato",
    latency_impact: "Impatto Latenza:"
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("beegol_lang") as Language;
      if (savedLang && ["en", "pt", "it"].includes(savedLang)) {
        return savedLang;
      }
      const browserLang = navigator.language.split("-")[0].toLowerCase();
      if (["pt", "it", "en"].includes(browserLang)) {
        return browserLang as Language;
      }
    }
    return "en";
  });
  const [theme, setThemeState] = useState<Theme>("dark");

  // New Simulation States
  const [filterBarrier, setFilterBarrier] = useState<FilterBarrier>("before-kafka");
  const [protocolMode, setProtocolMode] = useState<ProtocolMode>("tr369");
  const [activeRemediation, setActiveRemediation] = useState<string | null>(null);
  const [backpressureValue, setBackpressureValue] = useState<number>(14);

  // Load from localStorage if present
  useEffect(() => {
    const savedTheme = localStorage.getItem("beegol_theme") as Theme;
    if (savedTheme && ["dark", "light"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("beegol_lang", lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("beegol_theme", newTheme);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider 
      value={{ 
        language, 
        theme, 
        setLanguage, 
        setTheme, 
        t,
        filterBarrier,
        setFilterBarrier,
        protocolMode,
        setProtocolMode,
        activeRemediation,
        setActiveRemediation,
        backpressureValue,
        setBackpressureValue
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
