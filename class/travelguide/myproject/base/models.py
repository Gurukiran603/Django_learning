from django.db import models

# Create your models here.
class Destination(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    average_cost = models.IntegerField()
    rating = models.IntegerField() # 1-5 scale
    
    def __str__(self):
        return self.name