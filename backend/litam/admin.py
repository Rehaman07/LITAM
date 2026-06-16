from django.contrib import admin
from .models import Course, Recruiter, PlacementHighlight, NewsAnnouncement, Event, Testimonial, Inquiry

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "duration", "counselling_code")
    list_filter = ("category",)
    search_fields = ("name", "description", "eligibility")


@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):
    list_display = ("name", "mark", "tone")
    search_fields = ("name",)


@admin.register(PlacementHighlight)
class PlacementHighlightAdmin(admin.ModelAdmin):
    list_display = ("year", "highest_package", "training_hours")


@admin.register(NewsAnnouncement)
class NewsAnnouncementAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "published_date")
    list_filter = ("tag", "published_date")
    search_fields = ("title", "content")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "venue", "event_date")
    list_filter = ("event_date",)
    search_fields = ("title", "venue", "description")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("student_name", "metadata")
    search_fields = ("student_name", "quote")


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "course_of_interest", "status", "submitted_at")
    list_filter = ("status", "submitted_at", "course_of_interest")
    search_fields = ("name", "phone", "email", "message")
    readonly_fields = ("name", "phone", "email", "course_of_interest", "message", "submitted_at")

    def has_add_permission(self, request):
        # Admin should not manually add inquiries from admin panel
        return False
