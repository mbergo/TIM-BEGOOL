import React, { useState } from "react";
import { useApp, Language } from "../context/AppContext";

// ==================== INTERACTIVE VOCABULARY DATABASE ====================
export const VOCABULARY_REGISTRY_LOCALIZED: Record<Language, Record<string, { 
  title: string; 
  def: string; 
  category: "Hardware" | "Protocol" | "Platform" | "Physics" | "AI/ML"; 
  gain: string 
}>> = {
  en: {
    "CPE": {
      title: "Customer Premises Equipment (CPE)",
      def: "Physical hardware (home Wi-Fi routers, broadband fiber modems, or DSL gateways) situated at the customer's property.",
      category: "Hardware",
      gain: "Eliminates unnecessary physical technician dispatches ('truck rolls') by performing remote signal audits."
    },
    "GPON": {
      title: "Gigabit Passive Optical Network (GPON)",
      def: "A fiber-optic network access standard delivering gigabit-speed data down to subscribers using optical splitter cables.",
      category: "Physics",
      gain: "Enables multi-megabit continuous upstream diagnostic data without degrading active consumer internet connections."
    },
    "OLT": {
      title: "Optical Line Terminal (OLT)",
      def: "The provider's central endpoint hardware in a fiber network. It converts optical fiber light waves into standard digital network packets.",
      category: "Hardware",
      gain: "Isolates trunk fiber failures from single-customer home issues instantaneously."
    },
    "vCCAP": {
      title: "Virtual Converged Cable Access Platform (vCCAP)",
      def: "A software-based version of physical cable routers running on virtual servers to process broadband signals at huge scale.",
      category: "Platform",
      gain: "Replaces millions in physical routing hardware with automated, auto-scalable edge computing processes."
    },
    "USP": {
      title: "User Services Platform (USP / TR-369)",
      def: "The state-of-the-art asynchronous messaging standard designed to communicate with, manage, and monitor smart home gateways and routers.",
      category: "Protocol",
      gain: "Reduces server query latency and cuts raw management overhead bandwidth by up to 84%."
    },
    "MQTT": {
      title: "Message Queuing Telemetry Transport (MQTT)",
      def: "An ultra-lightweight, publish-subscribe messaging protocol. Perfect for low-bandwidth, high-density IoT telemetry streams.",
      category: "Protocol",
      gain: "Keeps constant real-time router reporting silent and highly power-efficient without lagging home hardware."
    },
    "TR-069": {
      title: "Technical Report 069 (Legacy CWMP)",
      def: "A legacy device management protocol from the early 2000s relying on heavy XML SOAP messaging over HTTP, requiring slow, manual server polling.",
      category: "Protocol",
      gain: "Obsolete. Replaced by TR-369 USP to avoid server crashes during large regional outages."
    },
    "TR-369": {
      title: "Technical Report 369 (Modern USP)",
      def: "The modern standard replacing TR-069. Built to handle millions of active home devices concurrently with fast, asynchronous binary protobuf messages.",
      category: "Protocol",
      gain: "Enables sub-second diagnostics so provider customer support can instantly spot Wi-Fi interference."
    },
    "CWMP": {
      title: "CPE WAN Management Protocol (CWMP / TR-069)",
      def: "The older, slower XML-based management standard. Uses heavy query structures that load both routers and remote servers heavily.",
      category: "Protocol",
      gain: "Bypassed by Beegol to eliminate massive polling queues and heavy network traffic."
    },
    "SOAP": {
      title: "Simple Object Access Protocol (SOAP)",
      def: "A legacy message protocol based on XML. It is heavy and verbose, making it highly inefficient for continuous high-speed data streams.",
      category: "Protocol",
      gain: "Replaced by Protocol Buffers to shrink telemetry packet payloads by over 10x."
    },
    "Kafka": {
      title: "Apache Kafka Event Stream",
      def: "An enterprise-grade, distributed event-streaming pipeline capable of ingesting and routing billions of records per second.",
      category: "Platform",
      gain: "Serves as the high-speed shock-absorber, buffering telemetry from millions of routers before it hits databases."
    },
    "Databricks": {
      title: "Databricks Unified Data Platform",
      def: "A cloud-based platform optimized for processing raw physical data feeds and organizing them into clean data lakes.",
      category: "Platform",
      gain: "Automates the heavy lifting of parsing unstructured electrical frequencies into structured databases."
    },
    "ETL": {
      title: "Extract, Transform, Load (ETL)",
      def: "The process of extracting raw data, transforming (cleaning, parsing, and filtering) it, and loading it into a final analysis database.",
      category: "Platform",
      gain: "Strips away 94% of irrelevant background electromagnetic noise so the AI only analyzes relevant signal anomalies."
    },
    "Delta Lake": {
      title: "Delta Lake Storage Layer",
      def: "An advanced, high-performance storage layer that organizes data in a highly compressed columnar layout (Parquet) for rapid access.",
      category: "Platform",
      gain: "Enables instant retrieval of historical Wi-Fi patterns, allowing models to identify long-term signal trends."
    },
    "RCA": {
      title: "Root Cause Analysis (RCA)",
      def: "The process of analyzing telemetry signals to pinpoint the exact root physical defect in a connection.",
      category: "Physics",
      gain: "Instantly tells operators if a user's connection is slow because of a cut cable outside, or simply a microwave interfering inside."
    },
    "DNN": {
      title: "Deep Neural Network (DNN)",
      def: "An artificial intelligence architecture containing layered artificial neurons. Used to detect patterns within complex statistical datasets.",
      category: "AI/ML",
      gain: "Identifies anomalies that traditional software rules miss, but lacks physical system context."
    },
    "GNN": {
      title: "Graph Neural Network (GNN)",
      def: "A cutting-edge AI architecture specialized in analyzing networks modeled as graphs (like interconnected fiber nodes, splitters, and routers).",
      category: "AI/ML",
      gain: "Calculates how physical street defects spill over to affect adjacent homes, mapping exact fault locations to within ±2.4 meters."
    },
    "OFDMA": {
      title: "Orthogonal Frequency Division Multiple Access",
      def: "A modern Wi-Fi standard that splits a single Wi-Fi channel into hundreds of small sub-channels to transmit data to multiple devices concurrently.",
      category: "Physics",
      gain: "Enables custom driver probes to measure actual raw frequency spectrum interference in real-time."
    },
    "PHY": {
      title: "Physical Layer (PHY Registers)",
      def: "The actual physical layer of hardware connection. PHY registers track micro-vibrations, laser power levels, and copper wire voltages directly.",
      category: "Physics",
      gain: "Bypasses slow operating system layers to fetch exact physical state variables within microseconds."
    },
    "SNR": {
      title: "Signal-to-Noise Ratio (SNR)",
      def: "A ratio comparing the strength of the desired network signal to the background static electrical noise.",
      category: "Physics",
      gain: "A low SNR indicates a degrading connection, allowing the system to auto-correct frequencies before a subscriber notices any slowdown."
    },
    "FEC": {
      title: "Forward Error Correction (FEC)",
      def: "A math technique where the sender inserts redundant error-correction data, allowing the receiver to fix bit errors automatically.",
      category: "Physics",
      gain: "Enables lines to remain active and fast despite minor physical copper or laser degradation."
    },
    "RDK": {
      title: "Reference Design Kit (RDK / RDK-B)",
      def: "The open-source, standardized Linux-based operating system framework used to power millions of high-end home broadband routers.",
      category: "Platform",
      gain: "Enables Beegol to compile custom telemetry modules directly into the router's operating system kernel."
    }
  },
  pt: {
    "CPE": {
      title: "Equipamento de Instalação do Cliente (CPE)",
      def: "Hardware físico (roteadores Wi-Fi residenciais, modems de fibra óptica ou gateways DSL) instalados no imóvel do cliente.",
      category: "Hardware",
      gain: "Elimina visitas desnecessárias de técnicos ('truck rolls') realizando auditorias de sinal remotas."
    },
    "GPON": {
      title: "Rede Óptica Passiva com Capacidade de Gigabit (GPON)",
      def: "Padrão de acesso à internet por fibra óptica que entrega velocidades de gigabit por meio de cabos divisores ópticos (splitters).",
      category: "Physics",
      gain: "Permite telemetria de diagnóstico contínua e veloz sem degradar a conexão ativa do consumidor."
    },
    "OLT": {
      title: "Terminal de Linha Óptica (OLT)",
      def: "O hardware central do provedor em uma rede de fibra. Ele converte os sinais de luz da fibra óptica em pacotes de rede digitais padrão.",
      category: "Hardware",
      gain: "Isola falhas no tronco de fibra óptica de problemas domésticos de um único cliente instantaneamente."
    },
    "vCCAP": {
      title: "Plataforma de Acesso a Cabo Convergente Virtual (vCCAP)",
      def: "Uma versão baseada em software dos roteadores de cabo físicos rodando em servidores virtuais para processar sinais em larga escala.",
      category: "Platform",
      gain: "Substitui milhões em hardware físico por processos de computação de borda escaláveis e automatizados."
    },
    "USP": {
      title: "Plataforma de Serviços ao Usuário (USP / TR-369)",
      def: "O padrão de mensagens assíncronas projetado para se comunicar com, gerenciar e monitorar gateways e roteadores residenciais inteligentes.",
      category: "Protocol",
      gain: "Reduz a latência de consultas e corta a largura de banda de gerenciamento bruta em até 84%."
    },
    "MQTT": {
      title: "Transporte de Telemetria de Fila de Mensagens (MQTT)",
      def: "Um protocolo de mensagens extremamente leve de publicação-assinatura. Perfeito para telemetria IoT de baixa largura de banda e alta densidade.",
      category: "Protocol",
      gain: "Mantém os relatórios em tempo real silenciosos e eficientes sem sobrecarregar os roteadores residenciais."
    },
    "TR-069": {
      title: "Technical Report 069 (CWMP Legado)",
      def: "Protocolo legado de gerenciamento de dispositivos baseado em XML SOAP sobre HTTP, exigindo consultas manuais e lentas dos servidores.",
      category: "Protocol",
      gain: "Obsolete. Substituído pelo TR-369 USP para evitar travamentos de servidores durante grandes quedas regionais."
    },
    "TR-369": {
      title: "Technical Report 369 (USP Moderno)",
      def: "O padrão moderno que substitui o TR-069. Projetado para lidar com milhões de conexões simultâneas usando mensagens binárias Protobuf assíncronas e rápidas.",
      category: "Protocol",
      gain: "Habilita diagnósticos subsegundo para que o suporte identifique interferências de Wi-Fi instantaneamente."
    },
    "CWMP": {
      title: "Protocolo de Gerenciamento de WAN CPE (CWMP / TR-069)",
      def: "O padrão mais antigo baseado em XML. Utiliza estruturas pesadas de consulta que sobrecarregam os roteadores e servidores remotos.",
      category: "Protocol",
      gain: "Ignorado pela Beegol para eliminar grandes filas de polling e tráfego de rede excessivo."
    },
    "SOAP": {
      title: "Simple Object Access Protocol (SOAP)",
      def: "Um protocolo legado baseado em XML. É pesado e prolixo, tornando-o altamente ineficiente para fluxos de dados de alta velocidade.",
      category: "Protocol",
      gain: "Substituído por Protocol Buffers para encolher os payloads das mensagens em mais de 10 vezes."
    },
    "Kafka": {
      title: "Barramento de Eventos Apache Kafka",
      def: "Pipeline de streaming de eventos distribuída e de nível empresarial, capaz de ingerir e rotear bilhões de registros por segundo.",
      category: "Platform",
      gain: "Funciona como um amortecedor de alta velocidade, acumulando telemetria de milhões de roteadores antes de enviá-la aos bancos de dados."
    },
    "Databricks": {
      title: "Plataforma Unificada de Dados Databricks",
      def: "Plataforma em nuvem otimizada para processar grandes volumes de dados brutos e organizá-los em lagos de dados de forma ágil.",
      category: "Platform",
      gain: "Automatiza a estruturação e análise de espectros elétricos complexos e piso de ruído em bancos de dados limpos."
    },
    "ETL": {
      title: "Extrair, Transformar, Carregar (ETL)",
      def: "O processo de extração de dados brutos, transformação (limpeza, normalização e filtragem) e carregamento em um banco de dados de destino.",
      category: "Platform",
      gain: "Remove 94% dos ruídos elétricos irrelevantes para que a IA analise apenas anomalias reais."
    },
    "Delta Lake": {
      title: "Camada de Armazenamento Delta Lake",
      def: "Uma camada de armazenamento avançada e de alto desempenho que organiza dados em tabelas colunares compactadas (Parquet).",
      category: "Platform",
      gain: "Permite a recuperação instantânea de históricos de Wi-Fi, ajudando os modelos a identificar tendências de longo prazo."
    },
    "RCA": {
      title: "Análise de Causa Raiz (RCA)",
      def: "O processo de análise de sinais de telemetria para identificar e isolar o defeito físico exato em uma conexão de rede.",
      category: "Physics",
      gain: "Informa instantaneamente se a lentidão ocorre por um rompimento de cabo na rua ou por uma interferência doméstica de eletrodomésticos."
    },
    "DNN": {
      title: "Rede Neural Profunda (DNN)",
      def: "Arquitetura de inteligência artificial contendo várias camadas de neurônios. Usada para detectar padrões em conjuntos complexos.",
      category: "AI/ML",
      gain: "Identifica anomalias que regras tradicionais de software falham em perceber, mas carece do contexto de topologia física."
    },
    "GNN": {
      title: "Rede Neural Gráfica (GNN)",
      def: "Arquitetura de IA especializada na análise de redes modeladas como grafos (como nós de fibra interconectados, splitters e roteadores).",
      category: "AI/ML",
      gain: "Mapeia o efeito cascata de problemas físicos da rede de rua sobre as casas vizinhas, isolando defeitos em ±2.4 metros."
    },
    "OFDMA": {
      title: "Acesso Múltiplo por Divisão de Frequência Ortogonal",
      def: "Padrão de Wi-Fi moderno que divide um canal em centenas de subcanais menores para transmitir dados a vários aparelhos ao mesmo tempo.",
      category: "Physics",
      gain: "Permite que sondas de driver meçam interferências de frequências brutas diretamente em tempo real."
    },
    "PHY": {
      title: "Camada Física (Registradores PHY)",
      def: "A camada de conexão física real do hardware. Registradores PHY monitoram microvibrações, níveis de laser e voltagens elétricas diretamente.",
      category: "Physics",
      gain: "Ignora camadas lentas do sistema operacional para ler variáveis físicas da linha em microssegundos."
    },
    "SNR": {
      title: "Razão Sinal-Ruído (SNR)",
      def: "Métrica que compara a força do sinal de rede desejado com a estática elétrica e ruídos de fundo.",
      category: "Physics",
      gain: "Um SNR baixo indica degradação física, permitindo a correção automática antes mesmo que o cliente perceba lentidão."
    },
    "FEC": {
      title: "Correção de Erros Direta (FEC)",
      def: "Técnica matemática onde o transmissor insere dados redundantes para correção de erros, permitindo que o receptor conserte bits corrompidos.",
      category: "Physics",
      gain: "Permite que linhas permaneçam ativas e velozes apesar de pequenas degradações físicas em cabos ou lasers."
    },
    "RDK": {
      title: "Reference Design Kit (RDK / RDK-B)",
      def: "O sistema operacional padronizado de código aberto baseado em Linux usado para gerenciar e controlar milhões de roteadores residenciais avançados.",
      category: "Platform",
      gain: "Permite que a Beegol compile módulos de telemetria customizados diretamente no kernel do sistema operacional do roteador."
    }
  },
  it: {
    "CPE": {
      title: "Customer Premises Equipment (CPE)",
      def: "Hardware fisico (router Wi-Fi domestici, modem in fibra ottica o gateway DSL) installati presso l'abitazione del cliente.",
      category: "Hardware",
      gain: "Elimina gli invii non necessari di tecnici sul campo tramite audit remoti del segnale."
    },
    "GPON": {
      title: "Gigabit Passive Optical Network (GPON)",
      def: "Standard di accesso a banda larga in fibra ottica che distribuisce velocità Gigabit agli abbonati tramite splitter ottici.",
      category: "Physics",
      gain: "Consente l'invio continuo di dati diagnostici ad alta velocità senza degradare la connessione attiva."
    },
    "OLT": {
      title: "Optical Line Terminal (OLT)",
      def: "Hardware centrale del provider in una rete in fibra. Converte gli impulsi luminosi in pacchetti di rete digitali standard.",
      category: "Hardware",
      gain: "Isola istantaneamente i guasti alla dorsale in fibra rispetto ai singoli problemi domestici del cliente."
    },
    "vCCAP": {
      title: "Virtual Converged Cable Access Platform (vCCAP)",
      def: "Versione software dei router fisici per cavo coassiale in esecuzione su server virtuali per gestire segnali a grandissima scala.",
      category: "Platform",
      gain: "Sostituisce costosi router hardware con processi software di edge computing scalabili e automatizzati."
    },
    "USP": {
      title: "User Services Platform (USP / TR-369)",
      def: "Nuovo standard di messaggistica asincrona progettato per comunicare con, gestire e monitorare gateway e router domestici intelligenti.",
      category: "Protocol",
      gain: "Riduce la latenza dei server e taglia la banda di traffico gestionale fino all'84%."
    },
    "MQTT": {
      title: "Message Queuing Telemetry Transport (MQTT)",
      def: "Protocollo di messaggistica pub/sub estremamente leggero. Ideale per flussi di telemetria IoT a bassa banda e alta densità.",
      category: "Protocol",
      gain: "Mantiene l'invio di dati in tempo reale silenzioso ed efficiente, senza sovraccaricare l'hardware domestico."
    },
    "TR-069": {
      title: "Technical Report 069 (CWMP Legacy)",
      def: "Protocollo di gestione dei dispositivi legacy dei primi anni 2000, basato su XML SOAP su HTTP, che richiede pesanti polling periodici.",
      category: "Protocol",
      gain: "Obsoleto. Sostituito da TR-369 USP per evitare crash dei server durante interruzioni regionali di massa."
    },
    "TR-369": {
      title: "Technical Report 369 (USP Moderno)",
      def: "Standard moderno in sostituzione del TR-069. Gestisce milioni di dispositivi contemporaneamente tramite messaggi binari Protobuf asincroni.",
      category: "Protocol",
      gain: "Abilita diagnostiche sotto il secondo per individuare immediatamente le interferenze Wi-Fi."
    },
    "CWMP": {
      title: "CPE WAN Management Protocol (CWMP / TR-069)",
      def: "Standard precedente basato su XML. Utilizza strutture pesanti di query che caricano router e server remoti.",
      category: "Protocol",
      gain: "Evitato da Beegol per eliminare code di polling e traffico di rete non necessario."
    },
    "SOAP": {
      title: "Simple Object Access Protocol (SOAP)",
      def: "Protocollo legacy basato su XML. Molto pesante e verboso, inefficiente per lo streaming continuo di dati ad alta velocità.",
      category: "Protocol",
      gain: "Sostituto da Protocol Buffers per ridurre la dimensione dei pacchetti di oltre 10 volte."
    },
    "Kafka": {
      title: "Apache Kafka Event Stream",
      def: "Pipeline di streaming di eventi distribuita di livello enterprise, capace di ingerire e instradare miliardi di record al secondo.",
      category: "Platform",
      gain: "Funge da ammortizzatore ad alta velocità, accumulando i dati di milioni di router prima che raggiungano i database."
    },
    "Databricks": {
      title: "Databricks Unified Data Platform",
      def: "Piattaforma cloud ottimizzata per elaborare enormi flussi di dati fisici e organizzarli rapidamente in data lake strutturati.",
      category: "Platform",
      gain: "Automatizza la strutturazione di frequenze elettriche complesse in database puliti."
    },
    "ETL": {
      title: "Extract, Transform, Load (ETL)",
      def: "Processo di estrazione di dati grezzi, trasformazione (pulizia, normalizzazione) e caricamento in un database di analisi.",
      category: "Platform",
      gain: "Elimina il 94% del rumore elettrico irrilevante per consentire all'IA di analizzare solo anomalie reali."
    },
    "Delta Lake": {
      title: "Delta Lake Storage Layer",
      def: "Livello di archiviazione avanzato ad alte prestazioni che organizza i dati in layout compressi (Parquet) per accessi rapidissimi.",
      category: "Platform",
      gain: "Abilita il recupero immediato degli andamenti Wi-Fi storici, aiutando i modelli a riconoscere trend a lungo termine."
    },
    "RCA": {
      title: "Analisi Causa Radice (RCA)",
      def: "Processo di analisi dei segnali di telemetria per individuare e isolare l'esatto difetto fisico in una connessione.",
      category: "Physics",
      gain: "Informa istantaneamente se la lentezza è causata da un cavo interrotto in strada o da un'interferenza domestica."
    },
    "DNN": {
      title: "Deep Neural Network (DNN)",
      def: "Architettura di intelligenza artificiale con neuroni disposti su più livelli per identificare pattern in dataset complessi.",
      category: "AI/ML",
      gain: "Identifica anomalie sfuggite alle regole tradizionali, ma non dispone del contesto fisico di rete."
    },
    "GNN": {
      title: "Graph Neural Network (GNN)",
      def: "Architettura IA specializzata nell'analisi di reti modellate come grafi (come fibre ottiche, splitter e router interconnessi).",
      category: "AI/ML",
      gain: "Calcola l'effetto cascata dei guasti fisici stradali sulle case vicine, isolando la posizione del guasto entro ±2.4 metri."
    },
    "OFDMA": {
      title: "Orthogonal Frequency Division Multiple Access",
      def: "Standard Wi-Fi moderno che suddivide un singolo canale in centinaia di piccoli sub-canali per trasmettere a più dispositivi contemporaneamente.",
      category: "Physics",
      gain: "Abilita sonde driver personalizzate per misurare le interferenze dello spettro di frequenza in tempo reale."
    },
    "PHY": {
      title: "Physical Layer (Registri PHY)",
      def: "Livello di connessione fisica dell'hardware. I registri PHY tracciano micro-vibrazioni, livelli laser e tensioni del rame direttamente.",
      category: "Physics",
      gain: "Aggira i lenti livelli del sistema operativo per recuperare le variabili fisiche di stato in pochi microsecondi."
    },
    "SNR": {
      title: "Signal-to-Noise Ratio (SNR)",
      def: "Rapporto che confronta la forza del segnale utile con il rumore statico di fondo.",
      category: "Physics",
      gain: "Un basso SNR indica un degrado della connessione, consentendo al sistema di auto-risolvere prima che l'utente avverta rallentaggi."
    },
    "FEC": {
      title: "Forward Error Correction (FEC)",
      def: "Tecnica matematica per cui il mittente inserisce dati ridondanti di correzione, consentendo al ricevente di riparare i bit errati.",
      category: "Physics",
      gain: "Consente alle linee di rimanere attive e veloci nonostante lievi degradi fisici nel rame o nei laser."
    },
    "RDK": {
      title: "Reference Design Kit (RDK / RDK-B)",
      def: "Insieme standardizzato di software open-source basato su Linux utilizzato per gestire e controllare milioni di router a banda larga.",
      category: "Platform",
      gain: "Consente a Beegol di compilare moduli di telemetria personalizzati direttamente nel kernel del router."
    }
  }
};

