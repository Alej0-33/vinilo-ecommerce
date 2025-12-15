from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    """Para enviar datos del usuario al frontend sin mostrar cosas sensibles"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    """Maneja el registro con validaciones estrictas"""
    # Agregamos campos que no están por defecto obligatorios en User pero tú los pides
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    # Escribir contraseña dos veces (opcional, pero buena práctica UI)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

    def create(self, validated_data):
        # Crear usuario estándar de Django
        user = User.objects.create(
            username=validated_data['email'], # Usamos email como username para simplificar login
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password']) # Hashing automático seguro (PBKDF2)
        user.save()
        return user