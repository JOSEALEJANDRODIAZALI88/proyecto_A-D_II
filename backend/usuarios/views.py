from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Administrador, Cliente
from .serializers import LoginSerializer, RegisterSerializer, RecoverPasswordSerializer


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

        refresh = RefreshToken.for_user(user_auth)

        rol = "usuario"

        if user_auth.is_superuser or Administrador.objects.filter(usuario=user_auth, estado=True).exists():
            rol = "admin"

        return Response(
            {
                "token": str(refresh.access_token),
                "refresh": str(refresh),
                "rol": rol,
                "usuario": {
                    "id": user_auth.id,
                    "username": user_auth.username,
                    "correo": user_auth.email,
                    "nombre": user_auth.first_name
                }
            },
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

        username_base = correo.split("@")[0]
        username = username_base
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{username_base}{counter}"
            counter += 1

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


class RecoverPasswordView(APIView):
    def post(self, request):
        serializer = RecoverPasswordSerializer(data=request.data)

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
                {"message": "Correo no registrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(password)
        user.save()

        return Response(
            {"message": "Contrasena actualizada correctamente"},
            status=status.HTTP_200_OK
        )