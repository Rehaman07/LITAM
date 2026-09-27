from rest_framework import serializers
from .models import Course, Branch, Section, Student, Attendance

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'course']

class SectionSerializer(serializers.ModelSerializer):
    total_students = serializers.IntegerField(read_only=True)
    absent_today = serializers.IntegerField(read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'name', 'branch', 'total_students', 'absent_today']

class StudentAttendanceStatsSerializer(serializers.ModelSerializer):
    present_count = serializers.IntegerField(read_only=True)
    absent_count = serializers.IntegerField(read_only=True)
    attendance_percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'roll_number', 'name', 'present_count', 'absent_count', 'attendance_percentage']
