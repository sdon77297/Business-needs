import csv
import io
import uuid
from decimal import Decimal
from datetime import datetime, date, timedelta
from django.utils import timezone
from django.db.models import Sum, Count, Avg, F
from .models import Business, Product, Sale, Expense, Transaction

from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def get_financial_summary(business, start_date=None, end_date=None):
    """
    Computes total revenue, COGS, gross profit, expenses, net profit,
    profit percentage, stock valuation, and date-filtered metrics.
    """
    if not business:
        return {
            'total_investment': Decimal('0.00'),
            'total_sales_count': 0,
            'total_revenue': Decimal('0.00'),
            'cogs': Decimal('0.00'),
            'gross_profit': Decimal('0.00'),
            'total_expenses': Decimal('0.00'),
            'total_cost': Decimal('0.00'),
            'net_profit': Decimal('0.00'),
            'net_loss': Decimal('0.00'),
            'profit_percentage': Decimal('0.00'),
            'is_profit': True,
            'total_stock_units': 0,
            'total_stock_value': Decimal('0.00'),
            'expense_categories': [],
        }

    # Querysets
    sales_qs = Sale.objects.filter(business=business)
    expense_qs = Expense.objects.filter(business=business)

    if start_date:
        sales_qs = sales_qs.filter(sales_date__gte=start_date)
        expense_qs = expense_qs.filter(expense_date__gte=start_date)

    if end_date:
        sales_qs = sales_qs.filter(sales_date__lte=end_date)
        expense_qs = expense_qs.filter(expense_date__lte=end_date)

    # Aggregations
    sales_agg = sales_qs.aggregate(
        total_rev=Sum('total_amount'),
        total_cogs=Sum('cost_of_goods_sold'),
        total_qty=Sum('quantity_sold'),
        sales_count=Count('id')
    )

    expense_agg = expense_qs.aggregate(
        total_exp=Sum('amount'),
        expense_count=Count('id')
    )

    total_revenue = sales_agg['total_rev'] or Decimal('0.00')
    cogs = sales_agg['total_cogs'] or Decimal('0.00')
    gross_profit = total_revenue - cogs

    total_expenses = expense_agg['total_exp'] or Decimal('0.00')
    total_cost = cogs + total_expenses

    net_profit = gross_profit - total_expenses
    is_profit = net_profit >= Decimal('0.00')
    net_loss = abs(net_profit) if not is_profit else Decimal('0.00')

    if total_cost > Decimal('0.00'):
        profit_percentage = round((net_profit / total_cost) * Decimal('100.00'), 2)
    else:
        profit_percentage = Decimal('100.00') if total_revenue > Decimal('0.00') else Decimal('0.00')

    # Available stock
    products = Product.objects.filter(business=business)
    total_stock_units = sum(p.available_quantity for p in products)
    total_stock_value = sum(Decimal(p.available_quantity) * p.purchase_price for p in products)

    # Category-wise expenses
    expense_by_cat = expense_qs.values('category').annotate(total=Sum('amount')).order_by('-total')

    return {
        'total_investment': business.initial_investment or Decimal('0.00'),
        'total_sales_count': sales_agg['sales_count'] or 0,
        'total_units_sold': sales_agg['total_qty'] or 0,
        'total_revenue': total_revenue,
        'cogs': cogs,
        'gross_profit': gross_profit,
        'total_expenses': total_expenses,
        'total_cost': total_cost,
        'net_profit': net_profit,
        'net_loss': net_loss,
        'profit_percentage': profit_percentage,
        'is_profit': is_profit,
        'total_stock_units': total_stock_units,
        'total_stock_value': total_stock_value,
        'expense_categories': list(expense_by_cat),
    }

