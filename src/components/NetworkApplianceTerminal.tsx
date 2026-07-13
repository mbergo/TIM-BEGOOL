import React, { useState, useEffect, useRef } from "react";
import { useApp, Language } from "../context/AppContext";
import { 
  X, 
  Terminal as TerminalIcon, 
  Cpu, 
  RotateCcw, 
  ArrowUpCircle, 
  Layers, 
  Radio, 
  Wifi, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Activity, 
  ShieldCheck, 
  Zap, 
  CornerDownLeft, 
  Wrench,
  Sparkles,
  RefreshCw,
  Clock,
  Check
} from "lucide-react";

interface NetworkApplianceTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNodeId?: string;
}

interface ApplianceSpec {
  id: string;
  name: string;
  acronym: string;
  type: string;
  ip: string;
  mac: string;
  cpu: number;
  memory: number;
  snr: number;
  attenuation: number;
  temp: number;
  firmware: string;
  location: string;
  description: string;
}

const dict = {
  en: {
    title: "Beegol AuraOps Remote Appliance Terminal",
    select_node: "Select Network Appliance Node",
    diagnostics: "Live Telemetry Diagnostics",
    status_nominal: "NOMINAL STATUS",
    status_degraded: "DEGRADED TELEMETRY",
    status_warning: "ALERT TRIGGERED",
    reboot: "Reboot Device",
    upgrade: "Upgrade Firmware",
    clear_cache: "Clear Cache",
    calibrate: "Calibrate Laser",
    channel_opt: "Optimize Radio Channels",
    run_diagnostic: "Self-Diagnosis",
    cli_placeholder: "Type a command (e.g., help, reboot, upgrade, clear, ping, status)...",
    truck_rolls_prevented: "Truck Roll Prevented!",
    truck_roll_saved: "TIM saved $150 in truck dispatch OPEX.",
    command_executed: "Command Executed Successfully",
    executing: "Executing command...",
    terminal_title: "USP remote CLI - Secure Channel",
    node_desc: "Target Device ID",
    node_type: "Device Classification",
    ip_addr: "Management IP",
    mac_addr: "Appliance Hardware MAC"
  },
  pt: {
    title: "Terminal Remoto de Dispositivo Beegol AuraOps",
    select_node: "Selecionar Nó de Rede",
    diagnostics: "Diagnóstico de Telemetria Live",
    status_nominal: "STATUS NOMINAL",
    status_degraded: "TELEMETRIA DEGRADADA",
    status_warning: "ALERTA DISPARADO",
    reboot: "Reiniciar Dispositivo",
    upgrade: "Atualizar Firmware",
    clear_cache: "Limpar Cache",
    calibrate: "Calibrar Laser",
    channel_opt: "Otimizar Canais de Rádio",
    run_diagnostic: "Autodiagnóstico",
    cli_placeholder: "Digite um comando (ex: help, reboot, upgrade, clear, ping, status)...",
    truck_rolls_prevented: "Deslocamento Técnico Evitado!",
    truck_roll_saved: "TIM economizou $150 de OPEX de despacho físico.",
    command_executed: "Comando Executado com Sucesso",
    executing: "Executando comando...",
    terminal_title: "CLI Remoto USP - Canal Seguro",
    node_desc: "ID do Dispositivo Alvo",
    node_type: "Classificação do Equipamento",
    ip_addr: "IP de Gerência",
    mac_addr: "MAC do Hardware"
  },
  it: {
    title: "Terminale Remoto dell'Apparato Beegol AuraOps",
    select_node: "Seleziona Nodo di Rete",
    diagnostics: "Diagnostica Telemetria Live",
    status_nominal: "STATO NOMINALE",
    status_degraded: "TELEMETRIA DEGRADATA",
    status_warning: "ALLERTA ATTIVATA",
    reboot: "Riavvia Apparato",
    upgrade: "Aggiorna Firmware",
    clear_cache: "Pulisci Cache",
    calibrate: "Calibra Laser",
    channel_opt: "Ottimizza Canali Radio",
    run_diagnostic: "Autodiagnostica",
    cli_placeholder: "Digita un comando (es: help, reboot, upgrade, clear, ping, status)...",
    truck_rolls_prevented: "Intervento Tecnico Evitato!",
    truck_roll_saved: "TIM ha risparmiato $150 in OPEX di dispatch fisico.",
    command_executed: "Comando Eseguito con Successo",
    executing: "Esecuzione comando...",
    terminal_title: "CLI Remoto USP - Canale Sicuro",
    node_desc: "ID Dispositivo Target",
    node_type: "Classificazione Apparato",
    ip_addr: "IP di Gestione",
    mac_addr: "MAC Hardware"
  }
};

