from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('user_id', 'email', 'full_name', 'mobile_number', 'currency', 'is_staff', 'is_active', 'created_at')
    search_fields = ('user_id', 'email', 'full_name', 'mobile_number')
    ordering = ('-created_at',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Businessman Details', {'fields': ('user_id', 'full_name', 'mobile_number', 'currency')}),
    )
