from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class VerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification_code')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code(self):
        import random
        self.code = str(random.randint(100000, 999999))
        self.save()
        return self.code

class PendingUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def __str__(self):
        return f"Registro pendiente: {self.email}"