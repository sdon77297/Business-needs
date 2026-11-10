from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import CustomUser
from .forms import (
    BusinessmanRegistrationForm,
    BusinessmanLoginForm,
    UserProfileForm,
    ChangePasswordForm
)

def register_view(request):
    if request.user.is_authenticated:
        return redirect('business:dashboard')

    if request.method == 'POST':
        form = BusinessmanRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.username = form.cleaned_data['user_id']
            user.save()

            # Automatically authenticate and log in new user
            login(request, user, backend='accounts.backends.EmailOrUserIdModelBackend')
            messages.success(request, f"Welcome to Business Profit & Loss System, {user.full_name or user.user_id}! Your account is ready.")
            return redirect('business:my_business')
        else:
            messages.error(request, "Please correct the errors in the registration form.")
    else:
        form = BusinessmanRegistrationForm()

    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('business:dashboard')

    if request.method == 'POST':
        form = BusinessmanLoginForm(request.POST)
        if form.is_valid():
            credential = form.cleaned_data['login_credential'].strip()
            password = form.cleaned_data['password']
            remember_me = form.cleaned_data['remember_me']

            user = authenticate(request, username=credential, password=password)

            if user is not None:
                login(request, user)
                if not remember_me:
                    request.session.set_expiry(0)  # Browser close session
                else:
                    request.session.set_expiry(86400 * 30)  # 30 days
                
                messages.success(request, f"Welcome back, {user.full_name or user.user_id}!")
                next_url = request.GET.get('next', 'business:dashboard')
                return redirect(next_url)
            else:
                messages.error(request, "Invalid User ID/Email or Password. Please check your credentials.")
    else:
        form = BusinessmanLoginForm()

    return render(request, 'accounts/login.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    messages.info(request, "You have been securely signed out of your account.")
    return redirect('accounts:login')

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile details have been updated successfully.")
            return redirect('accounts:profile')
    else:
        form = UserProfileForm(instance=request.user)

    return render(request, 'accounts/profile.html', {'form': form})

@login_required
def settings_view(request):
    password_form = ChangePasswordForm()

    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'change_password':
            password_form = ChangePasswordForm(request.POST)
            if password_form.is_valid():
                old_pwd = password_form.cleaned_data['old_password']
                new_pwd = password_form.cleaned_data['new_password']

                if request.user.check_password(old_pwd):
                    request.user.set_password(new_pwd)
                    request.user.save()
                    # Re-authenticate so user is not logged out after password change
                    login(request, request.user, backend='accounts.backends.EmailOrUserIdModelBackend')
                    messages.success(request, "Your password has been changed successfully.")
                    return redirect('accounts:settings')
                else:
                    messages.error(request, "Current password incorrect.")

        elif action == 'update_currency':
            new_curr = request.POST.get('currency', '₹')
            request.user.currency = new_curr
            request.user.save()
            messages.success(request, f"Default currency updated to {new_curr}.")
            return redirect('accounts:settings')

    return render(request, 'accounts/settings.html', {'password_form': password_form})

def forgot_password_view(request):
    if request.method == 'POST':
        credential = request.POST.get('credential', '').strip()
        user = CustomUser.objects.filter(email__iexact=credential).first() or \
               CustomUser.objects.filter(user_id__iexact=credential).first()
        
        if user:
            # Demonstration recovery for businessman: direct password reset simulation
            request.session['reset_user_id'] = user.id
            messages.info(request, f"Identity verified for {user.full_name or user.user_id}. Please enter your new password.")
            return redirect('accounts:reset_password')
        else:
            messages.error(request, "No account found matching that User ID or Email address.")
    
    return render(request, 'accounts/forgot_password.html')

def reset_password_view(request):
    user_id = request.session.get('reset_user_id')
    if not user_id:
        messages.error(request, "Password reset session has expired. Please initiate again.")
        return redirect('accounts:forgot_password')

    user = CustomUser.objects.filter(id=user_id).first()
    if not user:
        return redirect('accounts:forgot_password')

    if request.method == 'POST':
        p1 = request.POST.get('new_password')
        p2 = request.POST.get('confirm_password')

        if not p1 or len(p1) < 6:
            messages.error(request, "Password must be at least 6 characters long.")
        elif p1 != p2:
            messages.error(request, "Passwords do not match.")
        else:
            user.set_password(p1)
            user.save()
            del request.session['reset_user_id']
            messages.success(request, "Password reset successful! You can now log in with your new password.")
            return redirect('accounts:login')

    return render(request, 'accounts/reset_password.html', {'target_user': user})
