from django.shortcuts import render, get_object_or_404,redirect
from .models import Doctor
from django.contrib.auth.decorators import login_required
from .forms import DoctorForm

def doctor_list(request):
    doctors = Doctor.objects.filter(is_active=True)
    return render(request, 'doctor_list.html', {'doctors': doctors})

def doctor_detail(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id, is_active=True)
    return render(request, 'doctor_detail.html', {'doctor': doctor})

@login_required
def add_doctor(request):
    if request.user.profile.role != 'admin':
        return redirect('dashboard')

    form = DoctorForm(request.POST or None, request.FILES or None) 

    if form.is_valid():
        form.save()
        return redirect('doctor_list')

    return render(request, 'add_doctor.html', {'form': form})

@login_required
def edit_doctor(request, pk):
    product = get_object_or_404(Doctor, pk=pk)
    if request.method == 'POST':
        form = DoctorForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('doctor_list')
    else:
        form = DoctorForm(instance=product)
    return render(request, 'edit_doctor.html', {'form': form})

@login_required
def delete_doctor(request, pk):
    product = get_object_or_404(Doctor, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect('doctor_list')
    return render(request, 'delete_doctor.html', {'product': product})

@login_required
def inactive_doctors(request):
    if request.user.profile.role != 'admin':
        return redirect('dashboard')
    
    doctors = Doctor.objects.filter(is_active=False)
    return render(request, 'inactive_list.html', {'doctors': doctors})

@login_required
def activate_doctor(request, pk):
    if request.user.profile.role != 'admin':
        return redirect('dashboard')

    doctor = get_object_or_404(Doctor, pk=pk)
    doctor.is_active = True
    doctor.save()
    return redirect('inactive_doctors')