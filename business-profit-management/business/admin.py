from django.contrib import admin
from .models import Business, Product, Sale, Expense, Transaction, Category

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'business_type', 'initial_investment', 'contact_number', 'is_active', 'created_at')
    list_filter = ('business_type', 'is_active')
    search_fields = ('name', 'user__username', 'contact_number')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_id', 'business', 'category_name', 'purchase_price', 'selling_price', 'available_quantity')
    list_filter = ('business',)
    search_fields = ('name', 'product_id', 'business__name')

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('invoice_no', 'business', 'product_name', 'quantity_sold', 'total_amount', 'profit', 'sales_date', 'payment_method')
    list_filter = ('sales_date', 'payment_method')
    search_fields = ('invoice_no', 'product_name', 'customer_name')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('name', 'business', 'category', 'amount', 'expense_date', 'payment_method')
    list_filter = ('category', 'expense_date', 'payment_method')
    search_fields = ('name', 'description')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('reference_id', 'business', 'transaction_type', 'title', 'amount', 'profit_or_loss', 'date')
    list_filter = ('transaction_type', 'date')
    search_fields = ('reference_id', 'title')
