from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

class Command(BaseCommand):
    help = 'Testa se o allauth está enviando emails de confirmação'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Criar um usuário de teste
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.stdout.write(self.style.SUCCESS(f'Usuário criado: {user.username}'))

        # Criar um EmailAddress não verificado
        email_address = EmailAddress.objects.create(
            user=user,
            email=user.email,
            verified=False
        )
        self.stdout.write(self.style.SUCCESS(f'EmailAddress criado: {email_address.email} (verificado: {email_address.verified})'))

        # Tentar enviar o email de confirmação
        try:
            email_address.send_confirmation()
            self.stdout.write(self.style.SUCCESS('Email de confirmação enviado com sucesso. Verifique o console para o conteúdo do email.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro ao enviar email: {e}'))

        # Limpeza: deletar o usuário e email
        email_address.delete()
        user.delete()
        self.stdout.write(self.style.SUCCESS('Usuário e EmailAddress deletados para limpeza.'))