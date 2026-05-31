from datetime import timedelta
import secrets
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import Administrador, Cliente, PasswordRecoveryCode
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    GoogleAuthSerializer,
    SendPasswordRecoveryCodeSerializer,
    VerifyPasswordRecoveryCodeSerializer,
    ResetPasswordWithCodeSerializer
)


GOOGLE_CLIENT_ID = "PEGA_AQUI_TU_CLIENT_ID_DE_GOOGLE"


def get_unique_username(correo):
    username_base = correo.split("@")[0]
    username = username_base
    counter = 1

    while User.objects.filter(username=username).exists():
        username = f"{username_base}{counter}"
        counter += 1

    return username


def get_user_role(user):
    if user.is_superuser or Administrador.objects.filter(usuario=user, estado=True).exists():
        return "admin"

    return "usuario"


def build_auth_response(user):
    refresh = RefreshToken.for_user(user)
    rol = get_user_role(user)

    return {
        "token": str(refresh.access_token),
        "refresh": str(refresh),
        "rol": rol,
        "usuario": {
            "id": user.id,
            "username": user.username,
            "correo": user.email,
            "nombre": user.first_name
        }
    }


def get_active_recovery(correo):
    return PasswordRecoveryCode.objects.filter(
        correo=correo,
        used=False,
        expires_at__gt=timezone.now()
    ).order_by("-created_at").first()


def validate_recovery_code(correo, codigo):
    recovery = get_active_recovery(correo)

    if recovery is None:
        return None, "El codigo expiro o no existe"

    if recovery.attempts >= 5:
        recovery.used = True
        recovery.save()
        return None, "Se supero el numero de intentos"

    if not check_password(codigo, recovery.code_hash):
        recovery.attempts += 1
        recovery.save()
        return None, "Codigo incorrecto"

    return recovery, ""


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=correo).first()

        if user is None:
            return Response(
                {"message": "Credenciales incorrectas"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user_auth = authenticate(username=user.username, password=password)

        if user_auth is None:
            return Response(
                {"message": "Credenciales incorrectas"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user_auth.is_active:
            return Response(
                {"message": "Usuario inactivo"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(
            build_auth_response(user_auth),
            status=status.HTTP_200_OK
        )


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        nombre = serializer.validated_data["nombre"]
        correo = serializer.validated_data["correo"]
        telefono = serializer.validated_data["telefono"]
        password = serializer.validated_data["password"]

        username = get_unique_username(correo)

        user = User.objects.create_user(
            username=username,
            email=correo,
            password=password,
            first_name=nombre
        )

        user.is_active = True
        user.save()

        Cliente.objects.create(
            usuario=user,
            telefono=telefono,
            estado=True
        )

        return Response(
            {
                "message": "Usuario registrado correctamente",
                "usuario": {
                    "id": user.id,
                    "username": user.username,
                    "correo": user.email,
                    "nombre": user.first_name
                }
            },
            status=status.HTTP_201_CREATED
        )


class GoogleAuthView(APIView):
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID == "PEGA_AQUI_TU_CLIENT_ID_DE_GOOGLE":
            return Response(
                {"message": "Falta configurar GOOGLE_CLIENT_ID en el backend"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        credential = serializer.validated_data["credential"]

        try:
            payload = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response(
                {"message": "Token de Google invalido"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        correo = payload.get("email")
        nombre = payload.get("name") or payload.get("given_name") or ""
        email_verified = payload.get("email_verified", False)

        if not correo:
            return Response(
                {"message": "Google no devolvio un correo"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not email_verified:
            return Response(
                {"message": "El correo de Google no esta verificado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=correo).first()

        if user is None:
            username = get_unique_username(correo)

            user = User(
                username=username,
                email=correo,
                first_name=nombre,
                is_active=True
            )

            user.set_unusable_password()
            user.save()

            Cliente.objects.create(
                usuario=user,
                telefono="",
                estado=True
            )

        if not user.is_active:
            return Response(
                {"message": "Usuario inactivo"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(
            build_auth_response(user),
            status=status.HTTP_200_OK
        )


class SendPasswordRecoveryCodeView(APIView):
    def post(self, request):
        serializer = SendPasswordRecoveryCodeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"]
        codigo = f"{secrets.randbelow(1000000):06d}"
        expires_at = timezone.now() + timedelta(minutes=10)

        PasswordRecoveryCode.objects.filter(
            correo=correo,
            used=False
        ).update(used=True)

        recovery = PasswordRecoveryCode.objects.create(
            correo=correo,
            code_hash=make_password(codigo),
            expires_at=expires_at,
            used=False,
            attempts=0
        )

        subject = "Codigo de recuperacion"
        message = (
            f"Tu codigo de recuperacion es: {codigo}\n\n"
            "Este codigo vence en 10 minutos.\n"
            "Si no solicitaste este codigo, ignora este mensaje."
        )

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [correo],
                fail_silently=False
            )
        except Exception:
            recovery.delete()
            return Response(
                {"message": "No se pudo enviar el correo de recuperacion"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": "Codigo enviado correctamente"},
            status=status.HTTP_200_OK
        )


class VerifyPasswordRecoveryCodeView(APIView):
    def post(self, request):
        serializer = VerifyPasswordRecoveryCodeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"].strip().lower()
        codigo = serializer.validated_data["codigo"]

        recovery, message = validate_recovery_code(correo, codigo)

        if recovery is None:
            return Response(
                {"message": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Codigo verificado correctamente"},
            status=status.HTTP_200_OK
        )


class ResetPasswordWithCodeView(APIView):
    def post(self, request):
        serializer = ResetPasswordWithCodeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"].strip().lower()
        codigo = serializer.validated_data["codigo"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=correo).first()

        if user is None:
            return Response(
                {"message": "Correo no registrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        recovery, message = validate_recovery_code(correo, codigo)

        if recovery is None:
            return Response(
                {"message": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        recovery.used = True
        recovery.save()

        PasswordRecoveryCode.objects.filter(
            correo=correo,
            used=False
        ).update(used=True)

        return Response(
            {"message": "Contrasena actualizada correctamente"},
            status=status.HTTP_200_OK
        )