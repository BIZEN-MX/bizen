const { GET } = require('./src/app/api/dashboard-init/route');
const { NextRequest } = require('next/server');

async function test() {
  const req = new NextRequest('http://localhost:3004/api/dashboard-init', {
    headers: { host: 'localhost:3004' }
  });
  try {
    const res = await GET(req);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Crash:', e);
  }
}

test();
