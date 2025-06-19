from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from io import BytesIO
from datetime import datetime

def generate_pdf_report(target, results):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()

    # Custom styles
    header_style = ParagraphStyle("Header", parent=styles["Heading1"], fontSize=18, spaceAfter=10, textColor=colors.darkblue)
    subheader_style = ParagraphStyle("SubHeader", parent=styles["Heading2"], fontSize=13, spaceAfter=6, textColor=colors.HexColor("#333"))
    normal_style = ParagraphStyle("NormalText", parent=styles["Normal"], fontSize=10, leading=14)

    story = []

    # Title section
    story.append(Paragraph("🔐 <b>VulnScanner Security Report</b>", header_style))
    story.append(Paragraph(f"📍 <b>Target:</b> {target}", normal_style))
    story.append(Paragraph(f"🕒 <b>Scan Time:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    story.append(Spacer(1, 12))

    # Ports/Services Table
    data = [["Port", "Protocol", "Service", "Product", "Version", "Risk"]]
    for item in results:
        data.append([
            str(item.get("port", "-")),
            item.get("protocol", "-"),
            item.get("service", "-"),
            item.get("product", "-"),
            item.get("version", "-"),
            item.get("risk", "-").capitalize()
        ])
    table = Table(data, hAlign="LEFT")
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#f5f5f5")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(table)
    story.append(Spacer(1, 16))

    # Vulnerabilities
    for item in results:
        vulns = item.get("vulnerability", [])
        if vulns:
            story.append(Paragraph(f"🔎 <b>Vulnerabilities on Port {item['port']} ({item.get('service', '-')})</b>", subheader_style))
            for vuln in vulns:
                cve = vuln.get("id", "-")
                title = vuln.get("title", "-")
                
                # Extract score from title if cvss is None
                cvss = vuln.get("cvss")
                if not cvss or not isinstance(cvss, (float, int, str)) or str(cvss).lower() == 'null':
                    try:
                        cvss = title.split()[0] if title.split()[0].replace('.', '').isdigit() else "-"
                    except:
                        cvss = "-"

                # Solution: derive from URL if present
                solution = vuln.get("solution")
                if not solution or solution.strip() == "-":
                    try:
                        solution = "Refer: " + title.split()[-1] if "http" in title.split()[-1] else "-"
                    except:
                        solution = "-"

                story.append(Paragraph(f"<b>🛡️ {cve}</b>: {title}", normal_style))
                story.append(Paragraph(f"• <b>CVSS Score:</b> {cvss}", normal_style))
                story.append(Paragraph(f"• <b>Recommended Fix:</b> {solution}", normal_style))
                story.append(Spacer(1, 8))

    doc.build(story)
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data
