from django.db import models
from django.contrib.auth.models import User


class Cliente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=150, blank=True, null=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.usuario.username


class Administrador(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    cargo = models.CharField(max_length=80, default='Administrador')
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.usuario.username