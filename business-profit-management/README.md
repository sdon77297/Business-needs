# Business Profit & Loss Management System

A production-grade, enterprise Full-Stack web application designed specifically for businessmen and entrepreneurs to manage multi-entity commercial operations, record products & stock, track sales & expenses, automatically compute gross and net profit/loss, visualize performance with interactive charts, and export executive financial statements (PDF, Excel, CSV).

---

## 🚀 Key Features

1. **Authentication & Multi-Tenant Isolation**
   - Secure dual-credential login (Log in with either unique **User ID** or **Email**).
   - Password hashing with PBKDF2/SHA-256.
   - Strict multi-tenant data isolation: Each businessman only has access to their own business data.
   - Password reset workflow and account profile customization (including custom currency symbols: ₹, $, €, £, AED, etc.).

2. **Multi-Business Support ("My Business")**
   - One businessman account can manage multiple separate businesses/enterprises (e.g. Retail Store, Wholesale, E-Commerce).
   - Instant header business switcher with automatic session synchronization.
   - Initial investment tracking, business category, registration details, and contact details.

3. **Product & Inventory Management**
   - Track Product Name, SKU / Product ID, Category, Purchase Cost, Selling Price, and Stock.
   - Instant inventory level status (In Stock, Low Stock, Out of Stock badges).
   - Automatic stock decrement upon recording sales and automatic stock restoration if a sale is deleted.

4. **Automated Profit & Loss Calculation Engine**
   - Implements the exact financial logic:
     - **Total Revenue** = $\text{Selling Price} \times \text{Quantity Sold} - \text{Discount}$
     - **Cost of Goods Sold (COGS)** = $\text{Purchase Price} \times \text{Quantity Sold}$
     - **Gross Profit** = $\text{Total Revenue} - \text{COGS}$
     - **Total Cost** = $\text{COGS} + \text{Operating Expenses}$
     - **Net Profit** = $\text{Gross Profit} - \text{Operating Expenses}$
     - **Net Profit Percentage** = $(\text{Net Profit} / \text{Total Cost}) \times 100$
   - Automatic visual color coding: **Green (`#10B981`)** for net profit and **Red (`#EF4444`)** for net loss.
   - Live interactive calculation preview in the sales modal before saving.

5. **Financial Operations & Expense Tracking**
   - Operational expense management across standardized categories (Rent, Utilities, Salaries, Marketing, Logistics, Maintenance, Taxes, Others).
   - Real-time double-entry transaction ledger with unique reference numbers (`TRX-...`).

6. **Executive Dashboard & Visual Analytics (Chart.js)**
   - 8 High-Impact KPI Cards:
     1. Total Initial Investment
     2. Total Sales Count
     3. Total Revenue
     4. Total Operating Expenses
     5. Total Gross Profit
     6. Total Net Profit / Net Loss
     7. Net Profit Percentage
     8. Total Units of Stock Available
   - **Daily Sales Trend Chart** (Line chart).
   - **Monthly Profit & Loss Chart** (Dual-dataset bar chart).
   - **Expense Category Breakdown** (Donut chart).

7. **Exportable Reports & Statements**
   - **PDF Financial Statement**: Formatted with executive corporate header, KPI summary, and ledger table using `ReportLab`.
   - **Excel Spreadsheet (.xlsx)**: Styled with header fills and borders using `openpyxl`.
   - **CSV Export**: Standardized comma-separated ledger export.

---

## 🛠️ Technology Stack

- **Backend**: Python 3, Django 4.2 LTS, Django REST Framework
- **Database**: SQLite (Stored cleanly in `database/db.sqlite3`)
- **Frontend**: HTML5, Modern CSS3, JavaScript (ES6+), Bootstrap 5, FontAwesome 6, Chart.js
- **Reporting Engines**: `ReportLab` (PDF generation), `OpenPyXL` (Excel generation)

---

## 💻 Quick Start & Running Guide

### 1. Prerequisites
Ensure Python 3.10+ is installed on your machine.

### 2. Configure Django
Set `DJANGO_SECRET_KEY` to a unique random value of at least 32 characters before running Django commands.

PowerShell:
```powershell
$env:DJANGO_SECRET_KEY = (python -c "import secrets; print(secrets.token_urlsafe(50))")
```

Linux/macOS:
```bash
export DJANGO_SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(50))')"
```

### 3. Navigate to Project Directory
```bash
cd "business-profit-management"
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run Migrations & Seed Demo Data
```bash
# Run database migrations
python manage.py migrate

# Populate ready-to-test demonstration records
python seed_demo.py
```

### 6. Run the Automated Test Suite
Verify that all unit and integration tests pass cleanly:
```bash
python manage.py test
```

### 7. Start the Development Server
```bash
python manage.py runserver
```
Visit the system in your browser at: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 🔑 Pre-Configured Demo Credentials

| Role | User ID / Login | Email | Password |
| :--- | :--- | :--- | :--- |
| **Businessman** | `businessman1` | `businessman1@example.com` | `Admin123!` |

*Note: You can also click **Create Businessman Account** on the login page to register a completely new user account.*

---

## 📂 Project Architecture

```
business-profit-management/
├── accounts/                  # User Auth, Profiles, Currency Settings, Multi-tenant Isolation
│   ├── models.py              # CustomUser (User ID, mobile, currency, profile photo)
│   ├── backends.py            # EmailOrUserIdModelBackend (Dual login backend)
│   ├── forms.py               # Registration, Login, Profile & Password Forms
│   ├── views.py               # Auth & Settings views
│   └── urls.py                # Authentication endpoints
├── business/                  # Core Business, Inventory, P&L, and Ledger Engine
│   ├── models.py              # Business, Category, Product, Sale, Expense, Transaction
│   ├── services.py            # P&L Formulas, Stock Management, PDF/Excel generators
│   ├── forms.py               # BusinessForm, ProductForm, SaleForm, ExpenseForm
│   ├── context_processors.py  # Injects active business & user businesses into templates
│   ├── templatetags/          # Custom math & formatting template filters
│   ├── views.py               # Dashboard, CRUD views, Report downloads
│   ├── urls.py                # Business routes
│   └── tests.py               # Automated test suite (6 passing test cases)
├── config/                    # Django Project Settings & Routing
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── database/                  # SQLite storage location
│   └── db.sqlite3
├── static/                    # Custom CSS & JavaScript
│   ├── css/style.css          # Executive Dark Navy, Emerald & Coral theme
│   └── js/script.js           # Chart.js configs & live dynamic calculation scripts
├── templates/                 # Jinja2 / Django HTML5 UI Templates
│   ├── base.html              # Responsive layout with sidebar & business switcher
│   ├── accounts/              # Auth pages (login, register, forgot password, profile)
│   └── business/              # Dashboard, Products, Sales, Expenses, P&L, Reports
├── manage.py
├── requirements.txt
└── seed_demo.py               # Populates sample businesses, products, sales & expenses
```
