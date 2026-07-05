let firestore = null;
let firebaseChecked = false;
let firebaseEnabled = false;

const JWT_SECRET = process.env.JWT_SECRET || "rijip-portfolio-secret-change-in-production";

// Minimal JWT using Web Crypto API (Node 18+)
async function importKey(secret) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function signJWT(payload, expiresInMs = 900000) {
  const key = await importKey(JWT_SECRET);
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: Math.floor((now * 1000 + expiresInMs) / 1000) };
  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const payloadB64 = btoa(JSON.stringify(claims)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const data = `${headerB64}.${payloadB64}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${data}.${sigB64}`;
}

async function verifyJWT(token) {
  try {
    const key = await importKey(JWT_SECRET);
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const encoder = new TextEncoder();
    const data = `${parts[0]}.${parts[1]}`;
    const sigBytes = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
    if (!valid) return null;
    const claims = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch { return null; }
}

function checkFirebase() {
  if (firebaseChecked) return firebaseEnabled;
  try {
    let envValue = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!envValue) { firebaseChecked = true; firebaseEnabled = false; return false; }
    let jsonStr = envValue;
    if (jsonStr.includes('\n') || jsonStr.includes('\r')) {
      let minified = ''; let inQuote = false;
      for (let i = 0; i < jsonStr.length; i++) {
        const char = jsonStr[i];
        if (char === '"' && (i === 0 || jsonStr[i-1] !== '\\')) inQuote = !inQuote;
        if (!inQuote && /[\s\n\r\t]/.test(char)) continue;
        minified += char;
      }
      jsonStr = minified;
    }
    let parsed = JSON.parse(jsonStr);
    if (parsed.project_id) {
      const admin = require('firebase-admin');
      if (!admin.apps || admin.apps.length === 0) {
        admin.initializeApp({ credential: admin.credential.cert(parsed) });
      }
      const { getFirestore: getDb } = require('firebase-admin/firestore');
      firestore = getDb();
      firebaseEnabled = true;
      firebaseChecked = true;
      return true;
    }
  } catch (e) { console.log('Firebase check error:', e.message); }
  firebaseChecked = true;
  firebaseEnabled = false;
  return false;
}

const mockProjects = [
  { id: '1', title: 'Portfolio Website', category: 'Web', description: 'My portfolio', accent: '#ff3d00', published: true, order: 0 },
  { id: '2', title: 'E-Commerce App', category: 'Mobile', description: 'Shopping app', accent: '#00c853', published: true, order: 1 },
  { id: '3', title: 'Dashboard', category: 'Web', description: 'Admin dashboard', accent: '#2962ff', published: true, order: 2 }
];
const mockSkills = [
  { id: '1', name: 'JavaScript', order: 0 },
  { id: '2', name: 'React', order: 1 },
  { id: '3', name: 'Node.js', order: 2 },
  { id: '4', name: 'Python', order: 3 }
];
const mockAdmin = { id: 'mock-admin', email: 'admin@portfolio.com', name: 'Admin', role: 'ADMIN' };
const defaultSocials = [
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@Rizippokharel', icon: 'youtube', order: 0 },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/rizip-pokharel-0a9880298/', icon: 'linkedin', order: 1 },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/rizippokharel/', icon: 'instagram', order: 2 },
  { id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@rizippokharel', icon: 'tiktok', order: 3 }
];

