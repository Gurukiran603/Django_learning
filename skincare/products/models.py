from django.db import models

SKIN_TYPE_CHOICES = [
    ('oily', 'Oily'),
    ('dry', 'Dry'),
    ('combination', 'Combination'),
    ('sensitive', 'Sensitive'),
    ('normal', 'Normal'),
]

CATEGORY_CHOICES = [
    ('cleanser', 'Cleanser'),
    ('moisturizer', 'Moisturizer'),
    ('serum', 'Serum'),
    ('sunscreen', 'Sunscreen'),
    ('toner', 'Toner'),
   
]

class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    skin_type = models.CharField(max_length=20, choices=SKIN_TYPE_CHOICES)
    description = models.TextField()
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
