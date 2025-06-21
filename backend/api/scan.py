from fastapi import APIRouter, Query
from fastapi import Request
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


def validate_target(ip: str):
    try:
        socket.gethostbyname(ip)
        return True
    except socket.gaierror:
        return False


class ReportRequest(BaseModel):
    target: str
    results: List[ScanResult]

@router.get("/scan")
def scan(ip: str, request: Request):
    if not validate_target(ip):
        return JSONResponse(status_code=400, content={"error": "❌ Invalid IP or domain. Please check your input."})
    try:
        # Extract advanced options from query params
        options = {
            "ports": request.query_params.get("ports", ""),
            "udp": request.query_params.get("udp", "false").lower() == "true",
            "timing": request.query_params.get("timing", "T4"),
            "script": request.query_params.get("script", "vulners")
        }

        results = run_nmap(ip, options)
        return JSONResponse(content={"results": results})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})




@router.post("/generate_report")
def create_report(data: dict):
    target = data.get("target")
    results = data.get("results", [])
    pdf_bytes = generate_pdf_report(target, results)
    return Response(content=pdf_bytes, media_type="application/pdf")