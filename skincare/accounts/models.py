from django.db import models

# Create your models here.
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
       # ('admin', 'Admin'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    skin_type = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
