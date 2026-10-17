const http = require('http');

const BASE_URL = 'http://localhost:5001';

// Helper for making HTTP requests with cookie handling
function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const rawBuffer = Buffer.concat(chunks);
        const setCookieHeader = res.headers['set-cookie'];
        let data = null;
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          try {
            data = JSON.parse(rawBuffer.toString());
          } catch (e) {
            data = rawBuffer.toString();
          }
        } else {
          data = rawBuffer;
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          setCookie: setCookieHeader,
          data,
          rawBuffer,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function parseCookie(setCookieArray) {
  if (!setCookieArray || !setCookieArray.length) return '';
  return setCookieArray.map((c) => c.split(';')[0]).join('; ');
}

async function runE2ETests() {
  console.log('=== VisaPath End-to-End System Verification ===\n');

  // 1. Health check
  console.log('1. Testing Health Endpoint...');
  const healthRes = await request('GET', '/api/health');
  console.log('   Health Status:', healthRes.statusCode, healthRes.data);
  if (healthRes.statusCode !== 200 || !healthRes.data.notice.includes('DEMO')) {
    throw new Error('Health check failed!');
  }

  // 2. Step 1 Registration
  console.log('\n2. Testing Step 1 Registration...');
  const testEmail = `applicant_${Date.now()}@example.com`;
  const regRes = await request('POST', '/api/auth/register', {
    displayName: 'Elena Rostova',
    email: testEmail,
    password: 'Password2026!',
    confirmPassword: 'Password2026!',
  });
  console.log('   Register Status:', regRes.statusCode, regRes.data);
  if (regRes.statusCode !== 201 || !regRes.data.success) {
    throw new Error('Registration failed: ' + JSON.stringify(regRes.data));
  }
  const applicantCookie = parseCookie(regRes.setCookie);
  console.log('   Received HTTP-Only Cookie:', applicantCookie ? 'YES (visapath_token)' : 'NO');

  // 3. Prevent Duplicate Registration
  console.log('\n3. Testing Duplicate Registration Prevention...');
  const dupRes = await request('POST', '/api/auth/register', {
    displayName: 'Elena Duplicate',
    email: testEmail,
    password: 'Password2026!',
    confirmPassword: 'Password2026!',
  });
  console.log('   Duplicate Register Status (expected 409):', dupRes.statusCode, dupRes.data.message);
  if (dupRes.statusCode !== 409) {
    throw new Error('Duplicate email check failed!');
  }

  // 4. Verify /api/auth/me using HTTP-only cookie
  console.log('\n4. Testing /api/auth/me session verification...');
  const meRes = await request('GET', '/api/auth/me', null, { Cookie: applicantCookie });
  console.log('   Current User Status:', meRes.statusCode, meRes.data.user);
  if (meRes.statusCode !== 200 || meRes.data.user.email !== testEmail) {
    throw new Error('Session verification failed!');
  }

  // 5. Submit Application (Step 2)
  console.log('\n5. Testing Application Submission (Step 2)...');
  const appRes = await request('POST', '/api/applications', {
    displayName: 'Elena Rostova',
    nationality: 'New Zealand',
    dateOfBirth: '1995-07-22',
    gender: 'Male',
    passportNumber: 'FA9028144',
    visaType: 'Visitor',
    travelStartDate: '2026-11-20',
    travelEndDate: '2026-12-10',
    entryType: 'Multiple entry',
    conditions: 'Educational demo simulation. Stay limited to 90 days.',
  }, { Cookie: applicantCookie });
  console.log('   Application Create Status:', appRes.statusCode);
  console.log('   Application Reference:', appRes.data.application.applicationRef);
  console.log('   Application Status (enforced Pending):', appRes.data.application.status);
  console.log('   Disclaimer attached:', appRes.data.application.disclaimer);

  if (
    appRes.statusCode !== 201 ||
    !appRes.data.application.applicationRef.startsWith('VP-2026-') ||
    appRes.data.application.status !== 'Pending'
  ) {
    throw new Error('Application creation failed!');
  }

  const applicationId = appRes.data.application._id;

  // 6. Retrieve Application Dashboard Data
  console.log('\n6. Testing /api/applications/my-application retrieval...');
  const myAppRes = await request('GET', '/api/applications/my-application', null, { Cookie: applicantCookie });
  console.log('   My Application Status:', myAppRes.statusCode, myAppRes.data.application.applicationRef);
  if (myAppRes.statusCode !== 200 || myAppRes.data.application._id !== applicationId) {
    throw new Error('Application dashboard retrieval failed!');
  }

  // 7. Verify Ownership Authorization Isolation
  console.log('\n7. Testing Ownership Authorization (User B cannot access User A application)...');
  // Register User B
  const userBEmail = `user_b_${Date.now()}@example.com`;
  const userBRegRes = await request('POST', '/api/auth/register', {
    displayName: 'Unauthorized Intruder',
    email: userBEmail,
    password: 'Password2026!',
    confirmPassword: 'Password2026!',
  });
  const userBCookie = parseCookie(userBRegRes.setCookie);

  // User B attempts to access User A's application by ID
  const forbiddenRes = await request('GET', `/api/applications/${applicationId}`, null, { Cookie: userBCookie });
  console.log('   User B access attempt status (expected 403 Forbidden):', forbiddenRes.statusCode, forbiddenRes.data.message);
  if (forbiddenRes.statusCode !== 403) {
    throw new Error('Ownership authorization check failed! User B was not blocked with 403.');
  }

  // User B attempts to download User A's PDF
  const forbiddenPdfRes = await request('GET', `/api/applications/${applicationId}/pdf`, null, { Cookie: userBCookie });
  console.log('   User B PDF download attempt status (expected 403 Forbidden):', forbiddenPdfRes.statusCode, forbiddenPdfRes.data.message);
  if (forbiddenPdfRes.statusCode !== 403) {
    throw new Error('Ownership authorization for PDF failed!');
  }

  // 8. Download PDF by legitimate owner
  console.log('\n8. Testing PDF Generation & Download for authorized owner...');
  const pdfRes = await request('GET', `/api/applications/${applicationId}/pdf`, null, { Cookie: applicantCookie });
  console.log('   PDF Download Status:', pdfRes.statusCode);
  console.log('   Content-Type:', pdfRes.headers['content-type']);
  console.log('   Content-Disposition:', pdfRes.headers['content-disposition']);
  console.log('   PDF Byte Length:', pdfRes.rawBuffer.length);
  const pdfSignature = pdfRes.rawBuffer.slice(0, 5).toString('ascii');
  console.log('   PDF File Signature Header:', pdfSignature);

  if (
    pdfRes.statusCode !== 200 ||
    pdfRes.headers['content-type'] !== 'application/pdf' ||
    pdfSignature !== '%PDF-' ||
    pdfRes.rawBuffer.length < 1000
  ) {
    throw new Error('PDF Generation verification failed!');
  }

  // 9. Logout
  console.log('\n9. Testing Logout...');
  const logoutRes = await request('POST', '/api/auth/logout', null, { Cookie: applicantCookie });
  console.log('   Logout Status:', logoutRes.statusCode, logoutRes.data.message);
  const clearedCookie = parseCookie(logoutRes.setCookie);
  console.log('   Cleared Cookie Header received:', !!clearedCookie);

  // 10. Login Again (Session Persistence)
  console.log('\n10. Testing Login & Persistence after logout...');
  const loginRes = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: 'Password2026!',
  });
  console.log('   Login Status:', loginRes.statusCode, loginRes.data.user.email);
  const reloginCookie = parseCookie(loginRes.setCookie);

  // Verify application is still available after relogin
  const persRes = await request('GET', '/api/applications/my-application', null, { Cookie: reloginCookie });
  console.log('   Persistent Application Ref after re-login:', persRes.data.application.applicationRef);
  if (persRes.data.application._id !== applicationId) {
    throw new Error('Application persistence failed!');
  }

  console.log('\n=============================================');
  console.log('🎉 ALL 10 END-TO-END VERIFICATION CHECKS PASSED!');
  console.log('=============================================\n');
}

runE2ETests().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
