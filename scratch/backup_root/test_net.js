const net = require('net');

function check(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
      console.log(`Connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    socket.on('error', (err) => {
      console.log(`Failed to connect to ${host}:${port}: ${err.message}`);
      socket.destroy();
      resolve(false);
    });
    socket.on('timeout', () => {
      console.log(`Timeout connecting to ${host}:${port}`);
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function main() {
  await check('127.0.0.1', 5432);
  await check('localhost', 5432);
  await check('::1', 5432);
}

main();
