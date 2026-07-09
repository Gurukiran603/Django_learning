from django.db import models

SKIN_TYPE_CHOICES = [
    ('oily', 'Oily'),
    ('dry', 'Dry'),
    ('combination', 'Combination'),
    ('sensitive', 'Sensitive'),
    ('all', 'All Skin Types'),
]

CATEGORY_CHOICES = [
    ('mask', 'Face Mask'),
    ('scrub', 'Scrub'),
    ('toner', 'Toner'),
    ('cleanser', 'Cleanser'),
    ('moisturizer', 'Moisturizer'),
]

class HomeMadeRemedy(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    skin_type = models.CharField(max_length=20, choices=SKIN_TYPE_CHOICES)
    ingredients = models.TextField()
    instructions = models.TextField()
    image = models.ImageField(upload_to='homemade/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
