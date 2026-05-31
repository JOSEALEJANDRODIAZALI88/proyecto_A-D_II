from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    GoogleAuthView,
    SendPasswordRecoveryCodeView,
    VerifyPasswordRecoveryCodeView,
    ResetPasswordWithCodeView
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("google/", GoogleAuthView.as_view(), name="google"),
    path("recover-password/send-code/", SendPasswordRecoveryCodeView.as_view(), name="send-recovery-code"),
    path("recover-password/verify-code/", VerifyPasswordRecoveryCodeView.as_view(), name="verify-recovery-code"),
    path("recover-password/reset/", ResetPasswordWithCodeView.as_view(), name="reset-password-code"),
]