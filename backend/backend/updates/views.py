from rest_framework import generics
from .models import Update
from .serializers import UpdateSerializer

class UpdateListAPIView(generics.ListAPIView):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer
