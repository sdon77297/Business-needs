from .models import Business

def active_business_processor(request):
    """
    Context processor making active_business, user_businesses,
    and user_currency available across all templates.
    """
    if not request.user.is_authenticated:
        return {
            'active_business': None,
            'user_businesses': [],
            'user_currency': '₹',
        }

    businesses = list(Business.objects.filter(user=request.user).order_by('name'))
    active_business = None

    # Check session override
    session_biz_id = request.session.get('active_business_id')
    if session_biz_id:
        active_business = next((b for b in businesses if b.id == session_biz_id), None)

    # Fallback to is_active=True or first business
    if not active_business and businesses:
        active_business = next((b for b in businesses if b.is_active), businesses[0])
        request.session['active_business_id'] = active_business.id

    currency = getattr(request.user, 'currency', '₹')

    return {
        'active_business': active_business,
        'user_businesses': businesses,
        'user_currency': currency,
    }
