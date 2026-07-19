from rest_framework import serializers
from .models import ResultBatch, StudentResult, CourseGrade

class ResultBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultBatch
        fields = '__all__'
        read_only_fields = ('status', 'error_message', 'uploaded_at')

class CourseGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGrade
        fields = ('course_code', 'course_name', 'credits', 'grade', 'grade_points')

class StudentResultSerializer(serializers.ModelSerializer):
    course_grades = CourseGradeSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudentResult
        fields = ('hall_ticket_number', 'sgpa', 'cgpa', 'course_grades')
