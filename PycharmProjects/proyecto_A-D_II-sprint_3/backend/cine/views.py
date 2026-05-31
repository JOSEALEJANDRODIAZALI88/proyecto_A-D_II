from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Pelicula
from .serializers import PeliculaSerializer


class PeliculaViewSet(ModelViewSet):
    queryset = Pelicula.objects.all().order_by("id")
    serializer_class = PeliculaSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]