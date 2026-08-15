from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, StudentPlacement, Inquiry, CampusGallery, StudentGallery, Update

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Roles', {'fields': ('role',)}),
    )

@admin.register(CampusGallery)
class CampusGalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'image_preview', 'created_at')
    list_filter = ('category', 'is_featured', 'created_at')
    search_fields = ('title', 'category', 'description')
    list_editable = ('is_featured',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Image Preview"

@admin.register(StudentGallery)
class StudentGalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'image_preview', 'created_at')
    list_filter = ('category', 'is_featured', 'created_at')
    search_fields = ('title', 'category', 'description')
    list_editable = ('is_featured',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Image Preview"

@admin.register(StudentPlacement)
class StudentPlacementAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'company_name', 'package_lpa', 'branch', 'year', 'is_featured', 'image_preview')
    list_filter = ('company_name', 'year', 'branch', 'is_featured')
    search_fields = ('student_name', 'company_name', 'branch')
    list_editable = ('is_featured',)

    def image_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />', obj.photo.url)
        return "No Photo"
    image_preview.short_description = "Photo"

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'course_of_interest', 'status', 'timestamp')
    list_filter = ('status', 'timestamp', 'course_of_interest')
    search_fields = ('name', 'phone', 'email', 'message', 'course_of_interest')
    list_editable = ('status',)
    date_hierarchy = 'timestamp'

@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('section', 'title', 'message_snippet', 'image_preview', 'attachment_preview', 'created_at')
    search_fields = ('section', 'title', 'message')
    list_filter = ('section', 'created_at')

    def message_snippet(self, obj):
        return (obj.message[:75] + "...") if obj.message and len(obj.message) > 75 else (obj.message or "")
    message_snippet.short_description = "Message"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Image Preview"

    def attachment_preview(self, obj):
        if obj.attachment:
            return format_html('<a href="{}" target="_blank">View Attachment</a>', obj.attachment.url)
        return "No Attachment"
    attachment_preview.short_description = "Attachment"

