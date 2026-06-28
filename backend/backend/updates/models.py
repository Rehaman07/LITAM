from django.db import models

class Update(models.Model):
    message = models.TextField(help_text="Message or content for the update.")
    image = models.ImageField(upload_to="updates/", blank=True, null=True, help_text="Optional image. Leave blank to use default college logo.")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.message[:50] + ("..." if len(self.message) > 50 else "")
