from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from io import BytesIO

from scanner.nmap_scan import run_nmap
from utils.pdf_report import generate_pdf_report

router = APIRouter()

@router.get("/scan")
def scan_target(ip: str = Query(..., description="Target IP address")):
    result = run_nmap(ip)
    return {
        "target": ip,
        "results": result
    }


# Define input schema for PDF report generation
class ScanResult(BaseModel):
    port: int
    protocol: str
    service: Optional[str] = ""
    product: Optional[str] = ""
    version: Optional[str] = ""
    risk: Optional[str] = "low"

class ReportRequest(BaseModel):
    target: str
    results: List[ScanResult]

@router.post("/generate_report")
def create_report(data: ReportRequest):
    pdf_bytes = generate_pdf_report(data.target, [r.dict() for r in data.results])
    pdf_io = BytesIO(pdf_bytes)
    
    return StreamingResponse(
        pdf_io,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=VulnScan_Report_{data.target}.pdf"}
    )
