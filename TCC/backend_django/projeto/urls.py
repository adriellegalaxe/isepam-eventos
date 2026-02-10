"""URL Configuration for projeto"""

from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from api.views import index

urlpatterns = [
    path('api/', include('api.urls')),
]

# Servir arquivos estáticos em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# TUDO QUE NÃO FOR API, SERVE O FRONTEND
urlpatterns += [
    re_path(r'^(?!api|static)',index, name='index'),
]

