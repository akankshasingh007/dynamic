const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Password Hashing Utility
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

let db;
let isFallback = false;
const dbFile = path.join(__dirname, 'database.sqlite');
const fallbackFile = path.join(__dirname, 'db_fallback.json');

// We will try importing sqlite3. If it fails due to native compilation issues,
// we fall back to a JSON file backend that implements the exact same async query interface!
try {
  const sqlite3 = require('sqlite3').verbose();
  db = new sqlite3.Database(dbFile);
  console.log('Connected to SQLite database successfully.');
} catch (err) {
  console.warn('Failed to load sqlite3 package. Falling back to local JSON database.', err.message);
  isFallback = true;
  db = new JsonDB(fallbackFile);
}

// Simple JSON Database implementation for seamless fallback
function JsonDB(filepath) {
  this.filepath = filepath;
  this.data = {
    users: [],
    announcements: [],
    events: [],
    projects: [],
    members: [],
    timeline_logs: []
  };

  if (fs.existsSync(filepath)) {
    try {
      this.data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (e) {
      console.error('Error loading fallback JSON DB:', e);
    }
  } else {
    this.save();
  }
}

JsonDB.prototype.save = function() {
  fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), 'utf8');
};

JsonDB.prototype.run = function(sql, params, callback) {
  // Simple router for INSERT/UPDATE/DELETE queries
  const self = this;
  setTimeout(() => {
    try {
      if (sql.includes('INSERT INTO users')) {
        const [username, password, role, status] = params;
        const newId = self.data.users.length + 1;
        self.data.users.push({ id: newId, username, password, role, status });
        self.save();
        if (callback) callback.call({ lastID: newId }, null);
      } else if (sql.includes('UPDATE users SET status')) {
        const [status, id] = params;
        const u = self.data.users.find(x => x.id === Number(id));
        if (u) u.status = status;
        self.save();
        if (callback) callback.call({}, null);
      } else if (sql.includes('INSERT INTO announcements')) {
        const [title, content, date, type, author] = params;
        const newId = self.data.announcements.length + 1;
        self.data.announcements.push({ id: newId, title, content, date, type, author });
        self.save();
        if (callback) callback.call({ lastID: newId }, null);
      } else if (sql.includes('DELETE FROM announcements')) {
        const [id] = params;
        self.data.announcements = self.data.announcements.filter(x => x.id !== Number(id));
        self.save();
        if (callback) callback.call({}, null);
      } else if (sql.includes('INSERT INTO events')) {
        const [title, description, date, location, category] = params;
        const newId = self.data.events.length + 1;
        self.data.events.push({ id: newId, title, description, date, location, category });
        self.save();
        if (callback) callback.call({ lastID: newId }, null);
      } else if (sql.includes('DELETE FROM events')) {
        const [id] = params;
        self.data.events = self.data.events.filter(x => x.id !== Number(id));
        self.save();
        if (callback) callback.call({}, null);
      } else if (sql.includes('INSERT INTO projects')) {
        const [name, description, specs, image, status] = params;
        const newId = self.data.projects.length + 1;
        self.data.projects.push({ id: newId, name, description, specs, image, status });
        self.save();
        if (callback) callback.call({ lastID: newId }, null);
      } else if (sql.includes('DELETE FROM projects')) {
        const [id] = params;
        self.data.projects = self.data.projects.filter(x => x.id !== Number(id));
        self.save();
        if (callback) callback.call({}, null);
      } else if (sql.includes('INSERT INTO members')) {
        const [name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin] = params;
        const newId = self.data.members.length + 1;
        self.data.members.push({ id: newId, name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin });
        self.save();
        if (callback) callback.call({ lastID: newId }, null);
      } else if (sql.includes('DELETE FROM members')) {
        const [id] = params;
        self.data.members = self.data.members.filter(x => x.id !== Number(id));
        self.save();
        if (callback) callback.call({}, null);
      } else if (sql.includes('INSERT INTO timeline_logs')) {
        const [timestamp, username, role, action, details] = params;
        const newId = self.data.timeline_logs.length + 1;
        self.data.timeline_logs.push({ id: newId, timestamp, username, role, action, details });
        self.save();
        if (callback) callback.call({ lastID: newId }, null);
      } else {
        if (callback) callback(new Error('SQL command not fully simulated in fallback JSON DB: ' + sql));
      }
    } catch (e) {
      if (callback) callback(e);
    }
  }, 10);
};

