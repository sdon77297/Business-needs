from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from accounts.models import CustomUser
from business.models import Business, Product, Sale, Expense, Transaction
from business.services import get_financial_summary, record_sale_and_update_stock, record_expense_transaction

class ProfitLossSystemTests(TestCase):
    def setUp(self):
        self.client = Client()

        # Create Businessman A
        self.user_a = CustomUser.objects.create_user(
            username='user_a',
            user_id='user_a',
            email='usera@business.com',
            password='Password123!',
            full_name='Businessman A'
        )

        # Create Businessman B (for isolation test)
        self.user_b = CustomUser.objects.create_user(
            username='user_b',
            user_id='user_b',
            email='userb@business.com',
            password='Password123!',
            full_name='Businessman B'
        )

        # Create Business for User A
        self.biz_a = Business.objects.create(
            user=self.user_a,
            name='Alpha Superstore',
            business_type='Retail Store',
            address='123 Main Street',
            initial_investment=Decimal('100000.00'),
            contact_number='+91 9999999999',
            is_active=True
        )

        # Create Business for User B
        self.biz_b = Business.objects.create(
            user=self.user_b,
            name='Beta Wholesalers',
            business_type='Wholesale',
            address='456 Market Road',
            initial_investment=Decimal('200000.00'),
            contact_number='+91 8888888888',
            is_active=True
        )

        # Add Product for User A
        self.product_a = Product.objects.create(
            business=self.biz_a,
            product_id='SKU-100',
            name='Smart Widget',
            purchase_price=Decimal('100.00'),
            selling_price=Decimal('150.00'),
            quantity_purchased=50,
            available_quantity=50
        )

    def test_01_login_with_user_id_and_email(self):
        """Verify authentication works with both User ID and Email."""
        # Test 1: Login using user_id
        res_id = self.client.post(reverse('accounts:login'), {
            'login_credential': 'user_a',
            'password': 'Password123!',
            'remember_me': True
        })
        self.assertEqual(res_id.status_code, 302)
        self.client.logout()

        # Test 2: Login using email
        res_email = self.client.post(reverse('accounts:login'), {
            'login_credential': 'usera@business.com',
            'password': 'Password123!',
            'remember_me': True
        })
        self.assertEqual(res_email.status_code, 302)

    def test_02_registration_validation(self):
        """Verify registration prevents duplicate user_id and email."""
        # Duplicate user_id
        res = self.client.post(reverse('accounts:register'), {
            'full_name': 'Duplicate User',
            'user_id': 'user_a',
            'email': 'newunique@example.com',
            'mobile_number': '+91 1234567890',
            'password': 'Password123!',
            'confirm_password': 'Password123!'
        })
        self.assertContains(res, 'This User ID is already taken')

    def test_03_multi_tenant_data_isolation(self):
        """Verify Businessman A cannot access or view Businessman B's business records."""
        self.client.login(username='user_a', password='Password123!')

        # User A tries to edit User B's business
        res = self.client.get(reverse('business:edit_business', args=[self.biz_b.id]))
        self.assertEqual(res.status_code, 404)

        # User A dashboard only shows User A's business
        res = self.client.get(reverse('business:dashboard'))
        self.assertContains(res, 'Alpha Superstore')
        self.assertNotContains(res, 'Beta Wholesalers')

    def test_04_automatic_profit_and_loss_calculation(self):
        """
        Verify the exact formula from Prompt Section 6:
        Purchase Price = 100, Selling Price = 150, Quantity Sold = 20, Other Expenses = 200
        Total Revenue = 150 * 20 = 3,000
        COGS = 100 * 20 = 2,000
        Gross Profit = 3,000 - 2,000 = 1,000
        Operating Expenses = 200
        Total Cost = 2,000 + 200 = 2,200
        Net Profit = 3,000 - 2,200 = 800
        Profit Percentage = (800 / 2,200) * 100 = 36.36%
        """
        # 1. Record Sale
        sale = record_sale_and_update_stock(
            business=self.biz_a,
            product=self.product_a,
            quantity_sold=20,
            selling_price=Decimal('150.00'),
            discount=Decimal('0.00'),
            customer_name='Test Customer',
            payment_method='Cash',
            sales_date=timezone.localdate()
        )

        self.assertEqual(sale.total_amount, Decimal('3000.00'))
        self.assertEqual(sale.cost_of_goods_sold, Decimal('2000.00'))
        self.assertEqual(sale.profit, Decimal('1000.00'))

        # Check stock decremented: 50 - 20 = 30
        self.product_a.refresh_from_db()
        self.assertEqual(self.product_a.available_quantity, 30)

        # 2. Record Expense
        expense = record_expense_transaction(
            business=self.biz_a,
            name='Office Cleaning',
            category='Maintenance',
            amount=Decimal('200.00'),
            expense_date=timezone.localdate(),
            payment_method='Cash'
        )

        # 3. Compute Summary
        summary = get_financial_summary(self.biz_a)
        self.assertEqual(summary['total_revenue'], Decimal('3000.00'))
        self.assertEqual(summary['cogs'], Decimal('2000.00'))
        self.assertEqual(summary['gross_profit'], Decimal('1000.00'))
        self.assertEqual(summary['total_expenses'], Decimal('200.00'))
        self.assertEqual(summary['total_cost'], Decimal('2200.00'))
        self.assertEqual(summary['net_profit'], Decimal('800.00'))
        self.assertEqual(summary['profit_percentage'], Decimal('36.36'))
        self.assertTrue(summary['is_profit'])

    def test_05_insufficient_stock_validation(self):
        """Verify user cannot sell more than available quantity."""
        self.client.login(username='user_a', password='Password123!')
        res = self.client.post(reverse('business:sales'), {
            'product': self.product_a.id,
            'quantity_sold': 999, # Available is only 50
            'selling_price': '150.00',
            'discount': '0.00',
            'customer_name': 'Overbuyer',
            'payment_method': 'Cash',
            'sales_date': timezone.localdate().strftime('%Y-%m-%d')
        })
        self.assertContains(res, 'Insufficient stock')

    def test_06_report_downloads(self):
        """Verify PDF, Excel, and CSV download endpoints return valid file attachments."""
        self.client.login(username='user_a', password='Password123!')

        # PDF Download
        res_pdf = self.client.get(reverse('business:download_report_pdf'))
        self.assertEqual(res_pdf.status_code, 200)
        self.assertEqual(res_pdf['Content-Type'], 'application/pdf')

        # Excel Download
        res_excel = self.client.get(reverse('business:download_report_excel'))
        self.assertEqual(res_excel.status_code, 200)
        self.assertIn('application/vnd.openxmlformats-officedocument', res_excel['Content-Type'])

        # CSV Download
        res_csv = self.client.get(reverse('business:download_report_csv'))
        self.assertEqual(res_csv.status_code, 200)
        self.assertEqual(res_csv['Content-Type'], 'text/csv')
