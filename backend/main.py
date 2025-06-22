# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import scan

app = FastAPI()

# Middleware for CORS (adjust `allow_origins` as needed for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes from the scan module
app.include_router(scan.router)

@app.get("/")
def read_root():
    return {"message": "VulnScanner API is running"}