async function getFromDb(collection) {
  try { const db = firestore; if (!db) return null; const snapshot = await db.collection(collection).get(); return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)); }
  catch { return null; }
}
async function addToDb(collection, data) {
  try { const db = firestore; if (!db) return null; const docRef = await db.collection(collection).add(data); return { id: docRef.id, ...data }; }
  catch { return null; }
}
async function updateInDb(collection, id, data) {
  try { const db = firestore; if (!db) return null; await db.collection(collection).doc(id).update(data); return { id, ...data }; }
  catch { return null; }
}
async function deleteFromDb(collection, id) {
  try { const db = firestore; if (!db) return false; await db.collection(collection).doc(id).delete(); return true; }
  catch { return false; }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url?.split('?')[0] || '';
  const useFirebase = checkFirebase();

  // Auth middleware for write operations
  const isWrite = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  const isPublicRead = path.match(/^\/api\/v1\/(projects|skills|socials)$/);
  const isContactForm = path === '/api/contact' && req.method === 'POST';
  const isLogin = path === '/api/v1/auth/login';

  if (isWrite && !isContactForm && !isLogin) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    const token = authHeader.split(' ')[1];
    const claims = await verifyJWT(token);
    if (!claims) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  try {
    if (path === '/api/health' || path === '/health') {
      return res.status(200).json({ status: 'ok', database: useFirebase ? 'firebase' : 'mock', mode: useFirebase ? 'firestore' : 'fallback' });
    }
    if (path === '/' || path === '/api') {
      return res.status(200).json({ name: 'Portfolio API', version: '1.1.0', endpoints: ['/api/v1/auth/login', '/api/v1/projects', '/api/v1/skills'] });
    }

    // AUTH - LOGIN (returns real JWT)
    if (path === '/api/v1/auth/login' && req.method === 'POST') {
      const { email, password } = req.body || {};
      if (useFirebase) {
        const settings = await getFromDb('settings');
        if (settings && settings.length > 0) {
          const adminCreds = settings.find(s => s.id === 'admin-credentials');
          if (adminCreds && email === adminCreds.email && password === adminCreds.password) {
            const accessToken = await signJWT({ sub: adminCreds.id, email: adminCreds.email, role: 'ADMIN' }, 900000);
            const refreshToken = await signJWT({ sub: adminCreds.id, type: 'refresh' }, 604800000);
            return res.status(200).json({ admin: { ...mockAdmin, email: adminCreds.email }, accessToken, refreshToken });
          }
        }
      }
      if (email === 'admin@portfolio.com' && password === 'admin123') {
        const accessToken = await signJWT({ sub: mockAdmin.id, email: mockAdmin.email, role: 'ADMIN' }, 900000);
        const refreshToken = await signJWT({ sub: mockAdmin.id, type: 'refresh' }, 604800000);
        return res.status(200).json({ admin: mockAdmin, accessToken, refreshToken });
      }
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // AUTH - PROFILE (verify token)
    if (path === '/api/v1/auth/profile' && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
      const claims = await verifyJWT(authHeader.split(' ')[1]);
      if (!claims) return res.status(401).json({ error: 'Invalid token' });
      return res.status(200).json({ admin: { id: claims.sub, email: claims.email, name: 'Admin', role: claims.role } });
    }

    // CHANGE PASSWORD
    if (path === '/api/v1/auth/change-password' && req.method === 'POST') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password are required' });
      if (newPassword.length < 12) return res.status(400).json({ error: 'Password must be at least 12 characters' });
      const settings = await getFromDb('settings');
      const adminCreds = settings?.find(s => s.id === 'admin-credentials');
      const storedPassword = adminCreds?.password || 'admin123';
      if (currentPassword !== storedPassword) return res.status(401).json({ error: 'Current password is incorrect' });
      const email = adminCreds?.email || 'admin@portfolio.com';
      try {
        const db = firestore;
        await db.collection('settings').doc('admin-credentials').set({ id: 'admin-credentials', email, password: newPassword }, { merge: true });
      } catch { return res.status(500).json({ error: 'Failed to update password' }); }
      return res.status(200).json({ success: true, message: 'Password changed successfully' });
    }

    // PROJECTS
    if (path === '/api/v1/projects' && req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const published = url.searchParams.get('published');
      if (useFirebase) {
        const projects = published === 'true' ? (await getFromDb('projects'))?.filter(p => p.published) || [] : await getFromDb('projects');
        if (projects) return res.status(200).json({ data: projects || [] });
      }
      const projects = published === 'true' ? mockProjects.filter(p => p.published) : mockProjects;
      return res.status(200).json({ data: projects });
    }
    if (path === '/api/v1/projects' && req.method === 'POST') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const data = req.body || {};
      const project = await addToDb('projects', { title: data.title || 'Untitled', category: data.category || 'Uncategorized', description: data.description || '', accent: data.accent || '#ff3d00', imageUrl: data.imageUrl || null, videoUrl: data.videoUrl || null, published: data.published || false, order: data.order || 0, adminId: mockAdmin.id });
      if (!project) return res.status(503).json({ error: 'Database not available' });
      return res.status(201).json({ data: project });
    }
    if (path.match(/^\/api\/v1\/projects\/[\w-]+$/) && req.method === 'GET') {
      const id = path.split('/').pop();
      if (useFirebase) { try { const db = firestore; const doc = await db.collection('projects').doc(id).get(); if (doc.exists) return res.status(200).json({ data: { id: doc.id, ...doc.data() } }); } catch {} }
      const project = mockProjects.find(p => p.id === id);
      if (!project) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ data: project });
    }
    if (path.match(/^\/api\/v1\/projects\/[\w-]+$/) && req.method === 'PUT') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/').pop(); const data = req.body || {};
      const project = await updateInDb('projects', id, data);
      if (!project) return res.status(503).json({ error: 'Database not available' });
      return res.status(200).json({ data: project });
    }
    if (path.match(/^\/api\/v1\/projects\/[\w-]+$/) && req.method === 'DELETE') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/').pop();
      const success = await deleteFromDb('projects', id);
      if (!success) return res.status(503).json({ error: 'Database not available' });
      return res.status(200).json({ success: true });
    }
    if (path.match(/^\/api\/v1\/projects\/[\w-]+\/publish$/) && req.method === 'PATCH') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/')[4];
      try { const db = firestore; const doc = await db.collection('projects').doc(id).get(); if (!doc.exists) return res.status(404).json({ error: 'Not found' }); const updated = await updateInDb('projects', id, { published: !doc.data().published }); return res.status(200).json({ data: updated }); }
      catch { return res.status(503).json({ error: 'Database not available' }); }
    }
    if (path === '/api/v1/projects/reorder' && req.method === 'POST') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const { projects: reordered } = req.body || {};
      if (Array.isArray(reordered)) { for (const p of reordered) { await updateInDb('projects', p.id, { order: p.order }); } }
      return res.status(200).json({ success: true });
    }

    // SKILLS
    if (path === '/api/v1/skills' && req.method === 'GET') {
      if (useFirebase) { const skills = await getFromDb('skills'); if (skills) return res.status(200).json({ data: skills }); }
      return res.status(200).json({ data: mockSkills });
    }
    if (path === '/api/v1/skills' && req.method === 'POST') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const data = req.body || {};
      const skill = await addToDb('skills', { name: data.name || 'Untitled', order: data.order || 0 });
      if (!skill) return res.status(503).json({ error: 'Database not available' });
      return res.status(201).json({ data: skill });
    }
    if (path.match(/^\/api\/v1\/skills\/[\w-]+$/) && req.method === 'DELETE') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/').pop();
      const success = await deleteFromDb('skills', id);
      if (!success) return res.status(503).json({ error: 'Database not available' });
      return res.status(200).json({ success: true });
    }
    if (path === '/api/v1/skills/reorder' && req.method === 'POST') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const { skills: reordered } = req.body || {};
      if (Array.isArray(reordered)) { for (const s of reordered) { await updateInDb('skills', s.id, { order: s.order }); } }
      return res.status(200).json({ success: true });
    }

    // CONTACT
    if (path === '/api/contact' && req.method === 'POST') {
      const { name, email, message } = req.body || {};
      if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required' });
      if (useFirebase) { await addToDb('messages', { name, email, message, read: false, createdAt: new Date().toISOString() }); }
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: 'Portfolio <onboarding@resend.dev>', to: 'rijippokharel@gmail.com', subject: `New message from ${name}`,
              html: `<div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:sans-serif;background:#0a0a0a;color:#fff"><h1>New Message</h1><p>From: ${name} (${email})</p><p>${message}</p></div>`
            })
          });
        } catch (err) { console.log('Email send failed:', err.message); }
      }
      return res.status(201).json({ success: true, message: 'Message sent!' });
    }

    // MESSAGES
    if (path === '/api/v1/messages' && req.method === 'GET') {
      if (useFirebase) { const messages = await getFromDb('messages'); if (messages) return res.status(200).json({ data: messages }); }
      return res.status(200).json({ data: [] });
    }
    if (path.match(/^\/api\/v1\/messages\/[\w-]+$/) && req.method === 'DELETE') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/').pop();
      const success = await deleteFromDb('messages', id);
      if (!success) return res.status(503).json({ error: 'Database not available' });
      return res.status(200).json({ success: true });
    }

    // SOCIALS
    if (path === '/api/v1/socials' && req.method === 'GET') {
      if (useFirebase) {
        const socials = await getFromDb('socials');
        if (socials && socials.length > 0) return res.status(200).json({ data: socials });
        const db = firestore; const batch = db.batch();
        defaultSocials.forEach(s => { batch.set(db.collection('socials').doc(s.id), { ...s, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); });
        await batch.commit();
        return res.status(200).json({ data: defaultSocials });
      }
      return res.status(200).json({ data: defaultSocials });
    }
    if (path === '/api/v1/socials' && req.method === 'POST') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const data = req.body || {};
      if (!data.name || !data.url) return res.status(400).json({ error: 'Name and URL are required' });
      const id = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const social = await addToDb('socials', { id, name: data.name, url: data.url, icon: data.icon || 'link', order: data.order || 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      if (!social) return res.status(503).json({ error: 'Database not available' });
      return res.status(201).json({ data: social });
    }
    if (path.match(/^\/api\/v1\/socials\/[\w-]+$/) && req.method === 'PUT') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/').pop(); const data = req.body || {};
      data.updatedAt = new Date().toISOString();
      const updated = await updateInDb('socials', id, data);
      if (!updated) return res.status(503).json({ error: 'Database not available' });
      return res.status(200).json({ data: { id, ...data } });
    }
    if (path.match(/^\/api\/v1\/socials\/[\w-]+$/) && req.method === 'DELETE') {
      if (!useFirebase) return res.status(503).json({ error: 'Database not available' });
      const id = path.split('/').pop();
      const success = await deleteFromDb('socials', id);
      if (!success) return res.status(503).json({ error: 'Database not available' });
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
