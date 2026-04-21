from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import RegisterSerializer, ProfileSerializer, UserPublicSerializer
from common.throttles import RegisterThrottle, LoginThrottle, UploadThrottle


class LoginView(TokenObtainPairView):
    throttle_classes = [LoginThrottle]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegisterThrottle]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_throttles(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [UploadThrottle()]
        return super().get_throttles()


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]
