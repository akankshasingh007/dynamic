import { useState, useEffect, useRef } from 'react';

export default function VehicleViewer() {
  const [selected, setSelected] = useState(0);
  const [inside, setInside] = useState(false);
  const [drag, setDrag] = useState(0);
  const dragStart = useRef(0);

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
        'Depth Rating': '300m',
        'Max Speed': '5 knots',
        'Endurance': '6+ hours',
        'Processor': 'NVIDIA Jetson Orin + STM32H7',
        'Thrusters': '8x BlueRobotics T500'
      },
      achievements: [
        'SAUVC 2026: Qualified for autonomous navigation',
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
      description: 'Competition-tested flagship with advanced dual-hull architecture',
      image: 'https://images.unsplash.com/photo-1579033356026-641a6834ff68?q=80&w=800',
      specs: {
        'Hull Configuration': 'Double Acrylic Hull + Aluminum Ribs',
        'Dimensions': '750mm x 450mm x 320mm',
        'Dry Weight': '14.5 kg',
        'Depth Rating': '100m',
        'Max Speed': '4 knots',
        'Processor': 'NVIDIA Jetson AGX Orin + Teensy 4.1',
        'Thrusters': '8x BlueRobotics T200 (Vectored)',
        'Unique Feature': 'Vectored thruster configuration for superior maneuverability'
      },
      achievements: [
        'SAUVC 2024: Top-ranked Indian entry',
        'Autonomous navigation and acoustic localization',
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
      description: 'Experimental research platform with modular design philosophy',
      image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=800',
      specs: {
        'Hull Configuration': 'Carbon Fiber & Acrylic Composite',
        'Dimensions': '700mm x 400mm x 300mm',
        'Dry Weight': '12.8 kg',
        'Depth Rating': '50m',
        'Max Speed': '2.5 knots',
        'Processor': 'NVIDIA Jetson Xavier NX + Arduino Due',
        'Thrusters': '6x BlueRobotics T200',
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
    }
  ];

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
    <div className="vehicle-viewer-section">
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {['all', 'active', 'retired'].map((status) => (
          <button
            key={status}
            onClick={() => setSelected(0)}
            style={{
              padding: '0.75rem 1.5rem',
              background: status === 'all' ? 'var(--primary)' : 'transparent',
              border: `2px solid ${status === 'all' ? 'var(--primary)' : 'var(--border)'}`,
              color: status === 'all' ? 'var(--bg)' : 'var(--text)',
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
        {/* Left: Vehicle Selector */}
        <div className="vehicle-selector">
          {vehicleData.map((vehicle, idx) => (
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
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem' }}>
                ⊙ {vehicle.status}
              </div>
            </button>
          ))}
        </div>

        {/* Center: Vehicle Display */}
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

        {/* Right: Specs Panel */}
        <div className="specs-panel">
          <h3 style={{ marginTop: 0 }}>{v.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {v.tagline}
          </p>

          {v.achievements && v.achievements.length > 0 && (
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>
                🏆 Achievements
              </p>
              {v.achievements.map((ach, i) => (
                <p
                  key={i}
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}
                >
                  ✓ {ach}
                </p>
              ))}
            </div>
          )}

          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.75rem' }}>
            Specifications:
          </p>
          {Object.entries(v.specs).map(([key, val]) => (
            <div key={key} className="spec-item">
              <span className="spec-label">{key}</span>
              <span className="spec-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
