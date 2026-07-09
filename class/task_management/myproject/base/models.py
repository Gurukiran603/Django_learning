from django.db import models #Importing Django’s database tools

# Create your models here.
class Task(models.Model):  #👉 Creating a table called Task
#👉 models.Model = tells Django → “this is a database table”
    title = models.CharField(max_length=200) #column in db 
    description = models.CharField(max_length=500)
    priority = models.CharField(max_length=50)
    estimated_hours = models.IntegerField()
    progress = models.IntegerField()

    def __str__(self):
        return self.title

        #This controls how object looks in admin/console
#👉 Instead of showing:Task object (1)👉 It shows:
#"Complete Project