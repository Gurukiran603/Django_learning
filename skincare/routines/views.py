from django.shortcuts import render, redirect,get_object_or_404
from .models import Routine, RoutineStep
from products.models import Product
from django.contrib.auth.decorators import login_required
from routines.models import Routine, RoutineStep

@login_required
def select_routine_type(request):
    if request.method == 'POST':
        routine_type = request.POST.get('routine_type')
        return redirect('build_routine', routine_type=routine_type)
    return render(request, 'select_type.html')

@login_required
def build_routine(request, routine_type):
    products = Product.objects.all()

    if request.method == 'POST':
        Routine.objects.filter(user=request.user, routine_type=routine_type.upper()).delete()
        
        routine = Routine.objects.create(user=request.user, routine_type=routine_type.upper())
        selected = request.POST.getlist('products')

        for idx, pid in enumerate(selected):
            RoutineStep.objects.create(
                routine=routine,
                product_id=pid,
                step_number=idx + 1
            )
        return redirect('view_routine', routine_type=routine_type)

    return render(request, 'build_routine.html', {
        'products': products,
        'routine_type': routine_type.upper()
    })


@login_required
def view_routine(request,routine_type):
    routines = Routine.objects.filter(user=request.user)
    return render(request, 'view_routine.html', {'routines': routines})



@login_required
def routine_view(request, routine_type):
    routine = Routine.objects.filter(user=request.user, routine_type=routine_type.upper()).first()
    
    if routine:
        steps = routine.steps.all() 
    else:
        steps = []

    return render(request, 'routine_view.html', {
        'routine_type': routine_type.upper(),
        'steps': steps
    })

@login_required
def edit_routine(request, routine_type):
    routine = get_object_or_404(Routine, user=request.user, routine_type=routine_type)
    steps = routine.steps.all()  

    if request.method == 'POST':
        for step in steps:
            new_step_number = request.POST.get(f'step_{step.id}')
            if new_step_number:
                step.step_number = int(new_step_number)
                step.save()
        return redirect('view_routine', routine_type=routine_type)

    return render(request, 'edit_routine.html', {
        'routine': routine,
        'steps': steps,
    })

