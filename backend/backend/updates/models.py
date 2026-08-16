from django.db import models
from cloudinary_storage.storage import RawMediaCloudinaryStorage


class ContentSection(models.TextChoices):
    NOTICE = "notice", "Notice"
    EVENT = "event", "Event"

class Update(models.Model):
    section = models.CharField(max_length=32, choices=ContentSection.choices, default=ContentSection.NOTICE)
    title = models.CharField(max_length=200, help_text="Short headline for the update.")
    message = models.TextField(help_text="Message or content for the update.")
    image = models.ImageField(upload_to="updates/", blank=True, null=True, help_text="Optional image. Leave blank to use default college logo.")
    attachment = models.FileField(
        upload_to="updates/attachments/",
        storage=RawMediaCloudinaryStorage(),
        blank=True,
        null=True,
        help_text="Optional PDF or document attachment.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=["section", "-created_at"])]

    def __str__(self):
        return self.title or self.message[:50] + ("..." if len(self.message) > 50 else "")


class ContactInquiry(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    course = models.CharField(max_length=50)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.phone}"


class StudentPlacement(models.Model):
    student_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    package_lpa = models.DecimalField(max_digits=5, decimal_places=2, help_text="Package in LPA (e.g., 12.50)")
    photo = models.ImageField(upload_to="placements/", blank=True, null=True, help_text="Optional student photo")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-package_lpa", "-created_at"]
        indexes = [models.Index(fields=["-package_lpa"])]

    def __str__(self):
        return f"{self.student_name} - {self.company_name} ({self.package_lpa} LPA)"
