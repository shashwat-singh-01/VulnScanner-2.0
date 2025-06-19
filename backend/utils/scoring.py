def get_port_risk(port):
    high_risk = [21, 23, 3306, 3389, 445]  # FTP, Telnet, MySQL, RDP, SMB
    medium_risk = [22, 80, 443, 25, 110]   # SSH, HTTP, HTTPS, SMTP, POP3
    
    if port in high_risk:
        return "high"
    elif port in medium_risk:
        return "medium"
    else:
        return "low"
