from django.contrib import admin
from .models import (
    Course,
    Branch,
    Section,
    Student,
    UploadedSheet,
    Attendance,
    NotificationCampaign,
    NotificationLog
)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'course')
    list_filter = ('course',)
    search_fields = ('name', 'course__name')

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'branch', 'get_course')
    list_filter = ('branch__course', 'branch')
    search_fields = ('name', 'branch__name', 'branch__course__name')
    
    def get_course(self, obj):
        return obj.branch.course.name
    get_course.short_description = 'Course'

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('roll_number', 'name', 'section', 'parent_phone')
    list_filter = ('section__branch__course', 'section__branch', 'section')
    search_fields = ('roll_number', 'name', 'parent_phone')

@admin.register(UploadedSheet)
class UploadedSheetAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploaded_at', 'status', 'file')
    list_filter = ('status', 'uploaded_at')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'status', 'sheet')
    list_filter = ('status', 'date', 'student__section__branch__course')
    search_fields = ('student__roll_number', 'student__name')
    date_hierarchy = 'date'

@admin.register(NotificationCampaign)
class NotificationCampaignAdmin(admin.ModelAdmin):
    list_display = ('date', 'sent_at')
    date_hierarchy = 'date'

@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('student', 'campaign', 'status', 'sent_at')
    list_filter = ('status', 'sent_at')
    search_fields = ('student__roll_number', 'student__name')
