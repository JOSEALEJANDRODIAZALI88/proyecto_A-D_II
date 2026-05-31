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

    def validate_nombre(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("El nombre es obligatorio")

        return value

    def validate_correo(self, value):
        value = value.strip().lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo ya esta registrado")

        return value

    def validate_telefono(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError("El telefono solo debe contener numeros")

        if len(value) < 7 or len(value) > 12:
            raise serializers.ValidationError("El telefono debe tener entre 7 y 12 numeros")

        return value

    def validate_password(self, value):
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("La contrasena debe incluir una letra")

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("La contrasena debe incluir un numero")

        return value


class UsuarioSaveSerializer(serializers.Serializer):
    nombre = serializers.CharField(min_length=2, max_length=100)
    correo = serializers.EmailField()
    telefono = serializers.CharField(required=False, allow_blank=True, max_length=20)
    direccion = serializers.CharField(required=False, allow_blank=True, max_length=150)
    password = serializers.CharField(required=False, allow_blank=True, min_length=6, max_length=128)
    rol = serializers.ChoiceField(choices=["cliente", "admin"], default="cliente")
    estado = serializers.BooleanField(required=False, default=True)

    def validate_correo(self, value):
        value = value.strip().lower()
        user_id = self.context.get("user_id")

        query = User.objects.filter(email=value)

        if user_id:
            query = query.exclude(id=user_id)

        if query.exists():
            raise serializers.ValidationError("El correo ya esta registrado")

        return value

    def validate_telefono(self, value):
        value = value.strip()

        if value and not value.isdigit():
            raise serializers.ValidationError("El telefono solo debe contener numeros")

        if value and (len(value) < 7 or len(value) > 12):
            raise serializers.ValidationError("El telefono debe tener entre 7 y 12 numeros")

        return value

    def validate_password(self, value):
        if not value:
            return value

        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("La contrasena debe incluir una letra")

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("La contrasena debe incluir un numero")

        return value


class GoogleAuthSerializer(serializers.Serializer):
    credential = serializers.CharField()


class SendPasswordRecoveryCodeSerializer(serializers.Serializer):
    correo = serializers.EmailField()

    def validate_correo(self, value):
        value = value.strip().lower()

        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo no esta registrado")

        return value


class VerifyPasswordRecoveryCodeSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)

    def validate_codigo(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El codigo solo debe contener numeros")

        return value


class ResetPasswordWithCodeSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)
    password = serializers.CharField(min_length=6, max_length=128)

    def validate_codigo(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El codigo solo debe contener numeros")

        return value

    def validate_password(self, value):
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("La contrasena debe incluir una letra")

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("La contrasena debe incluir un numero")

        return value