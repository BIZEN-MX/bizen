const http = require('http');

const data = JSON.stringify({
  symbol: 'AAPL',
  side: 'buy',
  order_type: 'market',
  quantity: 2.5
});

const options = {
  hostname: 'localhost',
  port: 3004,
  path: '/api/simulators/stocks/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
