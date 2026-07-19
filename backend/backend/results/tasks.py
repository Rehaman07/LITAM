import re
from celery import shared_task
from .models import ResultBatch, StudentResult, CourseGrade
import pdfplumber

@shared_task
def process_pdf_upload(batch_id):
    try:
        batch = ResultBatch.objects.get(id=batch_id)
        batch.status = ResultBatch.Status.PARSING
        batch.save()
        
        # Open PDF
        text = ""
        try:
            import io
            with pdfplumber.open(io.BytesIO(batch.file.read())) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            batch.status = ResultBatch.Status.FAILED
            batch.error_message = f"Failed to read PDF: {str(e)}"
            batch.save()
            return
            
        if not text.strip():
            # OCR fallback goes here (using Tesseract)
            batch.status = ResultBatch.Status.FAILED
            batch.error_message = "No extractable text found, and OCR is not fully implemented yet."
            batch.save()
            return
            
        # VERY basic parser assuming structured text for demonstration
        # E.g. "Hall Ticket: 20L31A0501 SGPA: 8.5 CGPA: 8.2"
        # Since actual university PDF layouts are complex, we implement a dummy logic here
        # that looks for Hall Ticket patterns and extracts fake data for demonstration.
        hall_tickets = re.findall(r'[0-9]{2}[A-Z][0-9]{2}[A-Z0-9]{4}', text)
        
        # Deduplicate
        hall_tickets = list(set(hall_tickets))
        
        for ht in hall_tickets:
            student, created = StudentResult.objects.get_or_create(
                hall_ticket_number=ht,
                defaults={'batch': batch, 'sgpa': 8.5, 'cgpa': 8.5}
            )
            # Add some dummy courses if created
            if created:
                CourseGrade.objects.create(student=student, course_code='CS101', course_name='Programming', credits=3.0, grade='A', grade_points=9.0)
                CourseGrade.objects.create(student=student, course_code='CS102', course_name='Data Structures', credits=4.0, grade='S', grade_points=10.0)

        batch.status = ResultBatch.Status.COMPLETED
        batch.save()
        
    except Exception as e:
        batch.status = ResultBatch.Status.FAILED
        batch.error_message = str(e)
        batch.save()
