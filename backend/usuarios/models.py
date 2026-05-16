from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Cliente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=20)
    ci = models.CharField(max_length=20)
    direccion = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return self.usuario.username


class Administrador(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    nivel_acceso = models.CharField(max_length=50, default='admin')

    def __str__(self):
        return self.usuario.username