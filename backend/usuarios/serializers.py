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
        correo = value.strip().lower()

        if User.objects.filter(email__iexact=correo).exists():
            raise serializers.ValidationError("El correo ya esta registrado")

        return correo


class RecoverPasswordSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(min_length=6, max_length=128)


class UsuarioSaveSerializer(serializers.Serializer):
    nombre = serializers.CharField(min_length=2, max_length=100)
    correo = serializers.EmailField()
    telefono = serializers.CharField(min_length=6, max_length=20, required=False, allow_blank=True)
    direccion = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(min_length=6, max_length=128, required=False, allow_blank=True)
    rol = serializers.CharField(max_length=30, required=False, allow_blank=True)
    estado = serializers.BooleanField(required=False)


class GoogleAuthSerializer(serializers.Serializer):
    credential = serializers.CharField()


class SendPasswordRecoveryCodeSerializer(serializers.Serializer):
    correo = serializers.EmailField()


class VerifyPasswordRecoveryCodeSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)


class ResetPasswordWithCodeSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)
    password = serializers.CharField(min_length=6, max_length=128)