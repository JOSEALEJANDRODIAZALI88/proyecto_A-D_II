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
from .models import Administrador, Cliente
from .serializers import LoginSerializer, RegisterSerializer, RecoverPasswordSerializer

try:
    from .models import PasswordRecoveryCode
except Exception:
    PasswordRecoveryCode = None

try:
    from cine.models import Pelicula
except Exception:
    Pelicula = None

try:
    from cine.models import Funcion
except Exception:
    Funcion = None


GOOGLE_CLIENT_ID = "PEGA_AQUI_TU_CLIENT_ID_DE_GOOGLE"


def get_unique_username(correo):
    username_base = correo.split("@")[0]
    username = username_base
    counter = 1

    while User.objects.filter(username=username).exists():
        username = f"{username_base}{counter}"
        counter += 1

    return username


def get_unique_username_update(correo, user_id):
    username_base = correo.split("@")[0]
    username = username_base
    counter = 1

    while User.objects.filter(username=username).exclude(id=user_id).exists():
        username = f"{username_base}{counter}"
        counter += 1

    return username


def normalize_role_value(rol):
    rol_text = str(rol or "").strip().lower()

    if rol_text in ["admin", "administrador"]:
        return "admin"

    if rol_text in ["cliente", "usuario", "user"]:
        return "cliente"

    return "cliente"


def normalize_estado_value(estado):
    if isinstance(estado, bool):
        return estado

    if isinstance(estado, str):
        return estado.strip().lower() in ["true", "1", "activo", "activa", "si"]

    return bool(estado)


def get_user_role(user):
    if Administrador.objects.filter(usuario=user, estado=True).exists():
        return "admin"

    return "cliente"


def get_user_data(user):
    cliente = Cliente.objects.filter(usuario=user).first()
    administrador = Administrador.objects.filter(usuario=user, estado=True).first()

    telefono = ""
    direccion = ""
    cargo = ""
    rol = "cliente"
    estado = user.is_active

    if cliente is not None:
        telefono = cliente.telefono or ""
        direccion = cliente.direccion or ""
        estado = user.is_active and cliente.estado

    if administrador is not None:
        rol = "admin"
        cargo = administrador.cargo or "Administrador"
        estado = user.is_active and administrador.estado

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
    rol_sistema = get_user_role(user)

    if rol_sistema == "admin":
        rol = "admin"
    else:
        rol = "usuario"

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
    if PasswordRecoveryCode is None:
        return None

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


class DashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        peliculas_activas = 0
        funciones_hoy = 0
        peliculas_data = []

        if Pelicula is not None:
            try:
                peliculas_activas = Pelicula.objects.filter(estado=True).count()
                peliculas = Pelicula.objects.all().order_by("-id")[:6]

                for pelicula in peliculas:
                    poster_value = ""
                    poster = getattr(pelicula, "poster", None)

                    if poster:
                        try:
                            poster_value = poster.url
                        except Exception:
                            poster_value = str(poster)

                    peliculas_data.append({
                        "id": pelicula.id,
                        "titulo": getattr(pelicula, "titulo", ""),
                        "genero": getattr(pelicula, "genero", ""),
                        "estado": getattr(pelicula, "estado", True),
                        "fecha_estreno": getattr(pelicula, "fecha_estreno", None),
                        "tickets_vendidos": getattr(pelicula, "tickets_vendidos", 0),
                        "poster": poster_value
                    })
            except Exception:
                peliculas_activas = 0
                peliculas_data = []

        if Funcion is not None:
            try:
                today = timezone.localdate()
                funciones_hoy = Funcion.objects.filter(fecha=today).count()
            except Exception:
                funciones_hoy = 0

        return Response(
            {
                "estadisticas": {
                    "peliculas_activas": peliculas_activas,
                    "tickets_vendidos": 0,
                    "usuarios_registrados": User.objects.count(),
                    "funciones_hoy": funciones_hoy
                },
                "peliculas": peliculas_data
            },
            status=status.HTTP_200_OK
        )


class UsuarioListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by("id")
        data = [get_user_data(user) for user in users]

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        nombre = str(request.data.get("nombre", "")).strip()
        correo = str(request.data.get("correo", "")).strip().lower()
        telefono = str(request.data.get("telefono", "")).strip()
        direccion = str(request.data.get("direccion", "")).strip()
        password = str(request.data.get("password", "")).strip()
        rol = normalize_role_value(request.data.get("rol", "cliente"))
        estado = normalize_estado_value(request.data.get("estado", True))

        if not nombre:
            return Response(
                {"message": "El nombre es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not correo:
            return Response(
                {"message": "El correo es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if "@" not in correo or "." not in correo:
            return Response(
                {"message": "El correo no tiene formato valido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not telefono:
            return Response(
                {"message": "El telefono es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not password:
            return Response(
                {"message": "La contrasena es obligatoria"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {"message": "La contrasena debe tener al menos 6 caracteres"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email__iexact=correo).exists():
            return Response(
                {"message": "El correo ya esta registrado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = get_unique_username(correo)

        user = User.objects.create_user(
            username=username,
            email=correo,
            password=password,
            first_name=nombre
        )

        user.is_active = estado
        user.is_superuser = False
        user.is_staff = rol == "admin"
        user.save()

        Cliente.objects.create(
            usuario=user,
            telefono=telefono,
            direccion=direccion,
            estado=estado
        )

        if rol == "admin":
            Administrador.objects.create(
                usuario=user,
                cargo="Administrador",
                estado=estado
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

    def get(self, request, user_id):
        user = User.objects.filter(id=user_id).first()

        if user is None:
            return Response(
                {"message": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        data = get_user_data(user)

        if data["rol"] == "admin":
            data["rol"] = "Administrador"
        else:
            data["rol"] = "Cliente"

        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        user = User.objects.filter(id=user_id).first()

        if user is None:
            return Response(
                {"message": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        nombre = str(request.data.get("nombre", "")).strip()
        correo = str(request.data.get("correo", "")).strip().lower()
        telefono = str(request.data.get("telefono", "")).strip()
        direccion = str(request.data.get("direccion", "")).strip()
        rol = normalize_role_value(request.data.get("rol", "cliente"))
        password = str(request.data.get("password", "")).strip()
        estado = normalize_estado_value(request.data.get("estado", True))

        if not nombre:
            return Response(
                {"message": "El nombre es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not correo:
            return Response(
                {"message": "El correo es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if "@" not in correo or "." not in correo:
            return Response(
                {"message": "El correo no tiene formato valido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not telefono:
            return Response(
                {"message": "El telefono es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo_repetido = User.objects.filter(email__iexact=correo).exclude(id=user.id).first()

        if correo_repetido is not None:
            return Response(
                {"message": f"El correo ya pertenece al usuario ID {correo_repetido.id}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.first_name = nombre
        user.email = correo
        user.username = get_unique_username_update(correo, user.id)
        user.is_active = estado
        user.is_superuser = False
        user.is_staff = rol == "admin"

        password_placeholders = [
            "********",
            "************",
            "••••••••",
            "••••••••••",
            "••••••••••••"
        ]

        if password and password not in password_placeholders:
            if len(password) < 6:
                return Response(
                    {"message": "La contrasena debe tener al menos 6 caracteres"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(password)

        user.save()

        cliente, created = Cliente.objects.get_or_create(
            usuario=user,
            defaults={
                "telefono": telefono,
                "direccion": direccion,
                "estado": estado
            }
        )

        cliente.telefono = telefono
        cliente.direccion = direccion
        cliente.estado = estado
        cliente.save()

        if rol == "admin":
            administrador, created = Administrador.objects.get_or_create(
                usuario=user,
                defaults={
                    "cargo": "Administrador",
                    "estado": estado
                }
            )

            administrador.cargo = "Administrador"
            administrador.estado = estado
            administrador.save()

        if rol == "cliente":
            Administrador.objects.filter(usuario=user).delete()

        return Response(
            {
                "message": "Usuario actualizado correctamente",
                "usuario": get_user_data(user)
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, user_id):
        user = User.objects.filter(id=user_id).first()

        if user is None:
            return Response(
                {"message": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        user.delete()

        return Response(
            {"message": "Usuario eliminado correctamente"},
            status=status.HTTP_200_OK
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"].strip().lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=correo).first()

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
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        nombre = serializer.validated_data["nombre"].strip()
        correo = serializer.validated_data["correo"].strip().lower()
        telefono = serializer.validated_data["telefono"].strip()
        password = serializer.validated_data["password"]

        if User.objects.filter(email__iexact=correo).exists():
            return Response(
                {"message": "El correo ya esta registrado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = get_unique_username(correo)

        user = User.objects.create_user(
            username=username,
            email=correo,
            password=password,
            first_name=nombre
        )

        user.is_active = True
        user.is_staff = False
        user.is_superuser = False
        user.save()

        Cliente.objects.create(
            usuario=user,
            telefono=telefono,
            direccion="",
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


class RecoverPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RecoverPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "Datos invalidos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"].strip().lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=correo).first()

        if user is None:
            return Response(
                {"message": "Correo no registrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(password)
        user.save()

        return Response(
            {"message": "Contrasena actualizada correctamente"},
            status=status.HTTP_200_OK
        )


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        credential = str(request.data.get("credential", "")).strip()

        if not credential:
            return Response(
                {"message": "Falta credential"},
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

        user = User.objects.filter(email__iexact=correo).first()

        if user is None:
            username = get_unique_username(correo)

            user = User(
                username=username,
                email=correo,
                first_name=nombre,
                is_active=True,
                is_staff=False,
                is_superuser=False
            )

            user.set_unusable_password()
            user.save()

            Cliente.objects.create(
                usuario=user,
                telefono="",
                direccion="",
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
    permission_classes = [AllowAny]

    def post(self, request):
        if PasswordRecoveryCode is None:
            return Response(
                {"message": "Falta el modelo PasswordRecoveryCode"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        correo = str(request.data.get("correo", "")).strip().lower()

        if not correo:
            return Response(
                {"message": "El correo es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email__iexact=correo).first()

        if user is None:
            return Response(
                {"message": "Correo no registrado"},
                status=status.HTTP_404_NOT_FOUND
            )

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
    permission_classes = [AllowAny]

    def post(self, request):
        correo = str(request.data.get("correo", "")).strip().lower()
        codigo = str(request.data.get("codigo", "")).strip()

        if not correo or not codigo:
            return Response(
                {"message": "Correo y codigo son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    permission_classes = [AllowAny]

    def post(self, request):
        if PasswordRecoveryCode is None:
            return Response(
                {"message": "Falta el modelo PasswordRecoveryCode"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        correo = str(request.data.get("correo", "")).strip().lower()
        codigo = str(request.data.get("codigo", "")).strip()
        password = str(request.data.get("password", "")).strip()

        if not correo or not codigo or not password:
            return Response(
                {"message": "Todos los campos son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email__iexact=correo).first()

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