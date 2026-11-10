/**
 * Business Profit & Loss Management System
 * Interactive Client Scripts & Dynamic Profit Calculator
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar-wrapper');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.toggle('toggled');
    });
  }

  // 2. Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
  alerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    }, 5000);
  });

  // 3. Dynamic Sales Form Calculator
  const productSelect = document.getElementById('id_product_select');
  const qtyInput = document.getElementById('id_quantity_sold');
  const priceInput = document.getElementById('id_selling_price');
  const discountInput = document.getElementById('id_discount');

  // Preview elements
  const previewStock = document.getElementById('preview_available_stock');
  const previewRevenue = document.getElementById('preview_total_revenue');
  const previewCogs = document.getElementById('preview_cogs');
  const previewProfit = document.getElementById('preview_profit');
  const previewUnitCost = document.getElementById('preview_unit_cost');

  let currentPurchasePrice = 0;

  function updateFinancialPreview() {
    const qty = parseFloat(qtyInput ? qtyInput.value : 0) || 0;
    const price = parseFloat(priceInput ? priceInput.value : 0) || 0;
    const discount = parseFloat(discountInput ? discountInput.value : 0) || 0;

    const totalRevenue = Math.max(0, (qty * price) - discount);
    const totalCogs = qty * currentPurchasePrice;
    const netProfit = totalRevenue - totalCogs;

    if (previewRevenue) previewRevenue.textContent = totalRevenue.toFixed(2);
    if (previewCogs) previewCogs.textContent = totalCogs.toFixed(2);
    if (previewProfit) {
      previewProfit.textContent = netProfit.toFixed(2);
      if (netProfit >= 0) {
        previewProfit.className = 'fw-bold text-success';
      } else {
        previewProfit.className = 'fw-bold text-danger';
      }
    }
  }

  if (productSelect) {
    productSelect.addEventListener('change', function () {
      const productId = this.value;
      if (!productId) {
        currentPurchasePrice = 0;
        if (priceInput) priceInput.value = '';
        if (previewStock) previewStock.textContent = '-';
        if (previewUnitCost) previewUnitCost.textContent = '-';
        updateFinancialPreview();
        return;
      }

      fetch(`/api/products/${productId}/`)
        .then(function (res) {
          if (!res.ok) throw new Error('Product not found');
          return res.json();
        })
        .then(function (data) {
          if (priceInput) priceInput.value = data.selling_price;
          currentPurchasePrice = parseFloat(data.purchase_price) || 0;
          if (previewStock) previewStock.textContent = data.available_quantity;
          if (previewUnitCost) previewUnitCost.textContent = data.purchase_price;
          updateFinancialPreview();
        })
        .catch(function (err) {
          console.error('Failed to fetch product details', err);
        });
    });
  }

  if (qtyInput) qtyInput.addEventListener('input', updateFinancialPreview);
  if (priceInput) priceInput.addEventListener('input', updateFinancialPreview);
  if (discountInput) discountInput.addEventListener('input', updateFinancialPreview);
});