def get_chart_data(business):
    """
    Builds data structures for Daily Sales (last 14 days),
    Monthly Profit (last 6 months), Yearly Revenue, and Expense Categories.
    """
    today = timezone.localdate()
    
    # 1. Daily Sales Graph (Last 14 Days)
    daily_labels = []
    daily_sales = []
    daily_profits = []

    for i in range(13, -1, -1):
        target_date = today - timedelta(days=i)
        date_str = target_date.strftime('%d %b')
        daily_labels.append(date_str)
        
        day_sales = Sale.objects.filter(business=business, sales_date=target_date)
        day_rev = day_sales.aggregate(rev=Sum('total_amount'), prof=Sum('profit'))
        daily_sales.append(float(day_rev['rev'] or 0))
        daily_profits.append(float(day_rev['prof'] or 0))

    # 2. Monthly Profit Graph (Last 6 Months)
    monthly_labels = []
    monthly_revenues = []
    monthly_expenses = []
    monthly_net_profits = []

    for i in range(5, -1, -1):
        # Calculate month offsets
        year = today.year
        month = today.month - i
        while month <= 0:
            month += 12
            year -= 1

        month_label = date(year, month, 1).strftime('%b %Y')
        monthly_labels.append(month_label)

        # Sales & Expenses in month
        m_sales = Sale.objects.filter(
            business=business,
            sales_date__year=year,
            sales_date__month=month
        ).aggregate(rev=Sum('total_amount'), cogs=Sum('cost_of_goods_sold'))
        
        m_expenses = Expense.objects.filter(
            business=business,
            expense_date__year=year,
            expense_date__month=month
        ).aggregate(exp=Sum('amount'))

        rev = m_sales['rev'] or Decimal('0.00')
        cogs = m_sales['cogs'] or Decimal('0.00')
        exp = m_expenses['exp'] or Decimal('0.00')
        net_prof = (rev - cogs) - exp

        monthly_revenues.append(float(rev))
        monthly_expenses.append(float(exp))
        monthly_net_profits.append(float(net_prof))

    # 3. Expense Categories for Doughnut Chart
    exp_cats = Expense.objects.filter(business=business).values('category').annotate(
        total=Sum('amount')
    ).order_by('-total')

    exp_labels = [c['category'] for c in exp_cats]
    exp_data = [float(c['total']) for c in exp_cats]

    return {
        'daily': {
            'labels': daily_labels,
            'sales': daily_sales,
            'profits': daily_profits,
        },
        'monthly': {
            'labels': monthly_labels,
            'revenues': monthly_revenues,
            'expenses': monthly_expenses,
            'net_profits': monthly_net_profits,
        },
        'expenses': {
            'labels': exp_labels,
            'data': exp_data,
        }
    }

def record_sale_and_update_stock(business, product, quantity_sold, selling_price, discount, customer_name, payment_method, sales_date, notes=''):
    """
    Creates a sale, calculates financials, decrements available stock,
    and logs a unified Transaction ledger record.
    """
    qty = int(quantity_sold)
    unit_cost = product.purchase_price if product else Decimal('0.00')
    
    # Generate unique invoice number
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    rand_suffix = uuid.uuid4().hex[:4].upper()
    invoice_no = f"INV-{timestamp}-{rand_suffix}"

    sale = Sale(
        business=business,
        invoice_no=invoice_no,
        product=product,
        product_name=product.name if product else 'Custom Item',
        quantity_sold=qty,
        purchase_price=unit_cost,
        selling_price=Decimal(selling_price),
        discount=Decimal(discount or 0),
        customer_name=customer_name or 'Cash Customer',
        payment_method=payment_method,
        sales_date=sales_date or timezone.localdate(),
        notes=notes
    )
    sale.calculate_financials()
    sale.save()

    # Decrement available product stock
    if product:
        product.available_quantity = max(0, product.available_quantity - qty)
        product.save()

    # Create transaction record
    Transaction.objects.create(
        business=business,
        transaction_type='SALE',
        reference_id=sale.invoice_no,
        title=f"Sale: {sale.product_name} x {sale.quantity_sold}",
        amount=sale.total_amount,
        profit_or_loss=sale.profit,
        date=sale.sales_date,
        payment_method=sale.payment_method,
        sale=sale
    )

    return sale

def record_expense_transaction(business, name, category, amount, expense_date, payment_method, description=''):
    """
    Creates an expense record and logs a unified Transaction record.
    """
    amt = Decimal(amount)
    exp = Expense.objects.create(
        business=business,
        name=name,
        category=category,
        amount=amt,
        expense_date=expense_date or timezone.localdate(),
        payment_method=payment_method,
        description=description
    )

    Transaction.objects.create(
        business=business,
        transaction_type='EXPENSE',
        reference_id=f"EXP-{exp.id:06d}",
        title=f"Expense: {exp.name} ({exp.category})",
        amount=amt,
        profit_or_loss=-amt,
        date=exp.expense_date,
        payment_method=exp.payment_method,
        expense=exp
    )

    return exp

