from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from .models import CustomUser

class EmailOrUserIdModelBackend(ModelBackend):
    """
    Allows authentication with either unique user_id (username) or email address.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('user_id') or kwargs.get('email')
        
        if not username or not password:
            return None

        try:
            # Match either user_id, username, or email (case-insensitive)
            user = CustomUser.objects.filter(
                Q(user_id__iexact=username) | Q(username__iexact=username) | Q(email__iexact=username)
            ).first()
            
            if user and user.check_password(password) and self.user_can_authenticate(user):
                return user
        except Exception:
            return None
        return None
