from django.db import models

# Create your models here.
from django.db import models


class Pelicula(models.Model):
    titulo = models.CharField(max_length=120)
    genero = models.CharField(max_length=80)
    sinopsis = models.TextField()
    duracion = models.IntegerField()
    clasificacion = models.CharField(max_length=30)
    idioma = models.CharField(max_length=50)
    formato = models.CharField(max_length=30)
    estado = models.BooleanField(default=True)
    fecha_estreno = models.DateField()

    def __str__(self):
        return self.titulo


class Sala(models.Model):
    nombre_sala = models.CharField(max_length=50)
    capacidad = models.IntegerField()
    tipo_sala = models.CharField(max_length=50)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_sala


class Asiento(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    fila = models.CharField(max_length=5)
    numero = models.IntegerField()
    tipo_asiento = models.CharField(max_length=50, default='Normal')
    estado = models.BooleanField(default=True)

    class Meta:
        unique_together = ('sala', 'fila', 'numero')

    def __str__(self):
        return f'{self.sala.nombre_sala} - {self.fila}{self.numero}'


class Funcion(models.Model):
    pelicula = models.ForeignKey(Pelicula, on_delete=models.CASCADE)
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    fecha_funcion = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.pelicula.titulo} - {self.fecha_funcion} - {self.hora_inicio}'