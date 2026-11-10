import json
from decimal import Decimal
from datetime import datetime, timedelta
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.db.models import Q

from .models import Business, Product, Sale, Expense, Transaction, Category
from .forms import BusinessForm, ProductForm, SaleForm, ExpenseForm
from .services import (
    get_financial_summary,
    get_chart_data,
    record_sale_and_update_stock,
    record_expense_transaction,
    generate_pdf_report,
    generate_excel_report,
    generate_csv_report
)

def get_current_business(request):
    """Helper to retrieve the active business for the logged-in user."""
    biz_id = request.session.get('active_business_id')
    if biz_id:
        biz = Business.objects.filter(user=request.user, id=biz_id).first()
        if biz:
            return biz
    
    # Fallback
    biz = Business.objects.filter(user=request.user).first()
    if biz:
        request.session['active_business_id'] = biz.id
    return biz

@login_required
def dashboard_view(request):
    business = get_current_business(request)
    if not business:
        messages.info(request, "Welcome! Please add your business details to start managing profits & losses.")
        return redirect('business:my_business')

    # Financial calculations
    summary = get_financial_summary(business)
    charts = get_chart_data(business)

    # Recent activity
    recent_transactions = Transaction.objects.filter(business=business).order_by('-date', '-created_at')[:8]
    recent_sales = Sale.objects.filter(business=business).order_by('-sales_date', '-created_at')[:5]

    context = {
        'business': business,
        'summary': summary,
        'charts_json': json.dumps(charts),
        'recent_transactions': recent_transactions,
        'recent_sales': recent_sales,
    }
    return render(request, 'business/dashboard.html', context)

@login_required
def switch_business_view(request, business_id):
    business = get_object_or_404(Business, id=business_id, user=request.user)
    
    # Mark in session and database
    request.session['active_business_id'] = business.id
    Business.objects.filter(user=request.user).update(is_active=False)
    business.is_active = True
    business.save(update_fields=['is_active'])

    messages.success(request, f"Active business switched to {business.name}.")
    return redirect(request.META.get('HTTP_REFERER', 'business:dashboard'))

@login_required
def my_business_view(request):
    businesses = Business.objects.filter(user=request.user)
    
    if request.method == 'POST':
        form = BusinessForm(request.POST)
        if form.is_valid():
            new_biz = form.save(commit=False)
            new_biz.user = request.user
            # If first business, make it active
            if not businesses.exists():
                new_biz.is_active = True
            new_biz.save()

            request.session['active_business_id'] = new_biz.id
            messages.success(request, f"Business '{new_biz.name}' created and set as active!")
            return redirect('business:dashboard')
        else:
            messages.error(request, "Please check the business form for errors.")
    else:
        form = BusinessForm()

    return render(request, 'business/my_business.html', {
        'businesses': businesses,
        'form': form,
    })

@login_required
def edit_business_view(request, business_id):
    business = get_object_or_404(Business, id=business_id, user=request.user)
    
    if request.method == 'POST':
        form = BusinessForm(request.POST, instance=business)
        if form.is_valid():
            form.save()
            messages.success(request, f"Business details for '{business.name}' updated successfully.")
            return redirect('business:my_business')
    else:
        form = BusinessForm(instance=business)

    return render(request, 'business/edit_business.html', {'form': form, 'business': business})

@login_required
def delete_business_view(request, business_id):
    business = get_object_or_404(Business, id=business_id, user=request.user)
    
    if request.method == 'POST':
        name = business.name
        business.delete()
        if request.session.get('active_business_id') == business_id:
            request.session.pop('active_business_id', None)
        messages.success(request, f"Business '{name}' and all associated records have been removed.")
        return redirect('business:my_business')

    return render(request, 'business/confirm_delete.html', {
        'title': f"Delete Business: {business.name}",
        'message': "Are you sure you want to delete this business? All associated products, sales, expenses, and transactions will be permanently deleted.",
        'cancel_url': 'business:my_business'
    })

@login_required
def products_view(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    search_query = request.GET.get('search', '').strip()
    category_filter = request.GET.get('category', '').strip()

    products = Product.objects.filter(business=business)
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | Q(product_id__icontains=search_query) | Q(category_name__icontains=search_query)
        )
    if category_filter:
        products = products.filter(category_name__iexact=category_filter)

    categories = Product.objects.filter(business=business).values_list('category_name', flat=True).distinct()

    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            prod = form.save(commit=False)
            prod.business = business
            # If available_quantity not set, default to quantity_purchased
            if prod.available_quantity is None:
                prod.available_quantity = prod.quantity_purchased
            prod.save()
            messages.success(request, f"Product '{prod.name}' registered successfully.")
            return redirect('business:products')
        else:
            messages.error(request, "Failed to add product. Please check input fields.")
    else:
        form = ProductForm()

    return render(request, 'business/products.html', {
        'business': business,
        'products': products,
        'form': form,
        'search_query': search_query,
        'category_filter': category_filter,
        'categories': [c for c in categories if c],
    })