# ==========================================
# EXPORT ENGINES: PDF, EXCEL, AND CSV
# ==========================================

def generate_pdf_report(business, user, start_date=None, end_date=None):
    """
    Generates an executive, beautifully styled PDF financial report using ReportLab.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0B1B3D'),
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    heading_style = ParagraphStyle(
        'SectionHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=6
    )
    cell_style = ParagraphStyle(
        'Cell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1E293B')
    )

    elements = []
    currency = getattr(user, 'currency', '₹')

    # Header
    elements.append(Paragraph(f"<b>{business.name.upper()}</b>", title_style))
    elements.append(Paragraph(f"Profit & Loss Financial Statement • Generated on {datetime.now().strftime('%d %B %Y, %I:%M %p')}", subtitle_style))
    elements.append(Paragraph(f"Business Type: {business.business_type} | Contact: {business.contact_number} | Owner: {user.full_name or user.user_id}", subtitle_style))
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#10B981'), spaceAfter=15))

    # Financial Summary Metrics Table
    summary = get_financial_summary(business, start_date, end_date)
    
    date_range_str = "All Time"
    if start_date and end_date:
        date_range_str = f"{start_date.strftime('%d-%m-%Y')} to {end_date.strftime('%d-%m-%Y')}"
    elif start_date:
        date_range_str = f"From {start_date.strftime('%d-%m-%Y')}"
    elif end_date:
        date_range_str = f"Until {end_date.strftime('%d-%m-%Y')}"

    elements.append(Paragraph(f"Executive Financial Overview ({date_range_str})", heading_style))

    profit_color = colors.HexColor('#059669') if summary['is_profit'] else colors.HexColor('#DC2626')
    profit_label = "Net Business Profit" if summary['is_profit'] else "Net Business Loss"

    summary_data = [
        ['Metric / Indicator', 'Amount Value', 'Metric / Indicator', 'Amount Value'],
        ['Total Revenue (Sales)', f"{currency} {summary['total_revenue']:,.2f}", 'Cost of Goods Sold (COGS)', f"{currency} {summary['cogs']:,.2f}"],
        ['Gross Profit', f"{currency} {summary['gross_profit']:,.2f}", 'Total Operating Expenses', f"{currency} {summary['total_expenses']:,.2f}"],
        ['Total Incurred Cost', f"{currency} {summary['total_cost']:,.2f}", 'Net Profit Percentage', f"{summary['profit_percentage']}%"],
        [profit_label, f"{currency} {abs(summary['net_profit']):,.2f}", 'Available Stock Valuation', f"{currency} {summary['total_stock_value']:,.2f}"],
    ]

    t_summary = Table(summary_data, colWidths=[140, 130, 140, 130])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B1B3D')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('ALIGN', (3, 1), (3, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
        ('TEXTCOLOR', (1, 4), (1, 4), profit_color),
        ('FONTNAME', (0, 4), (-1, 4), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(t_summary)
    elements.append(Spacer(1, 15))

    # Recent Sales Table (up to 15)
    elements.append(Paragraph("Recent Sales Transactions", heading_style))
    sales = Sale.objects.filter(business=business)
    if start_date: sales = sales.filter(sales_date__gte=start_date)
    if end_date: sales = sales.filter(sales_date__lte=end_date)
    recent_sales = sales.order_by('-sales_date', '-created_at')[:12]

    sales_data = [['Invoice #', 'Date', 'Product', 'Qty', 'Unit Price', 'Revenue', 'Profit']]
    for s in recent_sales:
        sales_data.append([
            s.invoice_no[:12],
            s.sales_date.strftime('%d-%m-%Y'),
            s.product_name[:20],
            str(s.quantity_sold),
            f"{currency} {s.selling_price:,.2f}",
            f"{currency} {s.total_amount:,.2f}",
            f"{currency} {s.profit:,.2f}",
        ])

    if len(sales_data) == 1:
        sales_data.append(['No sales recorded in this period', '-', '-', '-', '-', '-', '-'])

    t_sales = Table(sales_data, colWidths=[75, 65, 140, 35, 75, 75, 75])
    t_sales.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_sales)
    elements.append(Spacer(1, 15))

    # Operating Expenses Table (up to 10)
    elements.append(Paragraph("Operating Business Expenses", heading_style))
    expenses = Expense.objects.filter(business=business)
    if start_date: expenses = expenses.filter(expense_date__gte=start_date)
    if end_date: expenses = expenses.filter(expense_date__lte=end_date)
    recent_expenses = expenses.order_by('-expense_date', '-created_at')[:10]

    expense_data = [['Expense Title', 'Category', 'Date', 'Payment Method', 'Amount']]
    for e in recent_expenses:
        expense_data.append([
            e.name[:25],
            e.category,
            e.expense_date.strftime('%d-%m-%Y'),
            e.payment_method,
            f"{currency} {e.amount:,.2f}",
        ])

    if len(expense_data) == 1:
        expense_data.append(['No expenses recorded in this period', '-', '-', '-', '-'])

    t_expenses = Table(expense_data, colWidths=[150, 120, 80, 90, 100])
    t_expenses.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#334155')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_expenses)

    doc.build(elements)
    buffer.seek(0)
    return buffer

def generate_excel_report(business, user, start_date=None, end_date=None):
    """
    Generates a professional Excel workbook with Financial Summary, Sales, Expenses, and Products sheets.
    """
    wb = Workbook()
    currency = getattr(user, 'currency', '₹')
    summary = get_financial_summary(business, start_date, end_date)

    # Sheet 1: Executive Summary
    ws_summary = wb.active
    ws_summary.title = "P&L Summary"

    title_font = Font(name='Calibri', size=16, bold=True, color='0B1B3D')
    header_font = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
    bold_font = Font(name='Calibri', size=11, bold=True)
    header_fill = PatternFill(start_color='0B1B3D', end_color='0B1B3D', fill_type='solid')
    sub_fill = PatternFill(start_color='F1F5F9', end_color='F1F5F9', fill_type='solid')

    ws_summary['A1'] = business.name.upper()
    ws_summary['A1'].font = title_font
    ws_summary['A2'] = f"Business Profit & Loss Statement ({datetime.now().strftime('%d-%m-%Y')})"
    ws_summary['A3'] = f"Owner: {user.full_name or user.user_id} | Type: {business.business_type}"

    ws_summary.append([])
    ws_summary.append(['Financial Indicator', 'Value', 'Calculation / Formula'])
    ws_summary.row_dimensions[5].height = 24

    for col in range(1, 4):
        cell = ws_summary.cell(row=5, column=col)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center', vertical='center')

    metrics = [
        ('Initial Investment', f"{currency} {summary['total_investment']:,.2f}", 'Capital infused into business'),
        ('Total Revenue (Gross Sales)', f"{currency} {summary['total_revenue']:,.2f}", 'Selling Price × Quantity Sold − Discounts'),
        ('Cost of Goods Sold (COGS)', f"{currency} {summary['cogs']:,.2f}", 'Purchase Price × Quantity Sold'),
        ('Gross Profit', f"{currency} {summary['gross_profit']:,.2f}", 'Total Revenue − Cost of Goods Sold'),
        ('Total Operating Expenses', f"{currency} {summary['total_expenses']:,.2f}", 'Sum of all non-product business expenses'),
        ('Total Cost of Business', f"{currency} {summary['total_cost']:,.2f}", 'COGS + Operating Expenses'),
        ('Net Business Profit / Loss', f"{currency} {summary['net_profit']:,.2f}", 'Gross Profit − Total Operating Expenses'),
        ('Net Profit Percentage', f"{summary['profit_percentage']}%", '(Net Profit / Total Cost) × 100'),
        ('Available Stock Valuation', f"{currency} {summary['total_stock_value']:,.2f}", 'Sum of Available Quantity × Purchase Price'),
        ('Available Stock Units', str(summary['total_stock_units']), 'Current physical units across all products'),
    ]

    for item in metrics:
        ws_summary.append(item)

    ws_summary.column_dimensions['A'].width = 30
    ws_summary.column_dimensions['B'].width = 24
    ws_summary.column_dimensions['C'].width = 45

    # Sheet 2: Sales Ledger
    ws_sales = wb.create_sheet(title="Sales Ledger")
    ws_sales.append(['Invoice #', 'Sales Date', 'Product Name', 'Quantity Sold', 'Cost Price', 'Selling Price', 'Discount', 'Total Revenue', 'Profit', 'Customer', 'Payment Method'])
    for col in range(1, 12):
        cell = ws_sales.cell(row=1, column=col)
        cell.font = header_font
        cell.fill = PatternFill(start_color='1E3A8A', end_color='1E3A8A', fill_type='solid')

    sales = Sale.objects.filter(business=business)
    if start_date: sales = sales.filter(sales_date__gte=start_date)
    if end_date: sales = sales.filter(sales_date__lte=end_date)
    for s in sales:
        ws_sales.append([
            s.invoice_no,
            s.sales_date.strftime('%Y-%m-%d'),
            s.product_name,
            s.quantity_sold,
            float(s.purchase_price),
            float(s.selling_price),
            float(s.discount),
            float(s.total_amount),
            float(s.profit),
            s.customer_name,
            s.payment_method
        ])
    for col in ws_sales.columns:
        ws_sales.column_dimensions[col[0].column_letter].width = 16

    # Sheet 3: Expenses Ledger
    ws_exp = wb.create_sheet(title="Expenses Ledger")
    ws_exp.append(['ID', 'Date', 'Expense Name', 'Category', 'Amount', 'Payment Method', 'Description'])
    for col in range(1, 8):
        cell = ws_exp.cell(row=1, column=col)
        cell.font = header_font
        cell.fill = PatternFill(start_color='334155', end_color='334155', fill_type='solid')

    expenses = Expense.objects.filter(business=business)
    if start_date: expenses = expenses.filter(expense_date__gte=start_date)
    if end_date: expenses = expenses.filter(expense_date__lte=end_date)
    for e in expenses:
        ws_exp.append([
            e.id,
            e.expense_date.strftime('%Y-%m-%d'),
            e.name,
            e.category,
            float(e.amount),
            e.payment_method,
            e.description
        ])
    for col in ws_exp.columns:
        ws_exp.column_dimensions[col[0].column_letter].width = 18

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output

def generate_csv_report(business, user, start_date=None, end_date=None):
    """
    Generates a CSV string containing the consolidated financial summary and transaction list.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    currency = getattr(user, 'currency', '₹')
    summary = get_financial_summary(business, start_date, end_date)

    writer.writerow([f"BUSINESS PROFIT & LOSS STATEMENT - {business.name.upper()}"])
    writer.writerow(["Generated At", datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
    writer.writerow(["Currency", currency])
    writer.writerow([])
    writer.writerow(["FINANCIAL SUMMARY"])
    writer.writerow(["Total Revenue", summary['total_revenue']])
    writer.writerow(["Cost of Goods Sold (COGS)", summary['cogs']])
    writer.writerow(["Gross Profit", summary['gross_profit']])
    writer.writerow(["Operating Expenses", summary['total_expenses']])
    writer.writerow(["Net Profit / Loss", summary['net_profit']])
    writer.writerow(["Net Profit Percentage", f"{summary['profit_percentage']}%"])
    writer.writerow(["Available Stock Units", summary['total_stock_units']])
    writer.writerow(["Available Stock Valuation", summary['total_stock_value']])
    writer.writerow([])
    writer.writerow(["CONSOLIDATED TRANSACTIONS"])
    writer.writerow(["Transaction ID", "Date", "Type", "Title", "Amount", "Profit / Inflow", "Payment Method"])

    txns = Transaction.objects.filter(business=business)
    if start_date: txns = txns.filter(date__gte=start_date)
    if end_date: txns = txns.filter(date__lte=end_date)

    for t in txns:
        writer.writerow([t.reference_id, t.date.strftime('%Y-%m-%d'), t.transaction_type, t.title, t.amount, t.profit_or_loss, t.payment_method])

    output.seek(0)
    return output