const INITIAL_APPLIANCES: ApplianceSpec[] = [
  {
    id: "home-gateway",
    name: "RDK-B Home Gateway",
    acronym: "RDK-B",
    type: "Customer Premises Equipment (CPE)",
    ip: "192.168.1.1",
    mac: "A4:B3:C2:55:01:DF",
    cpu: 68,
    memory: 79,
    snr: 12.5,
    attenuation: 24.2,
    temp: 58,
    firmware: "rdkb-v2.4.12-release",
    location: "Rome Sector B - User ID #40182",
    description: "Primary residential RDK broadband router handling high density of client connections and synchronous polling telemetry loads."
  },
  {
    id: "iot-mesh",
    name: "Smart Home IoT Node",
    acronym: "CPE",
    type: "Customer Premises Equipment (CPE)",
    ip: "192.168.1.42",
    mac: "A4:B3:C2:55:04:AA",
    cpu: 45,
    memory: 52,
    snr: 14.2,
    attenuation: 18.4,
    temp: 42,
    firmware: "prpl-mesh-v1.0.3",
    location: "Rome Sector B - User ID #40182",
    description: "Extender node running prplMesh driver on restricted local processing capacity. Suffers from high Wi-Fi noise and transient frame loss."
  },
  {
    id: "stb-tv",
    name: "RDK-V Video Set-Top Box",
    acronym: "RDK-V",
    type: "Customer Premises Equipment (CPE)",
    ip: "192.168.1.100",
    mac: "A4:B3:C2:55:06:BC",
    cpu: 82,
    memory: 91,
    snr: 11.8,
    attenuation: 26.5,
    temp: 64,
    firmware: "rdkv-prod-v10.4a",
    location: "Rome Sector B - User ID #40182",
    description: "Premium IPTV set-top media client. Susceptible to video buffer underruns, packet jitters, and resource depletion due to cache build-up."
  },
  {
    id: "enterprise-edge",
    name: "Business SD-WAN Gateway",
    acronym: "CPE-WAN",
    type: "Customer Premises Equipment (CPE)",
    ip: "10.22.40.1",
    mac: "E8:99:A2:D0:33:F1",
    cpu: 35,
    memory: 44,
    snr: 28.5,
    attenuation: 12.0,
    temp: 38,
    firmware: "beegol-wan-v5.0-opt",
    location: "Enterprise Core - Milan Hub",
    description: "Business-class secure edge appliance with multiple active tunnels, demanding high availability and sub-millisecond route optimization."
  },
  {
    id: "gpon-ont",
    name: "Optical GPON ONT",
    acronym: "ONT",
    type: "Optical Access Point (ONT)",
    ip: "192.168.100.1",
    mac: "00:25:9E:C1:F4:A2",
    cpu: 54,
    memory: 38,
    snr: 18.2,
    attenuation: 32.4, // high attenuation - optical laser issue
    temp: 49,
    firmware: "ont-gpon-v3.1",
    location: "GPON Fiber Splitter Node A",
    description: "Optical Network Terminal converting high-frequency laser signals to local copper ethernet. Susceptible to laser frequency drift."
  },
  {
    id: "olt-chassis",
    name: "Central GPON OLT",
    acronym: "OLT",
    type: "Carrier Access Aggregator (OLT)",
    ip: "10.254.12.8",
    mac: "C0:3F:0E:1F:B1:A2",
    cpu: 28,
    memory: 41,
    snr: 35.1,
    attenuation: 8.5,
    temp: 45,
    firmware: "olt-chassis-v12.2-core",
    location: "Rome Metro Central Office",
    description: "Chassis aggregation plate feeding multiple GPON splitter sectors. High processing load and critical telemetry distribution."
  },
  {
    id: "vccap-node",
    name: "vCCAP Software Core",
    acronym: "vCCAP",
    type: "Virtualized Access Aggregator",
    ip: "10.254.12.20",
    mac: "52:54:00:12:34:56",
    cpu: 89, // high CPU
    memory: 85,
    snr: 22.1,
    attenuation: 15.2,
    temp: 52,
    firmware: "vccap-k8s-pod-v4.1",
    location: "Edge Cloud Node Cluster",
    description: "Virtualized CCAP software platform processing multi-gigabit DOCSIS/GPON data streams. High CPU spikes under peak parsing load."
  }
];

