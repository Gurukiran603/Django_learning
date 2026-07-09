from django.shortcuts import render,redirect,get_object_or_404
from .forms import StudentForm
from .models import Student
from django.contrib import messages
from django.db.models import Q

# Create your views here.

def home(request):
    form = StudentForm(request.POST or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Student added successfully!')
        return redirect('student_data')
    return render(request, 'home.html',{'form':form})

def student_data(request):
    students = Student.objects.all()
    search_query = request.GET.get('search')
    if search_query:
        students = students.filter(
            Q(name__icontains=search_query) |
            Q(roll_number__icontains=search_query) |
            Q(class_name__icontains=search_query) |
            Q(age__icontains=search_query) |
            Q(total_marks__icontains=search_query)
        )
    else:
        students = Student.objects.all()
    return render(request, 'student_data.html', {'students': students, 'search_query': search_query or ''})


def update_student(request, pk): # take one extra args for targeting id column
    Students = get_object_or_404(Student, id=pk) # Extracting the data
    form = StudentForm(request.POST or None, instance=Students) # Using instance forupdating the data
    if form.is_valid(): # It checks the the variable is holding the updated value or not
        form.save() # save the data in database
        messages.success(request, 'Student updated successfully!')
        return redirect('student_data') # automatically go for read page
    return render(request,'update_student.html', {'form':form}) 

def delete_student(request,pk):
    data = get_object_or_404(Student, id=pk)
    if request.method == 'POST':
        data.delete()
        messages.success(request, 'Student deleted successfully!')
        return redirect('student_data')
    return render(request,'delete_student.html')