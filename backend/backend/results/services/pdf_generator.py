import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_student_pdf(student_result):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Header
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 750, "Loyola Institute of Technology & Management")
    p.setFont("Helvetica", 12)
    p.drawString(100, 730, "Official Result Statement")
    
    # Student Info
    p.drawString(100, 680, f"Hall Ticket Number: {student_result.hall_ticket_number}")
    p.drawString(100, 660, f"SGPA: {student_result.sgpa}")
    p.drawString(100, 640, f"CGPA: {student_result.cgpa}")
    
    # Grades
    p.drawString(100, 600, "Grades:")
    y = 580
    for grade in student_result.course_grades.all():
        p.drawString(120, y, f"{grade.course_code} - {grade.course_name} : {grade.grade} ({grade.grade_points})")
        y -= 20
        
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer
