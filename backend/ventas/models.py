from django.db import models
from django.contrib.auth.models import User
from cine.models import Funcion, Asiento


class Promocion(models.Model):
    nombre_promocion = models.CharField(max_length=100)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_promocion


class Venta(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE)
    promocion = models.ForeignKey(Promocion, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    cantidad_boletos = models.IntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=30, default='pendiente')

    def __str__(self):
        return f'Venta {self.id}'


class Pago(models.Model):
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE)
    metodo_pago = models.CharField(max_length=50, default='No definido')
    monto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado_pago = models.CharField(max_length=30, default='confirmado')
    fecha_pago = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pago {self.id}'

class Comprobante(models.Model):
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=100, unique=True, null=True, blank=True)
    fecha_emision = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.codigo if self.codigo else f'Comprobante {self.id}'


class Boleto(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    funcion = models.ForeignKey(Funcion, on_delete=models.CASCADE)
    asiento = models.ForeignKey(Asiento, on_delete=models.CASCADE)
    codigo_boleto = models.CharField(max_length=100, unique=True, null=True, blank=True)
    codigo_qr = models.CharField(max_length=200, unique=True, null=True, blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado_boleto = models.CharField(max_length=30, default='emitido')
    fecha_emision = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('funcion', 'asiento')

    def __str__(self):
        return self.codigo_boleto if self.codigo_boleto else f'Boleto {self.id}'