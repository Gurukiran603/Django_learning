from django.db import models

# Create your models here.

class Article(models.Model):
    title=models.CharField(max_length=100)
    desc=models.TextField(max_length=500)
    author=models.CharField(max_length=10)
    cost=models.IntegerField()
