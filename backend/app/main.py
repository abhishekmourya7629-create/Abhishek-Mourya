import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .models.database import init_db
from .data.seed_generator import generate_synthetic_data
from .api.router import router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Multilingual Citizen Demand Intelligence Platform for BRICS Nations (Digital Public Good)"
)

# CORS configuration for development and local networks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    generate_synthetic_data(target_count=1500)
    print(f"NAGRIK API {settings.VERSION} online. Pluggable LLM: {settings.LLM_PROVIDER}")

# Mount API router
app.include_router(router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.APP_NAME,
        "version": settings.VERSION,
        "dpg_certification": "Digital Public Good Standard Compliant",
        "brics_sovereign_nodes": ["India (DPDP)", "Brazil (LGPD)", "South Africa (POPIA)", "Russia (152-FZ)", "China (PIPL)"],
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
