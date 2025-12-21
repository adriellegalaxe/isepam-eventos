from django.db import models
from accounts.models import User
import uuid

# Create your models here.

class Event(models.Model):
    COURSE_CHOICES = (
        ('technical_informatics', 'Informática Técnica'),
        ('pedagogy', 'Pedagogia'),
    )
    name = models.CharField(max_length=255, verbose_name='Nome do Evento')
    target_courses = models.JSONField(verbose_name='Cursos Alvo')  # list of choices
    date = models.DateField(verbose_name='Data do Evento')
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='Carga Horária Total')
    participants = models.ManyToManyField(User, related_name='registered_events', blank=True)

    def __str__(self):
        return self.name

class Session(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=255, verbose_name='Título da Sessão')
    speaker = models.CharField(max_length=255, blank=True, null=True, verbose_name='Palestrante')
    start_time = models.TimeField(verbose_name='Horário de Início')
    end_time = models.TimeField(verbose_name='Horário de Fim')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')

    def get_color(self):
        courses = self.event.target_courses
        if 'technical_informatics' in courses and 'pedagogy' in courses:
            return 'linear-gradient(to right, #00008B, #800080)'  # dark blue to purple
        elif 'technical_informatics' in courses:
            return '#00008B'  # dark blue
        elif 'pedagogy' in courses:
            return '#800080'  # purple
        else:
            return '#FFFFFF'  # white

    def __str__(self):
        return self.title

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    qr_code = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'session')

    def __str__(self):
        return f'{self.user} - {self.session}'
