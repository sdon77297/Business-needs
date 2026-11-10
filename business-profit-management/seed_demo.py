"""
Database Seeding Script for Business Profit & Loss Management System.
Generates an executive businessman account with realistic inventory, sales, expenses, and transactions.
"""
import os
import django
from decimal import Decimal
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from accounts.models import CustomUser
from business.models import Business, Product, Sale, Expense, Transaction
from business.services import record_sale_and_update_stock, record_expense_transaction

def seed():
    print("[Seed] Initializing demo data...")

    # 1. Create or reset Businessman user
    user, created = CustomUser.objects.get_or_create(
        user_id='businessman1',
        defaults={
            'username': 'businessman1',
            'email': 'businessman1@example.com',
            'full_name': 'Rajesh Sharma',
            'mobile_number': '+91 9876543210',
            'currency': '₹',
        }
    )
    user.set_password('Admin123!')
    user.save()
    print(f"[Seed] Businessman account '{user.user_id}' ready. Password: 'Admin123!'")

    # 2. Clear old data for clean state
    Business.objects.filter(user=user).delete()

    # 3. Create Primary Business
    biz1 = Business.objects.create(
        user=user,
        name='Apex Electronics & Gadgets',
        business_type='Retail Store',
        address='Shop #4, Commercial Galleria, MG Road, Bangalore',
        description='Leading retailer of consumer electronics, smartphones, accessories, and audio gear.',
        starting_date=timezone.localdate() - timedelta(days=120),
        initial_investment=Decimal('500000.00'),
        contact_number='+91 80 4123 5678',
        is_active=True
    )

    # Create Secondary Business
    biz2 = Business.objects.create(
        user=user,
        name='Apex Wholesalers & Distribution',
        business_type='Wholesale & Distribution',
        address='Warehouse 12, Industrial Area, Peenya, Bangalore',
        description='B2B bulk supplier of electronic components and accessories to regional retailers.',
        starting_date=timezone.localdate() - timedelta(days=90),
        initial_investment=Decimal('1200000.00'),
        contact_number='+91 80 4123 9999',
        is_active=False
    )
    print(f"[Seed] Created 2 businesses: '{biz1.name}' and '{biz2.name}'")

    # 4. Add Products for biz1
    products_data = [
        {'id': 'EAR-001', 'name': 'Wireless Bluetooth Earbuds Pro', 'cat': 'Audio', 'cost': '650.00', 'sell': '1350.00', 'purchased': 60, 'available': 60},
        {'id': 'CAM-402', 'name': '4K Ultra HD Action Waterproof Camera', 'cat': 'Cameras', 'cost': '3200.00', 'sell': '5500.00', 'purchased': 25, 'available': 25},
        {'id': 'PWR-20K', 'name': 'Fast Charging Power Bank 20000mAh', 'cat': 'Accessories', 'cost': '750.00', 'sell': '1500.00', 'purchased': 50, 'available': 50},
        {'id': 'KB-MECH', 'name': 'RGB Mechanical Gaming Keyboard', 'cat': 'Peripherals', 'cost': '1400.00', 'sell': '2700.00', 'purchased': 35, 'available': 35},
        {'id': 'BAND-PRO', 'name': 'Smart Fitness Tracker & Heart Rate Band', 'cat': 'Wearables', 'cost': '950.00', 'sell': '1900.00', 'purchased': 40, 'available': 40},
        {'id': 'CBL-C2M', 'name': 'Braided Fast Charging Type-C Cable 2M', 'cat': 'Cables', 'cost': '110.00', 'sell': '320.00', 'purchased': 100, 'available': 100},
        {'id': 'SPK-BT10', 'name': 'Waterproof Portable Bluetooth Speaker', 'cat': 'Audio', 'cost': '1150.00', 'sell': '2250.00', 'purchased': 30, 'available': 30},
    ]

    products_map = {}
    for pd in products_data:
        p = Product.objects.create(
            business=biz1,
            product_id=pd['id'],
            name=pd['name'],
            category_name=pd['cat'],
            purchase_price=Decimal(pd['cost']),
            selling_price=Decimal(pd['sell']),
            quantity_purchased=pd['purchased'],
            available_quantity=pd['available'],
            purchase_date=timezone.localdate() - timedelta(days=60)
        )
        products_map[pd['id']] = p
    print(f"[Seed] Created {len(products_map)} products with stock.")

    # 5. Record Realistic Sales
    today = timezone.localdate()
    sales_plan = [
        (products_map['EAR-001'], 3, '1350.00', '50.00', 'Vikram Mehra', 'UPI', today - timedelta(days=8), 'Walk-in buyer'),
        (products_map['CAM-402'], 2, '5500.00', '200.00', 'Ananya Deshmukh', 'Credit Card', today - timedelta(days=7), 'Vlogger kit'),
        (products_map['PWR-20K'], 5, '1500.00', '0.00', 'Suresh Kumar', 'Cash', today - timedelta(days=6), 'Bulk purchase for office'),
        (products_map['KB-MECH'], 2, '2700.00', '100.00', 'Rohan Verma', 'UPI', today - timedelta(days=5), 'Gaming customer'),
        (products_map['BAND-PRO'], 4, '1900.00', '150.00', 'Pooja Hegde', 'Debit Card', today - timedelta(days=4), 'Family fitness purchase'),
        (products_map['CBL-C2M'], 10, '320.00', '0.00', 'Karthik Rao', 'Cash', today - timedelta(days=3), 'Accessories package'),
        (products_map['SPK-BT10'], 3, '2250.00', '150.00', 'Neha Kapoor', 'UPI', today - timedelta(days=2), 'Party speaker'),
        (products_map['EAR-001'], 4, '1350.00', '100.00', 'Amitabh Sen', 'Credit Card', today - timedelta(days=1), 'Regular client'),
        (products_map['KB-MECH'], 1, '2700.00', '0.00', 'Deepak Joshi', 'UPI', today, 'Desk upgrade'),
        (products_map['PWR-20K'], 3, '1500.00', '50.00', 'Sneha Patel', 'Cash', today, 'Travel emergency'),
    ]

    for prod, qty, price, disc, cust, method, sdate, note in sales_plan:
        record_sale_and_update_stock(
            business=biz1,
            product=prod,
            quantity_sold=qty,
            selling_price=price,
            discount=disc,
            customer_name=cust,
            payment_method=method,
            sales_date=sdate,
            notes=note
        )
    print(f"[Seed] Recorded {len(sales_plan)} sales and synchronized product inventory.")

    # 6. Record Operating Expenses
    expenses_plan = [
        ('Showroom Rent - Current Month', 'Rent', '35000.00', today - timedelta(days=10), 'Bank Transfer', 'Shop #4 monthly rent'),
        ('Electricity & Lighting Bill', 'Electricity', '5850.00', today - timedelta(days=7), 'UPI', 'BESCOM commercial meter bill'),
        ('Store Staff Salaries (2 staff)', 'Employee Salary', '38000.00', today - timedelta(days=5), 'Bank Transfer', 'Monthly salary disbursement'),
        ('Social Media & Local Ads', 'Marketing', '7500.00', today - timedelta(days=6), 'Credit Card', 'Meta & Google local campaign'),
        ('Fiber Broadband & CCTV Cloud', 'Internet & Utilities', '1850.00', today - timedelta(days=8), 'UPI', 'Airtel commercial fiber'),
        ('Air Conditioning Maintenance', 'Maintenance', '2400.00', today - timedelta(days=3), 'Cash', 'Quarterly AC service'),
    ]

    for name, cat, amt, edate, method, desc in expenses_plan:
        record_expense_transaction(
            business=biz1,
            name=name,
            category=cat,
            amount=amt,
            expense_date=edate,
            payment_method=method,
            description=desc
        )
    print(f"[Seed] Recorded {len(expenses_plan)} operating expenses.")

    print("\n[Seed] SUCCESS! Database seeded with production-ready records.")
    print("----------------------------------------------------------------")
    print(f"Login URL: http://127.0.0.1:8000/accounts/login/")
    print(f"User ID:   businessman1")
    print(f"Password:  Admin123!")
    print("----------------------------------------------------------------\n")

if __name__ == '__main__':
    seed()
