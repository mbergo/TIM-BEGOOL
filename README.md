<div align="center">
<img width="1200" height="475" alt="TIM Beergol AuroraOps Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# TIM-Beergol AuroraOps

An interactive, high-fidelity real-time network telemetry and AI-driven monitoring pipeline simulation dashboard designed for **Telecom Italia (TIM)**. It simulates the capture, aggregation, ingestion, ETL, and AI inference phases of network diagnostic operations, showing both low-level technical telemetry logs and executive-level business/ROI metrics (targeting a **480% ROI by Year 3**).

---

## 🚀 The 6-Stage Telemetry & AI Pipeline

The application visualizes a state-of-the-art telemetry and AI processing pipeline:

1. **Step 1: Home CPE Edge Capture (Subscriber CPE)**  
   Captures raw physical layer metrics (Wi-Fi noise floor, RX optical power, FEC errors, CPU loads) at 1-second intervals directly from broadband gateways and video set-tops without crashing modems. Saves €101,500/month by avoiding 1,450 unnecessary dispatches.

2. **Step 2: GPON OLT & Edge Aggregation**  
   Consolidates massive physical telemetry at Optical Line Terminals (OLT) and virtual CCAP router edges. Isolates group faults (e.g. cut fiber lines) from individual residential issues. Saves €42,000/month.

3. **Step 3: USP MQTT Control Plane**  
   Secures the transport of asynchronous telemetry state changes over the TR-369 User Services Platform (USP) protocol. Swaps heavy HTTP/XML status checks for lightweight binary-serialized Protobuf streams over TLS. Saves €18,000/month in cloud bandwidth egress.

4. **Step 4: Kafka Ingest & Queue Stream**  
   Ingests telemetry streams. Employs embedded Apache MiNiFi agents on gateways/OLTs to pre-filter and drop 90% of redundant static noise at the edge before sending to Kafka. Saves €35,000/month in central Kafka cluster costs.

5. **Step 5: Databricks Stateful ETL**  
   Normalizes and joins data in Delta Lake for cold-path analytical tracking, audits, and GNN model training. Filters out 94% of useless static noise, shrinking cloud compute bills by 65% (€48,000/month).

6. **Step 6: Beegol Cloud Results & RCA**  
   Consumes Kafka topics directly in real-time (hot path) for sub-second Root Cause Analysis (RCA) inference via deep neural networks (98.42% accuracy). Automatically triggers self-healing routines (e.g. Wi-Fi channel shifts), preventing 21.4% of all truck dispatches and saving €180,000/month.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 & TypeScript
- **Styling**: Tailwind CSS & Lucide Icons (premium dark-mode styling with high-contrast indicator highlights)
- **Charts & Visualization**: Recharts (for AI anomaly spectrum graphs and diagnostic telemetry curves)
- **Production Server**: Express.js (Node.js) wrapper for serving compiled static bundles on cloud runtimes
- **Compilation Toolchain**: Vite 6

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Execution
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your Gemini API key in a `.env.local` file (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   # Add your key: GEMINI_API_KEY=your_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## ☁️ Deployment to Azure App Service

The application includes a production-ready Express server (`server.js`) that serves compiled frontend assets. The deployment is fully automated using a **Makefile** and the **Azure CLI (`az`)**.

### Deployment Prerequisites
1. Install the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
2. Log in to your Azure account:
   ```bash
   az login
   ```
3. Ensure you have the proper active subscription selected.

### Automated Deployment using `make`

The `Makefile` at the root of the project contains targets to provision Azure infrastructure, package the application, and deploy it.

#### 1. Customize Variables (Optional)
You can configure your target deployment parameters by editing the variables at the top of the `Makefile` or overriding them on the command line:
- `APP_NAME`: Name of your Azure Web App (must be globally unique, e.g. `tim-beergol-ops`)
- `RG_NAME`: Azure Resource Group name (e.g. `rg-tim-beegol`)
- `PLAN_NAME`: App Service Plan name
- `LOCATION`: Azure region (e.g. `westeurope`, `eastus`)
- `SKU`: Plan pricing tier (defaults to `B1` for standard Node workloads)
- `RUNTIME`: Runtime environment (`NODE:20-lts`)

#### 2. Provision Azure Infrastructure
Run the following command to create the Resource Group, App Service Plan, and Web App instance:
```bash
make create-infra APP_NAME=your-app-name
```

#### 3. Package and Deploy the Application
Run the following target to install dependencies, compile the Vite app, bundle the production code into a zip archive (`deploy.zip`), and push it to Azure:
```bash
make deploy APP_NAME=your-app-name
```
*Your app will be deployed using Azure Zip Deploy and will run using `server.js` automatically.*

#### 4. Configure App Settings (Gemini API Key)
Set the required `GEMINI_API_KEY` environment variable in your Azure Web App:
```bash
make config-env KEY=GEMINI_API_KEY VALUE=your_api_key_here APP_NAME=your-app-name
```

#### 5. Monitor Application Logs
To watch the live log output from the running Node server on Azure:
```bash
make logs APP_NAME=your-app-name
```

#### 6. Clean Up Local Build Artifacts
Remove local compilation folders and the temporary deployment zip:
```bash
make clean
```
