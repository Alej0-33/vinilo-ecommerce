import random
from datetime import timedelta
from django.db import transaction
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer, UserSerializer
from .models import VerificationCode, PendingUser

# --- 1. REGISTRO (PASO 1: CREAR USUARIO PENDIENTE Y ENVIAR CÓDIGO) ---
class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    throttle_scope = 'auth_attempts'

    @transaction.atomic
    def post(self, request):
        # Mapeamos los datos del frontend (camelCase) a los del serializador (snake_case)
        data = {
            'email': request.data.get('email'),
            'first_name': request.data.get('firstName'),
            'last_name': request.data.get('lastName'),
            'password': request.data.get('password')
        }
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        # Generar código de 6 dígitos
        code = str(random.randint(100000, 999999))
        
        # Guardar en tabla temporal PendingUser
        pending, created = PendingUser.objects.update_or_create(
            email=email,
            defaults={
                'first_name': serializer.validated_data['first_name'],
                'last_name': serializer.validated_data['last_name'],
                'code': code
            }
        )
        # Hachear la contraseña antes de guardarla en la tabla temporal
        pending.set_password(serializer.validated_data['password'])
        pending.save()

        # Enviar Correo
        try:
            send_mail(
                'Tu Código de Verificación - Vinilo Store',
                f'Hola {pending.first_name},\n\nTu código para crear tu cuenta es: {code}\nEste código expira en 15 minutos.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except Exception:
            return Response({"error": "Error al enviar el correo."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"success": True, "message": "Código de verificación enviado."})


# --- 2. VERIFICACIÓN (PASO 2: VALIDAR CÓDIGO Y CREAR USUARIO REAL) ---
class VerifyEmailView(views.APIView):
    permission_classes = (AllowAny,)
    throttle_scope = 'auth_attempts'

    @transaction.atomic
    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        code = request.data.get('code', '').strip()

        try:
            pending = PendingUser.objects.get(email=email, code=code)
            
            # Validación de expiración (15 minutos)
            if timezone.now() > pending.created_at + timedelta(minutes=15):
                pending.delete()
                return Response({"error": "El código ha expirado. Regístrate de nuevo."}, status=status.HTTP_400_BAD_REQUEST)

            # Verificar si por algún motivo ya existe el usuario real
            if User.objects.filter(email=pending.email).exists():
                pending.delete()
                return Response({"error": "Este email ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

            # Crear el usuario oficial en auth_user
            user = User.objects.create(
                username=pending.email,
                email=pending.email,
                first_name=pending.first_name,
                last_name=pending.last_name,
                password=pending.password # Ya es un hash seguro
            )
            
            # Limpiar el registro temporal
            pending.delete()

            return Response({"success": True, "message": "Cuenta creada y verificada exitosamente."})

        except PendingUser.DoesNotExist:
            return Response({"error": "Código o email inválido."}, status=status.HTTP_400_BAD_REQUEST)


# --- 3. LOGIN PERSONALIZADO (SIMPLE JWT) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'name': f"{self.user.first_name} {self.user.last_name}".strip()
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# --- 4. PERFIL DE USUARIO ---
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            if 'email' in serializer.validated_data:
                new_email = serializer.validated_data['email'].lower().strip()
                if new_email != user.email:
                    if User.objects.filter(email=new_email).exists():
                        return Response({"error": "Email ya en uso."}, status=status.HTTP_400_BAD_REQUEST)
                    user.username = new_email
            
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- 5. RECUPERACIÓN DE CONTRASEÑA ---
class PasswordResetRequestView(views.APIView):
    permission_classes = (AllowAny,)
    throttle_scope = 'auth_attempts'

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        user = User.objects.filter(email=email).first()

        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            link = f"https://www.vinilostore.xyz/reset-password/{uid}/{token}/"
            
            send_mail(
                'Recuperar Contraseña - Vinilo Store',
                f'Haz clic en el siguiente enlace para restablecer tu contraseña: {link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        
        return Response({"message": "Si la cuenta existe, hemos enviado un correo de recuperación."})


class PasswordResetConfirmView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"success": True, "message": "Contraseña actualizada exitosamente."})
            else:
                return Response({"error": "El enlace ha expirado o es inválido."}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception:
            return Response({"error": "Error al procesar la solicitud."}, status=status.HTTP_400_BAD_REQUEST)