from django.urls import path
from . import views

app_name = 'business'

urlpatterns = [
    # Main Dashboard
    path('', views.dashboard_view, name='dashboard'),
    path('dashboard/', views.dashboard_view, name='dashboard_alt'),
    
    # Business Profile & Switcher
    path('my-business/', views.my_business_view, name='my_business'),
    path('business/<int:business_id>/edit/', views.edit_business_view, name='edit_business'),
    path('business/<int:business_id>/delete/', views.delete_business_view, name='delete_business'),
    path('business/<int:business_id>/switch/', views.switch_business_view, name='switch_business'),

    # Product Management
    path('products/', views.products_view, name='products'),
    path('products/<int:product_id>/edit/', views.edit_product_view, name='edit_product'),
    path('products/<int:product_id>/delete/', views.delete_product_view, name='delete_product'),
    path('api/products/<int:product_id>/', views.product_api_detail, name='product_api_detail'),

    # Sales Management
    path('sales/', views.sales_view, name='sales'),
    path('sales/<int:sale_id>/delete/', views.delete_sale_view, name='delete_sale'),

    # Expense Management
    path('expenses/', views.expenses_view, name='expenses'),
    path('expenses/<int:expense_id>/delete/', views.delete_expense_view, name='delete_expense'),

    # Profit & Loss Reports
    path('profit-loss/', views.profit_loss_view, name='profit_loss'),
    path('reports/', views.reports_view, name='reports'),
    path('reports/download/pdf/', views.download_report_pdf, name='download_report_pdf'),
    path('reports/download/excel/', views.download_report_excel, name='download_report_excel'),
    path('reports/download/csv/', views.download_report_csv, name='download_report_csv'),

    # Transactions Ledger
    path('transactions/', views.transactions_view, name='transactions'),
]
