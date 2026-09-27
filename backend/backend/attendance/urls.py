from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, BranchViewSet, SectionViewSet, StudentViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
]
