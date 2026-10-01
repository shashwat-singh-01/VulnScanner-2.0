# VulnScanner 2.0

VulnScanner 2.0 is a full-stack vulnerability scanning application with a **Next.js frontend** and a **FastAPI backend** powered by **Nmap**.

## Features

- Scan an IP address or domain for open ports and services
- Optional advanced scan settings:
  - Custom ports
  - UDP scan toggle
  - Nmap timing profile (`T1`, `T3`, `T4`, `T5`)
  - Custom Nmap script/category (default: `vulners`)
- Risk classification per discovered port
- Vulnerability list per port (including CVE/CVSS when available)
- Download PDF security report from scan results

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** FastAPI, python-nmap, ReportLab
- **Scanner Engine:** Nmap

## Repository Structure

- `/frontend` — Next.js UI
- `/backend` — FastAPI API and scanner logic

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Nmap installed and available in your system PATH

## Local Setup

### 1) Backend

```bash
cd /home/runner/work/VulnScanner-2.0/VulnScanner-2.0/backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`

### 2) Frontend

```bash
cd /home/runner/work/VulnScanner-2.0/VulnScanner-2.0/frontend
npm install
```

Create `.env.local` in `/frontend` with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

## API Endpoints

### `GET /scan`
Scan a target.

Query parameters:
- `ip` (required) — IP address or domain
- `ports` (optional) — comma-separated ports, e.g. `21,22,80`
- `udp` (optional) — `true` or `false`
- `timing` (optional) — `T1`, `T3`, `T4`, `T5`
- `script` (optional) — Nmap script/category (default `vulners`)

Example:

```bash
curl "http://localhost:8000/scan?ip=scanme.nmap.org&timing=T4&script=vulners"
```

### `POST /generate_report`
Generate a PDF report from scan results.

Example:

```bash
curl -X POST "http://localhost:8000/generate_report" \\
  -H "Content-Type: application/json" \\
  -d '{"target":"scanme.nmap.org","results":[]}' \\
  --output report.pdf
```

## Docker (Backend)

A backend Dockerfile is available at `/backend/Dockerfile`.

```bash
cd /home/runner/work/VulnScanner-2.0/VulnScanner-2.0
docker build -f backend/Dockerfile -t vulnscanner-backend .
docker run --rm -p 8000:8000 vulnscanner-backend
```

## Security & Legal Notice

Use this tool **only on systems you own or are explicitly authorized to test**.
Unauthorized scanning may violate laws or policies.
