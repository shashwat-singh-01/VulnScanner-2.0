import os
import socket
import nmap
from utils.scoring import get_port_risk

# Add Nmap to PATH if needed
nmap_path = r"C:\Program Files (x86)\Nmap"
if nmap_path not in os.environ["PATH"]:
    os.environ["PATH"] += os.pathsep + nmap_path

import os
import socket
import nmap
from utils.scoring import get_port_risk

# Ensure Nmap path is included
nmap_path = r"C:\Program Files (x86)\Nmap"
if nmap_path not in os.environ["PATH"]:
    os.environ["PATH"] += os.pathsep + nmap_path

def run_nmap(ip_or_domain, options=None):
    try:
        if options is None:
            options = {}

        print(f"[INFO] Input: {ip_or_domain}")
        resolved_ip = socket.gethostbyname(ip_or_domain)
        print(f"[INFO] Resolved to IP: {resolved_ip}")

        # Advanced options
        custom_ports = options.get("ports", "").strip()
        use_udp = options.get("udp", False)
        timing = options.get("timing", "T4")
        script = options.get("script", "vulners")

        # Build Nmap arguments dynamically
        scan_args = f"-Pn -sV -{'sU' if use_udp else 'sS'} -{timing}"

        if script:
            scan_args += f" --script {script}"

        if custom_ports:
            scan_args += f" -p {custom_ports}"
        else:
            scan_args += " --top-ports 100"

        print(f"[INFO] Final Nmap arguments: {scan_args}")
        nm = nmap.PortScanner()
        nm.scan(resolved_ip, arguments=scan_args)

        if resolved_ip not in nm.all_hosts():
            return {"error": f"The host '{ip_or_domain}' appears to be down or blocking probes."}

        results = []

        for proto in nm[resolved_ip].all_protocols():
            ports = nm[resolved_ip][proto].keys()
            for port in ports:
                state = nm[resolved_ip][proto][port]['state']
                name = nm[resolved_ip][proto][port].get('name', '')
                product = nm[resolved_ip][proto][port].get('product', '')
                version = nm[resolved_ip][proto][port].get('version', '')

                scripts = nm[resolved_ip][proto][port].get('script', {})
                vuln_info = []

                for key, output in scripts.items():
                    if 'CVE' in output:
                        for line in output.splitlines():
                            if "CVE" in line:
                                parts = line.strip().split()
                                cve_id = parts[0]
                                cvss = None
                                for p in parts:
                                    if "CVSS:" in p:
                                        try:
                                            cvss = float(p.replace("CVSS:", ""))
                                        except:
                                            pass
                                title = " ".join(
                                    [p for p in parts if not p.startswith("CVE") and not p.startswith("CVSS:")]
                                )
                                vuln_info.append({
                                    "id": cve_id,
                                    "cvss": cvss,
                                    "title": title
                                })
                    else:
                        vuln_info.append({"id": key, "title": output.strip()})

                results.append({
                    "protocol": proto,
                    "port": port,
                    "state": state,
                    "service": name,
                    "product": product,
                    "version": version,
                    "risk": get_port_risk(port),
                    "vulnerability": vuln_info or "None"
                })

        if not results:
            return {"error": f"The host '{ip_or_domain}' appears to be down or blocking probes."}

        return results

    except socket.gaierror:
        return {"error": f"DNS resolution failed for {ip_or_domain}"}
    except Exception as e:
        print(f"[ERROR] Nmap failed: {e}")
        return {"error": str(e)}
