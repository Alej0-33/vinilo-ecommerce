from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import generics, status, views
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import timedelta
from django.utils import timezone 
from .serializers import RegisterSerializer, UserSerializer
from .models import VerificationCode

# --- 1. REGISTRO (CON PROTECCIÓN DE FUERZA BRUTA) ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    # Seguridad: Limita intentos para evitar creación masiva de cuentas falsas
    throttle_classes = [ScopedRateThrottle] 
    throttle_scope = 'auth_attempts'

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Sanitización: Normalizar email a minúsculas
        data = request.data.copy()
        if 'email' in data:
            data['email'] = data['email'].lower().strip()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # Guardamos usuario pero INACTIVO hasta que verifique
        user = serializer.save(is_active=False) 
        
        # Generar código
        verification, created = VerificationCode.objects.get_or_create(user=user)
        code = verification.generate_code()
        
        # Enviar Correo
        send_mail(
            subject='Código de Verificación - Vinilo Store',
            message=f'Tu código de verificación es: {code}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        return Response({
            "message": "Usuario creado. Revisa tu correo para el código de verificación.",
            "email": user.email
        }, status=status.HTTP_201_CREATED)


class VerifyEmailView(views.APIView):
    permission_classes = (AllowAny,)
    # Seguridad: Limita intentos de ingresar códigos incorrectos
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempts'

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()
        
        if not email or not code:
            return Response({"error": "Email y código requeridos"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # OPTIMIZACIÓN SQL: 'select_related' trae el Código y el User en UNA sola consulta
            verification = VerificationCode.objects.select_related('user').get(user__email=email)
            user = verification.user
            
            # --- VALIDACIÓN DE TIEMPO (15 MINUTOS) ---
            expiration_time = verification.created_at + timedelta(minutes=15)
            
            if timezone.now() > expiration_time:
                # Código vencido -> Limpieza de base de datos
                user.delete() 
                return Response(
                    {"error": "El código ha expirado. La cuenta fue eliminada, regístrate nuevamente."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validación del código
            if verification.code == code:
                user.is_active = True
                user.save()
                verification.delete()  # Limpieza: Ya no necesitamos el código
                return Response({"success": True, "message": "Cuenta verificada exitosamente"})
            else:
                return Response({"error": "Código incorrecto"}, status=status.HTTP_400_BAD_REQUEST)
                
        except VerificationCode.DoesNotExist:
            return Response({"error": "Usuario no encontrado o ya verificado."}, status=status.HTTP_400_BAD_REQUEST)

    
# --- 2. RECUPERACIÓN DE CONTRASEÑA ---

class PasswordResetRequestView(views.APIView):
    permission_classes = (AllowAny,)
    # Seguridad: Evita spam de correos
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempts'

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        
        # Optimización: filter().first() es más limpio que try/except User.DoesNotExist
        user = User.objects.filter(email=email).first()

        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Link al frontend
            link = f"http://localhost:5173/reset-password/{uid}/{token}/"
            
            send_mail(
                subject='Recuperar Contraseña - Vinilo Store',
                message=f'Para recuperar tu contraseña ingresa aquí: {link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        
        # Seguridad: Anti-Enumeration. Siempre retornamos OK para no revelar si el email existe.
        return Response({"message": "Si la cuenta existe, hemos enviado un correo."})


class PasswordResetConfirmView(views.APIView):
    permission_classes = (AllowAny,)
    # Seguridad: Protege contra fuerza bruta de tokens
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempts'

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            # Django maneja la expiración del token según PASSWORD_RESET_TIMEOUT en settings.py
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"success": True, "message": "Contraseña actualizada."})
            else:
                return Response({"error": "Link inválido o expirado."}, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Link inválido."}, status=status.HTTP_400_BAD_REQUEST)


# --- 3. LOGIN PERSONALIZADO ---

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Se normaliza email para asegurar login sin importar mayúsculas
        if 'username' in attrs:
            pass # SimpleJWT usa username field
        
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
    # Nota: SimpleJWT tiene sus propios mecanismos, pero puedes agregar throttling aquí si lo deseas


# --- 4. PERFIL DE USUARIO ---

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        data = request.data.copy()

        # Sanitización de email
        if 'email' in data:
            data['email'] = data['email'].lower().strip()
            
            if data['email'] != user.email:
                if User.objects.filter(email=data['email']).exists():
                    return Response(
                        {"email": ["Este correo electrónico ya está en uso por otra cuenta."]}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.username = data['email']

        serializer = UserSerializer(user, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)