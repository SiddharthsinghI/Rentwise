
const API_BASE = 'http://localhost:5000/api';

async function run() {
  console.log('--- Testing RentWise Real Backend Authentication ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      failed++;
    }
  };

  // 1. Unauthenticated access to protected endpoint (/api/bookings)
  try {
    const unauthRes = await fetch(`${API_BASE}/bookings`);
    assert(unauthRes.status === 401, 'Unauthenticated access to /api/bookings returns 401 Unauthorized');
  } catch (e) {
    assert(false, `Unauthenticated request failed: ${e.message}`);
  }

  // 2. Invalid credentials login
  try {
    const badLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.customer@example.com', password: 'WrongPassword!' })
    });
    const badData = await badLoginRes.json();
    assert(badLoginRes.status === 401 && badData.success === false, 'Invalid credentials return 401 Unauthorized with error message');
  } catch (e) {
    assert(false, `Bad login test failed: ${e.message}`);
  }

  // 3. Customer login (Alex Rivera)
  let customerToken = null;
  let customerUser = null;
  try {
    const custRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.customer@example.com', password: 'Password123!' })
    });
    const data = await custRes.json();
    assert(custRes.status === 200 && data.success && data.data?.token, 'Customer login succeeds with JWT');
    customerToken = data.data?.token;
    customerUser = data.data?.user;
    assert(customerUser?.role === 'customer' && customerUser?.name === 'Alex Rivera', 'Customer user object has correct name and role');
  } catch (e) {
    assert(false, `Customer login failed: ${e.message}`);
  }

  // 4. Session restoration via GET /api/auth/me (Customer)
  try {
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data?.email === 'alex.customer@example.com', 'GET /api/auth/me restores valid session for customer');
  } catch (e) {
    assert(false, `Session restoration failed: ${e.message}`);
  }

  // 5. Vendor login (Marcus Vance)
  let vendorToken = null;
  let vendorUser = null;
  try {
    const vendRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'marcus.vendor@example.com', password: 'Password123!' })
    });
    const data = await vendRes.json();
    assert(vendRes.status === 200 && data.success && data.data?.token, 'Vendor login succeeds with JWT');
    vendorToken = data.data?.token;
    vendorUser = data.data?.user;
    assert(vendorUser?.role === 'vendor' && vendorUser?.name === 'Marcus Vance', 'Vendor user object has correct name and role');
  } catch (e) {
    assert(false, `Vendor login failed: ${e.message}`);
  }

  // 6. Session restoration via GET /api/auth/me (Vendor)
  try {
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${vendorToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data?.email === 'marcus.vendor@example.com', 'GET /api/auth/me restores valid session for vendor');
  } catch (e) {
    assert(false, `Vendor session restoration failed: ${e.message}`);
  }

  // 7. Role enforcement: Vendor cannot book products (403 Forbidden)
  try {
    const bookRes = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendorToken}`
      },
      body: JSON.stringify({
        productId: 'prod-1',
        startDate: '2026-11-01',
        endDate: '2026-11-05'
      })
    });
    assert(bookRes.status === 403, 'Vendor booking attempt is rejected with 403 Forbidden by backend authorization');
  } catch (e) {
    assert(false, `Vendor booking test failed: ${e.message}`);
  }

  // 8. Logout endpoint
  try {
    const logoutRes = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      }
    });
    assert(logoutRes.status === 200, 'POST /api/auth/logout succeeds');
  } catch (e) {
    assert(false, `Logout endpoint failed: ${e.message}`);
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

run();
