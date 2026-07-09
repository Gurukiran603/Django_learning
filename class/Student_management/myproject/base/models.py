from django.db import models
class Student(models.Model):
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=50)
    class_name = models.CharField(max_length=50)
    age = models.IntegerField()
    total_marks = models.IntegerField()
    
def __str__(self):
    return self.name