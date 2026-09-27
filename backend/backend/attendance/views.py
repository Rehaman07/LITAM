from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, F, FloatField, ExpressionWrapper
from .models import Course, Branch, Section, Student
from .serializers import (
    CourseSerializer, 
    BranchSerializer, 
    SectionSerializer, 
    StudentAttendanceStatsSerializer
)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all().order_by('name')
    serializer_class = CourseSerializer

class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BranchSerializer

    def get_queryset(self):
        queryset = Branch.objects.all().order_by('name')
        course_id = self.request.query_params.get('course_id')
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SectionSerializer

    def get_queryset(self):
        queryset = Section.objects.all().order_by('name')
        branch_id = self.request.query_params.get('branch_id')
        if branch_id is not None:
            queryset = queryset.filter(branch_id=branch_id)
        return queryset

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentAttendanceStatsSerializer

    def get_queryset(self):
        queryset = Student.objects.all().order_by('name')
        section_id = self.request.query_params.get('section_id')
        if section_id is not None:
            queryset = queryset.filter(section_id=section_id)
        
        # Annotate with attendance stats
        queryset = queryset.annotate(
            present_count=Count('attendances', filter=Q(attendances__status='PRESENT')),
            absent_count=Count('attendances', filter=Q(attendances__status='ABSENT')),
        )
        
        from django.db.models import Case, When, Value
        
        # Calculate percentage (present / (present + absent)) * 100
        queryset = queryset.annotate(
            total_classes=F('present_count') + F('absent_count')
        ).annotate(
            attendance_percentage=Case(
                When(total_classes=0, then=Value(None)),
                default=ExpressionWrapper(
                    F('present_count') * 100.0 / F('total_classes'),
                    output_field=FloatField()
                ),
                output_field=FloatField()
            )
        )
        
        return queryset
