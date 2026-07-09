from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout,update_session_auth_hash
from django.contrib import messages


# Create your views here.

def signup(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Username already exists')
            return redirect('signin')
        else:
            User.objects.create_user(
            first_name = request.POST['first_name'],
            last_name = request.POST['last_name'],
            username = request.POST['username'],
            email = request.POST['email'],
            password = request.POST['password']
            )
            messages.success(request, 'User created successfully')
            return redirect('signin')
    return render(request, 'signup.html')
#-------------------------------------------------------
def signin(request):
    if request.method == 'POST':
        user=authenticate(request, username=request.POST['username'], password=request.POST['password']) # credntials verfication
        if user is not None: # if user having valid credentials
            login(request, user)# login complete
            messages.success(request, 'Logged in successfully')
            return redirect('profile')
        else:
            messages.error(request, 'Invalid username or password')
            return redirect('signin')
    return render(request, 'signin.html')
#-----------------------LOGOUT--------------------------------
def signout(request):
    if request.method == 'POST':
        logout(request) # to end the user session
        messages.success(request, 'Logged out successfully')
        return redirect('signin')
    return render(request, 'signout.html')
#-------------------------------------------------------
def profile(request):
    #extract the active user details
    data = request.user
    return render(request, 'profile.html', {'data': data})
#-------------------------------------------------------
def update_profile(request):
    #extract the active user details and update his profile details
    data = request.user # extract the active user details

    if request.method == 'POST':
        data.first_name = request.POST['first_name'] # updating user details with new details
        data.last_name = request.POST['last_name']
        data.email = request.POST['email']
        data.username = request.POST['username']
        data.save()   # to update user details in database
        messages.success(request, 'Profile updated successfully')
        return redirect('profile')
    return render(request, 'update_profile.html', {'data': data})
#-------------------------------------------------------
def update_password(request):
    # extract the active user details and update his password
    data = request.user # extract the active user details
    if request.method == 'POST':
        old_password = request.POST['old_password']  
        new_password = request.POST['new_password']   
        confirm_password = request.POST['confirm_password']

        # check _password ---> to check the user old password is correct or not
        if not data.check_password(old_password):
            messages.error(request, 'Old password is incorrect !...........')
        elif new_password == old_password:
            messages.error(request, 'New password cannot be same as old password !...........')
        elif new_password != confirm_password:
            messages.error(request, 'New password and confirm password do not match !...........')
        else:
            data.set_password(new_password) # to encrypt the new passw0ord and set it to useer 
            data.save() # to update the new password in database
            update_session_auth_hash(request, data) # to maintain the user session after password change
            messages.success(request, 'Password updated successfully')
            return redirect('profile')
    return render(request, 'update_password.html')


