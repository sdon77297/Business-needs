from django import forms
from django.utils import timezone
from .models import Business, Product, Sale, Expense, Category

class BusinessForm(forms.ModelForm):
    class Meta:
        model = Business
        fields = [
            'name',
            'business_type',
            'address',
            'description',
            'starting_date',
            'initial_investment',
            'contact_number'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Apex Electronics & Trading'}),
            'business_type': forms.Select(attrs={'class': 'form-select'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Full business location / city'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Optional business description'}),
            'starting_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'initial_investment': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'contact_number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+91 9876543210'}),
        }

class ProductForm(forms.ModelForm):
    category_name = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Smartphones, Grocery, Hardware'})
    )

    class Meta:
        model = Product
        fields = [
            'product_id',
            'name',
            'category_name',
            'purchase_price',
            'selling_price',
            'quantity_purchased',
            'available_quantity',
            'purchase_date'
        ]
        widgets = {
            'product_id': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'SKU-001 / Barcode'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Product Name'}),
            'purchase_price': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'selling_price': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'quantity_purchased': forms.NumberInput(attrs={'class': 'form-control', 'min': '0'}),
            'available_quantity': forms.NumberInput(attrs={'class': 'form-control', 'min': '0'}),
            'purchase_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
        }

    def clean(self):
        cleaned = super().clean()
        purchased = cleaned.get('quantity_purchased') or 0
        available = cleaned.get('available_quantity')
        # If available quantity is not manually provided on creation, default it to quantity_purchased
        if available is None:
            cleaned['available_quantity'] = purchased
        return cleaned

class SaleForm(forms.ModelForm):
    product = forms.ModelChoiceField(
        queryset=Product.objects.none(),
        required=True,
        empty_label="-- Select Product --",
        widget=forms.Select(attrs={'class': 'form-select', 'id': 'id_product_select'})
    )

    class Meta:
        model = Sale
        fields = [
            'product',
            'quantity_sold',
            'selling_price',
            'discount',
            'customer_name',
            'sales_date',
            'payment_method',
            'notes'
        ]
        widgets = {
            'quantity_sold': forms.NumberInput(attrs={'class': 'form-control', 'min': '1', 'value': '1'}),
            'selling_price': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'discount': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'value': '0.00'}),
            'customer_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Walk-in Customer / Client Name'}),
            'sales_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'payment_method': forms.Select(attrs={'class': 'form-select'}),
            'notes': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Optional notes or receipt remark'}),
        }

    def __init__(self, *args, **kwargs):
        business = kwargs.pop('business', None)
        super().__init__(*args, **kwargs)
        if business:
            self.fields['product'].queryset = Product.objects.filter(business=business, available_quantity__gt=0)

    def clean(self):
        cleaned = super().clean()
        product = cleaned.get('product')
        qty = cleaned.get('quantity_sold') or 0

        if product and qty > product.available_quantity:
            self.add_error('quantity_sold', f"Insufficient stock! Only {product.available_quantity} units available for {product.name}.")
        return cleaned

class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = [
            'name',
            'category',
            'amount',
            'expense_date',
            'payment_method',
            'description'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Office Rent, Electricity Bill, Salary'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'amount': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'expense_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'payment_method': forms.Select(attrs={'class': 'form-select'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Optional receipt or voucher notes'}),
        }
