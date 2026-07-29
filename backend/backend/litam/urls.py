from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CourseViewSet, PlacementViewSet, StudentPlacementViewSet,
    InquiryViewSet, NewsViewSet, EventViewSet, TestimonialViewSet,
    LoginView, LogoutView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'placements', PlacementViewSet)
router.register(r'student-placements', StudentPlacementViewSet)
router.register(r'inquiries', InquiryViewSet)
router.register(r'news', NewsViewSet)
router.register(r'events', EventViewSet)
router.register(r'testimonials', TestimonialViewSet)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('', include(router.urls)),
]

