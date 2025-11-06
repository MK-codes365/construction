# Deploying blockchain-listener

This document outlines quick ways to deploy the `blockchain-listener` backend so the Next.js app can proxy anchoring requests to it via `BLOCKCHAIN_SERVICE_URL`.

Important env variables
- `NODE_ENV` - set to `production` in production
- `PORT` - port to listen on (default 4001)
- `ETH_RPC_URL` - RPC URL for the Ethereum network (Infura/Alchemy or your node)
- `MAINNET_PRIVATE_KEY` - Private key for sending transactions in production
- `PRIVATE_KEY` - Private key used for development/local deployments (if you use a testnet or local node)

Files added/updated
- `package.json` - adds `start` script
- `Dockerfile` - container image for Docker-based platforms

Quick deploy options

1) Deploy to Render (recommended quick deploy)
- Create a new Web Service on Render.
- Connect your GitHub repo and select the `backend/blockchain-listener` folder.
- Build command: `npm install`
- Start command: `npm start`
- Set environment variables in Render's dashboard (ETH_RPC_URL, MAINNET_PRIVATE_KEY, NODE_ENV=production, PORT=10000 or as required).
- After deploy, copy the public URL and set `BLOCKCHAIN_SERVICE_URL` in Vercel to `https://your-service.onrender.com`.

2) Deploy to Railway
- Create a new project and deploy from GitHub pointing to `backend/blockchain-listener`.
- Railway will auto-detect Node. Set env vars in Railway project settings.
- Use the generated URL and set `BLOCKCHAIN_SERVICE_URL` in Vercel.

3) Deploy with Docker (for VPS or Docker-enabled hosts)
- Build image locally:
  ```
  docker build -t blockchain-listener:latest backend/blockchain-listener
  docker run -e ETH_RPC_URL=https://... -e MAINNET_PRIVATE_KEY=... -p 4001:4001 blockchain-listener:latest
  ```
- Expose the host URL and set `BLOCKCHAIN_SERVICE_URL` in Vercel to point to that public URL.

4) Quick local run (for testing)
- From repo root:
  ```
  cd backend\blockchain-listener
  npm install
  set ETH_RPC_URL=http://localhost:8545
  set PRIVATE_KEY=<your-local-key>
  node index.js
  ```
- Confirm health: `http://localhost:4001/health`

Vercel integration
- In the Vercel project settings add an Environment Variable named `BLOCKCHAIN_SERVICE_URL` with the public URL of the hosted backend (for example `https://your-backend.example.com`).
- If you prefer the Next.js server on Vercel to anchor itself, set `ETH_RPC_URL` and `MAINNET_PRIVATE_KEY` in Vercel instead.
- Redeploy the Vercel app after changing env vars.

Notes & troubleshooting
- The backend expects ABI files under `blockchain/artifacts/...`. In production you should compile contracts and ensure the artifact files are included or provide contract ABIs another way.
- For production use, never commit private keys. Use the host's secrets/env var storage.
- If your backend is internal-only, Vercel won't be able to reach `http://localhost:4001` — you must host it publicly.

If you want, I can:
- Generate a minimal `docker-compose.yml` to run a local Hardhat node + backend for integration testing.
- Prepare a small Render deployment YAML if you plan to deploy to Render and want exact settings.