JsonDB.prototype.get = function(sql, params, callback) {
  const self = this;
  setTimeout(() => {
    try {
      if (sql.includes('FROM users WHERE username =')) {
        const username = params[0];
        const user = self.data.users.find(u => u.username === username);
        callback(null, user || null);
      } else if (sql.includes('FROM users WHERE id =')) {
        const id = Number(params[0]);
        const user = self.data.users.find(u => u.id === id);
        callback(null, user || null);
      } else {
        callback(new Error('SQL GET command not fully simulated: ' + sql));
      }
    } catch (e) {
      callback(e);
    }
  }, 10);
};

JsonDB.prototype.all = function(sql, params, callback) {
  const self = this;
  if (typeof params === 'function') {
    callback = params;
    params = [];
  }
  setTimeout(() => {
    try {
      if (sql.includes('FROM users WHERE status =')) {
        const status = params[0] || (sql.includes("'pending'") ? 'pending' : '');
        callback(null, self.data.users.filter(x => x.status === status));
      } else if (sql.includes('FROM users WHERE role =')) {
        const role = params[0];
        const list = self.data.users.filter(x => x.role === role);
        callback(null, list);
      } else if (sql.includes('FROM users')) {
        callback(null, self.data.users);
      } else if (sql.includes('SELECT * FROM announcements')) {
        callback(null, self.data.announcements);
      } else if (sql.includes('SELECT * FROM events')) {
        callback(null, self.data.events);
      } else if (sql.includes('SELECT * FROM projects')) {
        callback(null, self.data.projects);
      } else if (sql.includes('SELECT * FROM members')) {
        callback(null, self.data.members);
      } else if (sql.includes('SELECT * FROM timeline_logs')) {
        // Return reverse chronological order
        const list = [...self.data.timeline_logs].reverse();
        callback(null, list);
      } else {
        callback(new Error('SQL ALL command not fully simulated: ' + sql));
      }
    } catch (e) {
      callback(e);
    }
  }, 10);
};

