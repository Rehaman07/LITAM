from rest_framework import serializers
from .models import User, Course, Placement, StudentPlacement, Inquiry, News, Event, Testimonial, CampusGallery, StudentGallery, Update

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

class CampusGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusGallery
        fields = '__all__'

class StudentGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentGallery
        fields = '__all__'

class UpdateSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    attachment = serializers.SerializerMethodField()

    class Meta:
        model = Update
        fields = ['id', 'section', 'title', 'message', 'image', 'attachment', 'created_at']

    def get_image(self, obj):
        if not obj.image:
            return None
        try:
            url = obj.image.url
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            if obj.image.name:
                url = f"/media/{obj.image.name}" if not obj.image.name.startswith('/') else obj.image.name
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return None

    def get_attachment(self, obj):
        if not obj.attachment:
            return None
        try:
            url = obj.attachment.url
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            if obj.attachment.name:
                url = f"/media/{obj.attachment.name}" if not obj.attachment.name.startswith('/') else obj.attachment.name
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return None

class InquirySerializer(serializers.ModelSerializer):
    course_of_interest = serializers.CharField(required=False, allow_blank=True, default="General Inquiry")
    course = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True, default="")
    message = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'email', 'phone', 'course_of_interest', 'course', 'message', 'status', 'timestamp']
        read_only_fields = ['id', 'status', 'timestamp']

    def create(self, validated_data):
        course_input = validated_data.pop('course', None)
        if course_input and (not validated_data.get('course_of_interest') or validated_data.get('course_of_interest') == "General Inquiry"):
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


