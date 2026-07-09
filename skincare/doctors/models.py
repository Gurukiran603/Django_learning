from django.db import models

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    contact_email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    availability = models.CharField(max_length=200, help_text="e.g. Mon-Fri, 10 AM - 6 PM")
    experience = models.PositiveIntegerField(help_text="Years of experience")
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='doctor_images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