interface GlossaryTermProps {
  word: string;
}

export function GlossaryTerm({ word }: GlossaryTermProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { language, theme } = useApp();
  const data = VOCABULARY_REGISTRY_LOCALIZED[language]?.[word] || VOCABULARY_REGISTRY_LOCALIZED.en[word];
  if (!data) return <span>{word}</span>;

  let badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
  if (data.category === "Hardware") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (data.category === "Physics") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
  if (data.category === "Protocol") badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  if (data.category === "AI/ML") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  const isLight = theme === "light";

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`cursor-help border-b border-dotted font-bold transition-colors duration-150 select-text ${
        isLight ? "border-sky-500 text-sky-700 hover:text-sky-900" : "border-sky-400 text-sky-300 hover:text-sky-100"
      }`}>
        {word}
      </span>
      
      {isHovered && (
        <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 w-80 border p-4 rounded-xl shadow-2xl block text-left font-sans normal-case tracking-normal whitespace-normal transition-all animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isLight ? "bg-white border-slate-300 text-slate-800" : "bg-slate-950 border-slate-800 text-slate-100"
        }`}>
          <span className={`flex items-center justify-between mb-2 pb-1.5 border-b ${isLight ? "border-slate-200" : "border-slate-900"}`}>
            <span className={`text-[12px] font-bold leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              {data.title}
            </span>
            <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${badgeColor}`}>
              {data.category}
            </span>
          </span>
          
          <span className={`text-[11px] leading-relaxed block mb-2 font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {data.def}
          </span>
          
          <span className={`border p-2 rounded-lg block ${isLight ? "bg-emerald-50/50 border-emerald-200/60" : "bg-emerald-500/5 border-emerald-500/15"}`}>
            <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-wider block font-black mb-0.5">
              {isLight ? "💰 BENEFÍCIO ROI" : "💰 Business Value Gain"}
            </span>
            <span className={`text-[10px] leading-snug block font-semibold ${isLight ? "text-emerald-700" : "text-emerald-300"}`}>
              {data.gain}
            </span>
          </span>
          
          <span className={`absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 border-r border-b rotate-45 block ${
            isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-800"
          }`} />
        </span>
      )}
    </span>
  );
}

// ==================== AUTO INTERACTIVE TEXT REPLACER ====================
export function renderInteractiveText(text: string): React.ReactNode {
  if (!text) return "";
  
  // Sort vocabulary keys by length descending to match longer multi-word phrases first
  const keys = Object.keys(VOCABULARY_REGISTRY_LOCALIZED.en).sort((a, b) => b.length - a.length);
  // Dynamic regex with boundary check
  const regex = new RegExp(`\\b(${keys.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join("|")})\\b`, "g");
  
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  
  return (
    <>
      {parts.map((part, idx) => {
        const isMatch = VOCABULARY_REGISTRY_LOCALIZED.en[part] !== undefined;
        if (isMatch) {
          return (
            <span key={idx} className="inline-block">
              <GlossaryTerm word={part} />
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}