// Database Initialization Script
function initDatabase() {
  if (isFallback) {
    // Seed JSON Database if empty
    if (db.data.users.length === 0) {
      console.log('Seeding Fallback JSON Database...');
      db.data.users.push({ id: 1, username: 'developer', password: hashPassword('devpass'), role: 'developer', status: 'active' });
      db.data.users.push({ id: 2, username: 'admin', password: hashPassword('adminpass'), role: 'admin', status: 'active' });
      db.data.users.push({ id: 3, username: 'member', password: hashPassword('memberpass'), role: 'member', status: 'active' });
      seedMockData(db);
      db.save();
    }
    return;
  }

  // SQLite execution
  db.serialize(() => {
    // Create Tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      status TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      date TEXT,
      type TEXT,
      author TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      date TEXT,
      location TEXT,
      category TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      specs TEXT,
      image TEXT,
      status TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      designation TEXT,
      image TEXT,
      enrollment_no TEXT,
      faculty_no TEXT,
      course TEXT,
      branch TEXT,
      one_liner TEXT,
      email TEXT,
      linkedin TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS timeline_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      username TEXT,
      role TEXT,
      action TEXT,
      details TEXT
    )`);

    // Seed default credentials
    db.get("SELECT * FROM users WHERE username = 'developer'", [], (err, row) => {
      if (!row) {
        console.log('Seeding SQLite database with default credentials...');
        db.run("INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)", ['developer', hashPassword('devpass'), 'developer', 'active']);
        db.run("INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)", ['admin', hashPassword('adminpass'), 'admin', 'active']);
        db.run("INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)", ['member', hashPassword('memberpass'), 'member', 'active']);
        seedMockData(db);
      }
    });
  });
}

function seedMockData(targetDb) {
  const insertAnn = "INSERT INTO announcements (title, content, date, type, author) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertAnn, ['Recruitment Drive 2026 Opened', 'MTS AUV-ZHCET Club is now recruiting passionate members across software, hardware, electronics, and marketing teams. Apply before the deadline!', '2026-09-10', 'important', 'admin']);
  targetDb.run(insertAnn, ['SAUVC 2026 Singapore Success', 'We are proud to announce that our new vehicle SEA 5.0 completed autonomous navigation tasks at SAUVC and secured an outstanding rank!', '2026-03-24', 'general', 'admin']);

  const insertEvent = "INSERT INTO events (title, description, date, location, category) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertEvent, ['Singapore AUV Challenge (SAUVC 2026)', 'International level underwater robotics challenge for student teams.', '2026-03-20', 'Singapore', 'Competition']);
  targetDb.run(insertEvent, ['AMUROVc Remotely Operated Vehicle Competition', 'National level ROV competition hosted at ZHCET, Aligarh Muslim University.', '2026-11-15', 'AMU Pool, Aligarh', 'Hosting']);
  targetDb.run(insertEvent, ['Autonomous Navigation Workshop', 'A hands-on workshop explaining ROS2, OpenCV, and NVIDIA Jetson implementation.', '2026-08-05', 'ZHCET Seminar Hall', 'Workshop']);

  const insertProject = "INSERT INTO projects (name, description, specs, image, status) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertProject, [
    'SEA 5.0',
    'Our flagship autonomous underwater vehicle featuring advanced dual-hull mechanics, custom power distributor systems, and AI-enabled vision tracking.',
    JSON.stringify({
      hull: 'Double Acrylic Hull, Aluminum Ribs',
      dimensions: '750mm x 450mm x 320mm',
      weight: '14.5 kg',
      sensors: 'DVL, Bar30 Pressure, IMU (9-DOF), Stereoscopic Camera',
      processor: 'NVIDIA Jetson AGX Orin, Teensy 4.1',
      thrusters: '8x BlueRobotics T200 thrusters in vector configuration'
    }),
    'https://images.unsplash.com/photo-1583244964261-2db904db198e?q=80&w=600',
    'active'
  ]);
  targetDb.run(insertProject, [
    'SEA 4.0',
    'Predecessor vehicle designed with carbon fiber reinforcement, standard modular electronics bays, and ROS-based controls.',
    JSON.stringify({
      hull: 'Carbon Fiber and Acrylic Composite',
      dimensions: '700mm x 400mm x 300mm',
      weight: '12.8 kg',
      sensors: 'Ping Sonar, Bar30 Pressure, IMU, Dual USB Cameras',
      processor: 'NVIDIA Jetson Xavier NX, Arduino Due',
      thrusters: '6x BlueRobotics T200 thrusters'
    }),
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600',
    'retired'
  ]);

  const insertMember = "INSERT INTO members (name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  targetDb.run(insertMember, [
    'Tanu Singh',
    'Lead Developer / Coordinator',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    'GH1234',
    '24COB201',
    'B.Tech',
    'Computer Engineering',
    'Building self-navigating submersibles with intelligent control layers.',
    'tanu.singh@zhcet.ac.in',
    'https://linkedin.com/in/tanu-singh-demo'
  ]);
  targetDb.run(insertMember, [
    'Ahmad Khan',
    'Electronics Lead',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
    'GH5678',
    '24ELB104',
    'B.Tech',
    'Electronics Engineering',
    'Designing robust PCB shields and high-current power distribution systems.',
    'ahmad.khan@zhcet.ac.in',
    'https://linkedin.com/in/ahmad-khan-demo'
  ]);

  const insertLog = "INSERT INTO timeline_logs (timestamp, username, role, action, details) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertLog, [new Date().toISOString(), 'system', 'system', 'database_initialization', 'Database seeded with default mock records and user accounts']);
}

// Export database client
module.exports = {
  db,
  isFallback,
  hashPassword,
  init: initDatabase
};
