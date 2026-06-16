from django.db import models
from django.core.validators import RegexValidator

class Course(models.Model):
    CATEGORY_CHOICES = [
        ("btech", "B.Tech Program"),
        ("mtech", "M.Tech Program"),
        ("diploma", "Diploma Program"),
        ("postgrad", "Post-Graduate Program"),
    ]
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    duration = models.CharField(max_length=100, help_text="e.g. 4 Years (3 Years Lateral)")
    eligibility = models.TextField(help_text="Counselling entrance requirements")
    counselling_code = models.CharField(max_length=20, default="LOYL", help_text="Counselling code (e.g. LOYL, LITM)")
    fee_estimate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Estimated annual fees")

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    class Meta:
        ordering = ["category", "name"]


class Recruiter(models.Model):
    name = models.CharField(max_length=100, unique=True)
    mark = models.CharField(max_length=10, help_text="Placeholder logo character (e.g. T for TCS)")
    tone = models.CharField(max_length=50, default="blue", help_text="Gradient style name (e.g. sky, violet, rainbow)")

    def __str__(self):
        return self.name


class PlacementHighlight(models.Model):
    highest_package = models.CharField(max_length=50, default="12 LPA")
    training_hours = models.PositiveIntegerField(default=300)
    year = models.PositiveIntegerField(default=2026)
    placements_count = models.PositiveIntegerField(default=150, blank=True, null=True)

    def __str__(self):
        return f"Placements Highlight ({self.year})"


class NewsAnnouncement(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    tag = models.CharField(max_length=50, help_text="Category (e.g. Admissions, Campus, Academic)")
    published_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-published_date"]


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    venue = models.CharField(max_length=255)
    event_date = models.DateTimeField()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["event_date"]


class Testimonial(models.Model):
    quote = models.TextField()
    student_name = models.CharField(max_length=150)
    metadata = models.CharField(max_length=255, help_text="e.g. CSE Graduate (Placed at TCS)")

    def __str__(self):
        return f"Testimonial from {self.student_name}"


class Inquiry(models.Model):
    phone_validator = RegexValidator(
        regex=r"^[0-9\s+-]{10,15}$",
        message="Phone number must be between 10 and 15 digits."
    )
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, validators=[phone_validator])
    email = models.EmailField(blank=True, null=True)
    course_of_interest = models.CharField(max_length=50, default="btech")
    message = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[("New", "New"), ("Processing", "Processing"), ("Answered", "Answered")],
        default="New"
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name} ({self.phone})"

    class Meta:
        verbose_name_plural = "Inquiries"
        ordering = ["-submitted_at"]
