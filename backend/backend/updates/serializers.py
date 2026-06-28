from rest_framework import serializers
from .models import Update

class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = ['id', 'message', 'image', 'created_at']
