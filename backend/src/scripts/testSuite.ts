import mongoose from 'mongoose';
import http from 'http';
import app from '../server';
import { env } from '../config/env';

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}`;

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

const runTest = async (name: string, fn: () => Promise<void>) => {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err.message });
    console.error(`  ✗ ${name}: ${err.message}`);
  }
};

const assert = (condition: boolean, msg: string) => {
  if (!condition) throw new Error(msg);
};

const runAllTests = async () => {
  console.log('\n============================================================');
  console.log('   MFEF PRIVATE WEALTH — AUTOMATED INTEGRATION TEST SUITE   ');
  console.log('============================================================\n');

  // Ensure DB connected
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(env.MONGODB_URI);
  }

  // Start HTTP server on test port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`[Test Harness] Server listening on ${BASE_URL}\n`);

  let authToken = '';
  let authCookie = '';
  let testInquiryId = '';
  let testReferenceCode = '';

  try {
    // 1. Health check
    await runTest('GET /api/health returns operational status', async () => {
      const res = await fetch(`${BASE_URL}/api/health`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.status === 'operational', `Expected operational status`);
    });

    // 2. Services endpoint
    await runTest('GET /api/v1/services returns active wealth practices', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/services`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.success === true, `Expected success: true`);
      assert(Array.isArray(data.data), `Expected data array`);
      assert(data.data.length >= 4, `Expected at least 4 seeded services`);
    });

    // 3. Single service by slug
    await runTest('GET /api/v1/services/private-wealth-management returns valid mandate', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/services/private-wealth-management`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.data.slug === 'private-wealth-management', `Expected matching slug`);
      assert(data.data.keyDeliverables.length > 0, `Expected deliverables`);
    });

    // 4. Consultation submission (Success)
    await runTest('POST /api/v1/inquiries/consultation generates VIP reference', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/inquiries/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Baroness Charlotte Roth',
          email: 'charlotte@roth-family.ch',
          phone: '+41 22 730 4111',
          countryOrCity: 'Geneva, Switzerland',
          estimatedPortfolioTier: '$20M+',
          serviceOfInterest: 'Family Office Advisory & Succession Planning',
          preferredMode: 'SECURE_VIDEO',
          message: 'Review of Swiss-domiciled discretionary family trust and real estate allocations.',
        }),
      });

      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.success === true, `Expected success: true`);
      assert(data.referenceNumber.startsWith('MFEF-'), `Expected MFEF- prefix`);
      testReferenceCode = data.referenceNumber;
      testInquiryId = data.data.id;
    });

    // 5. Consultation submission (Validation failure)
    await runTest('POST /api/v1/inquiries/consultation rejects invalid email format', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/inquiries/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Test User',
          email: 'not-a-valid-email',
          phone: '+1 555 1234',
        }),
      });

      assert(res.status === 400, `Expected 400 validation error, got ${res.status}`);
      const data = await res.json();
      assert(data.success === false, `Expected success: false`);
      assert(Array.isArray(data.errors), `Expected validation error list`);
    });

    // 6. Callback submission
    await runTest('POST /api/v1/inquiries/callback registers urgent callback', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/inquiries/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Sir Arthur Wellesley',
          phone: '+44 20 7123 4567',
          callbackWindow: 'IMMEDIATE',
          serviceOfInterest: 'Corporate Capital Advisory & Debt',
        }),
      });

      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.referenceNumber.startsWith('CALL-'), `Expected CALL- prefix`);
    });

    // 7. Track consultation by reference
    await runTest('GET /api/v1/inquiries/track retrieves registered booking', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/inquiries/track?referenceNumber=${testReferenceCode}`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.inquiry.referenceNumber === testReferenceCode, `Reference code mismatch`);
      assert(data.inquiry.status === 'NEW', `Expected status NEW`);
    });

    // 8. Admin protection (unauthenticated access denied)
    await runTest('GET /api/v1/admin/dashboard/stats rejects unauthenticated request (401)', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/admin/dashboard/stats`);
      assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
    });

    // 9. Auth login with invalid password
    await runTest('POST /api/v1/auth/login rejects incorrect password', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@mfefwealth.com',
          password: 'WrongPassword123!',
        }),
      });

      assert(res.status === 401, `Expected 401, got ${res.status}`);
    });

    // 10. Auth login with valid credentials
    await runTest('POST /api/v1/auth/login authorizes partner and returns JWT', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@mfefwealth.com',
          password: 'MFEF_Wealth_2026!',
        }),
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.success === true, `Expected success: true`);
      assert(!!data.token, `Expected token string`);
      authToken = data.token;

      // Extract cookie header
      const cookieHeader = res.headers.get('set-cookie');
      if (cookieHeader) {
        authCookie = cookieHeader.split(';')[0];
      }
    });

    // 11. Auth profile verification
    await runTest('GET /api/v1/auth/me returns authenticated partner profile', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Cookie: authCookie,
        },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.user.email === 'admin@mfefwealth.com', `User email mismatch`);
      assert(data.user.role === 'SUPER_ADMIN', `Expected SUPER_ADMIN role`);
    });

    // 12. Dashboard Stats
    await runTest('GET /api/v1/admin/dashboard/stats returns real-time metrics', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${authToken}`, Cookie: authCookie },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.stats.totalInquiries > 0, `Expected positive total inquiries`);
      assert(typeof data.stats.conversionRate === 'string', `Expected conversionRate string`);
    });

    // 13. Inquiries Table & Filter
    await runTest('GET /api/v1/admin/inquiries returns paginated lead records', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/admin/inquiries?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${authToken}`, Cookie: authCookie },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(Array.isArray(data.data), `Expected data array`);
      assert(data.pagination.total > 0, `Expected non-zero total`);
    });

    // 14. Update Lead Status
    await runTest('PATCH /api/v1/admin/inquiries/:id/status updates lead status', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/admin/inquiries/${testInquiryId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          Cookie: authCookie,
        },
        body: JSON.stringify({ status: 'CONTACTED' }),
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.data.status === 'CONTACTED', `Expected updated status CONTACTED`);
    });

    // 15. Add Confidential Advisor Note
    await runTest('POST /api/v1/admin/inquiries/:id/notes logs audit note', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/admin/inquiries/${testInquiryId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          Cookie: authCookie,
        },
        body: JSON.stringify({
          content: 'Completed initial phone triage. Verified accredited status and scheduled video conference.',
        }),
      });

      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.success === true, `Expected success`);
      assert(data.notes.length > 0, `Expected notes list`);
    });

    // 16. CSV Export Stream
    await runTest('GET /api/v1/admin/inquiries/export/csv streams valid CSV dataset', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/admin/inquiries/export/csv`, {
        headers: { Authorization: `Bearer ${authToken}`, Cookie: authCookie },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.headers.get('content-type')?.includes('text/csv') === true, `Expected text/csv`);
      const csvText = await res.text();
      assert(csvText.includes('Reference Number'), `Expected CSV header 'Reference Number'`);
      assert(csvText.includes(testReferenceCode), `Expected newly created reference code in CSV`);
    });

    // 17. Logout
    await runTest('POST /api/v1/auth/logout clears auth session', async () => {
      const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, Cookie: authCookie },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.success === true, `Expected success`);
    });
  } finally {
    // Tear down server and DB connection
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await mongoose.disconnect();
  }

  // Summary Report
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log('\n------------------------------------------------------------');
  console.log(`TEST RESULTS: ${passedCount} Passed, ${failedCount} Failed out of ${results.length} Tests.`);
  console.log('------------------------------------------------------------\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL 17 INTEGRATION & SECURITY TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
};

runAllTests();
