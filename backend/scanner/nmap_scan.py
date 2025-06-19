import os
import socket
import nmap
from utils.scoring import get_port_risk

# Add Nmap to PATH if needed
nmap_path = r"C:\Program Files (x86)\Nmap"
if nmap_path not in os.environ["PATH"]:
    os.environ["PATH"] += os.pathsep + nmap_path

def run_nmap(ip_or_domain):
    try:
        print(f"[INFO] Input: {ip_or_domain}")
        resolved_ip = socket.gethostbyname(ip_or_domain)
        print(f"[INFO] Resolved to IP: {resolved_ip}")

        nm = nmap.PortScanner()
        nm.scan(resolved_ip, arguments='-Pn -sS -sV -T4 --script vulners --top-ports 100')

        if resolved_ip not in nm.all_hosts():
            return {"error": f"The host '{ip_or_domain}' appears to be down or blocking ping probes."}


        results = []

        for proto in nm[resolved_ip].all_protocols():
            ports = nm[resolved_ip][proto].keys()
            for port in ports:
                state = nm[resolved_ip][proto][port]['state']
                name = nm[resolved_ip][proto][port].get('name', '')
                product = nm[resolved_ip][proto][port].get('product', '')
                version = nm[resolved_ip][proto][port].get('version', '')

                # Extract script output
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
                                title = " ".join([p for p in parts if not p.startswith("CVE") and not p.startswith("CVSS:")])
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
