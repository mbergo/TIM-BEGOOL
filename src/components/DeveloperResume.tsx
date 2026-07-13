import React, { useState } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Terminal, 
  Download, 
  X, 
  Award, 
  Globe, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Code
} from "lucide-react";
import { jsPDF } from "jspdf";

interface DeveloperResumeProps {
  isOpen: boolean;
  onClose: () => void;
  isLight: boolean;
}

export default function DeveloperResume({ isOpen, onClose, isLight }: DeveloperResumeProps) {
  const [resumeLang, setResumeLang] = useState<"en" | "pt">("en");
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "certifications">("experience");

  if (!isOpen) return null;

  // PDF Export of the Professional CV
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    // Header styling
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, "F");
    
    // Core accent line
    doc.setFillColor(56, 189, 248); // sky-400
    doc.rect(0, 40, 210, 1.5, "F");

    // Header Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("LUCAS SILVA CORRÊA", 14, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(186, 230, 253); // sky-200
    doc.text("Lead Systems Architect & Telecommunications AI Engineer", 14, 22);
    
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text("Email: lucas.silva@auraops.tech  |  Phone: +55 (11) 98765-4321  |  LinkedIn: linkedin.com/in/lucas-silva-telecom", 14, 29);
    doc.text("Portfolio: auraops.tech/lucas  |  Location: São Paulo, Brazil / Remote", 14, 34);

    // Section 1: Professional Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("PROFESSIONAL SUMMARY", 14, 52);
    doc.line(14, 54, 196, 54);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const summary = resumeLang === "pt"
      ? "Arquiteto de Sistemas Sênior e Especialista em IA para Telecomunicações com mais de 8 anos de experiência projetando pipelines de ingestão de telemetria de ultra-alta frequência e modelos de aprendizado profundo (GNN, DNN). Histórico comprovado de parcerias estratégicas de infraestrutura (TIM Brasil, Beegol) reduzindo custos operacionais (OpEx) e despesas de truck-rolls em mais de 35% através do desenvolvimento de micro-módulos RDK e automações de auto-healing."
      : "Senior Systems Architect and Telecommunications AI Expert with over 8 years of experience designing ultra-high frequency telemetry ingestion pipelines and deep learning models (GNN, DNN). Proven track record of high-impact corporate partnerships (TIM Brasil, Beegol) driving down OpEx and truck-roll overhead by over 35% through custom RDK micro-firmware modules and self-heal edge automations.";
    doc.text(summary, 14, 59, { maxWidth: 182 });

    // Section 2: Experience
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("WORK EXPERIENCE", 14, 76);
    doc.line(14, 78, 196, 78);

    // Experience 1
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("Lead Systems Architect - AuraOps Integration (TIM Brasil & Beegol)", 14, 84);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Jan 2024 - Present  |  São Paulo, Brazil", 14, 88);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const bullet1 = resumeLang === "pt"
      ? "- Liderou o projeto do pipeline AuraOps para TIM Brasil, arquitetando ingestão massiva de 1.8M msg/s com 3 brokers Kafka gerenciados via ZooKeeper, reduzindo custos de hardware em 78%.\n- Desenvolveu módulos de telemetria baseados em C++ integrados ao firmware de CPE RDK-B e prplMesh para extrair ruído físico de linha em intervalos de 1 segundo.\n- Projetou filtros de redução de ruído pré-Kafka, diminuindo os volumes de ingestão central em 90% (de 1.8M para 180k msg/s) e economizando €180.000 mensais em infraestrutura de nuvem."
      : "- Spearheaded the AuraOps pipeline architecture for TIM Brasil, scaling raw telemetry ingestion to 1.8M msg/s using an optimized 3-node Kafka configuration, cutting hardware expenses by 78%.\n- Developed embedded C++ agents integrated into RDK-B and prplMesh CPE firmware, pulling sub-second physical PHY layer SNR parameters.\n- Designed and shipped pre-Kafka edge noise filters, reducing central data ingestion bills by 90% (from 1.8M to 180k msg/s), retaining €180,000 monthly in cloud opex.";
    doc.text(bullet1, 14, 93, { maxWidth: 182 });

    // Experience 2
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Senior Telemetry & AI Platform Engineer - Beegol", 14, 119);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Oct 2021 - Dec 2023  |  São Paulo, Brazil", 14, 123);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const bullet2 = resumeLang === "pt"
      ? "- Desenvolveu modelos de Rede Neural Gráfica (GNN) que mapeiam topologias de rede residenciais TIM GPON para isolar e geolocalizar blindagens físicas degradadas a menos de 2.4 metros de precisão.\n- Implementou protocolo TR-369 USP baseado em MQTT para enviar ordens assíncronas em tempo real, realizando correções de canal de Wi-Fi automáticas para evitar truck rolls desnecessários."
      : "- Coded Graph Neural Network (GNN) models mapping resident GPON topologies to localize physical coaxial shielding degradations within 2.4 meters.\n- Implemented asynchronous TR-369 USP control layer over MQTT to perform automated remote Wi-Fi channel mitigation, completely avoiding unnecessary truck dispatches.";
    doc.text(bullet2, 14, 128, { maxWidth: 182 });

    // Section 3: Tech Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("CORE EXPERTISE & TECHNICAL SKILLS", 14, 151);
    doc.line(14, 153, 196, 153);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Languages & Frameworks: ", 14, 159);
    doc.setFont("helvetica", "normal");
    doc.text("TypeScript, React, C++, Go, Python, Rust, SQL, Bash", 54, 159);

    doc.setFont("helvetica", "bold");
    doc.text("Distributed Systems: ", 14, 164);
    doc.setFont("helvetica", "normal");
    doc.text("Apache Kafka, ZooKeeper, Spark Streaming, Databricks, Delta Lake, Docker, K8s", 47, 164);

    doc.setFont("helvetica", "bold");
    doc.text("Protocols & Telecom: ", 14, 169);
    doc.setFont("helvetica", "normal");
    doc.text("TR-369 USP, TR-069, RDK-B, prplMesh, GPON, DOCSIS 3.1/4.0, OLT Interface", 48, 169);

    doc.setFont("helvetica", "bold");
    doc.text("AI / Deep Learning: ", 14, 174);
    doc.setFont("helvetica", "normal");
    doc.text("Graph Neural Networks (GNN), PyTorch, ONNX, Anomaly Detection, Time-Series Forecasting", 44, 174);

    // Section 4: Education & Certifications
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("EDUCATION & CERTIFICATIONS", 14, 187);
    doc.line(14, 189, 196, 189);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("B.S. in Telecommunications Engineering", 14, 195);
    doc.setFont("helvetica", "normal");
    doc.text("Universidade de São Paulo (USP)  |  Graduated 2018", 14, 199);

    doc.setFont("helvetica", "bold");
    doc.text("Key Certifications: ", 14, 206);
    doc.setFont("helvetica", "normal");
    doc.text("Confluent Certified Developer for Apache Kafka  |  Databricks Certified Associate Developer", 46, 206);

    doc.save(`Lucas_Silva_CV_${resumeLang.toUpperCase()}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-end transition-all duration-300">
      {/* Drawer */}
      <div className={`w-full max-w-2xl h-full shadow-2xl flex flex-col relative overflow-hidden transition-all duration-500 transform translate-x-0 ${
        isLight ? "bg-slate-50 text-slate-800" : "bg-slate-950 text-slate-100"
      }`}>
        {/* Glow corner decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Drawer Header */}
        <div className={`p-6 border-b flex items-center justify-between select-none ${
          isLight ? "bg-white border-slate-200" : "bg-slate-900/60 border-slate-800"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg font-mono">
              LS
            </div>
            <div>
              <h2 className="text-lg font-black font-mono tracking-tight leading-none">LUCAS SILVA CORRÊA</h2>
              <span className="text-[10px] uppercase font-mono font-bold text-sky-500 dark:text-sky-400 mt-1 block">
                {resumeLang === "pt" ? "Arquiteto de Sistemas Sênior" : "Senior Systems Architect"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className={`flex items-center border rounded-lg p-0.5 mr-2 ${
              isLight ? "bg-slate-100 border-slate-200" : "bg-slate-950 border-slate-800"
            }`}>
              {(["en", "pt"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setResumeLang(lang)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    resumeLang === lang
                      ? "bg-sky-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-black transition-all cursor-pointer shadow-lg shadow-sky-500/15"
              title={resumeLang === "pt" ? "Exportar Currículo em PDF" : "Export Resume as PDF"}
            >
              <Download size={13} />
              <span>PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg border transition-all ${
                isLight ? "hover:bg-slate-100 border-slate-200" : "hover:bg-slate-800 border-slate-800"
              }`}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-sky-500/10 border-b border-sky-500/20 px-6 py-3 flex items-center justify-between text-[11px] font-mono leading-none">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Award size={13} />
            <span className="font-bold">
              {resumeLang === "pt" 
                ? "Criador do Sizing de Kafka de 1.8M msg/s e Filtro Pré-Kafka" 
                : "Architect of 1.8M msg/s Kafka Sizing & Pre-Kafka Filter"}
            </span>
          </div>
          <span className="text-slate-500">v5.4-AURA PROFILE</span>
        </div>

        {/* Drawer Body - Scrollable content */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border flex flex-col gap-1 ${
              isLight ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800/80"
            }`}>
              <span className="text-[9px] uppercase font-mono text-slate-500">{resumeLang === "pt" ? "Experiência" : "Experience"}</span>
              <span className="text-base font-black font-mono text-sky-500">8+ {resumeLang === "pt" ? "Anos" : "Years"}</span>
            </div>
            <div className={`p-3 rounded-lg border flex flex-col gap-1 ${
              isLight ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800/80"
            }`}>
              <span className="text-[9px] uppercase font-mono text-slate-500">{resumeLang === "pt" ? "Foco Principal" : "Core Tech"}</span>
              <span className="text-xs font-bold font-mono">Kafka / RDK-B</span>
            </div>
            <div className={`p-3 rounded-lg border flex flex-col gap-1 ${
              isLight ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800/80"
            }`}>
              <span className="text-[9px] uppercase font-mono text-slate-500">{resumeLang === "pt" ? "Projetos TIM" : "TIM Projects"}</span>
              <span className="text-base font-black font-mono text-indigo-500">AuraOps</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 pb-0.5">
            {[
              { id: "experience", label: resumeLang === "pt" ? "Experiência" : "Experience", icon: Briefcase },
              { id: "skills", label: resumeLang === "pt" ? "Habilidades" : "Skills", icon: Code },
              { id: "certifications", label: resumeLang === "pt" ? "Educação & Certificados" : "Education & Certs", icon: GraduationCap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all -mb-[1.5px] ${
                  activeTab === tab.id
                    ? "border-sky-500 text-sky-500 font-extrabold"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <tab.icon size={13} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Experience View */}
          {activeTab === "experience" && (
            <div className="flex flex-col gap-5">
              
              {/* TIM BRASIL & BEEGOL Experience Card */}
              <div className={`p-4.5 rounded-xl border relative overflow-hidden group ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/30 border-slate-800"
              }`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-sky-500 font-mono">
                      {resumeLang === "pt" 
                        ? "Arquiteto de Sistemas Líder - Integração AuraOps" 
                        : "Lead Systems Architect - AuraOps Integration"}
                    </h3>
                    <span className="text-xs font-bold block mt-1">TIM Brasil & Beegol</span>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2 py-0.5 rounded">
                    2024 - {resumeLang === "pt" ? "PRESENTE" : "PRESENT"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {resumeLang === "pt"
                    ? "Responsável por projetar o fluxo inteiro de coleta de dados das CPEs e ingestão para a TIM Brasil. Otimizou clusters de produção para processar volumes gigantescos mantendo 99.999% de tolerância a falhas."
                    : "Responsible for designing the entire subscriber-to-cloud data stream and telemetry processing hub for TIM Brasil. Optimized bare-metal cluster instances to process massive scale volumes under tight SLAs."}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-[10px]">
                    <CheckCircle2 size={12} className="text-sky-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>{resumeLang === "pt" ? "Sizing Kafka 1.8M msg/s:" : "1.8M msg/s Kafka Sizing:"}</strong>{" "}
                      {resumeLang === "pt"
                        ? "Arquitetou infraestrutura enxuta com 3 brokers + ZooKeeper (96 partições no total), economizando 78% em servidores."
                        : "Architected a lean 3-broker topology + ZooKeeper (96 partitions total), achieving 78% server cost-efficiency."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-[10px]">
                    <CheckCircle2 size={12} className="text-sky-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>{resumeLang === "pt" ? "Filtros de Borda (Pre-Kafka):" : "Pre-Kafka Edge Filters:"}</strong>{" "}
                      {resumeLang === "pt"
                        ? "Moveu a remoção de ruídos redundantes para as OLTs e CPEs, economizando 90% de volume (1.8M msgs reduzidas para 180k msgs/s)."
                        : "Shifted redundant noise removal to OLTs and CPEs, shaving 90% of central cluster ingestion load."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-[10px]">
                    <CheckCircle2 size={12} className="text-sky-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>{resumeLang === "pt" ? "Firmware CPE Embarcado:" : "Embedded CPE Firmware:"}</strong>{" "}
                      {resumeLang === "pt"
                        ? "Integrou coleta de registradores de PHY e FEC no módulo RDK-B em C++ rodando sem sobrecarregar a CPU dos roteadores."
                        : "Coded high-performance C++ agents for RDK-B firmware mapping hardware registers directly."}
                    </span>
                  </div>
                </div>
              </div>

              {/* BEEGOL Experience Card */}
              <div className={`p-4.5 rounded-xl border relative overflow-hidden group ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/30 border-slate-800"
              }`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-indigo-400 font-mono">
                      {resumeLang === "pt" 
                        ? "Engenheiro Sênior de IA e Plataforma" 
                        : "Senior AI & Telemetry Platform Engineer"}
                    </h3>
                    <span className="text-xs font-bold block mt-1">Beegol</span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                    2021 - 2023
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {resumeLang === "pt"
                    ? "Desenvolveu o core de processamento neural e telemetria, aplicando modelos de deep learning para predição física de redes de cabo/fibra."
                    : "Built the core telemetry processing framework, integrating deep learning architectures to execute physical-layer diagnostics."}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-[10px]">
                    <CheckCircle2 size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>{resumeLang === "pt" ? "IA de Causa Raiz GNN:" : "Graph Neural Network (GNN):"}</strong>{" "}
                      {resumeLang === "pt"
                        ? "Desenvolveu o modelo GNN para isolar distorções dielétricas de cabos físicos residenciais com ±2.4 metros de precisão."
                        : "Authored GNN algorithms detecting coaxial shield flaws down to ±2.4m precision from raw PHY registries."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-[10px]">
                    <CheckCircle2 size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>{resumeLang === "pt" ? "Plano de Controle USP TR-369:" : "TR-369 USP Protocol Plane:"}</strong>{" "}
                      {resumeLang === "pt"
                        ? "Implementou sockets leves via MQTT que realizam correções preventivas nos canais Wi-Fi do assinante sem necessitar de atendentes."
                        : "Configured lightweight MQTT client protocols triggering automatic Wi-Fi channel heals, bypassing service queues."}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Skills View */}
          {activeTab === "skills" && (
            <div className="flex flex-col gap-5 select-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs uppercase font-mono font-black text-sky-500">
                    {resumeLang === "pt" ? "Sistemas Distribuídos & Dados" : "Distributed Systems & Data"}
                  </h4>
                  
                  {/* Skill 1 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>Apache Kafka & ZooKeeper</span>
                      <span className="font-bold text-sky-500">98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>Databricks & Spark ETL</span>
                      <span className="font-bold text-sky-500">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>Delta Lake & Parquet</span>
                      <span className="font-bold text-sky-500">90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs uppercase font-mono font-black text-indigo-400">
                    {resumeLang === "pt" ? "Telecom & Firmware" : "Telecom & Firmware"}
                  </h4>
                  
                  {/* Skill 4 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>TR-369 USP / TR-069</span>
                      <span className="font-bold text-indigo-400">95%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  {/* Skill 5 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>RDK-B / prplMesh Firmware C++</span>
                      <span className="font-bold text-indigo-400">88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  {/* Skill 6 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>GNN / PyTorch (Deep Learning)</span>
                      <span className="font-bold text-indigo-400">86%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: "86%" }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Explanatory quote about Local Inference (CPE) limits */}
              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[10.5px] leading-relaxed">
                <span className="font-bold font-mono text-indigo-400 block mb-1">
                  {resumeLang === "pt" ? "💡 ARQUITETURA DE INFERÊNCIA DA CPE RDK-B:" : "💡 CPE INFERENCE ARCHITECTURAL NOTE:"}
                </span>
                {resumeLang === "pt"
                  ? "Em roteadores de assinante (firmware RDK-B), os processadores são chips enxutos de baixo custo. O RDK-B local não possui RAM ou threads para executar modelos pesados de Deep Learning. Logo, a abordagem ótima de AuraOps consiste em detecções de anomalias estatísticas leves localmente nas CPEs, enquanto modelos pesados de Grafos (GNN), inferências completas de rede e RAG residem em segurança na nuvem Beegol, alimentados por streams do Kafka."
                  : "Within subscriber router gateways (RDK-B), CPU resources are constrained. Running heavy Deep Learning on the modem directly is hardware-prohibitive. Therefore, the AuraOps layout executes lightweight thresholding and statistical anomaly alerts locally on the CPE, leaving complex Graph Neural Network (GNN) and RAG diagnostics to the high-availability Beegol Cloud, bridged via Kafka streams."}
              </div>
            </div>
          )}

          {/* Certifications View */}
          {activeTab === "certifications" && (
            <div className="flex flex-col gap-4">
              <div className={`p-4 rounded-xl border flex gap-3.5 items-center ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/30 border-slate-800"
              }`}>
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 font-mono font-black shrink-0">
                  USP
                </div>
                <div>
                  <h4 className="text-xs font-black font-mono">
                    {resumeLang === "pt" ? "Engenharia de Telecomunicações - Graduação" : "B.S. in Telecommunications Engineering"}
                  </h4>
                  <span className="text-[10px] text-slate-500 block mt-1">Universidade de São Paulo (USP)  |  2014 - 2018</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex gap-3.5 items-center ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/30 border-slate-800"
              }`}>
                <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-500 font-mono font-black shrink-0">
                  KFK
                </div>
                <div>
                  <h4 className="text-xs font-black font-mono">Confluent Certified Developer for Apache Kafka</h4>
                  <span className="text-[10px] text-slate-500 block mt-1">Credential ID: CC-KAFKA-98242  |  Confluent Inc.</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex gap-3.5 items-center ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/30 border-slate-800"
              }`}>
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 font-mono font-black shrink-0">
                  DB
                </div>
                <div>
                  <h4 className="text-xs font-black font-mono">Databricks Certified Associate Developer</h4>
                  <span className="text-[10px] text-slate-500 block mt-1">Credential ID: DB-SPARK-88129  |  Databricks</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center text-[10px] font-mono text-slate-500 select-none ${
          isLight ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800"
        }`}>
          © 2026 Lucas Silva Corrêa  |  AuraOps Architecture Core  |  Strictly Confidential
        </div>

      </div>
    </div>
  );
}
