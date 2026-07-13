import { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import TextPressure from './TextPressure';
import DecryptedText from './DecryptedText';
import RotatingText from './RotatingText';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const vehicleData = [
  {
    id: 1,
    name: 'SEA 6.0',
    year: 2026,
    status: 'active',
    tagline: 'Next-gen flagship with advanced autonomous capabilities',
    description: 'Our latest development featuring cutting-edge technology for international competitions',
    image: 'https://images.unsplash.com/photo-1518611505868-48010b2414f3?q=80&w=800',
    specs: {
      'Hull Configuration': 'Dual Acrylic Sphere + Aluminum Frame',
      'Dimensions': '800mm x 500mm x 350mm',
      'Dry Weight': '16.2 kg',
      'Buoyancy': 'Neutrally buoyant in saltwater',
      'Depth Rating': '300m',
      'Max Speed': '5 knots',
      'Endurance': '6+ hours',
      'Processor': 'NVIDIA Jetson Orin + STM32H7 Real-time Controller',
      'Memory': '256GB NVMe + 16GB LPDDR5',
      'Thrusters': '8x BlueRobotics T500 (Vectored Configuration)',
      'Degrees of Freedom': '6-DOF (Full Omnidirectional)',
      'Primary Sensors': 'Stereo Pair (USB3 Vision), DVL, Bar30 Pressure, 9-DOF IMU',
      'Secondary Sensors': 'BlueRobotics Ping360 Scanning Sonar, Hydrophone Array',
      'Power System': 'Custom LiPo 18650 Pack (48V, 20Ah), Smart BMS',
      'Tether': 'Optional Fiber-optic hybrid (10km rated)',
      'Special Features': 'AI-powered visual SLAM, Real-time streaming, Modular payload bay'
    },
    achievements: [
      'SAUVC 2026: Qualified for autonomous navigation tasks',
      'First vehicle with on-board AI inference at 30fps',
      'Custom power distribution achieving 98% efficiency'
    ],
    parts: [
      { name: 'NVIDIA Jetson Orin', icon: '🧠', tx: '-180px', ty: '-180px' },
      { name: 'Stereo Vision System', icon: '👁️', tx: '180px', ty: '-150px' },
      { name: 'DVL & Sonar', icon: '📡', tx: '-150px', ty: '170px' },
      { name: '8x T500 Thrusters', icon: '⚡', tx: '160px', ty: '150px' },
      { name: 'Smart Battery Pack', icon: '🔋', tx: '-100px', ty: '-100px' },
      { name: 'IMU & Pressure Sensor', icon: '📊', tx: '140px', ty: '-50px' }
    ]
  },
  {
    id: 2,
    name: 'SEA 5.0',
    year: 2024,
    status: 'active',
    tagline: 'Proven performer in SAUVC & international competitions',
    description: 'Our competition-tested flagship with advanced dual-hull architecture',
    image: 'https://images.unsplash.com/photo-1579033356026-641a6834ff68?q=80&w=800',
    specs: {
      'Hull Configuration': 'Double Acrylic Hull + Aluminum Ribs',
      'Dimensions': '750mm x 450mm x 320mm',
      'Dry Weight': '14.5 kg',
      'Buoyancy': 'Neutrally buoyant',
      'Depth Rating': '100m',
      'Max Speed': '4 knots',
      'Endurance': '4 hours',
      'Processor': 'NVIDIA Jetson AGX Orin + Teensy 4.1',
      'Thrusters': '8x BlueRobotics T200 (Vectored)',
      'Degrees of Freedom': '6-DOF',
      'Primary Sensors': 'Stereo USB Camera, DVL, Bar30 Pressure, 9-DOF IMU',
      'Secondary Sensors': 'Ping Scanning Sonar, Analog Hydrophone',
      'Power System': 'LiPo Battery 18650 (48V, 18Ah)',
      'Unique Feature': 'Vectored thruster configuration for superior maneuverability'
    },
    achievements: [
      'SAUVC 2024: Top-ranked Indian entry',
      'Autonomous navigation and acoustic localization tasks',
      'Successfully deployed in pool and open-water testing'
    ],
    parts: [
      { name: 'Jetson AGX Orin', icon: '🧠', tx: '-160px', ty: '-160px' },
      { name: 'Dual-Hull Design', icon: '⛵', tx: '160px', ty: '-120px' },
      { name: 'Vectored Thrusters', icon: '⚡', tx: '-130px', ty: '150px' },
      { name: 'DVL Unit', icon: '📡', tx: '130px', ty: '140px' },
      { name: 'Battery System', icon: '🔋', tx: '-80px', ty: '-80px' },
      { name: 'Stereo Cameras', icon: '📷', tx: '110px', ty: '-40px' }
    ]
  },
  {
    id: 3,
    name: 'SEA 4.0',
    year: 2022,
    status: 'retired',
    tagline: 'Carbon fiber modular platform',
    description: 'Our experimental research platform with modular design philosophy',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=800',
    specs: {
      'Hull Configuration': 'Carbon Fiber & Acrylic Composite',
      'Dimensions': '700mm x 400mm x 300mm',
      'Dry Weight': '12.8 kg',
      'Depth Rating': '50m',
      'Max Speed': '2.5 knots',
      'Processor': 'NVIDIA Jetson Xavier NX + Arduino Due',
      'Thrusters': '6x BlueRobotics T200',
      'Degrees of Freedom': '6-DOF',
      'Primary Sensors': 'Ping Sonar, Bar30 Pressure, 9-DOF IMU, Dual USB Cameras',
      'Power System': 'LiPo Battery (48V, 10Ah)',
      'Innovation': 'First vehicle with modular electronics bays'
    },
    achievements: [
      'MATE RoboSub 2022: Vehicle deployment success',
      'Research platform for vision algorithms',
      'Foundation for SEA 5.0 architecture'
    ],
    parts: [
      { name: 'Xavier NX', icon: '🧠', tx: '-140px', ty: '-140px' },
      { name: 'CF Frame', icon: '⛵', tx: '140px', ty: '-100px' },
      { name: 'Modular Thrusters', icon: '⚡', tx: '-120px', ty: '110px' },
      { name: 'Ping Sonar', icon: '📡', tx: '120px', ty: '130px' },
      { name: 'Main Battery', icon: '🔋', tx: '-80px', ty: '-80px' }
    ]
  },
  {
    id: 4,
    name: 'SEA 3.0',
    year: 2020,
    status: 'training',
    tagline: 'Stereo-vision research platform',
    description: 'Educational platform used for training new team members',
    image: 'https://images.unsplash.com/photo-1585776245865-b0ac9957a0a1?q=80&w=800',
    specs: {
      'Hull Configuration': 'Acrylic Sphere',
      'Dimensions': '600mm diameter',
      'Dry Weight': '10 kg',
      'Depth Rating': '50m',
      'Max Speed': '1.5 knots',
      'Processor': 'Arduino Mega + Raspberry Pi 4',
      'Thrusters': '4x Standard Rotary',
      'Degrees of Freedom': '4-DOF',
      'Primary Sensors': 'Dual USB Cameras, Basic 6-DOF IMU',
      'Power System': 'NiMH Battery Pack (12V, 5Ah)',
      'Purpose': 'Computer vision research and team training'
    },
    achievements: [
      'Stereo vision algorithm development platform',
      'Training vehicle for new members',
      'Successful pool testing'
    ],
    parts: [
      { name: 'Arduino + RPi', icon: '🧠', tx: '-130px', ty: '-130px' },
      { name: 'Spherical Hull', icon: '⛵', tx: '130px', ty: '-90px' },
      { name: 'Rotary Motors', icon: '⚡', tx: '-110px', ty: '100px' },
      { name: 'Camera Pair', icon: '📷', tx: '110px', ty: '120px' }
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
      <p className="eyebrow">{eyebrow}}</p>
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
          <span>⊙</span> MTS AUV-ZHCET
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
  const [stats] = useState([
    { label: 'Vehicles Developed', value: '4+' },
    { label: 'Competitions', value: 'SAUVC, RoboSub, AMUROVc' },
    { label: 'Team Members', value: '40+' },
    { label: 'Years Active', value: '2011-Present' }
  ]);

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
            <h1>
              <DecryptedText 
                text="Autonomous Underwater Innovation"
                speed={80}
                sequential={true}
                animateOn="view"
                className="revealed"
                encryptedClassName="encrypted"
              />
            </h1>
            <p>Designing, building, and deploying cutting-edge AUVs for international competitions and research since 2011.</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('projects')}>
                <RotatingText 
                  texts={['Explore Vehicles', 'View Fleet', 'See Projects']}
                  rotationInterval={4000}
                  mainClassName="rotating-button-text"
                />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('about')}>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-image-container" ref={heroRef}>
            <img 
              src="https://images.unsplash.com/photo-1518611505868-48010b2414f3?q=80&w=800" 
              alt="SEA 6.0" 
              className="hero-image" 
            />
            <div className="hero-spotlight"></div>
          </div>
        </div>
      </section>

      <Section title="Our Impact" eyebrow="Stats & Highlights">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ 
              background: 'var(--card-bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              animation: `slideInLeft 0.8s ease-out ${i * 0.1}s both`
            }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: 0 }}>{stat.value}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

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
          '# MTS AUV-ZHCET\nWe build autonomous and remotely operated underwater vehicles for international competitions.'
        )
      );
  }, []);

  return (
    <Section title="About Us" eyebrow="Information">
      <div style={{ lineHeight: '1.8', color: 'var(--text)', fontSize: '1.05rem' }}>
        {md.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h2 key={i} style={{ marginTop: '2rem', marginBottom: '1rem' }}>{line.slice(2)}</h2>;
          if (line.startsWith('## ')) return <h3 key={i} style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>{line.slice(3)}</h3>;
          if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{line.slice(2)}</li>;
          if (line.startsWith('🏄')) return <p key={i} style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{line}</p>;
          if (line.startsWith('✨')) return <p key={i} style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>{line}</p>;
          if (line.startsWith('🏆')) return <p key={i} style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>{line}</p>;
          if (line.startsWith('🔧')) return <p key={i} style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{line}</p>;
          if (line.trim()) return <p key={i} style={{ marginBottom: '0.75rem' }}>{line}</p>;
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
  const [filterStatus, setFilterStatus] = useState('all');
  const dragStart = useRef(0);

  const v = vehicleData[selected];

  const filteredVehicles = filterStatus === 'all' 
    ? vehicleData 
    : vehicleData.filter(vehicle => vehicle.status === filterStatus);

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
    <Section title="Vehicle Fleet" eyebrow="Projects">
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {['all', 'active', 'retired', 'training'].map(status => (
          <button
            key={status}
            onClick={() => {
              setFilterStatus(status);
              setSelected(0);
              setInside(false);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: filterStatus === status ? 'var(--primary)' : 'transparent',
              border: `2px solid ${filterStatus === status ? 'var(--primary)' : 'var(--border)'}`,
              color: filterStatus === status ? 'var(--bg)' : 'var(--text)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              textTransform: 'capitalize'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="projects-container">
        <div className="vehicle-selector">
          {filteredVehicles.map((vehicle, idx) => (
            <button
              key={vehicle.id}
              className={`vehicle-thumbnail ${selected === idx ? 'active' : ''}`}
              onClick={() => {
                setSelected(idx);
                setInside(false);
              }}
            >
              <div style={{ fontWeight: 600 }}>{vehicle.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vehicle.year}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem' }}>⊙ {vehicle.status}</div>
            </button>
          ))}
        </div>

        <div className="vehicle-display">
          <h3 style={{ marginTop: 0, color: 'var(--accent)' }}>{v.name}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{v.description}</p>
          
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
                  {part.icon} {part.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="specs-panel">
          <h3 style={{ marginTop: 0 }}>{v.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{v.tagline}</p>
          
          {v.achievements && v.achievements.length > 0 && (
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>🏆 Achievements</p>
              {v.achievements.map((ach, i) => (
                <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>✓ {ach}</p>
              ))}
            </div>
          )}

          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.75rem' }}>Specifications:</p>
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
    <Section title="Events & Competitions" eyebrow="Events">
      <div className="timeline">
        {events.map((event) => (
          <div key={event.id} className="timeline-item">
            <div className="event">
              <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                📍 {event.location}
              </p>
              {event.category && (
                <div style={{ display: 'inline-block', background: 'rgba(0,217,255,0.2)', color: 'var(--accent)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  {event.category}
                </div>
              )}
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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/info`).then((r) => r.json()).then((x) => setInfo(x.content));
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
        <button className={`tab-btn ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
          Edit Info
        </button>
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
    </Section>
  );
}

function Dev({ token, user }) {
  const [pending, setPending] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('timeline');

  const load = () => {
    if (!token) return;
    fetch(`${API}/dev/pending-users`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then(setPending);
    fetch(`${API}/dev/timeline`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then(setLogs);
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

  return (
    <Section title="Developer Console" eyebrow="Dev Tools">
      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'timeline' ? 'active' : ''}`} onClick={() => setTab('timeline')}>
          Timeline
        </button>
        <button className={`tab-btn ${tab === 'access' ? 'active' : ''}`} onClick={() => setTab('access')}>
          Access Manager
        </button>
      </div>

      {tab === 'timeline' && (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {logs.map((log) => (
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
                  <button className="btn btn-small btn-primary" onClick={() => approve(p.id)}>
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
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
