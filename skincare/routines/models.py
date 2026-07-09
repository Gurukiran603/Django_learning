from django.db import models
from django.contrib.auth.models import User
from products.models import Product

ROUTINE_TYPE_CHOICES = [
    ('AM', 'Morning'),
    ('PM', 'Evening'),
]

class Routine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    routine_type = models.CharField(max_length=2, choices=ROUTINE_TYPE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.routine_type} Routine"

class RoutineStep(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE, related_name='steps')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    step_number = models.PositiveIntegerField()

    class Meta:
        ordering = ['step_number']

    def __str__(self):
        return f"{self.routine} - Step {self.step_number}"
