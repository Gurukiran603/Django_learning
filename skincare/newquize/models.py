from django.db import models

# Create your models here.


class Question(models.Model):
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    skin_type_weights = models.JSONField()  

    def __str__(self):
        return f"{self.text} ({self.question.text})"
