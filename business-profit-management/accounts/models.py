from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """
    Custom user model for businessmen.
    Guarantees a distinct User ID, email, mobile number, and personal settings.
    """
    user_id = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text='Unique User ID chosen during registration'
    )
    full_name = models.CharField(max_length=150, blank=True)
    mobile_number = models.CharField(max_length=20, blank=True)
    currency = models.CharField(max_length=10, default='₹', help_text='Preferred currency symbol')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Sync username with user_id for seamless compatibility with Django auth
        if not self.username:
            self.username = self.user_id
        if not self.user_id:
            self.user_id = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name or self.username} ({self.user_id})"

    class Meta:
        verbose_name = 'Businessman Account'
        verbose_name_plural = 'Businessman Accounts'
