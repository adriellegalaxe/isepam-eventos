#!/usr/bin/env python
import os
import sys
import django
from django.test import Client
from django.core import mail

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'isepam.settings')
django.setup()

from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

def test_signup_form():
    # Sobrescrever EMAIL_BACKEND para capturar emails
    from django.conf import settings
    original_backend = settings.EMAIL_BACKEND
    settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

    client = Client(enforce_csrf_checks=True)  # Para testar CSRF

    # Obter a página de signup para pegar o CSRF token
    response_get = client.get('/accounts/signup/')
    if 'csrfmiddlewaretoken' in response_get.content.decode():
        import re
        csrf_token = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', response_get.content.decode()).group(1)
        signup_data['csrfmiddlewaretoken'] = csrf_token
        print("CSRF token obtido.")
    else:
        print("CSRF token não encontrado.")

    print("Enviando POST para /accounts/signup/ com dados do formulário...")
    response = client.post('/accounts/signup/', signup_data, follow=True)
    print(f"Response status: {response.status_code}")
    print(f"Response content length: {len(response.content)}")
    if response.redirect_chain:
        print(f"Redirects: {response.redirect_chain}")
    if 'error' in response.content.decode().lower():
        print("Possível erro na resposta:")
        print(response.content.decode()[:500])  # primeiros 500 chars

    # Verificar se o usuário foi criado
    User = get_user_model()
    try:
        user = User.objects.get(username='testuser_form')
        print(f"Usuário criado: {user.username}, email: {user.email}")
    except User.DoesNotExist:
        print("Erro: Usuário não foi criado.")
        return

    # Verificar se EmailAddress foi criado
    try:
        email_address = EmailAddress.objects.get(user=user, email=user.email)
        print(f"EmailAddress criado: {email_address.email}, verificado: {email_address.verified}")
    except EmailAddress.DoesNotExist:
        print("Erro: EmailAddress não foi criado.")
        return

    # Verificar se email foi enviado
    if len(mail.outbox) > 0:
        print(f"Email enviado: {len(mail.outbox)} email(s) na outbox.")
        for email in mail.outbox:
            print(f"Assunto: {email.subject}")
            print(f"Para: {email.to}")
    else:
        print("Erro: Nenhum email foi enviado.")

    # Limpar dados de teste
    email_address.delete()
    user.delete()
    print("Dados de teste limpos.")

    # Restaurar backend original
    settings.EMAIL_BACKEND = original_backend

if __name__ == '__main__':
    test_signup_form()