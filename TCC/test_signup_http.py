#!/usr/bin/env python
import os
import sys
import django
import requests
import re

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'isepam.settings')
django.setup()

from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

def test_signup_via_http():
    base_url = 'http://localhost:8000'

    # Sessão para manter cookies
    session = requests.Session()

    # GET para obter CSRF token
    print("Fazendo GET para /accounts/signup/...")
    response_get = session.get(f'{base_url}/accounts/signup/')
    if response_get.status_code != 200:
        print(f"Erro no GET: {response_get.status_code}")
        return

    # Extrair CSRF token
    content = response_get.text
    csrf_match = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', content)
    if not csrf_match:
        print("CSRF token não encontrado.")
        return
    csrf_token = csrf_match.group(1)
    print("CSRF token obtido.")

    # Dados do formulário
    signup_data = {
        'csrfmiddlewaretoken': csrf_token,
        'username': 'testuser_http',
        'email': 'testhttp@example.com',
        'password1': 'Testpass123',
        'password2': 'Testpass123',
        'user_type': 'student',
        'enrollment_number': '654321',
        'cpf': '111.444.777-35',
        'full_name': 'Test User HTTP',
    }

    # POST para signup
    print("Enviando POST para /accounts/signup/...")
    response_post = session.post(f'{base_url}/accounts/signup/', data=signup_data, allow_redirects=True)

    print(f"Status code: {response_post.status_code}")
    print(f"URL final: {response_post.url}")

    if 'erro' in response_post.text.lower() or 'error' in response_post.text.lower() or 'alert-danger' in response_post.text:
        print("Possível erro na resposta:")
        # Procurar por erros no HTML
        error_matches = re.findall(r'<li>(.*?)</li>', response_post.text)
        if error_matches:
            for error in error_matches:
                print(f"- {error}")
        else:
            print(response_post.text[:2000])
        return

    # Verificar no banco se usuário foi criado
    User = get_user_model()
    try:
        user = User.objects.get(username='testuser_http')
        print(f"Usuário criado: {user.username}, email: {user.email}")
    except User.DoesNotExist:
        print("Erro: Usuário não foi criado.")
        return

    # Verificar EmailAddress
    try:
        email_address = EmailAddress.objects.get(user=user, email=user.email)
        print(f"EmailAddress criado: {email_address.email}, verificado: {email_address.verified}")
    except EmailAddress.DoesNotExist:
        print("Erro: EmailAddress não foi criado.")
        return

    # Para email enviado, como é console, verificar se o processo chegou até aí
    print("Processo de signup completado. Verifique o console do servidor para o email enviado.")

    # Limpar dados
    email_address.delete()
    user.delete()
    print("Dados de teste limpos.")

if __name__ == '__main__':
    test_signup_via_http()