"""URLs da API"""

from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Autenticação
    path('auth/login/', views.login, name='login'),
    path('auth/solicit-access/', views.solicit_access, name='solicit_access'),
    path('auth/verify-code/', views.verify_code, name='verify_code'),
    path('auth/set-password/', views.set_password, name='set_password'),
    
    # Eventos
    path('eventos/', views.listar_eventos, name='listar_eventos'),
    path('eventos/<int:evento_id>/', views.obter_evento, name='obter_evento'),
    path('eventos/criar/', views.criar_evento, name='criar_evento'),
    path('eventos/<int:evento_id>/atualizar/', views.atualizar_evento, name='atualizar_evento'),
    path('eventos/<int:evento_id>/deletar/', views.deletar_evento, name='deletar_evento'),
    path('eventos/<int:evento_id>/inscrever/', views.inscrever_evento, name='inscrever_evento'),
    path('eventos/<int:evento_id>/desinscrever/', views.desinscrever_evento, name='desinscrever_evento'),
    
    # Inscrições e usuário
    path('usuarios/<str:matricula>/eventos/', views.listar_eventos_usuario, name='listar_eventos_usuario'),
    
    # Certificados
    path('usuarios/<str:matricula>/certificados/', views.listar_certificados, name='listar_certificados'),
    path('usuarios/<str:matricula>/certificados/<int:evento_id>/', views.gerar_certificado, name='gerar_certificado'),
    
    # QR Code
    path('eventos/<int:evento_id>/sessoes/<int:sessao_id>/qrcode/', views.gerar_qrcode_data, name='gerar_qrcode'),
]
