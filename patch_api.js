const fs = require('fs');

// Patch script.js
let scriptJs = fs.readFileSync('script.js', 'utf8');
scriptJs = scriptJs.replace(/\/api\//g, 'http://localhost:3000/api/');
fs.writeFileSync('script.js', scriptJs);
console.log('Patched script.js');

// Patch user-dashboard.html
let dashboardHtml = fs.readFileSync('user-dashboard.html', 'utf8');
dashboardHtml = dashboardHtml.replace(/\/api\//g, 'http://localhost:3000/api/');
fs.writeFileSync('user-dashboard.html', dashboardHtml);
console.log('Patched user-dashboard.html');

// Patch admin.html (Just make the API_URL point to localhost directly)
let adminHtml = fs.readFileSync('admin.html', 'utf8');
adminHtml = adminHtml.replace("const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000/api' : '/api';", "const API_URL = 'http://localhost:3000/api';");
fs.writeFileSync('admin.html', adminHtml);
console.log('Patched admin.html');
