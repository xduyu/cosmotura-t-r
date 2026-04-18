"use client";
import { useEffect, useRef, useState } from "react";

const TOURS = [
  {
    id: 1,
    title: "Орбитальная станция",
    subtitle: "МКС — 7 дней",
    price: "от $450,000",
    desc: "Живите на орбите 400 км над Землёй. Наблюдайте 16 рассветов в сутки и парите в невесомости.",
    color: "#00f5ff",
    icon: "🛸",
    duration: "7 дней",
    gravity: "0g",
  },
  {
    id: 2,
    title: "Лунная прогулка",
    subtitle: "Обратная сторона Луны",
    price: "от $2,100,000",
    desc: "Ступите туда, куда не ступала нога человека. Прогулка по кратерам при свете Земли.",
    color: "#c8b8ff",
    icon: "🌕",
    duration: "14 дней",
    gravity: "0.17g",
  },
  {
    id: 3,
    title: "Марсианский рейд",
    subtitle: "Красная планета",
    price: "от $8,000,000",
    desc: "Первые туристы на Марсе. Исследуйте каньоны Valles Marineris и вулкан Олимп.",
    color: "#ff6b35",
    icon: "🔴",
    duration: "520 дней",
    gravity: "0.38g",
  },
  {
    id: 4,
    title: "Поясная экспедиция",
    subtitle: "Пояс астероидов",
    price: "от $15,000,000",
    desc: "Добыча редких металлов и невесомый сёрфинг между астероидами в поясе между Марсом и Юпитером.",
    color: "#ffd700",
    icon: "☄️",
    duration: "2 года",
    gravity: "0g",
  },
];

const STATS = [
  { label: "Туристов в космосе", value: "2,847" },
  { label: "Успешных миссий", value: "1,203" },
  { label: "Км пройдено", value: "4.2B" },
  { label: "Звёзд изучено", value: "∞" },
];

function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        o: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
      });
    }

    let frame = 0;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      for (const s of stars) {
        s.o = 0.3 + 0.7 * Math.abs(Math.sin(frame * s.speed + s.x));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function Nebula() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div className="nebula-blob nebula-1" />
      <div className="nebula-blob nebula-2" />
      <div className="nebula-blob nebula-3" />
    </div>
  );
}

function Rocket() {
  return (
    <div className="rocket-container">
      <div className="rocket">🚀</div>
      <div className="rocket-trail" />
    </div>
  );
}

