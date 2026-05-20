from django.contrib import admin
from .models import Promocion, Venta, Pago, Comprobante, Boleto

admin.site.register(Promocion)
admin.site.register(Venta)
admin.site.register(Pago)
admin.site.register(Comprobante)
admin.site.register(Boleto)