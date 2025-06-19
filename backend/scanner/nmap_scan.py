import os
import socket
import nmap

# Manually add Nmap to PATH if not already in it
nmap_path = r"C:\Program Files (x86)\Nmap"
if nmap_path not in os.environ["PATH"]:
    os.environ["PATH"] += os.pathsep + nmap_path

def run_nmap(ip_or_domain):
    try:
        print(f"[INFO] Input: {ip_or_domain}")

        # Step 1: Resolve domain to IP
        resolved_ip = socket.gethostbyname(ip_or_domain)
        print(f"[INFO] Resolved to IP: {resolved_ip}")

        nm = nmap.PortScanner()

        # Step 2: Perform scan
        nm.scan(resolved_ip, arguments='-Pn -sS -sV -T4 --top-ports 100')

        if resolved_ip not in nm.all_hosts():
            return {"error": f"No scan results for {ip_or_domain}. Resolved IP: {resolved_ip}"}

        results = []
        for proto in nm[resolved_ip].all_protocols():
            ports = nm[resolved_ip][proto].keys()
            for port in ports:
                state = nm[resolved_ip][proto][port]['state']
                name = nm[resolved_ip][proto][port].get('name', '')
                product = nm[resolved_ip][proto][port].get('product', '')
                version = nm[resolved_ip][proto][port].get('version', '')

                results.append({
                    "protocol": proto,
                    "port": port,
                    "state": state,
                    "service": name,
                    "product": product,
                    "version": version
                })

        return results

    except socket.gaierror:
        return {"error": f"DNS resolution failed for {ip_or_domain}"}
    except Exception as e:
        print(f"[ERROR] Nmap failed: {e}")
        return {"error": str(e)}
