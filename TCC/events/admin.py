from django.contrib import admin
from .models import Event, Session, Attendance

# Register your models here.
admin.site.register(Event)
admin.site.register(Session)
admin.site.register(Attendance)
