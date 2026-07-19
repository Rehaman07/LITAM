from django.db import models

class ResultBatch(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PARSING = 'PARSING', 'Parsing'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
        
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='results_pdfs/')
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Batch {self.id} - {self.status}"

class StudentResult(models.Model):
    batch = models.ForeignKey(ResultBatch, on_delete=models.CASCADE, related_name='student_results')
    hall_ticket_number = models.CharField(max_length=50, unique=True, db_index=True)
    sgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return self.hall_ticket_number

class CourseGrade(models.Model):
    student = models.ForeignKey(StudentResult, on_delete=models.CASCADE, related_name='course_grades')
    course_code = models.CharField(max_length=50)
    course_name = models.CharField(max_length=255)
    credits = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    grade = models.CharField(max_length=10)
    grade_points = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.course_code} - {self.grade}"
