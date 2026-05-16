from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from cine.models import Funcion, Asiento


class Promocion(models.Model):
    nombre_promocion = models.CharField(max_length=100)
    descripcion = models.TextField()
    porcentaje_descuento = models.DecimalField(max_digits=5, decimal_places=2)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_promocion


class Venta(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE)
    funcion = models.ForeignKey(Funcion, on_delete=models.CASCADE)
    promocion = models.ForeignKey(Promocion, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    cantidad_entradas = models.IntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=30, default='pendiente')

    def __str__(self):
        return f'Venta {self.id}'


class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    funcion = models.ForeignKey(Funcion, on_delete=models.CASCADE)
    asiento = models.ForeignKey(Asiento, on_delete=models.CASCADE)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    estado_asiento = models.CharField(max_length=30, default='vendido')

    class Meta:
        unique_together = ('funcion', 'asiento')

    def __str__(self):
        return f'{self.venta.id} - {self.asiento}'


class Pago(models.Model):
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50)
    referencia = models.CharField(max_length=100)
    estado = models.CharField(max_length=30, default='confirmado')

    def __str__(self):
        return f'Pago {self.id}'


class Comprobante(models.Model):
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE)
    numero_comprobante = models.CharField(max_length=50, unique=True)
    fecha_emision = models.DateTimeField(auto_now_add=True)
    nit_ci = models.CharField(max_length=20)
    razon_social = models.CharField(max_length=120)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    codigo_control = models.CharField(max_length=100)
    estado = models.CharField(max_length=30, default='emitido')

    def __str__(self):
        return self.numero_comprobante


class TicketVirtual(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    detalle_venta = models.OneToOneField(DetalleVenta, on_delete=models.CASCADE)
    codigo_qr = models.CharField(max_length=200)
    codigo_ticket = models.CharField(max_length=100, unique=True)
    estado = models.CharField(max_length=30, default='emitido')
    fecha_emision = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.codigo_ticket