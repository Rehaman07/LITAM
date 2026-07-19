from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        ADMISSION_OFFICER = 'ADMISSION_OFFICER', 'Admission Officer'
        STUDENT = 'STUDENT', 'Student'
        
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)

class Course(models.Model):
    class Category(models.TextChoices):
        BTECH = 'BTECH', 'B.Tech'
        MTECH = 'MTECH', 'M.Tech'
        DIPLOMA = 'DIPLOMA', 'Diploma'
        POST_GRAD = 'POST_GRAD', 'PostGrad'
        
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=Category.choices)
    code = models.CharField(max_length=50, unique=True)
    duration = models.CharField(max_length=50) # E.g., '4 Years'
    description = models.TextField()
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    eligibility = models.TextField()

    def __str__(self):
        return f"{self.title} ({self.code})"

class Placement(models.Model):
    highest_package = models.CharField(max_length=50) # E.g., '44 LPA'
    average_package = models.CharField(max_length=50)
    year = models.IntegerField()
    recruiters = models.IntegerField() # Number of recruiters
    training_hours = models.IntegerField()
    
    def __str__(self):
        return f"Placements {self.year}"

class Inquiry(models.Model):
    class Status(models.TextChoices):
        NEW = 'NEW', 'New'
        PROCESSING = 'PROCESSING', 'Processing'
        ANSWERED = 'ANSWERED', 'Answered'
        
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    course_of_interest = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.NEW)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.course_of_interest}"

class News(models.Model):
    date = models.DateField()
    title = models.CharField(max_length=255)
    content = models.TextField()
    tag = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "News"
    
    def __str__(self):
        return self.title

class Event(models.Model):
    date = models.DateTimeField()
    title = models.CharField(max_length=255)
    description = models.TextField()
    venue = models.CharField(max_length=255)
    
    def __str__(self):
        return self.title

class Testimonial(models.Model):
    quote = models.TextField()
    student_name = models.CharField(max_length=255)
    metadata = models.CharField(max_length=255) # E.g., placement info
    
    def __str__(self):
        return f"Testimonial by {self.student_name}"
