const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { db, hashPassword, init } = require('./database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'auvzhcet_secret_key_2026_xyz';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize database schema and seed data
init();

app.use(cors());
app.use(express.json());

// Memory store to keep track of chat session message counts (max 5 per session)
const chatSessions = {};

// Helper: Add entry to timeline_logs
function logToTimeline(username, role, action, details, cb) {
  const timestamp = new Date().toISOString();
  const sql = "INSERT INTO timeline_logs (timestamp, username, role, action, details) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [timestamp, username, role, action, details], (err) => {
    if (err) console.error('Error logging to timeline:', err);
    if (cb) cb(err);
  });
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Role Authorization Middleware
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Higher role required.' });
    }
    next();
  };
}

// --- AUTH ROUTE ---

// User Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    if (user.password !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your developer registration is pending approval by an active developer.' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ message: 'This access request was not approved.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
});

// Register Developer (Starts as pending)
app.post('/api/auth/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['member', 'developer'].includes(role)) {
    return res.status(400).json({ message: 'Only member or developer registration is allowed.' });
  }
  const status = (role === 'developer') ? 'pending' : 'active';
  const hashedPassword = hashPassword(password);

  const sql = "INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)";
  db.run(sql, [username, hashedPassword, role, status], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return res.status(500).json({ message: 'Database error during registration' });
    }

    logToTimeline(
      username,
      role,
      'registration',
      `Registered user with role "${role}". Account status is "${status}".`
    );

    res.status(201).json({
      message: (role === 'developer')
        ? 'Developer registered successfully! Awaiting developer approval.'
        : 'User registered successfully!',
      status
    });
  });
});

// --- ABOUT/INFO MARKDOWN ROUTE ---

// Read Info markdown content
app.get('/api/info', (req, res) => {
  const filePath = path.join(__dirname, 'info.md');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Failed to read info markdown' });
    res.json({ content: data });
  });
});

// Write Info markdown content (Admin and Developer only)
app.post('/api/info', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { content } = req.body;
  if (content === undefined) return res.status(400).json({ message: 'Content is required' });

  const filePath = path.join(__dirname, 'info.md');
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) return res.status(500).json({ message: 'Failed to save info markdown' });
    
    logToTimeline(
      req.user.username,
      req.user.role,
      'update_info_markdown',
      'Modified the general About/Info markdown text'
    );
    
    res.json({ message: 'Info markdown updated successfully' });
  });
});

// --- ANNOUNCEMENTS CRUD ---
app.get('/api/announcements', (req, res) => {
  db.all("SELECT * FROM announcements", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.post('/api/announcements', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { title, content, date, type } = req.body;
  const sql = "INSERT INTO announcements (title, content, date, type, author) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [title, content, date || new Date().toISOString().split('T')[0], type || 'general', req.user.username], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'add_announcement', `Added announcement: "${title}"`);
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/api/announcements/:id', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM announcements WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'delete_announcement', `Deleted announcement ID ${id}`);
    res.json({ message: 'Deleted successfully' });
  });
});

// --- EVENTS CRUD ---
app.get('/api/events', (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.post('/api/events', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { title, description, date, location, category } = req.body;
  const sql = "INSERT INTO events (title, description, date, location, category) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [title, description, date, location, category], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'add_event', `Added event: "${title}"`);
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/api/events/:id', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM events WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'delete_event', `Deleted event ID ${id}`);
    res.json({ message: 'Deleted successfully' });
  });
});

// --- PROJECTS CRUD ---
app.get('/api/projects', (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    
    // Parse specs back to JSON object if needed or let client handle
    const processed = rows.map(r => {
      try {
        r.specs = JSON.parse(r.specs);
      } catch (e) {}
      return r;
    });
    res.json(processed);
  });
});

app.post('/api/projects', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { name, description, specs, image, status } = req.body;
  const specsStr = typeof specs === 'string' ? specs : JSON.stringify(specs || {});
  const sql = "INSERT INTO projects (name, description, specs, image, status) VALUES (?, ?, ?, ?, ?)";
  
  db.run(sql, [name, description, specsStr, image, status || 'active'], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'add_project', `Added project: "${name}"`);
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/api/projects/:id', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM projects WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'delete_project', `Deleted project ID ${id}`);
    res.json({ message: 'Deleted successfully' });
  });
});

// --- MEMBERS CRUD ---
app.get('/api/members', (req, res) => {
  db.all("SELECT * FROM members", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.post('/api/members', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin } = req.body;
  const sql = "INSERT INTO members (name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.run(sql, [name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'add_member', `Added club member: "${name}" (Designation: ${designation})`);
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/api/members/:id', authenticateToken, requireRole(['admin', 'developer']), (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM members WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    logToTimeline(req.user.username, req.user.role, 'delete_member', `Deleted member ID ${id}`);
    res.json({ message: 'Deleted successfully' });
  });
});

// --- DEVELOPER ONLY ROUTES ---