@login_required
def edit_product_view(request, product_id):
    business = get_current_business(request)
    product = get_object_or_404(Product, id=product_id, business=business)

    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, f"Product '{product.name}' updated successfully.")
            return redirect('business:products')
    else:
        form = ProductForm(instance=product)

    return render(request, 'business/edit_product.html', {'form': form, 'product': product})

@login_required
def delete_product_view(request, product_id):
    business = get_current_business(request)
    product = get_object_or_404(Product, id=product_id, business=business)

    if request.method == 'POST':
        name = product.name
        product.delete()
        messages.success(request, f"Product '{name}' deleted.")
        return redirect('business:products')

    return render(request, 'business/confirm_delete.html', {
        'title': f"Delete Product: {product.name}",
        'message': f"Are you sure you want to delete product SKU {product.product_id}? Historical sales records will be preserved.",
        'cancel_url': 'business:products'
    })

@login_required
def product_api_detail(request, product_id):
    """Returns price and available quantity for sales form dynamic autofill."""
    business = get_current_business(request)
    product = Product.objects.filter(id=product_id, business=business).first()
    if not product:
        return JsonResponse({'error': 'Product not found'}, status=404)
    
    return JsonResponse({
        'id': product.id,
        'name': product.name,
        'selling_price': str(product.selling_price),
        'purchase_price': str(product.purchase_price),
        'available_quantity': product.available_quantity,
    })

