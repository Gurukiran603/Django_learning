from django.db import models


# Create your models here.

class Patient(models.Model):
    name = models.CharField(max_length=100)
    disease = models.CharField(max_length=100)
    doctor_assigned = models.CharField(max_length=100)
    age = models.IntegerField()
    room_number = models.IntegerField()

    def __str__(self):
        return self.name