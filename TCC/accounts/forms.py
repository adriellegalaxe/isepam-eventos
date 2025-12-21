from django import forms
from allauth.account.forms import SignupForm as AllauthSignupForm
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import User
from validate_docbr import CPF

class CustomSignupForm(AllauthSignupForm):
    user_type = forms.ChoiceField(choices=User.USER_TYPE_CHOICES, label='Tipo de Usuário')
    enrollment_number = forms.CharField(max_length=20, label='Número de Matrícula')
    cpf = forms.CharField(max_length=14, label='CPF')
    full_name = forms.CharField(max_length=255, label='Nome Completo')

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise ValidationError("Este nome de usuário já está em uso. Escolha outro.")
        if len(username) < 3:
            raise ValidationError("O nome de usuário deve ter pelo menos 3 caracteres.")
        return username

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise ValidationError("Este email já está cadastrado. Use outro email ou faça login.")
        return email

    def clean_password1(self):
        password = self.cleaned_data['password1']
        if len(password) < 8:
            raise ValidationError("A senha deve ter pelo menos 8 caracteres.")
        if not any(char.isdigit() for char in password):
            raise ValidationError("A senha deve conter pelo menos um número.")
        if not any(char.isupper() for char in password):
            raise ValidationError("A senha deve conter pelo menos uma letra maiúscula.")
        return password

    def clean_cpf(self):
        cpf = self.cleaned_data['cpf']
        cpf_validator = CPF()
        if not cpf_validator.validate(cpf):
            raise ValidationError("CPF inválido. Verifique o número digitado.")
        if User.objects.filter(cpf=cpf).exists():
            raise ValidationError("Este CPF já está cadastrado no sistema.")
        return cpf

    def clean_enrollment_number(self):
        enrollment = self.cleaned_data['enrollment_number']
        if User.objects.filter(enrollment_number=enrollment).exists():
            raise ValidationError("Este número de matrícula já está cadastrado.")
        return enrollment

    def clean_full_name(self):
        full_name = self.cleaned_data['full_name']
        if len(full_name.strip()) < 2:
            raise ValidationError("Nome completo deve ter pelo menos 2 caracteres.")
        return full_name

    def save(self, request):
        user = super().save(request)
        user.user_type = self.cleaned_data['user_type']
        user.enrollment_number = self.cleaned_data['enrollment_number']
        user.cpf = self.cleaned_data['cpf']
        user.full_name = self.cleaned_data['full_name']
        user.save()
        return user