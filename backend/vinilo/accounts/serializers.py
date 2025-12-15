# backend/accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    """Para enviar datos del usuario al frontend sin mostrar cosas sensibles"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    """Maneja el registro con validaciones estrictas y sanitización"""
    
    # Campos obligatorios explícitos
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    # Password write_only para que no se devuelva en la respuesta por seguridad
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password] # Aplica las reglas de seguridad de settings.py (largo, caracteres, etc)
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        """
        Normaliza el email a minúsculas para evitar duplicados por casing 
        (ej: 'User@mail.com' vs 'user@mail.com')
        """
        normalized_email = value.lower().strip()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return normalized_email

    def create(self, validated_data):
        # Crear usuario estándar de Django
        # validated_data['email'] ya viene normalizado desde validate_email
        user = User.objects.create(
            username=validated_data['email'], # Usamos el email limpio como username
            email=validated_data['email'],
            first_name=validated_data['first_name'].strip(), # Quitamos espacios extra
            last_name=validated_data['last_name'].strip()
        )
        
        # Hashing automático seguro (PBKDF2 por defecto en Django)
        user.set_password(validated_data['password']) 
        user.save()
        
        return user