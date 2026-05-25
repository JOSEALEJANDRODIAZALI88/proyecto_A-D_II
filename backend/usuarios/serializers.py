from django.contrib.auth.models import User
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(min_length=6, max_length=128)


class RegisterSerializer(serializers.Serializer):
    nombre = serializers.CharField(min_length=2, max_length=100)
    correo = serializers.EmailField()
    telefono = serializers.CharField(min_length=6, max_length=20)
    password = serializers.CharField(min_length=6, max_length=128)

    def validate_correo(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo ya esta registrado")
        return value


class RecoverPasswordSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(min_length=6, max_length=128)