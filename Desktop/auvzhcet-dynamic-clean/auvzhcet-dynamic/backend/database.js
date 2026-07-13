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
  // Announcements
  const insertAnn = "INSERT INTO announcements (title, content, date, type, author) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertAnn, ['🏆 SAUVC 2026 Registration Open', 'Singapore Autonomous Underwater Vehicle Challenge 2026 is now accepting team registrations. Deadline: February 15, 2026. Register your team here!', new Date().toISOString().split('T')[0], 'competition', 'auvzhcet']);
  targetDb.run(insertAnn, ['🎉 SEA 6.0 Development Complete', 'Our latest vehicle, SEA 6.0, has successfully completed pool testing with all autonomous navigation tasks passing validation tests.', new Date().toISOString().split('T')[0], 'achievement', 'auvzhcet']);
  targetDb.run(insertAnn, ['📋 Recruitment Drive 2026', 'Join MTS AUV-ZHCET! We are recruiting passionate students for Software, Mechanical, Electronics, and Management teams. No prior experience required!', new Date().toISOString().split('T')[0], 'recruitment', 'auvzhcet']);

  // Events
  const insertEvent = "INSERT INTO events (title, description, date, location, category) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertEvent, ['Singapore AUV Challenge (SAUVC) 2026', 'International level underwater robotics competition featuring autonomous navigation, target recognition, and acoustic challenges.', '2026-06-15', 'Marina Bay, Singapore', 'International']);
  targetDb.run(insertEvent, ['MATE ROV Competition 2026', 'Student robotics competition organized by MATE (Marine Advanced Technology Education).', '2026-07-20', 'Various Locations', 'International']);
  targetDb.run(insertEvent, ['AMUROVc 2026', 'National level ROV competition hosted by AMU. Organized by AUV-ZHCET team.', '2026-09-10', 'AMU Pool, Aligarh', 'National']);
  targetDb.run(insertEvent, ['ROS2 & Autonomous Navigation Workshop', 'Hands-on workshop covering ROS2 basics, sensor fusion, path planning, and autonomous vehicle programming.', '2026-03-20', 'ZHCET, AMU', 'Workshop']);

  // Projects (Vehicles)
  const insertProject = "INSERT INTO projects (name, description, specs, image, status) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertProject, [
    'SEA 6.0',
    'Latest generation flagship with NVIDIA Jetson Orin and advanced 6-DOF control.',
    JSON.stringify({
      'Hull': 'Dual Acrylic Sphere + Aluminum Frame',
      'Weight': '16.2 kg',
      'Depth': '300m',
      'Processor': 'NVIDIA Jetson Orin',
      'Thrusters': '8x T500 (Vectored)'
    }),
    'https://images.unsplash.com/photo-1518611505868-48010b2414f3?q=80&w=400',
    'active'
  ]);
  targetDb.run(insertProject, [
    'SEA 5.0',
    'Competition-tested vehicle with proven track record at SAUVC.',
    JSON.stringify({
      'Hull': 'Double Acrylic Hull',
      'Weight': '14.5 kg',
      'Depth': '100m',
      'Processor': 'Jetson AGX Orin',
      'Thrusters': '8x T200 (Vectored)'
    }),
    'https://images.unsplash.com/photo-1579033356026-641a6834ff68?q=80&w=400',
    'active'
  ]);

  // Members
  const insertMember = "INSERT INTO members (name, designation, image, enrollment_no, faculty_no, course, branch, one_liner, email, linkedin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  targetDb.run(insertMember, [
    'Akanksha Singh',
    'Project Lead & Software Architecture',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    'GH2024101',
    '24COB201',
    'B.Tech',
    'Computer Engineering',
    'Designing autonomous underwater vehicles with AI-powered computer vision.',
    'akanksha.singh@zhcet.ac.in',
    'https://linkedin.com/in/akanksha-singh'
  ]);
  targetDb.run(insertMember, [
    'Tanu Singh',
    'Mechanical Design Lead',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    'GH2024102',
    '24MEB305',
    'B.Tech',
    'Mechanical Engineering',
    'Building robust underwater vehicle structures with hydrodynamic optimization.',
    'tanu.singh@zhcet.ac.in',
    'https://linkedin.com/in/tanu-singh'
  ]);
  targetDb.run(insertMember, [
    'Ahmad Khan',
    'Electronics & Power Systems',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    'GH2024103',
    '24ELB104',
    'B.Tech',
    'Electronics Engineering',
    'Designing custom PCBs and power management systems for autonomous vehicles.',
    'ahmad.khan@zhcet.ac.in',
    'https://linkedin.com/in/ahmad-khan'
  ]);
  targetDb.run(insertMember, [
    'Fatima Ahmed',
    'Vision & AI Systems',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300',
    'GH2024104',
    '24COB202',
    'B.Tech',
    'Computer Engineering',
    'Implementing deep learning models for underwater object detection and tracking.',
    'fatima.ahmed@zhcet.ac.in',
    'https://linkedin.com/in/fatima-ahmed'
  ]);

  // Timeline
  const insertLog = "INSERT INTO timeline_logs (timestamp, username, role, action, details) VALUES (?, ?, ?, ?, ?)";
  targetDb.run(insertLog, [new Date().toISOString(), 'system', 'system', 'database_initialization', 'Database seeded with default mock records, vehicles, team members, and announcements']);
}

// Export database client
module.exports = {
  db,
  isFallback,
  hashPassword,
  init: initDatabase
};
