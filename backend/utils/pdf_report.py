from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from io import BytesIO
from xml.sax.saxutils import escape
from datetime import datetime

def generate_pdf_report(target, results):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()

    # Custom styles
    header_style = ParagraphStyle(
        "Header", parent=styles["Heading1"], fontSize=18, spaceAfter=10, textColor=colors.darkblue)
    subheader_style = ParagraphStyle(
        "SubHeader", parent=styles["Heading2"], fontSize=13, spaceAfter=6, textColor=colors.HexColor("#333"))
    normal_style = ParagraphStyle(
        "NormalText", parent=styles["Normal"], fontSize=10, leading=14)

    story = []

    # Title section
    story.append(Paragraph("🔐 <b>VulnScanner Security Report</b>", header_style))
    story.append(Paragraph(f"📍 <b>Target:</b> {escape(str(target))}", normal_style))
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

    # Vulnerabilities section
    for item in results:
        vulns = item.get("vulnerability", [])
        if isinstance(vulns, list) and vulns:
            story.append(Paragraph(
                f"🔎 <b>Vulnerabilities on Port {escape(str(item['port']))} ({escape(str(item.get('service', '-')))})</b>",
                subheader_style
            ))

            for vuln in vulns:
                try:
                    cve = vuln.get("id", "-")
                    title = vuln.get("title", "-")
                    cvss = vuln.get("cvss", "-")
                    solution = vuln.get("solution", "-")

                    # Fallback for CVSS
                    if not cvss or str(cvss).lower() in ['null', 'none']:
                        try:
                            tokens = title.split()
                            cvss = tokens[0] if tokens[0].replace('.', '', 1).isdigit() else "-"
                        except:
                            cvss = "-"

                    # Fallback for solution from URL in title
                    if not solution or solution.strip() == "-":
                        try:
                            tokens = title.split()
                            last_token = tokens[-1]
                            solution = "Refer: " + last_token if "http" in last_token else "-"
                        except:
                            solution = "-"

                    story.append(Paragraph(f"<b>🛡️ {escape(str(cve))}</b>: {escape(str(title))}", normal_style))
                    story.append(Paragraph(f"• <b>CVSS Score:</b> {escape(str(cvss))}", normal_style))
                    story.append(Paragraph(f"• <b>Recommended Fix:</b> {escape(str(solution))}", normal_style))
                    story.append(Spacer(1, 8))

                except Exception:
                    story.append(Paragraph("<b>⚠️ Skipped malformed vulnerability entry</b>", normal_style))
                    story.append(Spacer(1, 6))
                    continue

    # Build PDF
    doc.build(story)
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data
