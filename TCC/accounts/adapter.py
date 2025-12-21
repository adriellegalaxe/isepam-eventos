from allauth.account.adapter import DefaultAccountAdapter
from django.contrib import messages

class CustomAccountAdapter(DefaultAccountAdapter):

    def authentication_failed(self, request, **credentials):
        """Mensagem quando a autenticação falha"""
        messages.error(request, "Nome de usuário/email ou senha incorretos. Verifique suas credenciais e tente novamente.")

    def confirm_email(self, request, email_address):
        """Mensagem quando email confirmado"""
        messages.success(request, f"O email {email_address.email} foi confirmado com sucesso!")

    def send_confirmation_mail(self, request, emailconfirmation, signup):
        """Mensagem quando email de confirmação enviado"""
        if request:
            messages.info(request, "Um email de confirmação foi enviado. Verifique sua caixa de entrada.")
        # Chama o método pai para garantir que o email seja enviado
        super().send_confirmation_mail(request, emailconfirmation, signup)