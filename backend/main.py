# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import scan

from utils.scoring import get_port_risk


app = FastAPI()

# Allow frontend dev access (adjust for prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include scanning route
app.include_router(scan.router)

@app.get("/")
def read_root():
    return {"message": "VulnScanner API is running"}
