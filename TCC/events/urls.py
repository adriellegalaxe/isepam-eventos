from django.urls import path
from . import views

urlpatterns = [
    path('register/<int:event_id>/', views.register_for_event, name='register_for_event'),
    path('confirm/<str:qr_code>/', views.confirm_attendance, name='confirm_attendance'),
    path('qr/<int:attendance_id>/', views.qr_code_image, name='qr_code_image'),
    path('meus-qr/', views.my_qr_codes, name='my_qr_codes'),
]