function TourCard({ tour, index }: { tour: (typeof TOURS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="tour-card"
      style={{ "--card-color": tour.color, animationDelay: `${index * 0.15}s` } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-glow" />
      <div className="card-icon">{tour.icon}</div>
      <div className="card-badge">{tour.duration} · {tour.gravity}</div>
      <h3 className="card-title">{tour.title}</h3>
      <p className="card-subtitle">{tour.subtitle}</p>
      <p className="card-desc">{tour.desc}</p>
      <div className="card-footer">
        <span className="card-price">{tour.price}</span>
        <button className="card-btn">
          Забронировать
          <span className="btn-arrow">→</span>
        </button>
      </div>
      {hovered && <div className="card-scan" />}
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [countdown, setCountdown] = useState({ d: 14, h: 7, m: 32, s: 0 });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) { d = 0; h = 0; m = 0; s = 0; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((p) => (p + 1) % TOURS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const parallax = scrollY * 0.3;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #020409;
          --surface: rgba(255,255,255,0.04);
          --border: rgba(255,255,255,0.08);
          --text: #e8eaf6;
          --accent: #00f5ff;
          --accent2: #c8b8ff;
          --accent3: #ff6b35;
          --font-display: 'Orbitron', sans-serif;
          --font-body: 'Exo 2', sans-serif;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          font-weight: 300;
          overflow-x: hidden;
          cursor: crosshair;
        }

        ::selection { background: rgba(0,245,255,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

        /* NEBULA */
        .nebula-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
          animation: nebula-drift 20s ease-in-out infinite;
        }
        .nebula-1 { width: 600px; height: 600px; background: #3b0070; top: -10%; left: -10%; animation-delay: 0s; }
        .nebula-2 { width: 500px; height: 500px; background: #001a5c; top: 40%; right: -5%; animation-delay: -7s; }
        .nebula-3 { width: 400px; height: 400px; background: #1a0030; bottom: 10%; left: 30%; animation-delay: -14s; }
        @keyframes nebula-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 40px) scale(0.95); }
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 3rem;
          backdrop-filter: blur(20px);
          background: rgba(2,4,9,0.6);
          border-bottom: 1px solid var(--border);
          transition: all 0.3s;
        }
        .nav-logo {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--accent);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .nav-logo span { color: var(--accent2); }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .nav-links a {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0; right: 0;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .nav-links a:hover { color: var(--accent); }
        .nav-links a:hover::after { transform: scaleX(1); }
        .nav-cta {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.6rem 1.4rem;
          border: 1px solid var(--accent);
          color: var(--accent);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .nav-cta:hover {
          background: var(--accent);
          color: var(--bg);
        }

        /* HERO */
        .hero {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 2rem 4rem;
          overflow: hidden;
        }
        .hero-orbit {
          position: absolute;
          border: 1px solid rgba(0,245,255,0.08);
          border-radius: 50%;
          animation: orbit-spin linear infinite;
          pointer-events: none;
        }
        .hero-orbit-1 { width: 500px; height: 500px; animation-duration: 30s; }
        .hero-orbit-2 { width: 700px; height: 700px; animation-duration: 50s; animation-direction: reverse; }
        .hero-orbit-3 { width: 900px; height: 900px; animation-duration: 80s; }
        .orbit-dot {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          top: 0; left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px var(--accent);
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero-eyebrow {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.5rem;
          animation: fade-up 0.8s ease both;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 7vw, 6rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          animation: fade-up 0.8s ease 0.1s both;
        }
        .hero-title .line2 {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
        .hero-title .accent-word {
          color: var(--accent);
          text-shadow: 0 0 60px rgba(0,245,255,0.4);
        }
        .hero-sub {
          max-width: 520px;
          margin: 2rem auto 0;
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          font-style: italic;
          animation: fade-up 0.8s ease 0.2s both;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-top: 3rem;
          justify-content: center;
          animation: fade-up 0.8s ease 0.3s both;
        }
        .btn-primary {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          background: var(--accent);
          color: var(--bg);
          border: none;
          cursor: pointer;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          transform: translateX(-100%);
          transition: transform 0.3s;
          opacity: 0.2;
        }
        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary:hover { box-shadow: 0 0 40px rgba(0,245,255,0.4); }
        .btn-outline {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
          cursor: pointer;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          transition: all 0.2s;
        }
        .btn-outline:hover {
          border-color: var(--accent2);
          color: var(--accent2);
        }

        /* COUNTDOWN */
        .countdown-bar {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 2rem 3rem;
          background: rgba(0,245,255,0.03);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .countdown-label {
          font-family: var(--font-display);
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-right: 3rem;
        }
        .countdown-units {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .countdown-num {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          text-shadow: 0 0 20px rgba(0,245,255,0.5);
          min-width: 3ch;
          text-align: center;
        }
        .countdown-unit-label {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .countdown-sep {
          font-family: var(--font-display);
          font-size: 2rem;
          color: rgba(0,245,255,0.3);
          margin: 0 0.5rem;
          padding-bottom: 1rem;
        }

        /* TICKER */
        .ticker-wrap {
          position: relative;
          z-index: 1;
          overflow: hidden;
          padding: 0.8rem 0;
          background: var(--accent);
        }
        .ticker-track {
          display: flex;
          animation: ticker-move 20s linear infinite;
          white-space: nowrap;
        }
        .ticker-item {
          font-family: var(--font-display);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--bg);
          padding: 0 3rem;
          flex-shrink: 0;
        }
        @keyframes ticker-move {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* SECTION */
        section {
          position: relative;
          z-index: 1;
        }
        .section-header {
          text-align: center;
          padding: 5rem 2rem 3rem;
        }
        .section-eyebrow {
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* TOURS GRID */
        .tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5px;
          padding: 0 0 5rem;
          max-width: 1400px;
          margin: 0 auto;
          padding-left: 2rem;
          padding-right: 2rem;
        }

        /* TOUR CARD */
        .tour-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 2.5rem;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s;
          animation: fade-up 0.6s ease both;
          cursor: pointer;
        }
        .tour-card:hover {
          transform: translateY(-6px);
          border-color: var(--card-color, var(--accent));
        }
        .tour-card:hover .card-glow {
          opacity: 1;
        }
        .card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, var(--card-color, var(--accent)), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0;
        }
        .tour-card:hover .card-glow { opacity: 0.15; }
        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: block;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .card-badge {
          display: inline-block;
          font-family: var(--font-display);
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem;
          border: 1px solid var(--card-color, var(--accent));
          color: var(--card-color, var(--accent));
          margin-bottom: 1rem;
        }
        .card-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.3rem;
        }
        .card-subtitle {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 1rem;
          font-style: italic;
        }
        .card-desc {
          font-size: 0.88rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.6);
          margin-bottom: 2rem;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .card-price {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--card-color, var(--accent));
        }
        .card-btn {
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.6rem 1.2rem;
          background: transparent;
          border: 1px solid var(--card-color, var(--accent));
          color: var(--card-color, var(--accent));
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
        }
        .card-btn:hover {
          background: var(--card-color, var(--accent));
          color: var(--bg);
        }
        .btn-arrow { transition: transform 0.2s; }
        .card-btn:hover .btn-arrow { transform: translateX(4px); }
        .card-scan {
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: scan 0.6s ease forwards;
        }
        @keyframes scan {
          to { left: 150%; }
        }

        /* STATS */
        .stats-section {
          padding: 5rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
        }
        .stat-item {
          background: var(--bg);
          padding: 3rem 2rem;
          text-align: center;
          transition: background 0.2s;
        }
        .stat-item:hover { background: rgba(0,245,255,0.04); }
        .stat-value {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 900;
          color: var(--accent);
          text-shadow: 0 0 30px rgba(0,245,255,0.3);
          letter-spacing: 0.02em;
        }
        .stat-label {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-top: 0.5rem;
        }

        /* ROCKET ANIM */
        .rocket-container {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          padding: 4rem 0;
          overflow: hidden;
        }
        .rocket {
          font-size: 4rem;
          animation: rocket-launch 4s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(0,245,255,0.5));
        }
        .rocket-trail {
          position: absolute;
          bottom: 30%;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 80px;
          background: linear-gradient(to bottom, rgba(0,245,255,0.8), transparent);
          animation: rocket-launch 4s ease-in-out infinite;
          filter: blur(2px);
        }
        @keyframes rocket-launch {
          0%, 100% { transform: translateY(0) rotate(-45deg); }
          50% { transform: translateY(-40px) rotate(-45deg); }
        }

        /* FEATURE STRIP */
        .feature-strip {
          display: flex;
          overflow: hidden;
          gap: 1px;
          background: var(--border);
          max-width: 1200px;
          margin: 0 auto 5rem;
        }
        .feature-item {
          flex: 1;
          background: var(--surface);
          padding: 2.5rem 2rem;
          text-align: center;
          transition: background 0.2s;
        }
        .feature-item:hover { background: rgba(200,184,255,0.04); }
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }
        .feature-name {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
        }

        /* CTA BAND */
        .cta-band {
          position: relative;
          z-index: 1;
          padding: 6rem 2rem;
          text-align: center;
          border-top: 1px solid var(--border);
          overflow: hidden;
        }
        .cta-band::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(0,245,255,0.06), transparent 70%);
          pointer-events: none;
        }
        .cta-band h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .cta-band p {
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          margin-bottom: 3rem;
          font-style: italic;
        }

        /* FOOTER */
        footer {
          position: relative;
          z-index: 1;
          padding: 3rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-logo {
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: var(--accent);
        }
        .footer-copy {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
        }
        .footer-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }
        .footer-links a {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--accent2); }

        /* ANIMATIONS */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* HORIZONTAL MARQUEE PLANETS */
        .planets-strip {
          position: relative;
          z-index: 1;
          padding: 3rem 0;
          overflow: hidden;
        }
        .planets-track {
          display: flex;
          animation: ticker-move 15s linear infinite;
          white-space: nowrap;
          gap: 3rem;
          align-items: center;
        }
        .planet-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          border: 1px solid var(--border);
          padding: 0.8rem 1.5rem;
        }
        .planet-emoji { font-size: 1.5rem; }

        /* TOUR SELECTOR TABS */
        .tour-tabs {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .tour-tab {
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.8rem 1.5rem;
          border: 1px solid var(--border);
          border-right: none;
          background: transparent;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: all 0.2s;
        }
        .tour-tab:last-child { border-right: 1px solid var(--border); }
        .tour-tab.active {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
        }
        .tour-tab:hover:not(.active) {
          color: var(--accent);
          border-color: var(--accent);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          nav { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .feature-strip { flex-direction: column; }
          footer { flex-direction: column; text-align: center; }
          .countdown-label { display: none; }
        }
      `}</style>

      <Stars />
      <Nebula />

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">COSMO<span>TURA</span></a>
        <ul className="nav-links">
          <li><a href="#tours">Туры</a></li>
          <li><a href="#about">О нас</a></li>
          <li><a href="#contact">Контакт</a></li>
        </ul>
        <button className="nav-cta">Подать заявку</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-orbit hero-orbit-1">
          <div className="orbit-dot" />
        </div>
        <div className="hero-orbit hero-orbit-2">
          <div className="orbit-dot" style={{ background: "#c8b8ff", boxShadow: "0 0 10px #c8b8ff" }} />
        </div>
        <div className="hero-orbit hero-orbit-3">
          <div className="orbit-dot" style={{ background: "#ff6b35", boxShadow: "0 0 10px #ff6b35" }} />
        </div>

        <p className="hero-eyebrow">✦ Космическое туристическое агентство ✦</p>
        <h1 className="hero-title">
          Твой билет<br />
          <span className="line2">в</span>{" "}
          <span className="accent-word">бесконечность</span>
        </h1>
        <p className="hero-sub">
          Орбитальные станции, лунные маршруты, экспедиции на Марс — мы открываем
          космос для каждого, кто достаточно смел, чтобы мечтать.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Выбрать тур 🚀</button>
          <button className="btn-outline">Смотреть видео ▶</button>
        </div>
      </section>

      {/* COUNTDOWN */}
      <div className="countdown-bar">
        <span className="countdown-label">Следующий старт через</span>
        <div className="countdown-units">
          <div className="countdown-unit">
            <span className="countdown-num">{String(countdown.d).padStart(2, "0")}</span>
            <span className="countdown-unit-label">дней</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-num">{String(countdown.h).padStart(2, "0")}</span>
            <span className="countdown-unit-label">часов</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-num">{String(countdown.m).padStart(2, "0")}</span>
            <span className="countdown-unit-label">минут</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-num">{String(countdown.s).padStart(2, "0")}</span>
            <span className="countdown-unit-label">секунд</span>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) =>
            ["МКС · ОРБИТА 400КМ", "ЛУНА · 384,400 КМ", "МАРС · 225M КМ", "ЮПИТЕР · 778M КМ", "САТУРН · КОЛЬЦА", "НУЛЕВАЯ ГРАВИТАЦИЯ", "ЖИЗНЬ В КОСМОСЕ"].map((t) => (
              <span className="ticker-item" key={`${i}-${t}`}>✦ {t}</span>
            ))
          )}
        </div>
      </div>

      {/* PLANETS STRIP */}
      <div className="planets-strip">
        <div className="planets-track">
          {[...Array(2)].map((_, gi) =>
            [
              { e: "🌍", n: "Земля" }, { e: "🌕", n: "Луна" }, { e: "🔴", n: "Марс" },
              { e: "🟠", n: "Юпитер" }, { e: "🪐", n: "Сатурн" }, { e: "🔵", n: "Нептун" },
              { e: "⭐", n: "Альфа Центавра" }, { e: "☄️", n: "Астероиды" },
            ].map((p) => (
              <div className="planet-item" key={`${gi}-${p.n}`}>
                <span className="planet-emoji">{p.e}</span>
                <span>{p.n}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TOURS */}
      <section id="tours">
        <div className="section-header">
          <p className="section-eyebrow">// Направления</p>
          <h2 className="section-title">Наши маршруты</h2>
        </div>
        <div className="tour-tabs">
          {TOURS.map((t, i) => (
            <button
              key={t.id}
              className={`tour-tab${activeSection === i ? " active" : ""}`}
              onClick={() => setActiveSection(i)}
            >
              {t.icon} {t.title}
            </button>
          ))}
        </div>
        <div className="tours-grid">
          {TOURS.map((tour, i) => (
            <TourCard key={tour.id} tour={tour} index={i} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section>
        <div className="stats-section">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div className="stat-item" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROCKET */}
      <Rocket />

      {/* FEATURES */}
      <div className="feature-strip" style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
        {[
          { icon: "🛡️", name: "Безопасность", desc: "Тройное дублирование систем жизнеобеспечения" },
          { icon: "👨‍🚀", name: "Обучение", desc: "6 месяцев подготовки в нашем центре" },
          { icon: "🌌", name: "Уникальность", desc: "Индивидуальные маршруты для каждого" },
          { icon: "📡", name: "Связь", desc: "Прямой эфир с семьёй 24/7" },
          { icon: "🏥", name: "Медицина", desc: "Врач на борту в каждой миссии" },
        ].map((f) => (
          <div className="feature-item" key={f.name}>
            <span className="feature-icon">{f.icon}</span>
            <div className="feature-name">{f.name}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="cta-band">
        <h2>Готов к <span style={{ color: "var(--accent)" }}>старту</span>?</h2>
        <p>Места на следующие миссии заполняются быстро. Не упусти свой шанс.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "1.2rem 3rem" }}>
            Забронировать место 🚀
          </button>
          <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "1.2rem 3rem" }}>
            Получить консультацию
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">COSMOTURA</div>
        <ul className="footer-links">
          <li><a href="#">Туры</a></li>
          <li><a href="#">О нас</a></li>
          <li><a href="#">Безопасность</a></li>
          <li><a href="#">Пресса</a></li>
          <li><a href="#">Контакты</a></li>
        </ul>
        <div className="footer-copy">© 2024 COSMOTURA · Все права защищены</div>
      </footer>
    </>
  );
}