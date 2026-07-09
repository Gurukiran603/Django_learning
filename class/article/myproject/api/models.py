from django.db import models

# Create your models here.
class Employee(models.Model):
    employee_id = models.CharField(max_length=10,unique=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=50)
    designation = models.CharField(max_length=50)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self): #to increase the readability of the object when we print it
        return self.name