from django.contrib import admin
from .models import Update

@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('message_snippet', 'has_image', 'created_at')
    
    def message_snippet(self, obj):
        return obj.message[:75] + ("..." if len(obj.message) > 75 else "")
    message_snippet.short_description = "Message"

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Image Attached"
