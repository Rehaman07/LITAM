from rest_framework import serializers
from .models import ContactInquiry, Update, StudentPlacement

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


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ["id", "name", "email", "phone", "course", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class StudentPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPlacement
        fields = ['id', 'student_name', 'company_name', 'package_lpa', 'photo', 'created_at']

