print("main.py is running")
# AI Service (FastAPI)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import random
from datetime import datetime
import asyncio
from fastapi import WebSocket, WebSocketDisconnect, Request

# Keep track of connected websocket clients so we can broadcast updates
connected_clients = set()

@app.get("/ai/safety")
def get_ai_safety():
    # Simulate real-time AI safety alerts and predictions
    alerts = [
        {
            "timestamp": datetime.now().isoformat(),
            "type": random.choice(["Hazard", "Warning", "Info"]),
            "message": random.choice([
                "Worker not wearing helmet detected.",
                "Unsafe material stacking detected.",
                "All clear in Zone 3.",
                "High risk of slip in wet area.",
                "No issues detected.",
            ]),
            "confidence": round(random.uniform(0.7, 0.99), 2)
        }
        for _ in range(random.randint(1, 3))
    ]
    predictions = {
        "risk_score": round(random.uniform(0, 1), 2),
        "next_incident_estimate": f"{random.randint(1, 24)} hours"
    }
    return {"status": "ok", "alerts": alerts, "predictions": predictions}


@app.websocket('/ai/ws')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        # keep connection alive and send periodic simulated updates
        while True:
            alerts = [
                {
                    "timestamp": datetime.now().isoformat(),
                    "type": random.choice(["Hazard", "Warning", "Info"]),
                    "message": random.choice([
                        "Worker not wearing helmet detected.",
                        "Unsafe material stacking detected.",
                        "All clear in Zone 3.",
                        "High risk of slip in wet area.",
                        "No issues detected.",
                    ]),
                    "confidence": round(random.uniform(0.7, 0.99), 2)
                }
                for _ in range(random.randint(1, 3))
            ]
            predictions = {
                "risk_score": round(random.uniform(0, 1), 2),
                "next_incident_estimate": f"{random.randint(1, 24)} hours"
            }

            payload = {"status": "ok", "alerts": alerts, "predictions": predictions}
            try:
                await websocket.send_json(payload)
            except Exception:
                # client may have disconnected
                break

            # send updates every ~5 seconds
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
    finally:
        try:
            connected_clients.discard(websocket)
        except Exception:
            pass


async def broadcast(payload: dict):
    """Send payload to all connected websocket clients."""
    to_remove = []
    for ws in list(connected_clients):
        try:
            await ws.send_json(payload)
        except Exception:
            to_remove.append(ws)
    for ws in to_remove:
        try:
            connected_clients.discard(ws)
        except Exception:
            pass


@app.post('/ai/analyze')
async def analyze_log(request: Request):
    """Receive a waste log, return AI analysis and broadcast to websocket clients.

    This is a simple demonstration: analysis is heuristic-based and intended
    for demo/training. Replace with a real ML model or external AI call in production.
    """
    try:
        payload = await request.json()
    except Exception:
        return {"status": "error", "error": "invalid json"}

    # Simple heuristic analysis
    material = (payload.get('materialType') or '').lower()
    disposal = (payload.get('disposalMethod') or '').lower()
    quantity = float(payload.get('quantity') or 0)

    alerts = []
    risk_score = 0.2

    if 'chemical' in material or 'paint' in material or 'solvent' in material:
        alerts.append({
            'timestamp': datetime.now().isoformat(),
            'type': 'Hazard',
            'message': 'Potential hazardous material detected. Follow hazardous waste protocol.',
            'confidence': 0.95,
        })
        risk_score += 0.5

    if disposal == 'disposed' and quantity > 50:
        alerts.append({
            'timestamp': datetime.now().isoformat(),
            'type': 'Warning',
            'message': 'Large disposal reported. Verify disposal permits and documentation.',
            'confidence': 0.85,
        })
        risk_score += 0.2

    if quantity > 200:
        alerts.append({
            'timestamp': datetime.now().isoformat(),
            'type': 'Warning',
            'message': 'Very large quantity logged. Consider immediate site review.',
            'confidence': 0.9,
        })
        risk_score += 0.2

    # Clamp risk_score between 0 and 1
    risk_score = max(0, min(1, round(risk_score, 2)))

    predictions = {
        'risk_score': risk_score,
        'next_incident_estimate': f"{random.randint(1, 72)} hours",
    }

    result = {"status": "ok", "alerts": alerts, "predictions": predictions}

    # Broadcast the analysis to all connected WebSocket clients (don't block)
    try:
        asyncio.create_task(broadcast(result))
    except Exception:
        pass

    return result