@login_required
def sales_view(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    search_query = request.GET.get('search', '').strip()
    date_filter = request.GET.get('date', '').strip()

    sales = Sale.objects.filter(business=business)
    if search_query:
        sales = sales.filter(
            Q(product_name__icontains=search_query) | Q(customer_name__icontains=search_query) | Q(invoice_no__icontains=search_query)
        )
    if date_filter:
        sales = sales.filter(sales_date=date_filter)

    if request.method == 'POST':
        form = SaleForm(request.POST, business=business)
        if form.is_valid():
            product = form.cleaned_data['product']
            qty = form.cleaned_data['quantity_sold']
            price = form.cleaned_data['selling_price']
            discount = form.cleaned_data['discount']
            customer = form.cleaned_data['customer_name']
            sales_date = form.cleaned_data['sales_date']
            payment_method = form.cleaned_data['payment_method']
            notes = form.cleaned_data['notes']

            sale = record_sale_and_update_stock(
                business=business,
                product=product,
                quantity_sold=qty,
                selling_price=price,
                discount=discount,
                customer_name=customer,
                payment_method=payment_method,
                sales_date=sales_date,
                notes=notes
            )
            messages.success(request, f"Sale recorded! Invoice #{sale.invoice_no}. Profit: {getattr(request.user, 'currency', '₹')}{sale.profit:,.2f}")
            return redirect('business:sales')
        else:
            messages.error(request, "Failed to record sale. Please review form errors.")
    else:
        form = SaleForm(business=business)

    # Products list with stock for modal / table
    products_with_stock = Product.objects.filter(business=business, available_quantity__gt=0)

    return render(request, 'business/sales.html', {
        'business': business,
        'sales': sales,
        'form': form,
        'products_with_stock': products_with_stock,
        'search_query': search_query,
        'date_filter': date_filter,
    })

@login_required
def delete_sale_view(request, sale_id):
    business = get_current_business(request)
    sale = get_object_or_404(Sale, id=sale_id, business=business)

    if request.method == 'POST':
        # Restore stock if product still exists
        if sale.product:
            sale.product.available_quantity += sale.quantity_sold
            sale.product.save(update_fields=['available_quantity'])
        
        invoice_no = sale.invoice_no
        sale.delete()
        messages.success(request, f"Invoice #{invoice_no} deleted and product stock restored.")
        return redirect('business:sales')

    return render(request, 'business/confirm_delete.html', {
        'title': f"Delete Sale #{sale.invoice_no}",
        'message': f"Are you sure you want to delete this sale of {sale.quantity_sold}x {sale.product_name}? Available stock will be restored.",
        'cancel_url': 'business:sales'
    })

@login_required
def expenses_view(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    search_query = request.GET.get('search', '').strip()
    category_filter = request.GET.get('category', '').strip()

    expenses = Expense.objects.filter(business=business)
    if search_query:
        expenses = expenses.filter(Q(name__icontains=search_query) | Q(description__icontains=search_query))
    if category_filter:
        expenses = expenses.filter(category=category_filter)

    if request.method == 'POST':
        form = ExpenseForm(request.POST)
        if form.is_valid():
            exp = record_expense_transaction(
                business=business,
                name=form.cleaned_data['name'],
                category=form.cleaned_data['category'],
                amount=form.cleaned_data['amount'],
                expense_date=form.cleaned_data['expense_date'],
                payment_method=form.cleaned_data['payment_method'],
                description=form.cleaned_data['description']
            )
            messages.success(request, f"Expense '{exp.name}' of {getattr(request.user, 'currency', '₹')}{exp.amount:,.2f} recorded.")
            return redirect('business:expenses')
        else:
            messages.error(request, "Failed to record expense. Please review inputs.")
    else:
        form = ExpenseForm()

    return render(request, 'business/expenses.html', {
        'business': business,
        'expenses': expenses,
        'form': form,
        'search_query': search_query,
        'category_filter': category_filter,
        'categories': Expense.EXPENSE_CATEGORIES,
    })

@login_required
def delete_expense_view(request, expense_id):
    business = get_current_business(request)
    expense = get_object_or_404(Expense, id=expense_id, business=business)

    if request.method == 'POST':
        name = expense.name
        expense.delete()
        messages.success(request, f"Expense '{name}' deleted.")
        return redirect('business:expenses')

    return render(request, 'business/confirm_delete.html', {
        'title': f"Delete Expense: {expense.name}",
        'message': f"Are you sure you want to delete this expense of {expense.amount}? P&L metrics will be updated immediately.",
        'cancel_url': 'business:expenses'
    })

@login_required
def profit_loss_view(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    preset = request.GET.get('preset', 'all')
    start_date_str = request.GET.get('start_date', '')
    end_date_str = request.GET.get('end_date', '')

    today = timezone.localdate()
    start_date = None
    end_date = None

    if preset == 'today':
        start_date = today
        end_date = today
    elif preset == 'this_week':
        start_date = today - timedelta(days=today.weekday())
        end_date = today
    elif preset == 'this_month':
        start_date = today.replace(day=1)
        end_date = today
    elif preset == 'this_year':
        start_date = today.replace(month=1, day=1)
        end_date = today
    elif preset == 'custom' and start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    summary = get_financial_summary(business, start_date, end_date)
    charts = get_chart_data(business)

    return render(request, 'business/profit_loss.html', {
        'business': business,
        'summary': summary,
        'charts_json': json.dumps(charts),
        'preset': preset,
        'start_date': start_date,
        'end_date': end_date,
        'start_date_str': start_date_str,
        'end_date_str': end_date_str,
    })

@login_required
def reports_view(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    summary = get_financial_summary(business)
    return render(request, 'business/reports.html', {
        'business': business,
        'summary': summary,
    })

@login_required
def download_report_pdf(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

    pdf_buffer = generate_pdf_report(business, request.user, start_date, end_date)
    response = HttpResponse(pdf_buffer, content_type='application/pdf')
    filename = f"PL_Report_{business.name.replace(' ', '_')}_{timezone.localdate().strftime('%Y%m%d')}.pdf"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

@login_required
def download_report_excel(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

    excel_buffer = generate_excel_report(business, request.user, start_date, end_date)
    response = HttpResponse(
        excel_buffer,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    filename = f"PL_Report_{business.name.replace(' ', '_')}_{timezone.localdate().strftime('%Y%m%d')}.xlsx"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

@login_required
def download_report_csv(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

    csv_buffer = generate_csv_report(business, request.user, start_date, end_date)
    response = HttpResponse(csv_buffer.getvalue(), content_type='text/csv')
    filename = f"PL_Report_{business.name.replace(' ', '_')}_{timezone.localdate().strftime('%Y%m%d')}.csv"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

@login_required
def transactions_view(request):
    business = get_current_business(request)
    if not business:
        return redirect('business:my_business')

    search_query = request.GET.get('search', '').strip()
    type_filter = request.GET.get('type', '').strip()
    date_filter = request.GET.get('date', '').strip()

    transactions = Transaction.objects.filter(business=business)
    if search_query:
        transactions = transactions.filter(
            Q(title__icontains=search_query) | Q(reference_id__icontains=search_query) | Q(payment_method__icontains=search_query)
        )
    if type_filter and type_filter != 'ALL':
        transactions = transactions.filter(transaction_type=type_filter)
    if date_filter:
        transactions = transactions.filter(date=date_filter)

    return render(request, 'business/transactions.html', {
        'business': business,
        'transactions': transactions,
        'search_query': search_query,
        'type_filter': type_filter,
        'date_filter': date_filter,
    })
