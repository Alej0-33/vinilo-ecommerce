from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer, UserSerializer

# --- PERSONALIZAR EL LOGIN (Para devolver datos del usuario junto al token) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregamos datos extra a la respuesta del login para que el frontend los guarde
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'name': f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- VISTA DE REGISTRO SEGURO Y ATÓMICO ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    @transaction.atomic  # <--- Atomicidad: Si algo falla, no se guarda nada en la BD
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "message": "Usuario creado exitosamente",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

# --- VISTA PARA VER Y ACTUALIZAR EL PERFIL ---
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Obtener datos del usuario logueado"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        """
        Actualizar datos del usuario (Nombre, Apellido, Email).
        Validamos que si cambia el email, no esté en uso.
        """
        user = request.user
        data = request.data

        # Si el usuario intenta cambiar el email
        if 'email' in data and data['email'] != user.email:
            # Verificar que no exista otro usuario con ese email
            if User.objects.filter(email=data['email']).exists():
                return Response(
                    {"email": ["Este correo electrónico ya está en uso por otra cuenta."]}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Como usamos email = username en el registro, actualizamos ambos
            user.username = data['email']

        # 'partial=True' permite actualizar solo algunos campos sin enviar todos
        serializer = UserSerializer(user, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)