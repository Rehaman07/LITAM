from rest_framework import viewsets, permissions, status, views, response
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from .models import User, Course, Placement, StudentPlacement, Inquiry, News, Event, Testimonial, CampusGallery, StudentGallery, Update
from .serializers import (
    UserSerializer, CourseSerializer, PlacementSerializer, StudentPlacementSerializer,
    InquirySerializer, NewsSerializer, EventSerializer, TestimonialSerializer,
    CampusGallerySerializer, StudentGallerySerializer, UpdateSerializer
)

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return response.Response(serializer.data)

class CampusGalleryViewSet(viewsets.ModelViewSet):
    queryset = CampusGallery.objects.all()
    serializer_class = CampusGallerySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = CampusGallery.objects.all()
        featured = self.request.query_params.get('featured')
        category = self.request.query_params.get('category')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset.order_by('-created_at')

class StudentGalleryViewSet(viewsets.ModelViewSet):
    queryset = StudentGallery.objects.all()
    serializer_class = StudentGallerySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = StudentGallery.objects.all()
        featured = self.request.query_params.get('featured')
        category = self.request.query_params.get('category')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset.order_by('-created_at')

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = Course.objects.all()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category__iexact=category)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset

class PlacementViewSet(viewsets.ModelViewSet):
    queryset = Placement.objects.all()
    serializer_class = PlacementSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class StudentPlacementViewSet(viewsets.ModelViewSet):
    queryset = StudentPlacement.objects.all()
    serializer_class = StudentPlacementSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = StudentPlacement.objects.all()
        top = self.request.query_params.get('top')
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if top is not None:
            try:
                top = int(top)
                queryset = queryset[:top]
            except ValueError:
                pass
        return queryset

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    authentication_classes = []

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = Update.objects.all()
        section = self.request.query_params.get('section')
        if section:
            queryset = queryset.filter(section__iexact=section)
        return queryset.order_by('-created_at')

class SiteContentAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        updates = Update.objects.all().order_by('-created_at')
        grouped = {}
        for update in updates:
            sec = update.section
            if sec not in grouped:
                grouped[sec] = []
            grouped[sec].append(UpdateSerializer(update, context={'request': request}).data)
        return response.Response(grouped)

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-date', '-created_at')
    serializer_class = NewsSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = News.objects.all().order_by('-date', '-created_at')
        tag = self.request.query_params.get('tag') or self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        limit = self.request.query_params.get('limit')

        if tag:
            queryset = queryset.filter(tag__iexact=tag)
        if search:
            queryset = queryset.filter(title__icontains=search)
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        return queryset

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = Event.objects.all()
        upcoming = self.request.query_params.get('upcoming')
        search = self.request.query_params.get('search')

        if upcoming and upcoming.lower() == 'true':
            queryset = queryset.filter(date__gte=timezone.now()).order_by('date')
        else:
            queryset = queryset.order_by('-date')

        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = Testimonial.objects.all()
        active_only = self.request.query_params.get('active', 'true')
        if active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('order', '-created_at')

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return response.Response(UserSerializer(user).data)
        return response.Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return response.Response({'message': 'Logged out successfully'})

