from django.contrib import admin
from django.utils.html import format_html
from .models import ContactInquiry, Update, StudentPlacement

@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('section', 'title', 'message_snippet', 'image_preview', 'attachment_preview', 'created_at')
    search_fields = ('section', 'title', 'message')
    list_filter = ('section', 'created_at')
    fields = ('section', 'title', 'message', 'image', 'image_preview', 'attachment', 'attachment_preview')
    readonly_fields = ('image_preview', 'attachment_preview')

    def message_snippet(self, obj):
        return obj.message[:75] + ("..." if len(obj.message) > 75 else "")
    message_snippet.short_description = "Message"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" />', obj.image.url)
        return "No Image Uploaded"
    image_preview.short_description = "Image Preview"

    def attachment_preview(self, obj):
        if obj.attachment:
            return format_html('<a href="{}" target="_blank" style="color: #2563eb; font-weight: bold;">📄 View PDF Attachment</a>', obj.attachment.url)
        return "No Attachment"
    attachment_preview.short_description = "Attachment"


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
