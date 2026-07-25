from django.contrib import admin
from .models import ContactInquiry, Update, StudentPlacement

@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('section', 'title', 'message_snippet', 'has_image', 'created_at')
    search_fields = ('section', 'title', 'message')
    list_filter = ('section', 'created_at')
    
    def message_snippet(self, obj):
        return obj.message[:75] + ("..." if len(obj.message) > 75 else "")
    message_snippet.short_description = "Message"

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Image Attached"


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "course", "created_at")
    search_fields = ("name", "phone", "email", "course", "message")
    list_filter = ("course", "created_at")


@admin.register(StudentPlacement)
class StudentPlacementAdmin(admin.ModelAdmin):
    list_display = ("student_name", "company_name", "package_lpa", "created_at")
    search_fields = ("student_name", "company_name")
    list_filter = ("company_name", "created_at")
