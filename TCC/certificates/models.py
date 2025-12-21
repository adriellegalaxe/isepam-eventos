from django.db import models
from accounts.models import User
from events.models import Event

# Create your models here.

class Certificate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f'Certificado de {self.user.full_name} para {self.event.name}'
