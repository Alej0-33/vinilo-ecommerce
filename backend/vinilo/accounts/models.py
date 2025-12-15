from django.db import models
from django.contrib.auth.models import User
import random

class VerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification_code')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code(self):
        self.code = str(random.randint(100000, 999999))
        self.save()
        return self.code
        
    def __str__(self):
        return f"Code for {self.user.email}"