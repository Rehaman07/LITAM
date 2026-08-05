from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        ADMISSION_OFFICER = 'ADMISSION_OFFICER', 'Admission Officer'
        STUDENT = 'STUDENT', 'Student'
        
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


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
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    eligibility = models.TextField(blank=True, default="")
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['category', 'title']

    def __str__(self):
        return f"{self.title} ({self.code})"


class Placement(models.Model):
    highest_package = models.CharField(max_length=50) # E.g., '44 LPA'
    average_package = models.CharField(max_length=50)
    year = models.IntegerField(default=2024)
    recruiters = models.IntegerField(default=50) # Number of recruiters
    training_hours = models.IntegerField(default=200)
    students_placed = models.IntegerField(default=500)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-year']

    def __str__(self):
        return f"Placements {self.year} - Max {self.highest_package}"


class StudentPlacement(models.Model):
    student_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    package_lpa = models.DecimalField(max_digits=5, decimal_places=2, help_text="Package in LPA (e.g., 12.50)")
    photo = models.ImageField(upload_to="placements/", blank=True, null=True)
    year = models.IntegerField(default=2024)
    branch = models.CharField(max_length=100, default="CSE")
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-package_lpa', '-created_at']

    def __str__(self):
        return f"{self.student_name} - {self.company_name} ({self.package_lpa} LPA)"


class Inquiry(models.Model):
    class Status(models.TextChoices):
        NEW = 'NEW', 'New'
        PROCESSING = 'PROCESSING', 'Processing'
        ANSWERED = 'ANSWERED', 'Answered'
        
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=20)
    course_of_interest = models.CharField(max_length=255, blank=True, default="General Inquiry")
    message = models.TextField(blank=True, default="")
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.NEW)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Inquiries"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.name} - {self.course_of_interest}"


class CampusGallery(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, default="Campus")
    description = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to="gallery/campus/", blank=True, null=True)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Campus Gallery"
        verbose_name_plural = "Campus Gallery"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class StudentGallery(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, default="Student Life")
    description = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to="gallery/students/", blank=True, null=True)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Student Gallery"
        verbose_name_plural = "Student Gallery"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class UpdateSection(models.TextChoices):
    HERO = "hero", "Hero"
    NOTICE = "notice", "Notice"
    EVENT = "event", "Event"
    PLACEMENT = "placement", "Placement"
    RECRUITER = "recruiter", "Recruiter"
    GALLERY = "gallery", "Gallery"
    FACULTY = "faculty", "Faculty"
    TESTIMONIAL = "testimonial", "Testimonial"
    COURSE = "course", "Course"
    STUDENT_LIFE = "student_life", "Student Life"
    ABOUT = "about", "About"
    STATS = "stats", "Stats"
    UNIQUE_FEATURE = "unique_feature", "Unique Feature"
    CAMPUS = "campus", "Campus"


class Update(models.Model):
    section = models.CharField(max_length=32, choices=UpdateSection.choices, default=UpdateSection.NOTICE)
    title = models.CharField(max_length=200, help_text="Short headline for the update.")
    message = models.TextField(help_text="Message or content for the update.")
    image = models.ImageField(upload_to="updates/", blank=True, null=True, help_text="Optional image.")
    attachment = models.FileField(upload_to="updates/attachments/", blank=True, null=True, help_text="Optional document attachment.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or (self.message[:50] if self.message else "Update")


class News(models.Model):
    date = models.DateField()
    title = models.CharField(max_length=255)
    content = models.TextField()
    tag = models.CharField(max_length=100, default="Notice")
    image = models.ImageField(upload_to="news/", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name_plural = "News"
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return self.title


class Event(models.Model):
    date = models.DateTimeField()
    title = models.CharField(max_length=255)
    description = models.TextField()
    venue = models.CharField(max_length=255, default="Main Auditorium")
    image = models.ImageField(upload_to="events/", blank=True, null=True)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    quote = models.TextField()
    student_name = models.CharField(max_length=255)
    metadata = models.CharField(max_length=255, blank=True, default="") # E.g., placement info
    role_or_company = models.CharField(max_length=255, blank=True, default="")
    photo = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    rating = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"Testimonial by {self.student_name}"


