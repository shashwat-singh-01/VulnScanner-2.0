# backend/utils/pdf_report.py
from fpdf import FPDF
from datetime import datetime

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 14)
        self.cell(0, 10, "VulnScanner Report", ln=1, align="C")

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 10)
        self.set_text_color(128)
        self.cell(0, 10, "© 2025 Shashwat Singh | VulnScanner", align="C")

def generate_pdf_report(target, results):
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(0, 10, f"Target: {target}", ln=True)
    pdf.cell(0, 10, f"Scan Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.ln(5)

    pdf.set_fill_color(200, 220, 255)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(20, 8, "Port", 1, 0, "C", 1)
    pdf.cell(20, 8, "Proto", 1, 0, "C", 1)
    pdf.cell(30, 8, "Service", 1, 0, "C", 1)
    pdf.cell(30, 8, "Product", 1, 0, "C", 1)
    pdf.cell(30, 8, "Version", 1, 0, "C", 1)
    pdf.cell(25, 8, "Risk", 1, 1, "C", 1)

    pdf.set_font("Arial", "", 10)
    for item in results:
        pdf.cell(20, 8, str(item.get("port", "-")), 1)
        pdf.cell(20, 8, item.get("protocol", "-"), 1)
        pdf.cell(30, 8, item.get("service", "-"), 1)
        pdf.cell(30, 8, item.get("product", "-"), 1)
        pdf.cell(30, 8, item.get("version", "-"), 1)
        pdf.cell(25, 8, item.get("risk", "-"), 1, ln=1)

    return pdf.output(dest="S").encode("latin1")
