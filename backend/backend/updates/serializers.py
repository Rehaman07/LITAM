from rest_framework import serializers
from .models import ContactInquiry, Update

class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = ['id', 'section', 'title', 'message', 'image', 'created_at']


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ["id", "name", "email", "phone", "course", "message", "created_at"]
        read_only_fields = ["id", "created_at"]
