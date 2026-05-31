from django.urls import path
from .views import LoginView, RegisterView, RecoverPasswordView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("recover-password/", RecoverPasswordView.as_view(), name="recover-password"),
]