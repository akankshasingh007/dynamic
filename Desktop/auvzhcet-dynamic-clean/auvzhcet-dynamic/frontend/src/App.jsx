import { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const sea5 = '/WhatsApp%20Image%202026-07-13%20at%2010.38.58%20PM.jpeg';
const sea5Pool = '/WhatsApp%20Image%202026-07-13%20at%2010.38.58%20PM%20(1).jpeg';
const sea5Detail = '/WhatsApp%20Image%202026-07-13%20at%2010.38.58%20PM%20(2).jpeg';

const vehicleData = [
  {
    name: 'SEA 5.0',
    image: sea5,
    tagline: 'Flagship autonomous underwater vehicle',
    specs: {
      'Hull Type': 'Double Acrylic Hull, Aluminum Ribs',
      'Dimensions': '750mm x 450mm x 320mm',
      'Weight': '14.5 kg',
      'Thrusters': '8x BlueRobotics T200 (vectored)',
      'Degrees of Freedom': '6',
      'Depth Rating': '100m',
      'Max Speed': '4 knots',
      'Processor': 'NVIDIA Jetson AGX Orin, Teensy 4.1',
      'Sensors': 'DVL, Bar30 Pressure, IMU (9-DOF), Stereoscopic Camera'
    },
    parts: [
      { name: 'NVIDIA Jetson AGX Orin', tx: '-150px', ty: '-150px' },
      { name: 'Vectored Thrusters', tx: '150px', ty: '-100px' },
      { name: 'Dual-Hull Frame', tx: '-120px', ty: '120px' },
      { name: 'Pressure Sensors', tx: '130px', ty: '140px' },
      { name: 'Battery Pack', tx: '-80px', ty: '-80px' },
      { name: 'Stereo Camera System', tx: '100px', ty: '-50px' }
    ]
  },
  {
    name: 'SEA 4.0',
    image: sea5Detail,
    tagline: 'Modular predecessor platform',
    specs: {
      'Hull Type': 'Carbon Fiber & Acrylic Composite',
      'Dimensions': '700mm x 400mm x 300mm',
      'Weight': '12.8 kg',
      'Thrusters': '6x BlueRobotics T200',
      'Degrees of Freedom': '6',
      'Depth Rating': '50m',
      'Max Speed': '2 knots',
      'Processor': 'NVIDIA Jetson Xavier NX, Arduino Due',
      'Sensors': 'Ping Sonar, Bar30 Pressure, IMU, Dual USB Cameras'
    },
    parts: [
      { name: 'Jetson Xavier NX', tx: '-140px', ty: '-140px' },
      { name: 'Modular Thrusters', tx: '140px', ty: '-100px' },
      { name: 'CF Frame', tx: '-120px', ty: '110px' },
      { name: 'Sonar System', tx: '120px', ty: '130px' },
      { name: 'Main Battery', tx: '-80px', ty: '-80px' }
    ]
  },
  {
    name: 'SEA 3.0',
    image: sea5Pool,
    tagline: 'Stereo-vision research platform',
    specs: {
      'Hull Type': 'Acrylic Sphere',
      'Dimensions': '600mm diameter',
      'Weight': '10 kg',
      'Thrusters': '4x Standard Rotary',
      'Degrees of Freedom': '4',
      'Depth Rating': '50m',
      'Max Speed': '1.5 knots',
      'Processor': 'Arduino Mega, Raspberry Pi',
      'Sensors': 'Dual USB Cameras, Basic IMU'
    },
    parts: [
      { name: 'Raspberry Pi', tx: '-130px', ty: '-130px' },
      { name: 'Rotary Thrusters', tx: '130px', ty: '-90px' },
      { name: 'Spherical Hull', tx: '-110px', ty: '100px' },
      { name: 'Camera Pair', tx: '110px', ty: '120px' }
    ]
  }
];

function authHeaders(token) {
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

function Section({ id, title, eyebrow, children }) {
  return (
    <section id={id} className="section reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [menu, setMenu] = useState(false);
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '');
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('user') || 'null'));

  const navigate = (next) => {
    setPage(next);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (t, u) => {
    sessionStorage.setItem('token', t);
    sessionStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    navigate('home');
  };

  const logout = () => {
    sessionStorage.clear();
    setToken('');
    setUser(null);
    navigate('home');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('shown');
          }
        }),
      { threshold: 0.08 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [page]);

  const links = [
    ['home', 'Home'],
    ['about', 'About'],
    ['projects', 'Vehicles'],
    ['team', 'Team'],
    ['events', 'Events']
  ];

  return (
    <>
      <header>
        <button className="brand" onClick={() => navigate('home')}>
          <span>◉</span> MTS AUV-ZHCET
        </button>
        <nav className={menu ? 'open' : ''}>
          {links.map(([id, label]) => (
            <button
              key={id}
              className={page === id ? 'active' : ''}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="menu-btn" onClick={() => setMenu(!menu)}>
          ☰
        </button>
        {user && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>{user.username}</span>
            {(user.role === 'admin' || user.role === 'developer') && (
              <button className="btn btn-secondary" onClick={() => navigate(user.role === 'developer' ? 'dev' : 'admin')}>
                {user.role === 'developer' ? 'Dev Console' : 'Admin'}
              </button>
            )}
            {user.role === 'member' && (
              <button className="btn btn-secondary" onClick={() => navigate('member')}>
                Member
              </button>
            )}
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        )}
        {!user && (
          <button className="btn btn-primary" onClick={() => navigate('login')}>
            Login
          </button>
        )}
      </header>

      <main>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'about' && <About />}
        {page === 'projects' && <Projects />}
        {page === 'team' && <Team />}
        {page === 'events' && <Events />}
        {page === 'login' && <Login login={login} />}
        {page === 'member' && <Member token={token} user={user} />}
        {page === 'admin' && <Admin token={token} user={user} />}
        {page === 'dev' && <Dev token={token} user={user} />}
      </main>

      <Bot />
    </>
  );
}

