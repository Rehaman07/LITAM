from django.urls import path
from .views import ContactInquiryCreateAPIView, UpdateListAPIView

urlpatterns = [
    path('', UpdateListAPIView.as_view(), name='update-list'),
    path('contact-inquiries/', ContactInquiryCreateAPIView.as_view(), name='contact-inquiry-create'),
]
