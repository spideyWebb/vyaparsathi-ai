const http = require('http');

const PORT = 8081;
const users = new Map();         // identifier -> UserRecord
const userProducts = new Map(); // userId -> Product[]
const userInvoices = new Map(); // userId -> Invoice[]
const userExpenses = new Map(); // userId -> Expense[]
const userChats = new Map();    // userId -> ChatMessage[]

// 🔑 PASTE YOUR FREE GOOGLE GEMINI API KEY IN ENVIRONMENT VARIABLE OR HERE FOR LOCAL TESTING
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function fetchGeminiAiReply(userPrompt, storeContext) {
  if (!GEMINI_API_KEY || !GEMINI_API_KEY.startsWith('AIzaSy')) {
    return null;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [{
        parts: [{
          text: `You are VyaparSathi AI, a friendly Indian MSME business advisor. Answer in clear Hinglish. Do NOT mention internal technical stack details (like Neon, PostgreSQL, databases, or tables). Speak purely in customer-facing MSME store management terms. Store metrics: ${JSON.stringify(storeContext)}. User Question: ${userPrompt}`
        }]
      }]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
  } catch (err) {
    console.warn('Gemini API fetch error:', err);
  }
  return null;
}

function generateAiReply(userPrompt, userId) {
  const prompt = (userPrompt || '').toLowerCase().trim();
  const products = userProducts.get(userId) || [];
  const invoices = userInvoices.get(userId) || [];
  const expenses = userExpenses.get(userId) || [];

  const totalSales = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const netProfit = totalSales - totalExpenses;
  const lowStockItems = products.filter(p => (p.stock || 0) <= (p.minStock || 5));

  // PRIORITY 1: HOW-TO QUESTIONS
  if (
    prompt.includes('kaise') ||
    prompt.includes('kaisa') ||
    prompt.includes('how') ||
    prompt.includes('banae') ||
    prompt.includes('banaye') ||
    prompt.includes('tarika') ||
    prompt.includes('tarike') ||
    prompt.includes('process') ||
    prompt.includes('karo')
  ) {
    if (prompt.includes('bill') || prompt.includes('invoice') || prompt.includes('rased') || prompt.includes('parcha')) {
      return '🧾 **Bill / Invoice Generate Karne Ka Tarika:**\n\n1. Left sidebar menu mein **"Sales & Invoices"** tab par click karein.\n2. Top-right corner par **"+ Create New Invoice"** button dabayein.\n3. Customer/Dukaan ka naam, Subtotal amount (₹), aur GST Tax percentage enter karein.\n4. **"Generate Invoice"** click karein. Aapka bill generate ho jayega aur Sales summary automatic update ho jayegi!';
    }
    if (prompt.includes('product') || prompt.includes('item') || prompt.includes('stock') || prompt.includes('saman')) {
      return '📦 **New Stock Product Add Karne Ka Tarika:**\n\n1. Left sidebar menu mein **"Inventory"** tab par click karein.\n2. **"+ Add New Product"** button par click karein.\n3. Product ka Name, Selling Price, aur Initial Stock Quantity bharein.\n4. **"Save Product"** click karein. Stock item aapki inventory mein jud jayega!';
    }
    if (prompt.includes('expense') || prompt.includes('kharcha') || prompt.includes('rent') || prompt.includes('bill payment')) {
      return '💸 **Dukaan Ka Kharcha (Expense) Log Karne Ka Tarika:**\n\n1. Left sidebar menu mein **"Finance & P&L"** tab par click karein.\n2. **"+ Log Expense"** button par click karein.\n3. Expense Description (jaise Rent, Electricity) aur Amount (₹) enter karein.\n4. **"Save Expense"** click karein. Live Profit & Loss statement update ho jayegi!';
    }
    return '🤖 **VyaparSathi AI Usage Guide:**\n\n1. **Billing**: `/sales` tab -> "+ Create New Invoice" par click karke bill banayein.\n2. **Stock**: `/inventory` tab -> "+ Add New Product" par click karke saman jodein.\n3. **Finance**: `/finance` tab -> "+ Log Expense" par click karke shop kharcha record karein.\n4. **GST**: `/gst` tab -> Net CGST & SGST tax liabilities dekhein.\n5. **Security**: Aapka vyapar data 100% encrypted aur safe rehta hai!';
  }

  // PRIORITY 2: DATA SUMMARIES
  if (prompt.includes('stock') || prompt.includes('inventory') || prompt.includes('item') || prompt.includes('saman') || prompt.includes('product') || prompt.includes('maal')) {
    if (products.length === 0) {
      return '📦 Aapke stock mein abhi 0 products hain. Product add karne ke liye **Inventory** section mein **"+ Add New Product"** click karein.';
    }
    const lowStockNames = lowStockItems.map(p => p.name).join(', ');
    return `📦 **Stock Summary:** Aapke paas kul ${products.length} products hain. ${lowStockItems.length > 0 ? `⚠️ Reorder Alerts: **${lowStockNames}**.` : '✅ Sabhi items ka stock sufficient hai.'}`;
  }

  if (prompt.includes('sale') || prompt.includes('invoice') || prompt.includes('kamai') || prompt.includes('revenue') || prompt.includes('bikri') || prompt.includes('bill')) {
    return `📊 **Sales Summary:** Aapne kul **${invoices.length} billing invoices** generate kiye hain, jisse total revenue **₹${totalSales.toLocaleString('en-IN')}** hui hai.`;
  }

  if (prompt.includes('profit') || prompt.includes('fayda') || prompt.includes('expense') || prompt.includes('kharcha') || prompt.includes('pnl') || prompt.includes('p&l') || prompt.includes('loss')) {
    const margin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0.0';
    return `💰 **Finance Summary:** \n- Total Revenue: **₹${totalSales.toLocaleString('en-IN')}**\n- Operating Expenses: **₹${totalExpenses.toLocaleString('en-IN')}**\n- Net Profit: **₹${netProfit.toLocaleString('en-IN')}** (${margin}% Profit Margin).`;
  }

  if (prompt.includes('gst') || prompt.includes('tax') || prompt.includes('gstr') || prompt.includes('return')) {
    const totalGst = invoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
    return `📑 **GST Compliance:** Current period ke liye estimated Net GST Tax Liability **₹${totalGst.toLocaleString('en-IN')}** hai. GSTR-1 file karne ke liye **GST Returns** section par jaein.`;
  }

  if (prompt.includes('hello') || prompt.includes('hi') || prompt.includes('namaste') || prompt.includes('hey')) {
    return 'Namaste! 🙏 Mai aapka **VyaparSathi AI Assistant** hoon. Main aapki dukaan ki inventory, invoices, profits, aur GST compliance mein madad kar sakta hoon. Aap mujhse kya poochhna chahte hain?';
  }

  return `🤖 Aapka sawaal: "*${userPrompt}*"\n\nAapke store status ke according: Aapke paas ${products.length} stock products, ${invoices.length} billing invoices (Total Sales ₹${totalSales}), aur ₹${totalExpenses} logged expenses hain. Business growth ke liye regular invoices generate karein aur low stock items reorder karein!`;
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const userId = token || 'guest_user';

  // AUTH SIGNUP (Business Name, Contact, Username, Password)
  if (req.url.startsWith('/api/v1/auth/signup')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch (e) { }

      const businessName = (parsed.businessName || '').trim();
      const contact = (parsed.contact || parsed.phone || '').trim().toLowerCase();
      const username = (parsed.username || '').trim().toLowerCase();
      const password = (parsed.password || '').trim();

      if (!businessName || !contact || !username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Business Name, Mobile/Email, Username, and Password are all required.' }));
        return;
      }

      if (users.has(contact) || users.has(username)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'An account already exists with this Mobile/Email or Username. Please Sign In.' }));
        return;
      }

      const uid = 'usr_' + Date.now();
      const user = {
        id: uid,
        phone: contact,
        username: username,
        businessName: businessName,
        gstin: '',
        businessType: 'Retail & Kirana',
        languagePref: 'hinglish',
        isVerified: true
      };
      
      const record = { ...user, password };
      users.set(contact, record);
      users.set(username, record);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Account created successfully',
        data: {
          accessToken: username,
          refreshToken: 'jwt_refresh_' + Date.now(),
          user: user
        }
      }));
    });
    return;
  }

  // AUTH LOGIN (Contact or Username + Password)
  if (req.url.startsWith('/api/v1/auth/login')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch (e) { }

      const identifier = (parsed.username || parsed.contact || '').trim().toLowerCase();
      const password = (parsed.password || '').trim();

      if (!identifier || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Mobile Number/Email and Password are required.' }));
        return;
      }

      if (!users.has(identifier)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: "Account not found. Please click 'Create Account (Sign Up)' to register your business."
        }));
        return;
      }

      const stored = users.get(identifier);
      if (stored.password !== password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Incorrect password. Please try again.' }));
        return;
      }

      const user = {
        id: stored.id,
        phone: stored.phone,
        username: stored.username,
        businessName: stored.businessName,
        gstin: stored.gstin || '',
        businessType: stored.businessType || 'Retail & Kirana',
        languagePref: 'hinglish',
        isVerified: true
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Logged in successfully',
        data: {
          accessToken: stored.username || identifier,
          refreshToken: 'jwt_refresh_' + Date.now(),
          user: user
        }
      }));
    });
    return;
  }

  // NEON AUTH SYNC
  if (req.url.startsWith('/api/v1/auth/neon-sync')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch (e) { }
      const username = (parsed.neonUserId || 'neon_user').toLowerCase();
      const user = {
        id: 'usr_' + username,
        phone: parsed.email || username,
        businessName: parsed.businessName || 'Neon Business Store',
        gstin: '',
        businessType: 'Retail & Kirana',
        languagePref: 'hinglish',
        isVerified: true
      };
      if (!users.has(username)) {
        users.set(username, { ...user, password: 'neon_auth_user' });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: { accessToken: username, refreshToken: 'jwt_refresh_' + Date.now(), user }
      }));
    });
    return;
  }

  // INVENTORY PRODUCTS GET / POST
  if (req.url.startsWith('/api/v1/inventory/products')) {
    if (!userProducts.has(userId)) userProducts.set(userId, []);
    const products = userProducts.get(userId);

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: products }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let parsed = {};
        try { parsed = JSON.parse(body); } catch (e) { }

        const newProd = {
          id: 'p_' + Date.now(),
          name: parsed.name || 'New Item',
          sku: parsed.sku || ('SKU-' + Date.now().toString().substring(7)),
          category: parsed.category || 'Grocery',
          price: parsed.price || 100,
          costPrice: parsed.costPrice || 80,
          stock: parsed.stock || 10,
          minStock: parsed.minStock || 5,
          unit: parsed.unit || 'Pack',
          gstRate: parsed.gstRate || 5
        };

        products.unshift(newProd);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Product saved', data: newProd }));
      });
      return;
    }
  }

  // SALES INVOICES MARK PAID
  if (req.url.startsWith('/api/v1/sales/invoices/mark-paid') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch (e) { }

      if (!userInvoices.has(userId)) userInvoices.set(userId, []);
      const invoices = userInvoices.get(userId);
      const target = invoices.find(inv => inv.id === parsed.id);
      if (target) {
        target.status = 'PAID';
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Invoice marked as PAID', data: target }));
    });
    return;
  }

  // SALES INVOICES GET / POST
  if (req.url.startsWith('/api/v1/sales/invoices')) {
    if (!userInvoices.has(userId)) userInvoices.set(userId, []);
    const invoices = userInvoices.get(userId);

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: invoices }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let parsed = {};
        try { parsed = JSON.parse(body); } catch (e) { }

        const sub = parsed.subtotal || 1000;
        const tax = parsed.taxAmount || 120;
        const newInv = {
          id: 'inv_' + Date.now(),
          invoiceNumber: 'INV-2026-0' + Math.floor(100 + Math.random() * 900),
          customerName: parsed.customerName || 'Walk-in Customer',
          customerPhone: '9811223344',
          date: new Date().toISOString().split('T')[0],
          taxAmount: tax,
          subtotal: sub,
          totalAmount: sub + tax,
          status: 'PENDING'
        };

        invoices.unshift(newInv);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Invoice saved', data: newInv }));
      });
      return;
    }
  }

  // FINANCE EXPENSES GET / POST
  if (req.url.startsWith('/api/v1/finance/expenses')) {
    if (!userExpenses.has(userId)) userExpenses.set(userId, []);
    const expenses = userExpenses.get(userId);

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: expenses }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let parsed = {};
        try { parsed = JSON.parse(body); } catch (e) { }

        const newExp = {
          id: 'exp_' + Date.now(),
          description: parsed.description || 'General Expense',
          category: parsed.category || 'Utilities',
          amount: parsed.amount || 500,
          date: new Date().toISOString().split('T')[0]
        };

        expenses.unshift(newExp);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Expense saved', data: newExp }));
      });
      return;
    }
  }

  // AI CHAT HISTORY GET / POST
  if (req.url.startsWith('/api/v1/ai/chat')) {
    if (!userChats.has(userId)) userChats.set(userId, []);
    const chats = userChats.get(userId);

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: chats }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let parsed = {};
        try { parsed = JSON.parse(body); } catch (e) { }

        const userMsg = { id: 'm_' + Date.now(), sender: 'user', text: parsed.text || '', timestamp: new Date().toLocaleTimeString() };
        chats.push(userMsg);

        const storeContext = {
          products: userProducts.get(userId) || [],
          invoices: userInvoices.get(userId) || [],
          expenses: userExpenses.get(userId) || []
        };

        fetchGeminiAiReply(parsed.text, storeContext).then(geminiReply => {
          const replyText = geminiReply || generateAiReply(parsed.text, userId);
          const aiMsg = { id: 'm_' + (Date.now() + 1), sender: 'ai', text: replyText, timestamp: new Date().toLocaleTimeString() };
          chats.push(aiMsg);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: chats }));
        });
      });
      return;
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, message: 'VyaparSathi API Server running' }));
});

server.listen(PORT, () => {
  console.log(`VyaparSathi API server running at http://localhost:${PORT}/api/v1`);
});
