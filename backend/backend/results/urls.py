from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResultBatchViewSet, StudentResultViewSet

router = DefaultRouter()
router.register(r'batches', ResultBatchViewSet, basename='resultbatch')
router.register(r'students', StudentResultViewSet, basename='studentresult')

urlpatterns = [
    path('', include(router.urls)),
]
