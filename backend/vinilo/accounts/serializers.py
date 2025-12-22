# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import PendingUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.Serializer):
    """
    Serializador independiente (no ModelSerializer) porque solo validamos datos,
    no creamos un User directamente aquí.
    """
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    def validate_email(self, value):
        normalized_email = value.lower().strip()
        
        # Verificar si ya existe como usuario confirmado
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        
        return normalized_email