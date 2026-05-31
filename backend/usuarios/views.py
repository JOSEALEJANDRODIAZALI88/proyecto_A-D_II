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
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Administrador, Cliente, PasswordRecoveryCode
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UsuarioSaveSerializer,
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

    if Cliente.objects.filter(usuario=user).exists():
        return "cliente"

    return "usuario"


def get_user_data(user):
    cliente = Cliente.objects.filter(usuario=user).first()
    administrador = Administrador.objects.filter(usuario=user).first()
    rol = get_user_role(user)

    telefono = ""
    direccion = ""
    cargo = ""
    estado = user.is_active

    if cliente:
        telefono = cliente.telefono or ""
        direccion = cliente.direccion or ""
        estado = user.is_active and cliente.estado

    if administrador:
        cargo = administrador.cargo or "Administrador"
        estado = user.is_active and administrador.estado

    if user.is_superuser:
        cargo = "Administrador General"
        estado = user.is_active

    return {
        "id": user.id,
        "username": user.username,
        "nombre": user.first_name or user.username,
        "correo": user.email,
        "rol": rol,
        "telefono": telefono,
        "direccion": direccion,
        "cargo": cargo,
        "estado": estado,
        "is_superuser": user.is_superuser
    }


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


class UsuarioListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by("id")
        data = [get_user_data(user) for user in users]

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UsuarioSaveSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        nombre = serializer.validated_data["nombre"].strip()
        correo = serializer.validated_data["correo"].strip().lower()
        telefono = serializer.validated_data.get("telefono", "").strip()
        direccion = serializer.validated_data.get("direccion", "").strip()
        password = serializer.validated_data.get("password", "")
        rol = serializer.validated_data.get("rol", "cliente")
        estado_user = serializer.validated_data.get("estado", True)

        if not password:
            return Response(
                {"message": "La contrasena es obligatoria"},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = get_unique_username(correo)

        user = User.objects.create_user(
            username=username,
            email=correo,
            password=password,
            first_name=nombre
        )

        user.is_active = estado_user
        user.save()

        if rol == "admin":
            Administrador.objects.create(
                usuario=user,
                cargo="Administrador",
                estado=estado_user
            )
        else:
            Cliente.objects.create(
                usuario=user,
                telefono=telefono,
                direccion=direccion,
                estado=estado_user
            )

        return Response(
            {
                "message": "Usuario creado correctamente",
                "usuario": get_user_data(user)
            },
            status=status.HTTP_201_CREATED
        )


class UsuarioDetailView(APIView):
    permission_classes = [AllowAny]

    def get_user(self, user_id):
        return User.objects.filter(id=user_id).first()

    def get(self, request, user_id):
        user = self.get_user(user_id)

        if user is None:
            return Response(
                {"message": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(get_user_data(user), status=status.HTTP_200_OK)

    def put(self, request, user_id):
        user = self.get_user(user_id)

        if user is None:
            return Response(
                {"message": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UsuarioSaveSerializer(
            data=request.data,
            context={"user_id": user.id},
            partial=True
        )

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        nombre = serializer.validated_data.get("nombre")
        correo = serializer.validated_data.get("correo")
        telefono = serializer.validated_data.get("telefono")
        direccion = serializer.validated_data.get("direccion")
        password = serializer.validated_data.get("password")
        rol = serializer.validated_data.get("rol")
        estado_user = serializer.validated_data.get("estado", user.is_active)

        if nombre is not None:
            user.first_name = nombre.strip()

        if correo is not None:
            user.email = correo.strip().lower()

        if password:
            user.set_password(password)

        user.is_active = estado_user
        user.save()

        if rol == "admin":
            Cliente.objects.filter(usuario=user).delete()

            administrador, created = Administrador.objects.get_or_create(
                usuario=user,
                defaults={
                    "cargo": "Administrador",
                    "estado": estado_user
                }
            )

            administrador.estado = estado_user
            administrador.save()

        if rol == "cliente" and not user.is_superuser:
            Administrador.objects.filter(usuario=user).delete()

            cliente, created = Cliente.objects.get_or_create(
                usuario=user,
                defaults={
                    "telefono": telefono or "",
                    "direccion": direccion or "",
                    "estado": estado_user
                }
            )

            if telefono is not None:
                cliente.telefono = telefono.strip()

            if direccion is not None:
                cliente.direccion = direccion.strip()

            cliente.estado = estado_user
            cliente.save()

        cliente = Cliente.objects.filter(usuario=user).first()

        if cliente and rol != "admin":
            if telefono is not None:
                cliente.telefono = telefono.strip()

            if direccion is not None:
                cliente.direccion = direccion.strip()

            cliente.estado = estado_user
            cliente.save()

        administrador = Administrador.objects.filter(usuario=user).first()

        if administrador and rol != "cliente":
            administrador.estado = estado_user
            administrador.save()

        return Response(
            {
                "message": "Usuario actualizado correctamente",
                "usuario": get_user_data(user)
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, user_id):
        user = self.get_user(user_id)

        if user is None:
            return Response(
                {"message": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.is_superuser:
            return Response(
                {"message": "No se puede eliminar el administrador principal"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return Response(
            {"message": "Usuario eliminado correctamente"},
            status=status.HTTP_200_OK
        )


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

        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests
        except ImportError:
            return Response(
                {"message": "Falta instalar google-auth y requests"},
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