from django.db import models
from django.contrib.auth.models import AbstractUser
from validate_docbr import CPF

# Create your models here.

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Estudante'),
        ('professor', 'Professor'),
        ('coordinator', 'Coordenador'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, verbose_name='Tipo de Usuário')
    enrollment_number = models.CharField(max_length=20, unique=True, verbose_name='Número de Matrícula')
    cpf = models.CharField(max_length=14, unique=True, verbose_name='CPF')
    full_name = models.CharField(max_length=255, verbose_name='Nome Completo')

    def __str__(self):
        return self.full_name

    def clean(self):
        super().clean()
        cpf_validator = CPF()
        if not cpf_validator.validate(self.cpf):
            # Note: user said show warning but not block, so perhaps in form, not here
            pass  # For now, no validation in model
