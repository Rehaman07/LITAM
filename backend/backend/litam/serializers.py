from rest_framework import serializers
from .models import User, Course, Placement, StudentPlacement, Inquiry, News, Event, Testimonial

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'is_staff', 'is_superuser']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = '__all__'

class StudentPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPlacement
        fields = '__all__'

class InquirySerializer(serializers.ModelSerializer):
    course = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'email', 'phone', 'course_of_interest', 'course', 'message', 'status', 'timestamp']
        read_only_fields = ['id', 'status', 'timestamp']

    def create(self, validated_data):
        course_input = validated_data.pop('course', None)
        if course_input and not validated_data.get('course_of_interest'):
            validated_data['course_of_interest'] = course_input
        if not validated_data.get('course_of_interest'):
            validated_data['course_of_interest'] = "General Inquiry"
        return super().create(validated_data)

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    is_upcoming = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'venue', 'date', 'image', 'is_featured', 'is_upcoming', 'created_at']

    def get_is_upcoming(self, obj):
        from django.utils import timezone
        return obj.date >= timezone.now()

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

