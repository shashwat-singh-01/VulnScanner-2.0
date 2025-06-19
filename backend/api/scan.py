from fastapi import APIRouter, Query
from fastapi.responses import Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import json
import socket
from scanner.nmap_scan import run_nmap
from utils.pdf_report import generate_pdf_report

router = APIRouter()

# Updated Vulnerability model with nullable fields
class Vulnerability(BaseModel):
    id: str
    title: str
    cvss: Optional[str] = None
    solution: Optional[str] = None

class ScanResult(BaseModel):
    port: int
    protocol: str
    state: Optional[str] = None
    service: Optional[str] = None
    product: Optional[str] = None
    version: Optional[str] = None
    risk: Optional[str] = "low"
    vulnerability: Optional[List[Vulnerability]] = []

class ReportRequest(BaseModel):
    target: str
    results: List[ScanResult]

@router.get("/scan")
async def scan(ip: str):
    try:
        result = run_nmap(ip)
        if isinstance(result, dict) and "error" in result:
            return JSONResponse(status_code=200, content={"error": result["error"]})
        return {"results": result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Internal server error."})




@router.post("/generate_report")
def create_report(data: dict):
    target = data.get("target")
    results = data.get("results", [])
    pdf_bytes = generate_pdf_report(target, results)
    return Response(content=pdf_bytes, media_type="application/pdf")