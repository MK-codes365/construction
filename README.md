# Green Track (WasteWise)

A full-stack construction waste management platform that helps site teams log, visualize, analyze, and reduce construction waste. Built with a modern React + Next.js frontend, server-side microservices, an AI assistant microservice, and Solidity smart contracts for auditable on-chain records.

---

## Table of contents

- [What it does](#what-it-does)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Architecture & services](#architecture--services)
- [Quickstart (Windows / cmd.exe)](#quickstart-windows--cmdexe)
- [Where to look (important files)](#where-to-look-important-files)
- [Development notes & next steps](#development-notes--next-steps)
- [Contributing](#contributing)
- [License](#license)

---

## What it does

Green Track (a.k.a. WasteWise) helps construction projects capture waste records at the point of work, visualize trends across sites, and produce audit-ready sustainability reports. It includes: structured waste logging, photo verification, geospatial site visualization, dashboards and charts, AI-powered classification and predictions, and blockchain-backed logs for tamper-evident records.

Primary users: site managers, project managers, sustainability teams, and auditors.

## Key features

- Digital waste logging (material, quantity, site, disposal method, cause, optional bin ID and photo)
- Photo verification + image recognition (AI-assisted classification)
- Interactive site map with geospatial markers
- Real-time dashboard and analytics (trends, recycling/diversion rates, GreenScore)
- Automated report generation (PDF / CSV) for compliance
- Predictive analytics and smart alerts
- Smart contract integration for auditable on-chain events (Hardhat + ethers.js)
- Optional AR/VR modules for blueprint viewing and safety training

## Tech stack

- Frontend: Next.js (App Router), React 18, TypeScript
- Styling: Tailwind CSS, PostCSS
- UI/UX: Radix UI, lucide-react icons, framer-motion
- Forms & validation: react-hook-form, zod
- Mapping & visualization: Leaflet, react-leaflet, Mapbox GL, react-map-gl, @react-google-maps/api, recharts, three.js
- Backend (Node): Express, cors, dotenv, Firebase (client SDK), ethers.js
- Blockchain: Solidity contracts, Hardhat, @nomiclabs/hardhat-ethers
- AI microservice: Python, FastAPI, Uvicorn (see `backend/ai-service`)
- Utilities: date-fns, jsPDF + jsPDF-AutoTable, patch-package, genkit

> Exact dependencies are declared in `package.json` (`next`, `react`, `tailwindcss`, `hardhat`, etc.) and `backend/ai-service/requirements.txt` (FastAPI & Uvicorn).

## Architecture & services

- Frontend (Next.js app) serves UI and communicates with client-side services in `src/services/*`.
- Node microservices live under `backend/` (e.g., `ar-service`, `gis-service`, `blockchain-listener`).
- Python AI microservice at `backend/ai-service` provides image classification and prediction endpoints.
- Blockchain artifacts and deployment scripts are in `blockchain/` and `contracts/` (Hardhat tooling included).

These components can run independently for development or be composed with container tooling for integration testing.

## Quickstart (Windows / cmd.exe)

Open a single terminal per service and run these commands from the repository root `d:\construction`.

1) Install root / frontend dependencies

```bash
cd d:\construction
npm install
```

2) Run the Next.js development server (default script in `package.json`)

```bash
npm run dev
# runs: next dev --turbopack -p 9002
```

3) Example: start the AR Node service

```bash
cd d:\construction\backend\ar-service
npm install
node index.js
```

4) Start the AI microservice (Python)

```bash
cd d:\construction\backend\ai-service
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
```

Notes
- The Python command assumes `main.py` exposes a FastAPI `app` variable. Adjust `module:app` if the entrypoint name differs.
- Check individual backend folders for their own `package.json` and README (some services may have custom start scripts).

## Where to look (important files)

- Frontend entry: `src/app/` (landing, dashboard, pages)
- Waste logging UI: `src/components/waste-log-form.tsx` and `src/app/log-waste/page.tsx`
- Client services: `src/services/` and `src/lib/` (sample data, utilities)
- Backend services: `backend/` (`ar-service`, `gis-service`, `blockchain-listener`, `ai-service`)
- Smart contracts & deployment: `contracts/`, `blockchain/`, and Hardhat config files
- Project manifest: `package.json`, `backend/ai-service/requirements.txt`

## Development notes & next steps

- Add a `CONTRIBUTING.md` with per-service ports, environment variables, and example environment files (`.env.example`).
- Consider a `docker-compose.yml` to orchestrate the Next.js app, Node services, and the Python AI service locally.
- Add unit/integration tests for critical flows (waste logging, AI classification, blockchain event handling).

If you'd like, I can:
- add per-service quickstart commands automatically by scanning each `backend/*` for `package.json` and start scripts,
- create a `docker-compose.yml` to run the main services together,
- generate a `CONTRIBUTING.md` and `.env.example`.

## Contributing

Contributions are welcome. Please open issues or submit PRs. For local development, follow the Quickstart steps above and add any required environment variables to a local `.env` file (do not commit secrets).

## License

This repository currently has no license file. Add a `LICENSE` if you want to specify reuse terms.

---

Last updated: 2025-11-06


