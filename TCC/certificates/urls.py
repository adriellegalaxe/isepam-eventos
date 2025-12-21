from django.urls import path
from . import views

urlpatterns = [
    path('', views.certificates_list, name='certificates'),
    path('download/<int:cert_id>/', views.download_certificate, name='download_certificate'),
]