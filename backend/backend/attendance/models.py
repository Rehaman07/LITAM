from django.db import models
from django.utils import timezone

class Course(models.Model):
    name = models.CharField(max_length=100, unique=True, help_text="e.g., MCA, B.Tech, Diploma")
    
    def __str__(self):
        return self.name

class Branch(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=100, help_text="e.g., CSE, ECE, Mechanical")
    
    class Meta:
        unique_together = ('course', 'name')
        verbose_name_plural = "Branches"

    def __str__(self):
        return f"{self.course.name} - {self.name}"

class Section(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=50, help_text="e.g., Section A")
    
    class Meta:
        unique_together = ('branch', 'name')

    def __str__(self):
        return f"{self.branch.course.name} - {self.branch.name} - {self.name}"

class Student(models.Model):
    roll_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='students')
    parent_phone = models.CharField(max_length=20, blank=True, null=True, help_text="For SMS notifications")
    
    def __str__(self):
        return f"{self.roll_number} - {self.name}"

class UploadedSheet(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSED = 'PROCESSED', 'Processed'
        FAILED = 'FAILED', 'Failed'
        
    file = models.FileField(upload_to='attendance_sheets/')
    uploaded_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Sheet {self.id} ({self.status})"

class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = 'PRESENT', 'Present'
        ABSENT = 'ABSENT', 'Absent'
        
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices)
    sheet = models.ForeignKey(UploadedSheet, on_delete=models.SET_NULL, null=True, blank=True, related_name='attendances')
    
    class Meta:
        unique_together = ('student', 'date')
        verbose_name_plural = "Attendance Records"

    def __str__(self):
        return f"{self.student.roll_number} - {self.date} - {self.status}"

class NotificationCampaign(models.Model):
    date = models.DateField(default=timezone.now)
    message_template = models.TextField(help_text="Template for SMS. E.g. 'Your ward {name} is absent on {date}.'")
    sent_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Campaign for {self.date}"

class NotificationLog(models.Model):
    class Status(models.TextChoices):
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'
        
    campaign = models.ForeignKey(NotificationCampaign, on_delete=models.CASCADE, related_name='logs')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=Status.choices)
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Log for {self.student.roll_number} - {self.status}"
