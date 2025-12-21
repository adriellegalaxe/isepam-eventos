#!/usr/bin/env python
import os
import sys
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'isepam.settings')
django.setup()

from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

def test_allauth_email():
    User = get_user_model()
    
    print("Criando usuário de teste...")
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    print(f"Usuário criado: {user.username}")

    print("Criando EmailAddress não verificado...")
    email_address = EmailAddress.objects.create(
        user=user,
        email=user.email,
        verified=False
    )
    print(f"EmailAddress criado: {email_address.email} (verificado: {email_address.verified})")

    print("Tentando enviar email de confirmação...")
    try:
        email_address.send_confirmation()
        print("Email de confirmação enviado com sucesso. Verifique o console para o conteúdo do email.")
    except Exception as e:
        print(f"Erro ao enviar email: {e}")

    print("Limpando dados de teste...")
    email_address.delete()
    user.delete()
    print("Usuário e EmailAddress deletados.")

if __name__ == '__main__':
    test_allauth_email()