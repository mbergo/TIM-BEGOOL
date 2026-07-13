import { FlowStep } from "../types";

export function getLocalizedPipelineSteps(language: "en" | "pt" | "it"): FlowStep[] {
  if (language === "pt") {
    return [
      {
        id: "user-cpe",
        name: "Passo 1: Captura de Borda na CPE Residencial",
        shortName: "CPE do Assinante",
        description: "Captura métricas brutas da camada física em intervalos de 1 segundo a partir de modems banda larga e set-tops de vídeo.",
        sourceNodes: ["legacy", "rdkb", "prpl", "rdkv"],
        activeEdges: ["legacy", "rdkb", "prpl", "rdkv"],
        metrics: [
          { label: "Piso de Ruído Wi-Fi", value: "-96 dBm", status: "optimal" },
          { label: "Potência Óptica Rx", value: "-4.2 dBm", status: "nominal" },
          { label: "Média de RSSI Wi-Fi", value: "-68 dBm", status: "nominal" },
          { label: "FEC Incorrigível", value: "1.402 / seg", status: "warning" },
          { label: "Carga de CPU do CPE", value: "34.5%", status: "nominal" },
          { label: "Vazamento Memória CPE", value: "0.0 MB/h", status: "optimal" }
        ],
        technicalLogs: [
          "INIT: Agente de telemetria RDK-B escutando na interface phy0/phy1.",
          "DEBUG: Capturando beacons RSSI de 5 clientes residenciais ativos.",
          "WARN: Canal upstream 3 sofrendo micro-reflexões; SNR degradado.",
          "INFO: Daemon prplMesh reportando link mesh ideal no backhaul de 5GHz."
        ],
        ceoLogs: [
          "💰 ECONOMIA: Evita 1.450 visitas técnicas desnecessárias por mês, economizando para a Telecom Italia € 101.500/mês em combustível e mão de obra.",
          "🚀 O QUE FAZ: Inspeciona os sinais Wi-Fi domésticos em resolução ultra-rápida de 1 segundo sem sobrecarregar ou travar os modems do usuário.",
          "🎯 RESULTADO COMERCIAL: Resolve reclamações de Wi-Fi na primeira chamada, reduzindo o cancelamento de clientes (churn) em 35%."
        ],
        businessImpact: "Chamados de suporte são reduzidos em 35% por meio de diagnósticos proativos e preventivos de linha.",
        beegolInsight: "Ignora os ciclos lentos de polling para extrair parâmetros ópticos/de rádio brutos diretamente do firmware RDK."
      },
      {
        id: "access-transport",
        name: "Passo 2: OLT GPON e Agregação de Borda",
        shortName: "GPON e Borda",
        description: "Agrega telemetria física massiva em terminais de linha óptica (OLT) e bordas de roteadores virtuais CCAP.",
        sourceNodes: ["olt", "edge"],
        activeEdges: ["olt", "edge"],
        metrics: [
          { label: "Capacidade de Link Agregado", value: "100.0 Gbps", status: "optimal" },
          { label: "Portas de Fibra Ativas", value: "48 / 48 Ativas", status: "optimal" },
          { label: "Latência do Gateway de Borda", value: "1.2 ms", status: "optimal" },
          { label: "Taxa de Descarte de Pacotes", value: "0.001%", status: "nominal" },
          { label: "Jitter de Upstream PHY", value: "0.85 ms", status: "nominal" },
          { label: "Splitter de Potência EPON", value: "Proporção 1:64", status: "nominal" }
        ],
        technicalLogs: [
          "SUBSCRIBE: GPON OLT escutando chaves de registro ONT ativas.",
          "INFO: Status da interface de borda do provedor Bundle-Ether1 está UP.",
          "DEBUG: Agregando payload de telemetria em 12.402 dispositivos CPE.",
          "TRACE: Adicionando cabeçalhos geográficos aos pacotes de rede."
        ],
        ceoLogs: [
          "💰 ECONOMIA: Agrupa assinantes regionais de forma inteligente, evitando visitas técnicas individuais em falhas coletivas de rua. Economia de € 42.000/mês.",
          "🚀 O QUE FAZ: Isola instantaneamente se um bloco inteiro teve a fibra cortada ou se apenas o cabo de um cliente foi desconectado.",
          "🎯 RESULTADO COMERCIAL: Acelera a coordenação de reparos, economizando 15% em custos de manutenção e roteamento de infraestrutura."
        ],
        businessImpact: "Consolida dependências de hardware, economizando 15% em custos de manutenção de infraestrutura.",
        beegolInsight: "Agrupa assinantes dispersos por splitters de fibra, isolando falhas gerais de PON de problemas residenciais."
      },
      {
        id: "control-broker",
        name: "Passo 3: Plano de Controle USP MQTT",
        shortName: "Broker USP / MQTT",
        description: "Garante o transporte seguro de alterações de estado de telemetria assíncrona sobre o protocolo TR-369 USP.",
        sourceNodes: ["acs", "controller"],
        activeEdges: ["acs", "controller"],
        metrics: [
          { label: "Sessões USP Ativas", value: "12.402 Sessões", status: "optimal" },
          { label: "Profundidade de Fila Broker", value: "12 msgs", status: "optimal" },
          { label: "Velocidade do Handshake TLS", value: "14 ms", status: "nominal" },
          { label: "Status do Socket MQTT", value: "ESTABELECIDO", status: "optimal" },
          { label: "Fallback TR-069 Legado", value: "4%", status: "warning" },
          { label: "Intervalo de Heartbeat", value: "30 segundos", status: "nominal" }
        ],
        technicalLogs: [
          "CONNECT: Controlador USP registrou 12.402 sockets TLS simultâneos.",
          "INFO: Processando mensagens assíncronas contendo estatísticas de Wi-Fi.",
          "DEBUG: Redirecionando mensagens USP Protobuf para o tópico 'cpe.telemetry'.",
          "TRACE: Estabelecendo sessões CWMP SOAP legadas (TR-069) para 500 nós."
        ],
        ceoLogs: [
          "💰 ECONOMIA: Substitui consultas manuais lentas por atualizações instantâneas. Redução de 84% de banda, cortando custos com nuvem em € 18.000/mês.",
          "🚀 O QUE FAZ: Troca verificações pesadas de status em XML por transmissões binárias contínuas de estado ultraleves.",
          "🎯 RESULTADO COMERCIAL: Streams leves permitem que os servidores lidem facilmente com picos e interrupções sem derrubar o datacenter."
        ],
        businessImpact: "Substitui consultas HTTP lentas e pesadas por eventos assíncronos leves, economizando 45% de processamento nos servidores.",
        beegolInsight: "Aproveita formatos de Protobuf serializados em binário para minimizar o impacto na largura de banda da WAN."
      },
      {
        id: "kafka-cluster",
        name: "Passo 4: Ingestão de Kafka e Stream de Fila",
        shortName: "Stream do Kafka",
        description: "Ingere streams de telemetria de ultra-alta frequência (pré-filtrados via Apache MiNiFi para descartar 90% de ruído) em grupos de partições com alta disponibilidade absoluta.",
        sourceNodes: ["kafka"],
        activeEdges: ["kafka"],
        metrics: [
          { label: "Velocidade Ingestão Kafka", value: "150k msgs/s (Qualificadas)", status: "optimal" },
          { label: "Filtro Apache MiNiFi", value: "90% Descartado na Borda", status: "optimal" },
          { label: "Brokers Online", value: "12 / 12 Nós", status: "optimal" },
          { label: "Taxa de Compressão lz4", value: "2.8 : 1.0", status: "optimal" },
          { label: "Alocação de Buffer", value: "85% Livre", status: "nominal" },
          { label: "Fator de Replicação", value: "Sinc. 3 Vias", status: "optimal" }
        ],
        technicalLogs: [
          "PRODUCER: Fluxos de telemetria equilibrados em 120 blocos de partição.",
          "INFO: Apache MiNiFi filtou 1.35M msgs/s redundantes na borda; enviando apenas 150k msgs/s qualificadas.",
          "DEBUG: Topic 'telemetry.qualified.rdkb' batch.size de 200.000; linger.ms de 50.",
          "WARN: Partição 12 sofrendo leve pressão de I/O em disco; balanceamento automático realizado."
        ],
        ceoLogs: [
          "💰 ECONOMIA: A pré-filtragem local via Apache MiNiFi reduz os custos de tráfego WAN em 90% e economiza € 35.000/mês em infraestrutura Kafka.",
          "🚀 O QUE FAZ: Integra um micro-datalake distribuído na borda antes de enviar dados ao Kafka, descartando métricas estáticas repetitivas.",
          "🎯 RESULTADO COMERCIAL: Garante telemetria limpa e de alta qualidade (150k msgs/s qualificadas em vez de 1.5M/s cheias de ruído), otimizando o processamento."
        ],
        businessImpact: "Garante 99,999% de disponibilidade de telemetria reduzindo o tráfego de rede e custos de nuvem de forma drástica.",
        beegolInsight: "Utiliza agentes Apache MiNiFi integrados nas CPEs/OLTs para limpar dados redundantes na origem antes de atingirem o Kafka."
      },
      {
        id: "databricks-etl",
        name: "Passo 5: ETL com Estado no Databricks",
        shortName: "ETL Databricks",
        description: "Normaliza e junta dados de telemetria no Delta Lake para o caminho analítico, auditorias e treinamento de IA.",
        sourceNodes: ["etl", "drop"],
        activeEdges: ["etl", "drop"],
        metrics: [
          { label: "Taxa de Deduplicação", value: "Proporção 14:1", status: "optimal" },
          { label: "Latência do Delta Lake", value: "12.0 ms", status: "optimal" },
          { label: "Carga de Cluster Spark", value: "68.2%", status: "nominal" },
          { label: "Conjuntos de Features Ativos", value: "142 Features", status: "optimal" },
          { label: "Ruído Descartado", value: "94% Descartado", status: "optimal" },
          { label: "Conformidade de Schema", value: "100% Válido", status: "optimal" }
        ],
        technicalLogs: [
          "SPARK: Iniciando micro-batch de Structured Streaming #849204.",
          "INFO: Descartando 94% de parâmetros nulos/redundantes na fronteira do ETL.",
          "DEBUG: Unindo fluxo de telemetria bruta com placas físicas de fibra ativas.",
          "TRACE: Materializando matrizes de features em tempo real em arquivos Delta colunares."
        ],
        ceoLogs: [
          "💰 ECONOMIA: Filtra 94% de estática eletrônica inútil instantaneamente, encolhendo os custos de processamento em nuvem em € 48.000/mês.",
          "🚀 O QUE FAZ: Uma peneira inteligente que limpa o fluxo caótico de dados, gerando dados totalmente limpos para a Inteligência Artificial.",
          "🎯 RESULTADO COMERCIAL: Corta os custos de armazenamento e processamento em nuvem em 65%, mantendo um inventário limpo."
        ],
        businessImpact: "Reduz custos de computação em nuvem bruta em 65% através de filtragem precoce de ruído e armazenamento delta.",
        beegolInsight: "Enquanto a Beegol consome o Kafka diretamente em tempo real (hot path), o Databricks consolida o Delta Lake analítico (cold path)."
      },
      {
        id: "beegol-cloud",
        name: "Passo 6: Resultados na Nuvem e RCA Beegol",
        shortName: "Nuvem Beegol",
        description: "A Beegol consome diretamente do fluxo de tópicos Kafka para inferência de causa raiz (RCA) em sub-segundos.",
        sourceNodes: ["ai"],
        activeEdges: ["ai"],
        metrics: [
          { label: "Precisão Neural RCA", value: "98.42% Acc", status: "optimal" },
          { label: "Tempo de Diagnóstico", value: "150.0 ms", status: "optimal" },
          { label: "Gatilhos Auto-Correção", value: "1.842 / hora", status: "optimal" },
          { label: "Confiança de Flap de Canal", value: "99.1% Conf", status: "optimal" },
          { label: "Alertas de Campo Ativos", value: "14 Ativos", status: "nominal" },
          { label: "Taxa de Aprendizado Alpha", value: "0.001 Alpha", status: "nominal" }
        ],
        technicalLogs: [
          "BEEGOL_AI: Injetando vetor de features na rede neural de diagnóstico profundo.",
          "INFO: Identificado amassado físico no cabo coaxial do Segmento #419-B.",
          "SUCCESS: Confirmado flap localizado de canal Wi-Fi; enviado comando de auto-correção de canal.",
          "BEEGOL_AI: Fechando chamado #98214 automaticamente; falha resolvida com 99.1% de confiança."
        ],
        ceoLogs: [
          "💰 ECONOMIA: Corrige canais Wi-Fi de forma silenciosa e remota, evitando 21,4% de todos os envios de técnicos. Economia de € 180.000/mês.",
          "🚀 O QUE FAZ: A IA funciona como um engenheiro digital de plantão 24 horas por dia, detectando imperfeições de linha e as corrigindo.",
          "🎯 RESULTADO COMERCIAL: Cria experiências excelentes para os assinantes, resolvendo falhas de conexão antes mesmo que o usuário perceba."
        ],
        businessImpact: "Evita diretamente 21,4% de envios desnecessários de técnicos, otimizando drasticamente as operações e o NPS.",
        beegolInsight: "Conexão direta de baixíssima latência (hot path) no Kafka permite reações e auto-correções em tempo de execução."
      }
    ];
  } else if (language === "it") {
    return [
      {
        id: "user-cpe",
        name: "Passo 1: Cattura di Bordo su CPE Residenziale",
        shortName: "CPE dell'Abbonato",
        description: "Acquisisce parametri grezzi del livello fisico a intervalli di 1 secondo dai modem a banda larga e dai set-top box video.",
        sourceNodes: ["legacy", "rdkb", "prpl", "rdkv"],
        activeEdges: ["legacy", "rdkb", "prpl", "rdkv"],
        metrics: [
          { label: "Rumore di Fondo Wi-Fi", value: "-96 dBm", status: "optimal" },
          { label: "Potenza Ottica Rx", value: "-4.2 dBm", status: "nominal" },
          { label: "Media RSSI Wi-Fi", value: "-68 dBm", status: "nominal" },
          { label: "FEC Non Correggibile", value: "1.402 / sec", status: "warning" },
          { label: "Carico CPU CPE", value: "34.5%", status: "nominal" },
          { label: "Perdita Memoria CPE", value: "0.0 MB/ora", status: "optimal" }
        ],
        technicalLogs: [
          "INIT: Agente di telemetria RDK-B in ascolto su interfaccia phy0/phy1.",
          "DEBUG: Acquisizione beacon RSSI da 5 client domestici attivi.",
          "WARN: Canale upstream 3 soggetto a micro-riflessioni; SNR degradato.",
          "INFO: Daemon prplMesh segnala un collegamento ideale sulla dorsale 5GHz."
        ],
        ceoLogs: [
          "💰 RISPARMIO: Evita 1.450 interventi di tecnici non necessari al mese, risparmiando a Telecom Italia € 101.500/mese in carburante e manodopera.",
          "🚀 COSA FA: Ispeziona i segnali Wi-Fi domestici a una risoluzione ultra-rapida di 1 secondo senza rallentare o mandare in crash i modem degli utenti.",
          "🎯 RISULTATO COMMERCIALE: Risolve i reclami Wi-Fi fin dalla prima chiamata, riducendo l'abbandono dei clienti (churn) del 35%."
        ],
        businessImpact: "Le chiamate di supporto si riducono del 35% grazie alle diagnosi proattive di linea.",
        beegolInsight: "Aggira i lenti cicli di polling per estrarre i parametri radio/ottici grezzi direttamente dal firmware RDK."
      },
      {
        id: "access-transport",
        name: "Passo 2: GPON OLT e Aggregazione di Bordo",
        shortName: "GPON e Borda",
        description: "Aggrega massiccia telemetria fisica su terminali di linea ottica (OLT) e router virtuali CCAP di bordo.",
        sourceNodes: ["olt", "edge"],
        activeEdges: ["olt", "edge"],
        metrics: [
          { label: "Capacità del Link Aggregato", value: "100.0 Gbps", status: "optimal" },
          { label: "Porte in Fibra Attive", value: "48 / 48 Attive", status: "optimal" },
          { label: "Latenza del Gateway di Bordo", value: "1.2 ms", status: "optimal" },
          { label: "Rapporto Pacchetti Persi", value: "0.001%", status: "nominal" },
          { label: "Jitter di Upstream PHY", value: "0.85 ms", status: "nominal" },
          { label: "Ripartitore di Potenza EPON", value: "Rapporto 1:64", status: "nominal" }
        ],
        technicalLogs: [
          "SUBSCRIBE: GPON OLT in ascolto delle chiavi di registrazione ONT attive.",
          "INFO: Stato dell'interfaccia edge del provider Bundle-Ether1 è UP.",
          "DEBUG: Aggregazione dei dati di telemetria su 12.402 dispositivi CPE.",
          "TRACE: Aggiunta intestazioni geografiche locali per mappare i divisori."
        ],
        ceoLogs: [
          "💰 RISPARMIO: Raggruppa gli abbonati regionali per evitare spedizioni di tecnici singoli per guasti stradali collettivi. Risparmio di € 42.000/mese.",
          "🚀 COSA FA: Isola istantaneamente se un intero isolato ha la fibra interrotta o se è solo il cavo di un singolo utente scollegato.",
          "🎯 RISULTATO COMMERCIALE: Velocizza la riparazione, risparmiando il 15% sui costi di manutenzione e instradamento dell'infrastruttura."
        ],
        businessImpact: "Consolida le dipendenze hardware, risparmiando il 15% sui costi di manutenzione dell'infrastruttura.",
        beegolInsight: "Raggruppa gli abbonati in base ai ripartitori di fibra ottica, isolando i guasti generali della rete PON."
      },
      {
        id: "control-broker",
        name: "Passo 3: Piano di Controllo USP MQTT",
        shortName: "Broker USP / MQTT",
        description: "Garantisce il trasporto sicuro delle modifiche di stato asincrone tramite il protocollo TR-369 USP.",
        sourceNodes: ["acs", "controller"],
        activeEdges: ["acs", "controller"],
        metrics: [
          { label: "Sessioni USP Attive", value: "12.402 Sessioni", status: "optimal" },
          { label: "Profundità di Coda Broker", value: "12 msgs", status: "optimal" },
          { label: "Velocità Handshake TLS", value: "14 ms", status: "nominal" },
          { label: "Stato Socket MQTT", value: "CONNESSO", status: "optimal" },
          { label: "Fallback TR-069 Legacy", value: "4%", status: "warning" },
          { label: "Intervallo di Heartbeat", value: "30 secondi", status: "nominal" }
        ],
        technicalLogs: [
          "CONNECT: Il controller USP ha registrato 12.402 socket TLS simultanei.",
          "INFO: Elaborazione dei messaggi asincroni contenenti statistiche Wi-Fi.",
          "DEBUG: Inoltro dei messaggi USP Protobuf al topic 'cpe.telemetry'.",
          "TRACE: Handshake delle sessioni legacy CWMP SOAP (TR-069) per 500 nodi."
        ],
        ceoLogs: [
          "💰 RISPARMIO: Sostituisce il polling manuale dei router con aggiornamenti istantanei. Banda ridotta dell'84%, risparmiando € 18.000/mese di cloud.",
          "🚀 COSA FA: Sostituisce i controlli di stato XML lenti con streaming continui di stato binario ultraleggeri.",
          "🎯 RISULTATO COMMERCIALE: Gli stream leggeri permettono ai server di gestire facilmente i picchi di guasto senza crashare."
        ],
        businessImpact: "Sostituisce i pesanti e lenti polling HTTP con eventi asincroni istantanei, riducendo il carico del server del 45%.",
        beegolInsight: "Sfrutta formati Protobuf serializzati in binario per ridurre al minimo l'impatto sulla larghezza di banda WAN."
      },
      {
        id: "kafka-cluster",
        name: "Passo 4: Ingestione Kafka e Stream di Coda",
        shortName: "Stream Kafka",
        description: "Ingloba flussi di telemetria ad altissima frequenza (pre-filtrati via Apache MiNiFi per scartare il 90% del rumore statico) in gruppi di partizioni con alta disponibilità assoluta.",
        sourceNodes: ["kafka"],
        activeEdges: ["kafka"],
        metrics: [
          { label: "Velocità Ingestione Kafka", value: "150k msgs/s (Qualificate)", status: "optimal" },
          { label: "Filtro Apache MiNiFi", value: "90% Scartato a Bordo", status: "optimal" },
          { label: "Broker Online", value: "12 / 12 Nodi", status: "optimal" },
          { label: "Rapporto Compressione lz4", value: "2.8 : 1.0", status: "optimal" },
          { label: "Allocazione del Buffer", value: "85% Libero", status: "nominal" },
          { label: "Fattore di Replicazione", value: "Sinc. a 3 Vie", status: "optimal" }
        ],
        technicalLogs: [
          "PRODUCER: Flussi di telemetria bilanciati su 120 partizioni.",
          "INFO: Apache MiNiFi ha filtrato 1.35M msgs/s ridondanti alla sorgente; inviando solo 150k msgs/s qualificate.",
          "DEBUG: Topic 'telemetry.qualified.rdkb' batch.size è 200.000; linger.ms è 50.",
          "WARN: Partizione 12 ha una leggera pressione di I/O disco; auto-bilanciamento."
        ],
        ceoLogs: [
          "💰 RISPARMIO: Il pre-filtraggio locale tramite Apache MiNiFi riduce i costi del traffico WAN del 90%, risparmiando € 35.000/mese di costi Kafka.",
          "🚀 COSA FA: Integra un micro-datalake distribuito a bordo prima di inviare dati a Kafka, scartando i parametri statici ripetitivi.",
          "🎯 RISULTATO COMMERCIALE: Garantisce una telemetria di alta qualità e pulita (150k msgs/s qualificate invece di 1.5M/s piene di rumore), ottimizzando il calcolo."
        ],
        businessImpact: "Garantisce la disponibilità della telemetria al 99.999% riducendo drasticamente il traffico WAN e i costi di cloud hosting.",
        beegolInsight: "Sfrutta gli agenti Apache MiNiFi integrati sui CPE/OLT per ripulire i dati ridondanti prima che tocchino la coda centrale Kafka."
      },
      {
        id: "databricks-etl",
        name: "Passo 5: ETL con Stato su Databricks",
        shortName: "ETL Databricks",
        description: "Normalizza e unisce i dati in Delta Lake per il percorso analitico, audit e addestramento del modello di IA.",
        sourceNodes: ["etl", "drop"],
        activeEdges: ["etl", "drop"],
        metrics: [
          { label: "Rapporto Deduplica", value: "Rapporto 14:1", status: "optimal" },
          { label: "Latenza Delta Lake", value: "12.0 ms", status: "optimal" },
          { label: "Carico Cluster Spark", value: "68.2%", status: "nominal" },
          { label: "Features Attive", value: "142 Features", status: "optimal" },
          { label: "Rumore Scartato", value: "94% Scartato", status: "optimal" },
          { label: "Conformità dello Schema", value: "100% Conforme", status: "optimal" }
        ],
        technicalLogs: [
          "SPARK: Avvio micro-batch di Structured Streaming #849204.",
          "INFO: Rimozione del 94% dei parametri nulli/redundanti ai confini dell'ETL.",
          "DEBUG: Unione del flusso di telemetria con le schede fisiche di fibra.",
          "TRACE: Scrittura delle caratteristiche in tempo reale su file Delta compressi."
        ],
        ceoLogs: [
          "💰 RISPARMIO: Filtra istantaneamente il 94% del rumore statico, riducendo le fatture di elaborazione cloud di € 48.000/mese.",
          "🚀 COSA FA: Un setaccio intelligente che pulisce il fiume caotico dei dati di rete, fornendo all'IA segnali perfettamente puliti.",
          "🎯 RISULTATO COMMERCIALE: Riduce i costi di calcolo cloud del 65%, mantenendo un catalogo dati pulito e ottimizzato."
        ],
        businessImpact: "Riduce del 65% i costi lordi di elaborazione cloud grazie alla rimozione precoce del rumore statico.",
        beegolInsight: "Mentre Beegol consuma direttamente da Kafka per l'RCA in tempo reale (hot path), Databricks consolida il Delta Lake (cold path)."
      },
      {
        id: "beegol-cloud",
        name: "Passo 6: Risultati Cloud e RCA Beegol",
        shortName: "Cloud Beegol",
        description: "Beegol consuma direttamente dai topic Kafka per un'inferenza di causa radice (RCA) immediata in sub-secondi.",
        sourceNodes: ["ai"],
        activeEdges: ["ai"],
        metrics: [
          { label: "Precisione Neurale RCA", value: "98.42% Acc", status: "optimal" },
          { label: "Tempo di Diagnostica", value: "150.0 ms", status: "optimal" },
          { label: "Attivazioni Risoluzione", value: "1.842 / ora", status: "optimal" },
          { label: "Affidabilità Flap Canale", value: "99.1% Conf", status: "optimal" },
          { label: "Allarmi di Campo Attivi", value: "14 Attivi", status: "nominal" },
          { label: "Tasso Apprendimento Alpha", value: "0.001 Alpha", status: "nominal" }
        ],
        technicalLogs: [
          "BEEGOL_AI: Iniezione del vettore di caratteristiche nella rete neurale di diagnostica profonda.",
          "INFO: Identificato piegamento del cavo coassiale fisico sul segmento #419-B.",
          "SUCCESS: Confermato flap del canale Wi-Fi locale; inviato comando di cambio canale Wi-Fi automatico.",
          "BEEGOL_AI: Chiusura automatica del ticket #98214; guasto risolto con affidabilità del 99.1%."
        ],
        ceoLogs: [
          "💰 RISPARMIO: Risolve i canali Wi-Fi in background, evitando il 21.4% degli interventi dei tecnici. Risparmio di € 180.000/mese.",
          "🚀 COSA FA: L'IA agisce come un ingegnere digitale disponibile 24 ore su 24, rilevando e correggendo le imperfezioni di linea.",
          "🎯 RISULTATO COMMERCIALE: Offre un'esperienza cliente eccezionale risolvendo i problemi prima che l'abbonato li noti."
        ],
        businessImpact: "Evita direttamente il 21.4% delle uscite non necessarie dei tecnici, ottimizzando le operazioni e l'esperienza cliente.",
        beegolInsight: "La connessione diretta (hot path) a Kafka consente risposte e auto-correzioni istantanee in esecuzione."
      }
    ];
  }

  // Fallback / default (English)
  return [
    {
      id: "user-cpe",
      name: "Step 1: Home CPE Edge Capture",
      shortName: "Subscriber CPE",
      description: "Captures raw physical layer metrics at 1-second intervals from broadband gateways and video set-tops.",
      sourceNodes: ["legacy", "rdkb", "prpl", "rdkv"],
      activeEdges: ["legacy", "rdkb", "prpl", "rdkv"],
      metrics: [
        { label: "Wi-Fi Noise Floor", value: "-96 dBm", status: "optimal" },
        { label: "Rx Optical Power", value: "-4.2 dBm", status: "nominal" },
        { label: "Wi-Fi RSSI Average", value: "-68 dBm", status: "nominal" },
        { label: "FEC Uncorrectable", value: "1,402 / sec", status: "warning" },
        { label: "CPE CPU Load", value: "34.5%", status: "nominal" },
        { label: "CPE Memory Leak", value: "0.0 MB/hr", status: "optimal" }
      ],
      technicalLogs: [
        "INIT: RDK-B telemetry agent listening on phy0/phy1 interface.",
        "DEBUG: Capturing RSSI beacon frames from 5 active home clients.",
        "WARN: Upstream channel 3 experiencing micro-reflections; SNR degraded.",
        "INFO: prplMesh daemon reporting optimal mesh link state on 5GHz backhaul."
      ],
      ceoLogs: [
        "💰 SAVINGS: Prevents 1,450 unnecessary dispatches per month, saving Telecom Italia €101,500/mo in technician fuel and labor.",
        "🚀 WHAT IT DOES: Inspects home modem Wi-Fi signals at ultra-fast 1-second resolution without lagging or crashing user modems.",
        "🎯 BUSINESS OUTCOME: Solves Wi-Fi complaints on the first call, reducing customer churn by 35%."
      ],
      businessImpact: "Support calls are reduced by 35% via proactive pre-emptive line diagnostics.",
      beegolInsight: "Bypasses slow polling cycles to extract raw radio/optical parameters directly from RDK firmware."
    },
    {
      id: "access-transport",
      name: "Step 2: GPON OLT & Edge Aggregation",
      shortName: "GPON & Edge",
      description: "Aggregates massive physical telemetry at optical line terminals (OLT) and virtual CCAP router edges.",
      sourceNodes: ["olt", "edge"],
      activeEdges: ["olt", "edge"],
      metrics: [
        { label: "Aggregated Link Capacity", value: "100.0 Gbps", status: "optimal" },
        { label: "Active Fiber Ports", value: "48 / 48 Active", status: "optimal" },
        { label: "Edge Gateway Latency", value: "1.2 ms", status: "optimal" },
        { label: "Packet Drop Ratio", value: "0.001%", status: "nominal" },
        { label: "PHY Upstream Jitter", value: "0.85 ms", status: "nominal" },
        { label: "EPON Power Splitter", value: "1:64 Ratio", status: "nominal" }
      ],
      technicalLogs: [
        "SUBSCRIBE: GPON OLT listening to active ONT registration keys.",
        "INFO: Provider edge interface Bundle-Ether1 status UP.",
        "DEBUG: Aggregating telemetry payload across 12,402 CPE devices.",
        "TRACE: Appending geographical node headers to network packets."
      ],
      ceoLogs: [
        "💰 SAVINGS: Groups regional subscribers together, averting single-customer dispatches for street-wide outages. Saves €42,000/mo.",
        "🚀 WHAT IT DOES: Instantly isolates if an entire block has cut fiber or if just one customer's cable was accidentally unplugged.",
        "🎯 BUSINESS OUTCOME: Speeds up repair coordination, saving 15% in infrastructure maintenance and routing costs."
      ],
      businessImpact: "Consolidates hardware dependencies, saving 15% in infrastructure maintenance costs.",
      beegolInsight: "Groups disparate subscribers by fiber splitters, isolating PON-wide outages from home-specific issues."
    },
    {
      id: "control-broker",
      name: "Step 3: USP MQTT Control Plane",
      shortName: "USP / MQTT Broker",
      description: "Secures transport of asynchronous telemetry state changes over the TR-369 USP protocol.",
      sourceNodes: ["acs", "controller"],
      activeEdges: ["acs", "controller"],
      metrics: [
        { label: "Active USP Sessions", value: "12,402 Sessions", status: "optimal" },
        { label: "Broker Queue Depth", value: "12 msgs", status: "optimal" },
        { label: "TLS Handshake Speed", value: "14 ms", status: "nominal" },
        { label: "MQTT Socket Status", value: "ESTABLISHED", status: "optimal" },
        { label: "Legacy TR-069 Fallback", value: "4%", status: "warning" },
        { label: "Heartbeat Interval", value: "30 seconds", status: "nominal" }
      ],
      technicalLogs: [
        "CONNECT: USP Controller registered 12,402 concurrent TLS sockets.",
        "INFO: Processing async Notify messages containing Wi-Fi statistics.",
        "DEBUG: Forwarding USP protobuf messages to broker topic 'cpe.telemetry'.",
        "TRACE: Handshaking legacy CWMP SOAP sessions (TR-069) for 500 fallback nodes."
      ],
      ceoLogs: [
        "💰 SAVINGS: Replaces manual router polling with instant updates. Bandwidth drops 84%, cutting cloud egress costs by €18,000/mo.",
        "🚀 WHAT IT DOES: Swaps heavy, slow XML status checks for ultra-lightweight, continuous binary state streaming.",
        "🎯 BUSINESS OUTCOME: Light streams allow servers to easily handle peaks and outages without crashing the datacenter."
      ],
      businessImpact: "Replaces heavy, slow HTTP polls with instant lightweight asynchronous events, saving 45% server overhead.",
      beegolInsight: "Leverages binary-serialized Protobuf formats to minimize WAN bandwidth impact across connections."
    },
    {
      id: "kafka-cluster",
      name: "Step 4: Kafka Ingest & Queue Stream",
      shortName: "Kafka Stream",
      description: "Ingests ultra-high frequency telemetry streams (pre-filtered via Apache MiNiFi Edge Datalake to drop 90% static noise) into highly available partition groups.",
      sourceNodes: ["kafka"],
      activeEdges: ["kafka"],
      metrics: [
        { label: "Kafka Ingest Speed", value: "150k msgs/s (Qualified)", status: "optimal" },
        { label: "Apache MiNiFi Filter", value: "90% Static Dropped", status: "optimal" },
        { label: "Brokers Online", value: "12 / 12 Nodes", status: "optimal" },
        { label: "lz4 Compression Ratio", value: "2.8 : 1.0", status: "optimal" },
        { label: "Buffer Allocation", value: "85% Free", status: "nominal" },
        { label: "Replication Factor", value: "3-Way Sync", status: "optimal" }
      ],
      technicalLogs: [
        "PRODUCER: Telemetry streams balanced across 120 partition blocks.",
        "INFO: Apache MiNiFi filtered 1.35M msgs/s redundant data at source; forwarding only 150k msgs/s qualified stream.",
        "DEBUG: Topic 'telemetry.qualified.rdkb' batch.size is 200,000; linger.ms is 50.",
        "WARN: Partition 12 experiencing slight disk I/O pressure; self-balanced."
      ],
      ceoLogs: [
        "💰 SAVINGS: Local edge pre-filtering via Apache MiNiFi reduces WAN transit bills by 90% and saves €35,000/mo in central Kafka resources.",
        "🚀 WHAT IT DOES: Implements a distributed edge pre-filtering datalake before sending logs, dropping redundant state variables.",
        "🎯 BUSINESS OUTCOME: Ensures pure, qualified telemetry (150k msgs/s instead of 1.5M/s noisy logs), massively lowering downstream costs."
      ],
      businessImpact: "Guarantees 99.999% telemetry availability while reducing transit network costs and cloud computing pressure drastically.",
      beegolInsight: "Employs lightweight Apache MiNiFi agents embedded in gateways/OLTs to pre-process and drop noise prior to cloud ingestion."
    },
    {
      id: "databricks-etl",
      name: "Step 5: Databricks Stateful ETL",
      shortName: "Databricks ETL",
      description: "Normalizes and joins data in Delta Lake for analytical tracking, audits, and GNN model training.",
      sourceNodes: ["etl", "drop"],
      activeEdges: ["etl", "drop"],
      metrics: [
        { label: "Deduplication Ratio", value: "14 : 1 Ratio", status: "optimal" },
        { label: "Delta Lake Latency", value: "12.0 ms", status: "optimal" },
        { label: "Spark Cluster Load", value: "68.2%", status: "nominal" },
        { label: "Active Feature Sets", value: "142 Features", status: "optimal" },
        { label: "Discarded Noise", value: "94% Dropped", status: "optimal" },
        { label: "Schema Compliance", value: "100% Valid", status: "optimal" }
      ],
      technicalLogs: [
        "SPARK: Starting Structured Streaming micro-batch #849204.",
        "INFO: Dropping 94% null/redundant state parameters at the ETL boundary.",
        "DEBUG: Joining raw telemetry stream with provisioned physical fiber cards.",
        "TRACE: Materializing real-time feature matrices in columnar Delta files."
      ],
      ceoLogs: [
        "💰 SAVINGS: Filters out 94% of useless electronic noise instantly, shrinking cloud database processing bills by €48,000/mo.",
        "🚀 WHAT IT DOES: An intelligent sieve that cleans the chaotic river of network data, outputting only pure signals for the AI.",
        "🎯 BUSINESS OUTCOME: Cuts cloud storage and compute costs by 65%, maintaining a clean, search-optimized inventory."
      ],
      businessImpact: "Reduces raw cloud compute costs by 65% through severe, early noise filtering and delta storage.",
      beegolInsight: "While Beegol consumes directly from Kafka in real-time (hot path), Databricks consolidates the analytical Delta Lake (cold path)."
    },
    {
      id: "beegol-cloud",
      name: "Step 6: Beegol Cloud Results & RCA",
      shortName: "Beegol Cloud",
      description: "Beegol direct-consumes Kafka topics for sub-second, real-time Root Cause Analysis (RCA) inference.",
      sourceNodes: ["ai"],
      activeEdges: ["ai"],
      metrics: [
        { label: "RCA Neural Accuracy", value: "98.42% Acc", status: "optimal" },
        { label: "Diagnosis Time", value: "150.0 ms", status: "optimal" },
        { label: "Self-Heal Triggers", value: "1,842 / hour", status: "optimal" },
        { label: "Flap Detection Confidence", value: "99.1% Conf", status: "optimal" },
        { label: "Active Field Alerts", value: "14 Active", status: "nominal" },
        { label: "Model Learning Rate", value: "0.001 Alpha", status: "nominal" }
      ],
      technicalLogs: [
        "BEEGOL_AI: Injecting feature vector to deep diagnostic neural net.",
        "INFO: Identified physical coaxial cable bending on Segment #419-B.",
        "SUCCESS: Confirmed localized Wi-Fi channel flap; dispatched self-heal channel shift.",
        "BEEGOL_AI: Auto-closing ticket #98214; fault resolved with 99.1% confidence."
      ],
      ceoLogs: [
        "💰 SAVINGS: Self-heals router Wi-Fi channels silently in the background, avoiding 21.4% of all truck dispatches. Saves €180,000/mo.",
        "🚀 WHAT IT DOES: The AI acts as a 24/7 digital engineer, detecting customer line flaws and correcting them instantly.",
        "🎯 BUSINESS OUTCOME: Creates flawless subscriber experiences by fixing issues before users even realize they occurred."
      ],
      businessImpact: "Support calls are reduced by 35% via proactive pre-emptive line diagnostics.",
      beegolInsight: "Direct fast-path Kafka subscriptions enable sub-second automated Wi-Fi and GPON troubleshooting actions."
    }
  ];
}

export const PIPELINE_STEPS: FlowStep[] = getLocalizedPipelineSteps("en");
