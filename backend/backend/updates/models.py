from django.db import models

class Update(models.Model):
    title = models.CharField(max_length=200, help_text="Short headline for the update.")
    message = models.TextField(help_text="Message or content for the update.")
    image = models.ImageField(upload_to="updates/", blank=True, null=True, help_text="Optional image. Leave blank to use default college logo.")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

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
