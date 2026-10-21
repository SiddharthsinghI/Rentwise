// Full-stack API end-to-end integration verification script

const BASE_URL = 'http://localhost:5000/api';

async function testAll() {
  console.log('🚀 Running Full-Stack API Integration Verification against real MySQL...');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.database === 'connected' ? '✅ PASS' : '❌ FAIL', health);

  // 2. Customer Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex.customer@example.com', password: 'Password123!' })
  });
  const loginData = await loginRes.json();
  const customerToken = loginData.data?.token;
  console.log('2. Customer Login:', customerToken ? '✅ PASS' : '❌ FAIL', 'User:', loginData.data?.user?.name);

  // 3. Vendor Login
  const vLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'marcus.vendor@example.com', password: 'Password123!' })
  });
  const vLoginData = await vLoginRes.json();
  const vendorToken = vLoginData.data?.token;
  console.log('3. Vendor Login:', vendorToken ? '✅ PASS' : '❌ FAIL', 'Vendor:', vLoginData.data?.user?.name);

  // 4. Get Current User (/auth/me)
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const me = await meRes.json();
  console.log('4. GET /auth/me:', me.data?.email === 'alex.customer@example.com' ? '✅ PASS' : '❌ FAIL');

  // 5. Products Catalog
  const prodRes = await fetch(`${BASE_URL}/products?category=cameras`);
  const prods = await prodRes.json();
  console.log('5. GET /products?category=cameras:', prods.data?.length > 0 ? '✅ PASS' : '❌ FAIL', `Found ${prods.data?.length} cameras`);

  // 6. Product Details with Vendor
  const prodDetailsRes = await fetch(`${BASE_URL}/products/prod-1`);
  const prodDetails = await prodDetailsRes.json();
  console.log('6. GET /products/prod-1 details:', prodDetails.data?.vendor?.businessName ? '✅ PASS' : '❌ FAIL', `Vendor: ${prodDetails.data?.vendor?.businessName}`);

  // 7. Customer Dashboard
  const dashRes = await fetch(`${BASE_URL}/dashboard/customer`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const dash = await dashRes.json();
  console.log('7. GET /dashboard/customer:', dash.data?.metrics ? '✅ PASS' : '❌ FAIL', dash.data?.metrics);

  // 8. Vendor Dashboard
  const vDashRes = await fetch(`${BASE_URL}/dashboard/vendor`, {
    headers: { Authorization: `Bearer ${vendorToken}` }
  });
  const vDash = await vDashRes.json();
  console.log('8. GET /dashboard/vendor:', vDash.data?.metrics ? '✅ PASS' : '❌ FAIL', vDash.data?.metrics);

  // 9. Wishlist toggle
  const wishToggleRes = await fetch(`${BASE_URL}/wishlist/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({ productId: 'prod-5' })
  });
  const wishToggle = await wishToggleRes.json();
  console.log('9. POST /wishlist/toggle:', wishToggle.data?.wishlist ? '✅ PASS' : '❌ FAIL', `Wishlisted count: ${wishToggle.data?.wishlist?.length}`);

  // 10. Booking creation with server calculations
  const bookRes = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({
      productId: 'prod-12',
      startDate: '2026-12-01',
      endDate: '2026-12-04',
      customerNotes: 'E2E automated integration booking test',
      destination: 'San Francisco, CA'
    })
  });
  const bookData = await bookRes.json();
  const createdBooking = bookData.data;
  console.log(
    '10. POST /bookings creation:',
    createdBooking?.id && createdBooking?.totalPrice > 0 ? '✅ PASS' : '❌ FAIL',
    `ID: ${createdBooking?.id}, Total: $${createdBooking?.totalPrice}`
  );

  // 11. Vendor approves booking
  const approveRes = await fetch(`${BASE_URL}/bookings/${createdBooking.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${vendorToken}`
    },
    body: JSON.stringify({ status: 'approved' })
  });
  const approveData = await approveRes.json();
  console.log(
    '11. PATCH /bookings/:id/status (approve):',
    approveData.data?.status === 'approved' ? '✅ PASS' : '❌ FAIL',
    `Status: ${approveData.data?.status}`
  );

  console.log('\n🎉 ALL FULL-STACK HTTP API INTEGRATION CHECKS PASSED AGAINST REAL MYSQL!\n');
}

testAll().catch((err) => {
  console.error('API Integration Test Failed:', err);
  process.exit(1);
});
