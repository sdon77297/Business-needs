from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
import uuid

class Business(models.Model):
    BUSINESS_TYPES = [
        ('Retail Store', 'Retail Store'),
        ('Wholesale & Distribution', 'Wholesale & Distribution'),
        ('Manufacturing', 'Manufacturing'),
        ('Services / Agency', 'Services / Agency'),
        ('E-commerce / Online Store', 'E-commerce / Online Store'),
        ('Restaurant / Cafe', 'Restaurant / Cafe'),
        ('Automobile / Garage', 'Automobile / Garage'),
        ('Healthcare / Pharmacy', 'Healthcare / Pharmacy'),
        ('Other', 'Other Business'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='businesses',
        db_index=True
    )
    name = models.CharField(max_length=200, help_text='Registered Business Name')
    business_type = models.CharField(max_length=60, choices=BUSINESS_TYPES, default='Retail Store')
    address = models.TextField(help_text='Physical business location / headquarters')
    description = models.TextField(blank=True, help_text='Short description of products or business focus')
    starting_date = models.DateField(default=timezone.now, help_text='Date when business was founded or started')
    initial_investment = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Capital injected into business'
    )
    contact_number = models.CharField(max_length=25)
    is_active = models.BooleanField(default=True, help_text='Current active business in session')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Business'
        verbose_name_plural = 'Businesses'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class Category(models.Model):
    CATEGORY_TYPES = [
        ('PRODUCT', 'Product Category'),
        ('EXPENSE', 'Expense Category'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='PRODUCT')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('business', 'name', 'category_type')
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.name} ({self.get_category_type_display()})"

class Product(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='products')
    product_id = models.CharField(max_length=50, help_text='Unique SKU or Product Code')
    name = models.CharField(max_length=200, help_text='Product Name')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    category_name = models.CharField(max_length=100, blank=True, default='General')
    
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, help_text='Cost price per unit')
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, help_text='Selling price per unit')
    quantity_purchased = models.IntegerField(default=0, help_text='Total stock acquired')
    available_quantity = models.IntegerField(default=0, help_text='Current available units in stock')
    purchase_date = models.DateField(default=timezone.now)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('business', 'product_id')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} [SKU: {self.product_id}]"

    @property
    def total_stock_value(self):
        return Decimal(self.available_quantity) * self.purchase_price

    @property
    def potential_revenue(self):
        return Decimal(self.available_quantity) * self.selling_price

class Sale(models.Model):
    PAYMENT_METHODS = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI / Online QR'),
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('Bank Transfer', 'Bank Transfer (NEFT/RTGS)'),
        ('Cheque', 'Cheque'),
        ('Credit/Due', 'Credit / Due (Customer Account)'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='sales')
    invoice_no = models.CharField(max_length=60, unique=True, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    product_name = models.CharField(max_length=200)
    
    quantity_sold = models.IntegerField(default=1)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, help_text='Cost per unit at time of sale')
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, help_text='Selling price per unit')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    total_amount = models.DecimalField(max_digits=14, decimal_places=2, help_text='Total revenue collected')
    cost_of_goods_sold = models.DecimalField(max_digits=14, decimal_places=2, help_text='Total purchase cost')
    profit = models.DecimalField(max_digits=14, decimal_places=2, help_text='Gross profit from this sale')

    customer_name = models.CharField(max_length=150, blank=True, default='Walk-in Customer')
    sales_date = models.DateField(default=timezone.now, db_index=True)
    payment_method = models.CharField(max_length=40, choices=PAYMENT_METHODS, default='Cash')
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-sales_date', '-created_at']

    def __str__(self):
        return f"Invoice #{self.invoice_no} - {self.product_name} ({self.total_amount})"

    def calculate_financials(self):
        qty = Decimal(self.quantity_sold)
        revenue = (qty * Decimal(self.selling_price)) - Decimal(self.discount or 0)
        cogs = qty * Decimal(self.purchase_price)
        profit = revenue - cogs
        
        self.total_amount = max(Decimal('0.00'), revenue)
        self.cost_of_goods_sold = cogs
        self.profit = profit

class Expense(models.Model):
    EXPENSE_CATEGORIES = [
        ('Rent', 'Rent & Premises'),
        ('Electricity', 'Electricity & Power'),
        ('Employee Salary', 'Employee Salary & Wages'),
        ('Transportation', 'Transportation & Logistics'),
        ('Maintenance', 'Maintenance & Repairs'),
        ('Marketing', 'Marketing & Advertising'),
        ('Internet & Utilities', 'Internet & Office Utilities'),
        ('Taxes & Licenses', 'Taxes, Duties & Legal Fees'),
        ('Other Expenses', 'Other Miscellaneous Expenses'),
    ]

    PAYMENT_METHODS = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI / Online Transfer'),
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Cheque', 'Cheque'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=200, help_text='Expense Name / Payee')
    category = models.CharField(max_length=50, choices=EXPENSE_CATEGORIES, default='Other Expenses', db_index=True)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    expense_date = models.DateField(default=timezone.now, db_index=True)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHODS, default='Cash')
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.amount} ({self.category})"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('SALE', 'Sale (Inflow)'),
        ('EXPENSE', 'Expense (Outflow)'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=15, choices=TRANSACTION_TYPES, db_index=True)
    reference_id = models.CharField(max_length=100, help_text='Invoice or Voucher ID')
    title = models.CharField(max_length=250)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    profit_or_loss = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    date = models.DateField(default=timezone.now, db_index=True)
    payment_method = models.CharField(max_length=50)

    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, null=True, blank=True, related_name='transactions')
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, null=True, blank=True, related_name='transactions')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"[{self.transaction_type}] {self.title} - {self.amount}"
