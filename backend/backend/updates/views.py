from rest_framework import generics
from .models import ContactInquiry, Update
from .serializers import ContactInquirySerializer, UpdateSerializer

class UpdateListAPIView(generics.ListAPIView):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer


class ContactInquiryCreateAPIView(generics.CreateAPIView):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
