from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Promocion, Venta, DetalleVenta, Pago, Comprobante, TicketVirtual

admin.site.register(Promocion)
admin.site.register(Venta)
admin.site.register(DetalleVenta)
admin.site.register(Pago)
admin.site.register(Comprobante)
admin.site.register(TicketVirtual)