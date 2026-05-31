from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    GoogleAuthView,
    UsuarioListCreateView,
    UsuarioDetailView,
    SendPasswordRecoveryCodeView,
    VerifyPasswordRecoveryCodeView,
    ResetPasswordWithCodeView
)
from .dashboard_views import DashboardView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("google/", GoogleAuthView.as_view(), name="google"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("usuarios/", UsuarioListCreateView.as_view(), name="usuarios"),
    path("usuarios/<int:user_id>/", UsuarioDetailView.as_view(), name="usuario-detail"),
    path("recover-password/send-code/", SendPasswordRecoveryCodeView.as_view(), name="send-recovery-code"),
    path("recover-password/verify-code/", VerifyPasswordRecoveryCodeView.as_view(), name="verify-recovery-code"),
    path("recover-password/reset/", ResetPasswordWithCodeView.as_view(), name="reset-password-code"),
]