function Home({ navigate }) {
  const heroRef = useRef();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch(`${API}/announcements`)
      .then((r) => r.json())
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 15;
      const rotateY = ((x - centerX) / centerX) * 15;

      const img = heroRef.current.querySelector('.hero-image');
      if (img) {
        img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      const spotlight = heroRef.current.querySelector('.hero-spotlight');
      if (spotlight) {
        spotlight.style.left = `${x - 100}px`;
        spotlight.style.top = `${y - 100}px`;
      }
    };

    const container = heroRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Autonomous Underwater Innovation</h1>
            <p>Pushing the boundaries of underwater robotics and AI at ZHCET, AMU.</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('projects')}>
                Explore Vehicles →
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('about')}>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-image-container" ref={heroRef}>
            <img src={sea5} alt="SEA 5.0" className="hero-image" />
            <div className="hero-spotlight"></div>
          </div>
        </div>
      </section>

      <Section title="Latest Updates" eyebrow="Announcements">
        <div className="announcements-grid">
          {announcements.map((ann) => (
            <div key={ann.id} className="announcement-card">
              <div className="type">{ann.type}</div>
              <h3>{ann.title}</h3>
              <p>{ann.content}</p>
              <div className="date">{new Date(ann.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function About() {
  const [md, setMd] = useState('');

  useEffect(() => {
    fetch(`${API}/info`)
      .then((r) => r.json())
      .then((x) => setMd(x.content))
      .catch(() =>
        setMd(
          '# MTS AUV-ZHCET\nWe build autonomous and remotely operated underwater vehicles for international competitions like SAUVC and Robosub.'
        )
      );
  }, []);

  return (
    <Section title="About Us" eyebrow="Information">
      <div style={{ lineHeight: '1.8', color: 'var(--text)' }}>
        {md.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h2 key={i}>{line.slice(2)}</h2>;
          if (line.startsWith('## ')) return <h3 key={i}>{line.slice(3)}</h3>;
          if (line.trim()) return <p key={i}>{line}</p>;
          return null;
        })}
      </div>
    </Section>
  );
}

function Projects() {
  const [selected, setSelected] = useState(0);
  const [inside, setInside] = useState(false);
  const [drag, setDrag] = useState(0);
  const dragStart = useRef(0);

  const v = vehicleData[selected];

  const handleMouseDown = (e) => {
    dragStart.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (dragStart.current === 0) return;
    const delta = e.clientX - dragStart.current;
    setDrag(delta / 100);
  };

  const handleMouseUp = () => {
    dragStart.current = 0;
  };

  return (
    <Section title="Vehicle Explorer" eyebrow="Projects">
      <div className="projects-container">
        <div className="vehicle-selector">
          {vehicleData.map((vehicle, idx) => (
            <button
              key={idx}
              className={`vehicle-thumbnail ${selected === idx ? 'active' : ''}`}
              onClick={() => {
                setSelected(idx);
                setInside(false);
              }}
            >
              {vehicle.name}
            </button>
          ))}
        </div>

        <div className="vehicle-display">
          <button
            className="explode-btn"
            onClick={() => setInside(!inside)}
          >
            {inside ? '← Collapse' : '🔍 Exploded View'}
          </button>

          {!inside ? (
            <img
              src={v.image}
              alt={v.name}
              className="vehicle-image"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `perspective(1000px) rotateY(${drag * 10}deg)`,
                cursor: dragStart.current ? 'grabbing' : 'grab'
              }}
            />
          ) : (
            <div className="exploded-parts">
              {v.parts.map((part, idx) => (
                <div
                  key={idx}
                  className="part exploded"
                  style={{
                    '--tx': part.tx,
                    '--ty': part.ty,
                    top: '50%',
                    left: '50%',
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  📌 {part.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="specs-panel">
          <h3>{v.name}</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>{v.tagline}</p>
          {Object.entries(v.specs).map(([key, val]) => (
            <div key={key} className="spec-item">
              <span className="spec-label">{key}</span>
              <span className="spec-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Team() {
  const [members, setMembers] = useState([]);
  const [flipped, setFlipped] = useState({});

  useEffect(() => {
    fetch(`${API}/members`)
      .then((r) => r.json())
      .then(setMembers)
      .catch(() => {});
  }, []);

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Section title="Meet the Team" eyebrow="Team">
      <div className="team-grid">
        {members.map((member) => (
          <div
            key={member.id}
            className="team-card-wrapper"
            onClick={() => toggleFlip(member.id)}
          >
            <div className={`team-card ${flipped[member.id] ? 'flipped' : ''}`}>
              <div className="team-face front">
                <img src={member.image} alt={member.name} className="team-image" />
                <h3 className="team-name">{member.name}</h3>
                <p className="team-designation">{member.designation}</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Click to flip →</p>
              </div>
              <div className="team-face back">
                <div style={{ width: '100%' }}>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-info">
                    <strong>{member.course}</strong> • {member.branch}
                  </p>
                  <p className="team-info">
                    <strong>Enrollment:</strong> {member.enrollment_no}
                  </p>
                  <p className="team-info">
                    <strong>Faculty:</strong> {member.faculty_no}
                  </p>
                  <p className="team-info" style={{ fontStyle: 'italic' }}>
                    "{member.one_liner}"
                  </p>
                  <div className="team-contact">
                    {member.email && (
                      <a href={`mailto:${member.email}`} title="Email">
                        ✉️
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        🔗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API}/events`)
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <Section title="Where We Surface" eyebrow="Events">
      <div className="timeline">
        {events.map((event, idx) => (
          <div key={event.id} className="timeline-item">
            <div className="event">
              <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                📍 {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Member({ token, user }) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch(`${API}/announcements`)
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => {});
  }, []);

  if (!user || !['member', 'admin', 'developer'].includes(user.role)) {
    return (
      <Section title="Access Denied" eyebrow="Member Portal">
        <p>You must be logged in as a member to access this section.</p>
      </Section>
    );
  }

  return (
    <Section title="Member Portal" eyebrow="Internal">
      <div className="member-container">
        <h3>Internal Documents & Announcements</h3>
        <div className="documents">
          {docs.map((doc) => (
            <div key={doc.id} className="doc-card">
              <h4>{doc.title}</h4>
              <p>{doc.content}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>By {doc.author}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Login({ login }) {
  const [register, setRegister] = useState(false);
  const [data, setData] = useState({ username: '', password: '', role: 'member' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const endpoint = register ? '/api/auth/register' : '/api/auth/login';
    const payload = register
      ? data
      : { username: data.username, password: data.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        if (register) {
          setMessage(`✅ ${result.message}`);
          setData({ username: '', password: '', role: 'member' });
          setRegister(false);
        } else {
          login(result.token, result.user);
        }
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <Section title={register ? 'Register' : 'Login'} eyebrow="Authentication">
      <div className="form-container">
        {message && (
          <div className={`message ${message.startsWith('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          {register && (
            <div className="form-group">
              <label>Role</label>
              <select
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              >
                <option value="member">Member</option>
                <option value="developer">Developer (Pending Approval)</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {register ? 'Register' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {register ? 'Already have an account? ' : 'New user? '}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => {
              setRegister(!register);
              setMessage('');
            }}
          >
            {register ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </Section>
  );
}

function Admin({ token, user }) {
  const [tab, setTab] = useState('announcements');
  const [info, setInfo] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/info`).then((r) => r.json()).then((x) => setInfo(x.content));
    fetch(`${API}/announcements`).then((r) => r.json()).then(setAnnouncements);
    fetch(`${API}/events`).then((r) => r.json()).then(setEvents);
    fetch(`${API}/projects`).then((r) => r.json()).then(setProjects);
    fetch(`${API}/members`).then((r) => r.json()).then(setMembers);
  }, [token]);

  if (!user || !['admin', 'developer'].includes(user.role)) {
    return <Section title="Access Denied" eyebrow="Admin"><p>Only admins and developers can access this.</p></Section>;
  }

  const handleSaveInfo = async () => {
    try {
      const res = await fetch(`${API}/info`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ content: info })
      });
      const result = await res.json();
      setMessage(res.ok ? '✅ Info updated!' : `❌ ${result.message}`);
    } catch (e) {
      setMessage(`❌ Error: ${e.message}`);
    }
  };

  return (
    <Section title="Admin Console" eyebrow="Management">
      <div className="admin-tabs">
        {['announcements', 'events', 'projects', 'members', 'info'].map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {message && (
        <div className={`message ${message.startsWith('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {tab === 'info' && (
        <div>
          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Edit About/Info Markdown here..."
            style={{ width: '100%', height: '400px' }}
          />
          <button className="btn btn-primary" onClick={handleSaveInfo} style={{ marginTop: '1rem' }}>
            Save Info
          </button>
        </div>
      )}

      {tab === 'announcements' && (
        <div>
          <h3>Current Announcements</h3>
          <div className="admin-grid">
            {announcements.map((a) => (
              <div key={a.id} className="admin-card">
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.content.substring(0, 100)}...</p>
                </div>
                <div className="admin-actions">
                  <button className="btn btn-small btn-primary">Edit</button>
                  <button className="btn btn-small" style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function Dev({ token, user }) {
  const [pending, setPending] = useState([]);
  const [logs, setLogs] = useState([]);
  const [db, setDb] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('timeline');

  const load = () => {
    if (!token) return;

    fetch(`${API}/dev/pending-users`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then(setPending);

    fetch(`${API}/dev/timeline`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then(setLogs);

    fetch(`${API}/dev/database-inspect`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then(setDb);
  };

  useEffect(() => {
    load();
  }, [token]);

  if (!user || user.role !== 'developer') {
    return <Section title="Access Denied" eyebrow="Developer"><p>Only developers can access this console.</p></Section>;
  }

  const approve = async (id) => {
    try {
      const res = await fetch(`${API}/dev/approve-user`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (res.ok) {
        load();
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const filteredLogs = logs.filter((l) =>
    search === '' || Object.values(l).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Section title="Developer Console" eyebrow="Dev Tools">
      <div className="admin-tabs">
        {['timeline', 'access', 'database'].map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'timeline' && 'Timeline History'}
            {t === 'access' && 'Access Manager'}
            {t === 'database' && 'Database Monitor'}
          </button>
        ))}
      </div>

      {tab === 'timeline' && (
        <div>
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px' }}
          />
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredLogs.map((log) => (
              <div key={log.id} className="admin-card" style={{ marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{log.action}</h4>
                  <p style={{ marginBottom: '0.25rem' }}>{log.details}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {log.username} ({log.role}) • {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'access' && (
        <div>
          <h3>Pending Developer Approvals</h3>
          {pending.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <div className="admin-grid">
              {pending.map((p) => (
                <div key={p.id} className="admin-card">
                  <div>
                    <h4>{p.username}</h4>
                    <p>Role: {p.role}</p>
                    <p>Status: {p.status}</p>
                  </div>
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => approve(p.id)}
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'database' && db && (
        <div>
          <h3>Database Dump</h3>
          <pre
            style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              maxHeight: '500px',
              fontSize: '0.85rem'
            }}
          >
            {JSON.stringify(db, null, 2)}
          </pre>
        </div>
      )}
    </Section>
  );
}

function Bot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const sessionId = useMemo(() => `session-${Date.now()}`, []);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setItems((prev) => [...prev, { role: 'user', text: userMsg }]);

    try {
      const res = await fetch(`http://localhost:5000/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId })
      });
      const data = await res.json();
      setItems((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (e) {
      setItems((prev) => [...prev, { role: 'bot', text: '❌ Error connecting to AI.' }]);
    }
  };

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AUV Helper Bot</h3>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {items.map((item, i) => (
              <div key={i} className={`message-item ${item.role}`}>
                {item.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <form style={{ display: 'flex', gap: '0.5rem', width: '100%' }} onSubmit={send}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about AUV..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
      <button className="chatbot-trigger" onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}
