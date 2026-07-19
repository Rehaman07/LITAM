from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Course, Placement, Inquiry, News, Event, Testimonial

admin.site.register(User, UserAdmin)
admin.site.register(Course)
admin.site.register(Placement)
admin.site.register(Inquiry)
admin.site.register(News)
admin.site.register(Event)
admin.site.register(Testimonial)
