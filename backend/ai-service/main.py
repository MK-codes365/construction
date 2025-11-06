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