// Get all timeline audit logs (Developer only)
app.get('/api/dev/timeline', authenticateToken, requireRole(['developer']), (req, res) => {
  db.all("SELECT * FROM timeline_logs ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Get all pending developer accounts
app.get('/api/dev/pending-users', authenticateToken, requireRole(['developer']), (req, res) => {
  db.all("SELECT id, username, role, status FROM users WHERE status = 'pending'", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Approve developer account
app.post('/api/dev/approve-user', authenticateToken, requireRole(['developer']), (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: 'User ID is required' });

  // Get user details first to log who was approved
  db.get("SELECT username FROM users WHERE id = ?", [id], (err, targetUser) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    db.run("UPDATE users SET status = 'active' WHERE id = ?", [id], function(err) {
      if (err) return res.status(500).json({ message: 'Failed to approve user' });
      
      logToTimeline(
        req.user.username,
        req.user.role,
        'approve_developer',
        `Approved developer registration for user "${targetUser.username}"`
      );

      res.json({ message: `Successfully approved user "${targetUser.username}"` });
    });
  });
});

// Get Database dump (For developer debugger tool)
app.get('/api/dev/database-inspect', authenticateToken, requireRole(['developer']), (req, res) => {
  const tables = ['users', 'announcements', 'events', 'projects', 'members'];
  const dbDump = {};
  
  let completed = 0;
  tables.forEach(table => {
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      completed++;
      if (!err) {
        dbDump[table] = rows;
      }
      if (completed === tables.length) {
        res.json(dbDump);
      }
    });
  });
});

// --- RATE-LIMITED AI CHATBOT (SECUED KEY) ---

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message || !sessionId) {
    return res.status(400).json({ message: 'Message and sessionId are required' });
  }

  // Enforce session message limit (max 5 questions)
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = 0;
  }

  if (chatSessions[sessionId] >= 5) {
    return res.status(429).json({
      message: 'You have reached the maximum limit of 5 AI helper messages for this session.'
    });
  }

  chatSessions[sessionId]++;

  // Refusal filter before invoking the API
  const lowerMsg = message.toLowerCase();
  const allowedKeywords = [
    'auv', 'rov', 'zhcet', 'amu', 'sea 5.0', 'sea 4.0', 'sea 3.0', 'robotics', 'underwater',
    'competitions', 'sauvc', 'robosub', 'mate-rov', 'members', 'announcements', 'projects',
    'hello', 'hi', 'about', 'join', 'contact', 'team', 'member', 'creator', 'event', 'workshop'
  ];

  const hasKeyword = allowedKeywords.some(kw => lowerMsg.includes(kw));

  // If a general off-topic question, reject immediately
  if (!hasKeyword && lowerMsg.length > 5) {
    return res.json({
      reply: "I am programmed to be the MTS AUV-ZHCET Club helper bot. I am restricted to answering questions specifically related to our club, vehicles (like the SEA series), robotics workshops, projects, members, and activities. Please ask me about these topics!",
      remaining: 5 - chatSessions[sessionId]
    });
  }

  // Call Gemini API securely if API Key is configured
  if (!GEMINI_API_KEY) {
    // Return a mock intelligent AUV-ZHCET chatbot response if no key is configured,
    // to preserve functionality during offline development.
    let reply = "Hello! I am the AUV-ZHCET AI assistant. (API key not configured in backend .env, running in offline mock-mode). ";
    if (lowerMsg.includes('sea 5.0') || lowerMsg.includes('latest')) {
      reply += "Our latest vehicle is SEA 5.0. It features a Double Acrylic Hull, weighs 14.5 kg, contains 8 vectored thrusters, and is powered by an NVIDIA Jetson AGX Orin for AI and computer vision tracking!";
    } else if (lowerMsg.includes('join') || lowerMsg.includes('recruitment')) {
      reply += "We hold annual recruitment drives at ZHCET, Aligarh Muslim University. Anyone passionate about mechanical fabrication, electrical PCB design, or autonomous code (ROS2/AI) is welcome to apply!";
    } else if (lowerMsg.includes('member') || lowerMsg.includes('team')) {
      reply += "The team is guided by ZHCET faculty advisors and organized into Software, Electronics, Mechanical, and Marketing branches. You can check the 'Team' section to view active cards.";
    } else {
      reply += "How can I help you with our robotics projects, vehicle designs, or AMUROVc events?";
    }
    return res.json({ reply, remaining: 5 - chatSessions[sessionId] });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `System Prompt: You are the official MTS AUV-ZHCET Club AI Helper. 
You must ONLY answer questions about the MTS AUV-ZHCET Club, its vehicles (SEA 5.0, SEA 4.0, SEA 3.0), ZHCET college, AMU university, robotics, and the club's activities/members.
If the user asks general coding questions, writing code, historical facts unrelated to the club, or general chat, refuse politely by stating that you are only programmed to answer queries related to the AUV club and subsea robotics.
Keep your answers engaging and brief (1-3 paragraphs max).

User Question: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();
    let reply = "I'm sorry, I encountered an issue processing that query.";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      reply = data.candidates[0].content.parts[0].text;
    }

    res.json({
      reply,
      remaining: 5 - chatSessions[sessionId]
    });
  } catch (error) {
    console.error('Error fetching Gemini API:', error);
    res.json({
      reply: "Hi, I am currently having troubles reaching my central AI core (Gemini API Error). Let me know if you want to know about our SEA 5.0 vehicle specs instead!",
      remaining: 5 - chatSessions[sessionId]
    });
  }
});

// Serve frontend build static files in production if needed
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Another instance of this server is likely still running. Stop it before starting a new one.`);
  } else {
    console.error('Server failed to start:', err.message);
  }
  process.exit(1);
});
