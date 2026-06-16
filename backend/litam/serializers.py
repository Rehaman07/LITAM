from rest_framework import serializers
from .models import Course, Recruiter, PlacementHighlight, NewsAnnouncement, Event, Testimonial, Inquiry

class CourseSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Course
        fields = "__all__"


class RecruiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruiter
        fields = "__all__"


class PlacementHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementHighlight
        fields = "__all__"


class NewsAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAnnouncement
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"

    def get_formatted_date(self, obj):
        # Return format like '21 Jun'
        return obj.event_date.strftime("%d %b")


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "name", "phone", "email", "course_of_interest", "message", "status", "submitted_at"]
        read_only_fields = ["status", "submitted_at"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value
