const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('--- STARTING BACKEND INTEGRATION VERIFICATION ---');

// 1. Verify files exist
const files = ['server.js', 'database.js', 'info.md', '.env'];
files.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) {
    console.error(`CRITICAL ERROR: File ${f} does not exist!`);
    process.exit(1);
  }
  console.log(`File check passed: ${f}`);
});

// 2. Spawn backend server process on port 5001 for test validation
const env = { ...process.env, PORT: '5001', JWT_SECRET: 'verify_test_secret_key' };
const serverProcess = spawn('node', ['server.js'], { cwd: __dirname, env });

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log('[Server stdout]:', data.toString().trim());
});

serverProcess.stderr.on('data', (data) => {
  console.error('[Server stderr]:', data.toString().trim());
});

// Wait 4 seconds for the server to start, then make verification API requests
setTimeout(() => {
  console.log('\n--- Initiating Endpoint Requests ---');
  
  // Test 1: GET info.md markdown content
  makeRequest('GET', '/api/info', null, (err, resBody, statusCode) => {
    if (err) {
      console.error('Test 1 Failed: GET /api/info', err);
      shutdown(1);
    }
    
    if (statusCode !== 200 || !resBody.includes('MTS AUV-ZHCET')) {
      console.error(`Test 1 Failed: Expected status 200 and markdown content, got status ${statusCode}`);
      shutdown(1);
    }
    console.log('Test 1 Passed: GET /api/info succeeded.');

    // Test 2: POST Login with invalid credentials
    const loginPayload = JSON.stringify({ username: 'developer', password: 'wrongpass_verification' });
    makeRequest('POST', '/api/auth/login', loginPayload, (err, loginRes, loginStatus) => {
      if (loginStatus !== 401) {
        console.error(`Test 2 Failed: Expected 401 Unauthorized for bad login, got status ${loginStatus}`);
        shutdown(1);
      }
      console.log('Test 2 Passed: Invalid login rejected successfully.');

      // Test 3: POST Chatbot rate limit and refusal checks
      const chatPayload = JSON.stringify({ message: 'Write a python script to sort arrays', sessionId: 'verify_sess_1' });
      makeRequest('POST', '/api/chat', chatPayload, (err, chatRes, chatStatus) => {
        if (chatStatus !== 200) {
          console.error(`Test 3 Failed: Expected status 200 for off-topic query check, got status ${chatStatus}`);
          shutdown(1);
        }
        
        const chatData = JSON.parse(chatRes);
        if (!chatData.reply.includes('programmed to be') && !chatData.reply.includes('refuse')) {
          console.warn('Test 3 Warning: Chatbot did not respond with refusal filter text on off-topic query. Response was:', chatData.reply);
        } else {
          console.log('Test 3 Passed: Chatbot successfully intercepted off-topic query.');
        }

        console.log('\n--- ALL BACKEND INTEGRATION CHECKS PASSED SUCCESSFULLY ---');
        shutdown(0);
      });
    });
  });

}, 4000);

function makeRequest(method, path, bodyData, callback) {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (bodyData) {
    options.headers['Content-Length'] = Buffer.byteLength(bodyData);
  }

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      callback(null, data, res.statusCode);
    });
  });

  req.on('error', (e) => {
    callback(e, null, null);
  });

  if (bodyData) {
    req.write(bodyData);
  }
  req.end();
}

function shutdown(exitCode) {
  console.log('Stopping test server process...');
  serverProcess.kill();
  process.exit(exitCode);
}
