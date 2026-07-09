from django.shortcuts import render,redirect,get_object_or_404
from .models import Patient
from .forms import PatientForm
from django.contrib import messages
from django.db.models import Q

# Create your views here.

def home(request):
    form = PatientForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Patient data added successfully!')
        return redirect('read_patients')
    return render(request, 'home.html', {'form': form})

    
#----------------------READ-----------------------------------
# extract data and display the data
def read_patients(request):
    query = request.GET.get('q')
    if query:
        data = Patient.objects.filter(Q(name__icontains=query)|
                                      Q(disease__icontains=query)|
                                      Q(age__icontains=query)|
                                      Q(room_number__icontains=query)|
                                      Q(doctor_assigned__icontains=query)) # search query
    else:
        data = Patient.objects.all() # extract all data
    print("SEARCH QUERY:", query)
    return render(request,'read_patients.html',{'data':data, 'query': query or ''})

#-----------------------UPDATE--------------------------------------
#extarct the data and update the data
def update_patient(request,pk):
    data = get_object_or_404(Patient,id=pk)
    form = PatientForm(request.POST or None, instance=data)
    if form.is_valid():
        form.save()
        messages.success(request, 'Patient data updated successfully!')
        return redirect('read_patients')
    return render(request,'update_patient.html',{'form':form})

#--------------------------DELETE-----------------------------------------
#extract data and delall data
def delete_patient(request,pk):
    data = get_object_or_404(Patient,id=pk)
    if request.method=='POST':
        data.delete()
        messages.success(request, 'Patient data deleted successfully!')
        return redirect('read_patients')
    return render(request,'delete_patient.html',{'data':data})