export default function NetworkApplianceTerminal({ isOpen, onClose, initialNodeId }: NetworkApplianceTerminalProps) {
  const { language, theme, setBackpressureValue } = useApp();
  const isLight = theme === "light";
  const t = (key: keyof typeof dict["en"]) => {
    return dict[language]?.[key] || dict["en"]?.[key] || key;
  };

  const [appliances, setAppliances] = useState<ApplianceSpec[]>(INITIAL_APPLIANCES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("home-gateway");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [cliInput, setCliInput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastPreventionAlert, setLastPreventionAlert] = useState<{
    appliance: string;
    action: string;
    metricsBefore: string;
    metricsAfter: string;
    savings: string;
  } | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sync to initialNodeId if supplied and valid
  useEffect(() => {
    if (initialNodeId && INITIAL_APPLIANCES.some(a => a.id === initialNodeId)) {
      setSelectedNodeId(initialNodeId);
    }
  }, [initialNodeId]);

  const activeAppliance = appliances.find(a => a.id === selectedNodeId) || appliances[0];

  // Initialize terminal on device change
  useEffect(() => {
    setTerminalLogs([
      `=== AuraOps Remote CLI Session Established ===`,
      `[SECURE CHANNEL] Connected via encrypted USP (TR-369) WebSockets port 4317`,
      `[DEVICE INFO] Name: ${activeAppliance.name} (${activeAppliance.acronym})`,
      `[HARDWARE] MAC: ${activeAppliance.mac} | Management IP: ${activeAppliance.ip}`,
      `[FIRMWARE] Running image: ${activeAppliance.firmware}`,
      `[DIAGNOSTICS] Current CPU: ${activeAppliance.cpu}% | RAM: ${activeAppliance.memory}% | Temp: ${activeAppliance.temp}°C`,
      `[READY] Type 'help' to list available remediation commands.`,
      `usp-cli@${activeAppliance.id}:~$ `
    ]);
    setLastPreventionAlert(null);
  }, [selectedNodeId]);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Execute terminal command helper
  const runCommand = (commandStr: string) => {
    const cleanCmd = commandStr.trim().toLowerCase();
    if (!cleanCmd) return;

    setTerminalLogs(prev => [...prev, `${cleanCmd}`]);
    setIsExecuting(true);

    // Broadcast trigger command event to Syslog
    const triggerEvent = new CustomEvent("syslog-event", {
      detail: {
        message: `[USP-CLI] Executing remote shell instruction '${cleanCmd}' on node '${activeAppliance.name}' (${activeAppliance.ip}).`,
        level: "info"
      }
    });
    window.dispatchEvent(triggerEvent);

    setTimeout(() => {
      let output: string[] = [];
      let prevention = null;

      switch (cleanCmd) {
        case "help":
          output = [
            `Available Commands:`,
            `  help               - Shows this command reference menu.`,
            `  reboot             - Performs graceful hot reboot of the CPE micro-kernel.`,
            `  upgrade            - Over-the-air firmware flash to latest secure package.`,
            `  clear_cache        - Flushes kernel memory pools and telemetry queue buffers.`,
            `  calibrate          - Runs automatic optical laser feedback loop tuning.`,
            `  optimize_wifi      - Scans RF spectrum and shifts to un-congested Wi-Fi channel.`,
            `  diagnose           - Performs full deep diagnostic telemetry analysis.`,
            `  clear              - Clears this terminal screen.`
          ];
          break;

        case "clear":
          setTerminalLogs([`usp-cli@${activeAppliance.id}:~$ `]);
          setIsExecuting(false);
          return;

        case "reboot":
          output = [
            `[INIT] Commencing soft-reboot sequence...`,
            `[KILL] Stopping active telemetry drivers (OTel / SNMP)...`,
            `[SHUTDOWN] Unmounting filesystems and flushing RAM buffers...`,
            `[BOOT] Loading micro-kernel image ${activeAppliance.firmware}...`,
            `[START] Handshaking USP Controller... OK`,
            `[SUCCESS] Remote reboot complete in 120ms. Connection restored.`,
            `[DIAGNOSTIC] CPU dropped from ${activeAppliance.cpu}% to 12%. Memory: 32%.`
          ];
          
          // Modify specific state
          setAppliances(prev => prev.map(a => {
            if (a.id === selectedNodeId) {
              return { ...a, cpu: 12, memory: 32, temp: Math.max(30, a.temp - 12) };
            }
            return a;
          }));

          prevention = {
            appliance: activeAppliance.name,
            action: "Soft Reboot",
            metricsBefore: `CPU: ${activeAppliance.cpu}%, RAM: ${activeAppliance.memory}%`,
            metricsAfter: `CPU: 12%, RAM: 32% (Optimal)`,
            savings: "$150 Truck Roll Saved (Intermittent crash risk resolved)"
          };
          break;

        case "upgrade":
          const nextFirmware = activeAppliance.firmware.includes("beegol") 
            ? "beegol-wan-v5.2-LATEST" 
            : activeAppliance.firmware.replace(/v\d+\.\d+/, "v5.0-AURA");

          output = [
            `[OTA] Initializing secure firmware download via HTTPS...`,
            `[VERIFY] Validating SHA-256 firmware signature... OK`,
            `[WRITE] Flashing active boot partition A/B...`,
            `[COMMIT] Re-pointing hardware boot pointers...`,
            `[REBOOT] Triggering hot reload...`,
            `[SUCCESS] Firmware updated to ${nextFirmware}!`,
            `[DIAGNOSTIC] Performance enhanced. CPU reduced by 20%.`
          ];

          setAppliances(prev => prev.map(a => {
            if (a.id === selectedNodeId) {
              return { 
                ...a, 
                firmware: nextFirmware, 
                cpu: Math.max(10, a.cpu - 20),
                memory: Math.max(15, a.memory - 10) 
              };
            }
            return a;
          }));

          prevention = {
            appliance: activeAppliance.name,
            action: "OTA Firmware Upgrade",
            metricsBefore: `Firmware: ${activeAppliance.firmware} (CPU: ${activeAppliance.cpu}%)`,
            metricsAfter: `Firmware: ${nextFirmware} (CPU: ${Math.max(10, activeAppliance.cpu - 20)}%)`,
            savings: "$150 Truck Roll Saved (Known memory-leak bug patched remotely)"
          };
          break;

        case "clear_cache":
          output = [
            `[CACHE] Fetching telemetry buffer stats...`,
            `[FLUSH] Flushing uncompressed SOAP XML queues: 420 KB released.`,
            `[TRIM] Optimizing local OTel circular memory pool...`,
            `[SUCCESS] Garbage collection executed. Memory released successfully.`,
            `[DIAGNOSTIC] Memory decreased from ${activeAppliance.memory}% to 35%.`
          ];

          setAppliances(prev => prev.map(a => {
            if (a.id === selectedNodeId) {
              return { ...a, memory: 35, cpu: Math.max(8, a.cpu - 5) };
            }
            return a;
          }));

          prevention = {
            appliance: activeAppliance.name,
            action: "Memory Cache Purge",
            metricsBefore: `Memory usage: ${activeAppliance.memory}%`,
            metricsAfter: `Memory usage: 35% (Safe range)`,
            savings: "$150 Truck Roll Saved (Averted out-of-memory lockup)"
          };
          break;

        case "calibrate":
          if (activeAppliance.id === "gpon-ont" || activeAppliance.id === "olt-chassis") {
            output = [
              `[OPTICS] Querying laser transmitter diagnostics...`,
              `[LASER] Measured optical RX power: -28.4 dBm (High Attenuation)`,
              `[TUNE] Applying feedback micro-current calibration...`,
              `[ALIGN] Shifting optical frequencies to peak laser band...`,
              `[SUCCESS] Attenuation reduced from ${activeAppliance.attenuation} dB to 14.2 dB.`,
              `[DIAGNOSTIC] SNR Margin restored. Optical status nominal.`
            ];

            setAppliances(prev => prev.map(a => {
              if (a.id === selectedNodeId) {
                return { ...a, attenuation: 14.2, snr: Math.min(30, a.snr + 6) };
              }
              return a;
            }));

            prevention = {
              appliance: activeAppliance.name,
              action: "Optical Laser Calibration",
              metricsBefore: `Attenuation: ${activeAppliance.attenuation} dB, SNR: ${activeAppliance.snr} dB`,
              metricsAfter: `Attenuation: 14.2 dB, SNR: ${Math.min(30, activeAppliance.snr + 6)} dB`,
              savings: "$150 Truck Roll Saved (Optical signal loss resolved over-the-air)"
            };
          } else {
            output = [
              `[WARNING] Laser calibration is only supported on optical transceivers (GPON ONT/OLT).`,
              `[FAIL] Device '${activeAppliance.name}' does not possess a direct laser module.`
            ];
          }
          break;

        case "optimize_wifi":
          if (["home-gateway", "iot-mesh", "stb-tv"].includes(activeAppliance.id)) {
            output = [
              `[RF] Scanning local Wi-Fi 2.4GHz and 5GHz channels...`,
              `[RF] Detected high interference on Channel 6 (Noise floor: -82 dBm).`,
              `[RF] Finding optimal clean channel allocation...`,
              `[AUTO-SHIFT] Transitioning radios to Channel 11 (Noise floor: -98 dBm)...`,
              `[SUCCESS] Wi-Fi frequency optimized. SNR Margin increased significantly.`,
              `[DIAGNOSTIC] SNR Margin up from ${activeAppliance.snr} dB to 18.5 dB.`
            ];

            setAppliances(prev => prev.map(a => {
              if (a.id === selectedNodeId) {
                return { ...a, snr: 18.5, cpu: Math.max(10, a.cpu - 8) };
              }
              return a;
            }));

            prevention = {
              appliance: activeAppliance.name,
              action: "Wi-Fi Spectrum Optimization",
              metricsBefore: `SNR Margin: ${activeAppliance.snr} dB`,
              metricsAfter: `SNR Margin: 18.5 dB (Excellent)`,
              savings: "$150 Truck Roll Saved (No dispatch needed for slow Wi-Fi complaints)"
            };
          } else {
            output = [
              `[WARNING] optimize_wifi is only supported on local wireless access devices (CPE Gateways).`,
              `[FAIL] Device '${activeAppliance.name}' has no active wireless antennas.`
            ];
          }
          break;

        case "diagnose":
          output = [
            `[DIAGNOSTIC] Initiating full system telemetry hardware scan...`,
            `[CPU] Cores: 4 | Thread occupancy: OK | Load average: ${(activeAppliance.cpu / 100).toFixed(2)}`,
            `[RAM] Circular queues: active | Fragmentation index: 0.12 | OK`,
            `[NETWORK] IP: ${activeAppliance.ip} | MAC: ${activeAppliance.mac} | Ping to gateway: 1.25ms`,
            `[RF-OPTICS] Physical SNR Margin: ${activeAppliance.snr} dB | Attenuation: ${activeAppliance.attenuation} dB`,
            `[STATUS] Diagnostic completed. Hardware integrity: 98.4%.`,
            `[RECOMMENDATION] ${activeAppliance.cpu > 75 ? "Run 'clear_cache' or 'reboot' to lower resource load." : "System operating within acceptable margins."}`
          ];
          break;

        case "ping":
          output = [
            `PING ${activeAppliance.ip} (${activeAppliance.ip}) 56(84) bytes of data.`,
            `64 bytes from ${activeAppliance.ip}: icmp_seq=1 ttl=64 time=1.12 ms`,
            `64 bytes from ${activeAppliance.ip}: icmp_seq=2 ttl=64 time=0.98 ms`,
            `64 bytes from ${activeAppliance.ip}: icmp_seq=3 ttl=64 time=1.05 ms`,
            `--- ${activeAppliance.ip} ping statistics ---`,
            `3 packets transmitted, 3 received, 0% packet loss, time 2004ms`,
            `rtt min/avg/max/mdev = 0.98/1.05/1.12/0.05 ms`
          ];
          break;

        default:
          output = [
            `Command '${commandStr}' not recognized.`,
            `Type 'help' to view the list of remote remediation commands.`
          ];
          break;
      }

      // Append command output
      setTerminalLogs(prev => [
        ...prev,
        ...output,
        `usp-cli@${activeAppliance.id}:~$ `
      ]);

      setIsExecuting(false);

      // Trigger Syslog result broadcast
      const successEvent = new CustomEvent("syslog-event", {
        detail: {
          message: `[REMEDIATION] Remote CLI action on node '${activeAppliance.name}' succeeded. Command: ${cleanCmd.toUpperCase()}`,
          level: "success"
        }
      });
      window.dispatchEvent(successEvent);

      // Drops global network backpressure temporarily as a physical remediation fix
      setBackpressureValue(prev => Math.max(5, prev - 12));

      if (prevention) {
        setLastPreventionAlert(prevention);
        // Increment automated fix count on dashboard
        const fixEvent = new CustomEvent("increment-auto-fix", {
          detail: {
            appliance: activeAppliance.name,
            action: prevention.action
          }
        });
        window.dispatchEvent(fixEvent);
      }

    }, 1000);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim() || isExecuting) return;
    const cmd = cliInput;
    setCliInput("");
    runCommand(cmd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-5xl h-[85vh] rounded-3xl border-2 flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
        isLight ? "bg-white border-slate-200" : "bg-[#090d16] border-slate-800"
      }`}>
        
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/40 border-slate-800"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <TerminalIcon size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-black uppercase tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
                  {t("title")}
                </h3>
                <span className="text-[9px] font-mono font-black bg-emerald-500/15 text-emerald-500 border border-emerald-500/35 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                  USP-2.0 CORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-1">
                Remotely control subscriber appliances in real-time, averting operational field tech rolls.
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight 
                ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-950" 
                : "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow flex flex-col md:flex-row min-h-0">
          
          {/* Left Sidebar - Appliance Selection & Physical Stats gauges */}
          <div className={`w-full md:w-80 border-r flex flex-col p-4 gap-4 shrink-0 overflow-y-auto ${
            isLight ? "bg-slate-50/50 border-slate-200" : "bg-slate-950/20 border-slate-800"
          }`}>
            
            {/* Device Dropdown Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-black uppercase text-slate-500">
                {t("select_node")}
              </label>
              <select
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className={`w-full p-2.5 rounded-xl border-2 text-xs font-mono font-black cursor-pointer transition-all ${
                  isLight 
                    ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300" 
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
              >
                {appliances.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.acronym})
                  </option>
                ))}
              </select>
            </div>

            {/* Appliance Details Card */}
            <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${
              isLight ? "bg-white border-slate-200" : "bg-slate-950/60 border-slate-900"
            }`}>
              <div className="flex items-center justify-between border-b pb-1.5 border-slate-500/10">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Device Specification</span>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-black ${
                  activeAppliance.cpu > 75 
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : activeAppliance.cpu > 50
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {activeAppliance.cpu > 75 ? "DEGRADED" : "HEALTHY"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono">
                <span className="text-slate-500">Classification:</span>
                <span className="text-slate-300 truncate font-bold text-right">{activeAppliance.acronym}</span>
                
                <span className="text-slate-500">Management IP:</span>
                <span className="text-slate-300 font-bold text-right">{activeAppliance.ip}</span>

                <span className="text-slate-500">Hardware MAC:</span>
                <span className="text-slate-300 font-bold text-right text-[10px] truncate">{activeAppliance.mac}</span>

                <span className="text-slate-500">Firmware Rev:</span>
                <span className="text-slate-400 font-bold text-right truncate">{activeAppliance.firmware}</span>

                <span className="text-slate-500">Region:</span>
                <span className="text-slate-400 font-bold text-right truncate">{activeAppliance.location.split("-")[0]}</span>
              </div>

              <p className="text-[10px] text-slate-400 leading-normal border-t pt-1.5 mt-1 border-slate-500/10">
                {activeAppliance.description}
              </p>
            </div>

            {/* Diagnostic Gauges Section */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-mono font-black uppercase text-slate-500 flex items-center gap-1">
                <Gauge size={12} className="text-sky-400" />
                {t("diagnostics")}
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* CPU Gauge */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${
                  activeAppliance.cpu > 75 
                    ? "border-rose-500/20 bg-rose-500/5 text-rose-400" 
                    : isLight ? "bg-white border-slate-200" : "bg-slate-950/40 border-slate-900"
                }`}>
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">CPU LOAD</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-mono font-black text-slate-200">{activeAppliance.cpu}%</span>
                    <Cpu size={14} className={activeAppliance.cpu > 75 ? "animate-pulse" : "text-slate-500"} />
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full ${activeAppliance.cpu > 75 ? "bg-rose-500" : activeAppliance.cpu > 50 ? "bg-amber-500" : "bg-emerald-500"}`} 
                      style={{ width: `${activeAppliance.cpu}%` }} 
                    />
                  </div>
                </div>

                {/* RAM Gauge */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${
                  activeAppliance.memory > 85 
                    ? "border-rose-500/20 bg-rose-500/5 text-rose-400" 
                    : isLight ? "bg-white border-slate-200" : "bg-slate-950/40 border-slate-900"
                }`}>
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">MEMORY USE</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-mono font-black text-slate-200">{activeAppliance.memory}%</span>
                    <Layers size={14} className={activeAppliance.memory > 85 ? "animate-pulse" : "text-slate-500"} />
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full ${activeAppliance.memory > 85 ? "bg-rose-500" : activeAppliance.memory > 60 ? "bg-amber-500" : "bg-emerald-500"}`} 
                      style={{ width: `${activeAppliance.memory}%` }} 
                    />
                  </div>
                </div>

                {/* SNR Gauge */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${
                  isLight ? "bg-white border-slate-200" : "bg-slate-950/40 border-slate-900"
                }`}>
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">SNR MARGIN</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-mono font-black text-slate-200">{activeAppliance.snr} dB</span>
                    <Wifi size={14} className="text-slate-500" />
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full ${activeAppliance.snr < 13 ? "bg-amber-500" : "bg-emerald-500"}`} 
                      style={{ width: `${Math.min(100, activeAppliance.snr * 3)}%` }} 
                    />
                  </div>
                </div>

                {/* Laser/Attenuation Gauge */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${
                  activeAppliance.attenuation > 30 
                    ? "border-rose-500/20 bg-rose-500/5 text-rose-400" 
                    : isLight ? "bg-white border-slate-200" : "bg-slate-950/40 border-slate-900"
                }`}>
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">LINE LOSS</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-mono font-black text-slate-200">{activeAppliance.attenuation} dB</span>
                    <Radio size={14} className={activeAppliance.attenuation > 30 ? "text-rose-400" : "text-slate-500"} />
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full ${activeAppliance.attenuation > 28 ? "bg-rose-500" : "bg-emerald-500"}`} 
                      style={{ width: `${Math.min(100, activeAppliance.attenuation * 2.5)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Remediations Buttons inside Left Side */}
            <div className="flex flex-col gap-1.5 mt-auto">
              <span className="text-[10px] font-mono font-black uppercase text-slate-500">
                Quick Command Macro Links
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => runCommand("reboot")}
                  disabled={isExecuting}
                  className="p-2 rounded-xl border text-[10px] font-mono font-black flex items-center gap-1.5 justify-center cursor-pointer hover:bg-sky-500/10 hover:border-sky-500/30 text-sky-400 border-sky-500/10 transition-all active:scale-95"
                >
                  <RotateCcw size={11} />
                  Reboot
                </button>
                <button
                  onClick={() => runCommand("clear_cache")}
                  disabled={isExecuting}
                  className="p-2 rounded-xl border text-[10px] font-mono font-black flex items-center gap-1.5 justify-center cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/30 text-indigo-400 border-indigo-500/10 transition-all active:scale-95"
                >
                  <Wrench size={11} />
                  Purge
                </button>
                <button
                  onClick={() => runCommand("optimize_wifi")}
                  disabled={isExecuting}
                  className="p-2 rounded-xl border text-[10px] font-mono font-black flex items-center gap-1.5 justify-center cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-400 border-emerald-500/10 transition-all active:scale-95"
                >
                  <Wifi size={11} />
                  Channel
                </button>
                <button
                  onClick={() => runCommand("calibrate")}
                  disabled={isExecuting}
                  className="p-2 rounded-xl border text-[10px] font-mono font-black flex items-center gap-1.5 justify-center cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-400 border-amber-500/10 transition-all active:scale-95"
                >
                  <Radio size={11} />
                  Laser
                </button>
              </div>
            </div>

          </div>

          {/* Right Core Panel - Main CLI Terminal & Savings prevention overlay */}
          <div className="flex-grow flex flex-col min-h-0 bg-slate-950 p-4 relative">
            
            {/* Live Command-Line Console header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                {t("terminal_title")} (CPE IP: {activeAppliance.ip})
              </span>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded font-bold border border-slate-800">
                MODE: CLOSED-LOOP USP TR-369
              </span>
            </div>

            {/* Simulated Live Terminal View */}
            <div className="flex-grow overflow-y-auto font-mono text-xs text-sky-400 flex flex-col gap-1 pr-1.5 select-text">
              {terminalLogs.map((log, index) => {
                if (log.startsWith("usp-cli@")) {
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <span className="text-emerald-500 font-bold">usp-cli@{activeAppliance.id}:~$</span>
                      <span className="text-slate-100 font-bold">{log.replace(/^[a-z\-@0-9:\s~#\$]+/, "")}</span>
                    </div>
                  );
                }
                const isHeader = log.startsWith("===") || log.includes("[SECURE CHANNEL]");
                const isSuccess = log.includes("[SUCCESS]") || log.includes("returned STATUS: 200 OK");
                const isError = log.includes("[FAIL]") || log.includes("[WARNING]") || log.startsWith("Command '");
                
                return (
                  <div 
                    key={index} 
                    className={`leading-relaxed whitespace-pre-wrap ${
                      isHeader ? "text-indigo-400 font-semibold" : 
                      isSuccess ? "text-emerald-400 font-bold" :
                      isError ? "text-rose-400" :
                      log.startsWith("Available Commands") ? "text-amber-300" : "text-sky-300"
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
              {isExecuting && (
                <div className="flex items-center gap-2 text-amber-400 font-bold animate-pulse mt-1">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>{t("executing")}</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Savings Prevention Alert Popup Overlay (Averting Truck Roll) */}
            {lastPreventionAlert && (
              <div className="absolute bottom-16 left-4 right-4 z-20 bg-[#0d1e21] border border-emerald-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-bounce">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                      {t("truck_rolls_prevented")}
                    </span>
                    <h4 className="text-[12px] font-black text-slate-100 uppercase mt-0.5">
                      {lastPreventionAlert.action} successfully calibrated on {lastPreventionAlert.appliance}
                    </h4>
                    <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-400 font-mono mt-1">
                      <span>BEFORE: <strong className="text-rose-400">{lastPreventionAlert.metricsBefore}</strong></span>
                      <span>•</span>
                      <span>AFTER: <strong className="text-emerald-400 font-black">{lastPreventionAlert.metricsAfter}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col text-right items-end self-stretch sm:self-auto justify-between shrink-0">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase">TIM ROI ADVANTAGE</span>
                  <span className="text-xs font-black text-emerald-400 font-mono mt-0.5 tracking-tight uppercase">
                    {t("truck_roll_saved")}
                  </span>
                </div>
              </div>
            )}

            {/* CLI Console Input field */}
            <form onSubmit={handleCliSubmit} className="mt-2 flex items-center gap-2 border-t border-slate-900 pt-3 shrink-0">
              <span className="text-emerald-500 font-mono font-bold text-xs">usp-cli@{activeAppliance.id}:~$</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder={t("cli_placeholder")}
                disabled={isExecuting}
                className="flex-grow bg-slate-950 font-mono text-xs text-slate-200 outline-none border-b border-transparent focus:border-sky-500/40 pb-0.5 transition-colors"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={isExecuting || !cliInput.trim()}
                className={`p-1.5 rounded-lg text-xs font-mono font-black flex items-center gap-1 cursor-pointer transition-all ${
                  isExecuting || !cliInput.trim() 
                    ? "bg-slate-900 text-slate-650 cursor-not-allowed" 
                    : "bg-sky-500 text-slate-950 hover:bg-sky-400 active:scale-95"
                }`}
              >
                <CornerDownLeft size={11} />
                <span>RUN</span>
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
