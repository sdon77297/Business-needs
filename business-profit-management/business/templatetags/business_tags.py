from django import template
from decimal import Decimal

register = template.Library()

@register.filter(name='abs')
def abs_filter(value):
    try:
        return abs(Decimal(value))
    except (ValueError, TypeError):
        return value

@register.filter(name='abs_val')
def abs_val_filter(value):
    try:
        return abs(Decimal(value))
    except (ValueError, TypeError):
        return value
