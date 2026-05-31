const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DB_FILE = path.join(__dirname, 'data', 'emails.json');

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '[]');
}

function readEmails() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveEmail(email) {
  const emails = readEmails();
  if (emails.some(e => e.email === email)) {
    return { ok: false, error: 'already_exists' };
  }
  emails.push({ email, date: new Date().toISOString() });
  fs.writeFileSync(DB_FILE, JSON.stringify(emails, null, 2));
  return { ok: true, count: emails.length };
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST' && req.url === '/subscribe') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          res.writeHead(400);
          return res.end(JSON.stringify({ ok: false, error: 'invalid_email' }));
        }
        const result = saveEmail(email.toLowerCase().trim());
        res.writeHead(result.ok ? 200 : 409);
        res.end(JSON.stringify(result));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, error: 'bad_json' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/emails') {
    const emails = readEmails();
    res.writeHead(200);
    return res.end(JSON.stringify({ count: emails.length, emails }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Subscribe API running on http://127.0.0.1:${PORT}`);
});
