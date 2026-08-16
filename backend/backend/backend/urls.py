from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from litam.views import UpdateViewSet

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/updates/', UpdateViewSet.as_view({'get': 'list', 'post': 'create'}), name='direct-updates'),
    path('api/updates/<int:pk>/', UpdateViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='direct-updates-detail'),
    path('api/litam/', include('litam.urls')),
]
