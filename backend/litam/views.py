from rest_framework import generics, status
from rest_framework.response import Response
from django.core.cache import cache
from .models import Course, Recruiter, PlacementHighlight, NewsAnnouncement, Event, Testimonial, Inquiry
from .serializers import (
    CourseSerializer,
    RecruiterSerializer,
    PlacementHighlightSerializer,
    NewsAnnouncementSerializer,
    EventSerializer,
    TestimonialSerializer,
    InquirySerializer
)

class CourseListAPIView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = []

    def get_queryset(self):
        # Redis cache key for courses
        cache_key = "litam_courses"
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = list(Course.objects.all())
            cache.set(cache_key, queryset, timeout=3600)  # cache for 1 hour
        return queryset


class RecruiterListAPIView(generics.ListAPIView):
    serializer_class = RecruiterSerializer
    permission_classes = []

    def get_queryset(self):
        cache_key = "litam_recruiters"
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = list(Recruiter.objects.all())
            cache.set(cache_key, queryset, timeout=3600)
        return queryset


class PlacementHighlightAPIView(generics.ListAPIView):
    serializer_class = PlacementHighlightSerializer
    permission_classes = []

    def get_queryset(self):
        cache_key = "litam_placements"
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = list(PlacementHighlight.objects.all())
            cache.set(cache_key, queryset, timeout=3600)
        return queryset


class NewsListAPIView(generics.ListAPIView):
    serializer_class = NewsAnnouncementSerializer
    permission_classes = []

    def get_queryset(self):
        cache_key = "litam_news"
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = list(NewsAnnouncement.objects.all()[:10])  # limit to latest 10 news items
            cache.set(cache_key, queryset, timeout=600)  # cache for 10 mins
        return queryset


class EventListAPIView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = []

    def get_queryset(self):
        cache_key = "litam_events"
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = list(Event.objects.all())
            cache.set(cache_key, queryset, timeout=600)
        return queryset


class TestimonialListAPIView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = []

    def get_queryset(self):
        cache_key = "litam_testimonials"
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = list(Testimonial.objects.all())
            cache.set(cache_key, queryset, timeout=3600)
        return queryset


class InquiryCreateAPIView(generics.CreateAPIView):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.all()
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {"success": True, "message": "Inquiry submitted successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
