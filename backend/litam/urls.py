from django.urls import path
from .views import (
    CourseListAPIView,
    RecruiterListAPIView,
    PlacementHighlightAPIView,
    NewsListAPIView,
    EventListAPIView,
    TestimonialListAPIView,
    InquiryCreateAPIView
)

urlpatterns = [
    path("courses/", CourseListAPIView.as_view(), name="course-list"),
    path("recruiters/", RecruiterListAPIView.as_view(), name="recruiter-list"),
    path("placements/", PlacementHighlightAPIView.as_view(), name="placement-highlight"),
    path("news/", NewsListAPIView.as_view(), name="news-list"),
    path("events/", EventListAPIView.as_view(), name="event-list"),
    path("testimonials/", TestimonialListAPIView.as_view(), name="testimonial-list"),
    path("inquiries/", InquiryCreateAPIView.as_view(), name="inquiry-create"),
]
