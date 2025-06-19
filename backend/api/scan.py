from fastapi import APIRouter, Query
from scanner.nmap_scan import run_nmap

router = APIRouter()

@router.get("/scan")
def scan_target(ip: str = Query(..., description="Target IP address")):
    result = run_nmap(ip)
    return {
        "target": ip,
        "results": result
    }
