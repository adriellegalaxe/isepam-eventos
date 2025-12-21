# Script para testar allauth email confirmation no Django shell
# Execute com: python manage.py shell < test_allauth_shell.py

from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

User = get_user_model()

# Criar um usuário de teste
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='testpass123'
)
print(f'Usuário criado: {user.username}')

# Criar um EmailAddress não verificado
email_address = EmailAddress.objects.create(
    user=user,
    email=user.email,
    verified=False
)
print(f'EmailAddress criado: {email_address.email} (verificado: {email_address.verified})')

# Tentar enviar o email de confirmação
try:
    email_address.send_confirmation()
    print('Email de confirmação enviado com sucesso. Verifique o console para o conteúdo do email.')
except Exception as e:
    print(f'Erro ao enviar email: {e}')

# Limpeza: deletar o usuário e email
email_address.delete()
user.delete()
print('Usuário e EmailAddress deletados para limpeza.')