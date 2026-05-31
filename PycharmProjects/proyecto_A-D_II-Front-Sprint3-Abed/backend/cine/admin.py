from django.contrib import admin
from .models import Pelicula, Sala, Asiento, Funcion

admin.site.register(Pelicula)
admin.site.register(Sala)
admin.site.register(Asiento)
admin.site.register(Funcion)