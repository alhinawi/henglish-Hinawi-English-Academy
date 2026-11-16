// ==============================================================================
// Henglish Academy (HENGLISH 2.0) - REAL 3D NAVIGABLE WORLD & SIMULATION CITY
// Fully playable Three.js 3D environment with character movement, NPCs, & physics
// ==============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal, flushSync } from 'react-dom';
import * as THREE from 'three';
import { createCityAssets, pavementTexture } from './cityAssets';
import { WORLD_GREETINGS, playWorldGreeting, stopWorldGreeting } from './worldGreetings';
import { WorldAudio } from './worldAudio';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { PageRoute } from '../types';
import { REAL_LIFE_SCENARIOS, SimulationScenario } from '../data/realLifeSimulationsData';
import { playSound } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Maximize2,
  Layers,
  MapPin,
  Building2,
  ExternalLink,
  ChevronLeft,
  X,
  Volume2,
  Navigation,
  Gamepad2,
  User,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Interactive3DWorldProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  onSelectScenario?: (scenarioId: string) => void;
}

interface WorldLocation {
  id: string;
  nameEn: string;
  nameAr: string;
  scenarioId: string;
  category: string;
  icon: string;
  position: [number, number, number];
  color: number;
  buildingHeight: number;
  descriptionAr: string;
  npcName: string;
  npcRole: string;
}

const LOCATIONS: WorldLocation[] = [
  {
    id: 'airport',
    nameEn: 'International Airport',
    nameAr: 'w3.loc.airport.name',
    scenarioId: 'sim-airport-checkin',
    category: 'Travel & Aviation',
    icon: '',
    position: [-14, 0, -10],
    color: 0x41e7ff, // Cyan Neon
    buildingHeight: 5,
    descriptionAr: 'w3.loc.airport.desc',
    npcName: 'Officer Sarah',
    npcRole: 'Airline Check-in Agent',
  },
  {
    id: 'restaurant',
    nameEn: 'The Ivy Restaurant & Café',
    nameAr: 'w3.loc.restaurant.name',
    scenarioId: 'sim-restaurant-ordering',
    category: 'Hospitality',
    icon: '',
    position: [-6, 0, 10],
    color: 0xffd166, // Gold Neon
    buildingHeight: 4,
    descriptionAr: 'w3.loc.restaurant.desc',
    npcName: 'Chef Marco',
    npcRole: 'Head Waiter & Sommelier',
  },
  {
    id: 'hospital',
    nameEn: 'St. Mary Medical Center',
    nameAr: 'w3.loc.hospital.name',
    scenarioId: 'sim-doctor-appointment',
    category: 'Healthcare',
    icon: '',
    position: [12, 0, -12],
    color: 0xff4f9a, // Pink Neon
    buildingHeight: 6,
    descriptionAr: 'w3.loc.hospital.desc',
    npcName: 'Dr. Emily Watson',
    npcRole: 'General Practitioner',
  },
  {
    id: 'tech-office',
    nameEn: 'Tech Innovation Hub',
    nameAr: 'w3.loc.tech-office.name',
    scenarioId: 'sim-job-interview',
    category: 'Business & Careers',
    icon: '',
    position: [14, 0, 8],
    color: 0xc4ff55, // Lime Neon
    buildingHeight: 8,
    descriptionAr: 'w3.loc.tech-office.desc',
    npcName: 'David Vance',
    npcRole: 'Senior Talent Acquisition',
  },
  {
    id: 'university',
    nameEn: 'Hinawi Central Academy',
    nameAr: 'w3.loc.university.name',
    scenarioId: 'academy-guide',
    category: 'Academic Campus',
    icon: '',
    position: [0, 0, 0],
    color: 0x9b7bff, // Purple Neon
    buildingHeight: 7,
    descriptionAr: 'w3.loc.university.desc',
    npcName: 'Prof. Hinawi',
    npcRole: 'Chief Academic Director',
  },
  {
    id: 'clothing', nameEn: 'Clothing Studio', nameAr: 'w3.loc.clothing.name',
    scenarioId: 'sim-clothing-shopping', category: 'Shopping', icon: '',
    position: [-15, 0, 9], color: 0xdfa5b5, buildingHeight: 4,
    descriptionAr: 'w3.loc.clothing.desc',
    npcName: 'Mona', npcRole: 'Shop Assistant',
  },
  {
    id: 'supermarket', nameEn: 'Neighbourhood Market', nameAr: 'w3.loc.supermarket.name',
    scenarioId: 'sim-supermarket-shopping', category: 'Everyday English', icon: '',
    position: [0, 0, -18], color: 0x91b5a1, buildingHeight: 4,
    descriptionAr: 'w3.loc.supermarket.desc',
    npcName: 'Omar', npcRole: 'Store Assistant',
  },
];

export const Interactive3DWorld: React.FC<Interactive3DWorldProps> = ({
  onNavigate,
  onSelectScenario,
}) => {
  const soundRef = useRef<WorldAudio | null>(null);
  const { t } = useLanguage();
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const [soundNotice, setSoundNotice] = useState('');
  useEffect(() => { return () => soundRef.current?.dispose(); }, []);
  const worldRef = useRef<HTMLDivElement>(null);
  const nearbyNpcRef = useRef<WorldLocation | null>(null);
  const [greetingId, setGreetingId] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState('');
  const greet = useCallback((id: string) => {
    setGreetingId(id);
    if (mutedRef.current) { setVoiceStatus(t('w3.voice.muted')); return; }
    void playWorldGreeting(id).then(mode => setVoiceStatus(mode === 'browser' ? t('w3.voice.browser') : mode === 'clip' ? t('w3.voice.clip') : t('w3.voice.none')));
  }, []);
  const [immersive, setImmersive] = useState(false);
  const [fullscreenHint, setFullscreenHint] = useState('');
  const [showControlsHint, setShowControlsHint] = useState(false);
  useEffect(() => {
    if (!immersive) return;
    setShowControlsHint(true);
    const timer = window.setTimeout(() => { setFullscreenHint(''); setShowControlsHint(false); }, 3200);
    return () => window.clearTimeout(timer);
  }, [immersive]);
  const exitWorld = useCallback(() => {
    keysPressed.current = {};
    joystickRef.current = { active: false, dx: 0, dy: 0 };
    soundRef.current?.stop();
    setSelectedLocation(null);
    setGreetingId(null);
    stopWorldGreeting();
    setImmersive(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    screen.orientation?.unlock?.();
  }, []);
  const enterWorld = () => {
    soundRef.current ??= new WorldAudio();
    void soundRef.current.start().then(() => soundRef.current?.chime()).catch(() => setSoundNotice(t('w3.soundError')));
    // The request must run directly in a user gesture, after the portal is mounted.
    flushSync(() => { setIs3DMode(true); setImmersive(true); });
    const element = worldRef.current;
    if (!element?.requestFullscreen) {
      setFullscreenHint(t('w3.fsInline'));
      return;
    }
    void element.requestFullscreen().then(() => {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (value: string) => Promise<void> };
      void orientation?.lock?.('landscape').catch(() => {});
    }).catch(() => {
      setFullscreenHint(t('w3.fsNoHide'));
    });
  };
  useEffect(() => {
    if (!immersive) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onFullscreen = () => {
      if (!document.fullscreenElement) exitWorld();
    };
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') exitWorld(); };
    document.addEventListener('fullscreenchange', onFullscreen);
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('fullscreenchange', onFullscreen);
      window.removeEventListener('keydown', onEscape);
    };
  }, [immersive, exitWorld]);
  const travelToRef = useRef<((loc: WorldLocation) => void) | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [nearbyNpc, setNearbyNpc] = useState<WorldLocation | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [playerCoords, setPlayerCoords] = useState<{ x: number; z: number }>({ x: 0, z: 4 });

  // Movement keys state
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const joystickRef = useRef<{ active: boolean; dx: number; dy: number }>({ active: false, dx: 0, dy: 0 });
  const joyKnobRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const JOY_RADIUS = 40;
  const updateJoy = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > JOY_RADIUS) {
      dx = (dx / len) * JOY_RADIUS;
      dy = (dy / len) * JOY_RADIUS;
    }
    joystickRef.current = { active: true, dx, dy };
    if (joyKnobRef.current) joyKnobRef.current.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  };
  const handleJoyStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateJoy(e);
  };
  const handleJoyMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (joystickRef.current.active) updateJoy(e);
  };
  const handleJoyEnd = () => {
    joystickRef.current = { active: false, dx: 0, dy: 0 };
    if (joyKnobRef.current) joyKnobRef.current.style.transform = 'translate(0,0)';
  };

  const handleSelectLoc = useCallback((loc: WorldLocation) => {
    setSelectedLocation(loc);
    soundRef.current?.door();
    greet(loc.id);
  }, [greet]);

  useEffect(() => {
    if (!is3DMode || !mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 480;
    let reducedMotion = true;
    try { reducedMotion = localStorage.getItem('henglish-motion') !== 'full' || window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* Storage can be disabled in private browsing. */ }
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 1. Scene, dusk sky dome & fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xc4d8dc, 35, 100);
    const assets = createCityAssets();

    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 4;
    skyCanvas.height = 512;
    const skyCtx = skyCanvas.getContext('2d')!;
    const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#4a8bb8');
    skyGrad.addColorStop(0.45, '#78b3d3');
    skyGrad.addColorStop(0.72, '#afd1df');
    skyGrad.addColorStop(0.88, '#e8ddd0');
    skyGrad.addColorStop(1, '#ffe1b2');
    skyCtx.fillStyle = skyGrad;
    skyCtx.fillRect(0, 0, 4, 512);
    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const skyDome = new THREE.Mesh(
      new THREE.SphereGeometry(120, 32, 24),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })
    );
    scene.add(skyDome);
    let cancelled = false;
    let environmentTarget: THREE.WebGLRenderTarget | undefined;
    const skyPromise = new RGBELoader().loadAsync('/models/city/sky.hdr');

    // Stars
    const starCount = 420;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.42;
      const r = 105;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi) + 6;
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xfff3d0, size: 0.32, transparent: true, opacity: 0.85, sizeAttenuation: true, fog: false })
    );
    // Daylight keeps windows, signs and faces readable on phone displays.
    stars.visible = false;
    scene.add(stars);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 260);
    camera.position.set(0, 3.1, 16);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    const smallScreen = Math.min(width, height) < 500;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1 : smallScreen ? 1.25 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isTouch ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    currentMount.appendChild(renderer.domElement);
    void skyPromise.then(texture => {
      if (cancelled) { texture.dispose(); return; }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      environmentTarget = pmrem.fromEquirectangular(texture);
      scene.environment = environmentTarget.texture;
      scene.background = texture;
      skyDome.visible = false;
      pmrem.dispose();
    }).catch(() => {});

    // 4. Cinematic dusk lighting
    const hemi = new THREE.HemisphereLight(0xdcefff, 0x677b52, 2.2);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffdfae, 2.4);
    sun.position.set(-18, 32, 22);
    sun.castShadow = true;
    sun.shadow.mapSize.set(isTouch ? 512 : 1024, isTouch ? 512 : 1024);
    sun.shadow.camera.left = -34;
    sun.shadow.camera.right = 34;
    sun.shadow.camera.top = 34;
    sun.shadow.camera.bottom = -34;
    sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const plazaGlow = new THREE.PointLight(0xffd9a0, 60, 45, 2);
    plazaGlow.position.set(0, 6, 0);
    scene.add(plazaGlow);

    // 5. Ground platform, plaza & roads
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1600, 1600),
      new THREE.MeshStandardMaterial({ color: 0x7b9465, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(21, 64),
      new THREE.MeshStandardMaterial({ map: pavementTexture(), normalMap: new THREE.TextureLoader().load('/models/city/paving-nor_gl.webp', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(12, 12); }), roughnessMap: new THREE.TextureLoader().load('/models/city/paving-Rough.webp', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(12, 12); }), roughness: 0.95 })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.005;
    plaza.receiveShadow = true;
    scene.add(plaza);

    const plazaRing = new THREE.Mesh(
      new THREE.RingGeometry(6.8, 7.1, 64),
      new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    plazaRing.rotation.x = -Math.PI / 2;
    plazaRing.position.y = 0.008;
    scene.add(plazaRing);

    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = 64;
    roadCanvas.height = 256;
    const roadCtx = roadCanvas.getContext('2d')!;
    roadCtx.fillStyle = '#535b60';
    roadCtx.fillRect(0, 0, 64, 256);
    roadCtx.fillStyle = '#ffd166';
    for (let y = 8; y < 256; y += 42) roadCtx.fillRect(29, y, 6, 24);
    const roadTex = new THREE.CanvasTexture(roadCanvas);
    roadTex.colorSpace = THREE.SRGBColorSpace;
    roadTex.wrapT = THREE.RepeatWrapping;

    LOCATIONS.filter(l => l.position[0] !== 0 || l.position[2] !== 0).forEach(loc => {
      const px = loc.position[0];
      const pz = loc.position[2];
      const dist = Math.hypot(px, pz);
      const len = dist - 8;
      const tex = roadTex.clone();
      tex.needsUpdate = true;
      tex.repeat.set(1, len / 4);
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, len),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
      );
      road.geometry.rotateX(-Math.PI / 2);
      road.rotation.y = Math.atan2(px, pz);
      road.position.set(px * 0.55, 0.02, pz * 0.55);
      road.receiveShadow = true;
      scene.add(road);

      const sidewalk = new THREE.Mesh(
        new THREE.CircleGeometry(3.9, 40),
        new THREE.MeshStandardMaterial({ color: 0xb4b7af, roughness: 0.95 })
      );
      sidewalk.rotation.x = -Math.PI / 2;
      sidewalk.position.set(px, 0.025, pz);
      sidewalk.receiveShadow = true;
      scene.add(sidewalk);
    });

    // Facade texture factory: dark facade + window grid albedo, lit windows emissive
    const makeFacade = (accent: number) => {
      const w = 256;
      const h = 512;
      const albedo = document.createElement('canvas');
      albedo.width = w;
      albedo.height = h;
      const a = albedo.getContext('2d')!;
      a.fillStyle = '#191b36';
      a.fillRect(0, 0, w, h);
      const emis = document.createElement('canvas');
      emis.width = w;
      emis.height = h;
      const e = emis.getContext('2d')!;
      e.fillStyle = '#000000';
      e.fillRect(0, 0, w, h);
      const accentCss = '#' + accent.toString(16).padStart(6, '0');
      for (let y = 14; y < h - 24; y += 34) {
        for (let x = 12; x < w - 20; x += 30) {
          a.fillStyle = '#0c0e20';
          a.fillRect(x, y, 18, 20);
          a.strokeStyle = 'rgba(255,255,255,0.07)';
          a.strokeRect(x + 0.5, y + 0.5, 17, 19);
          if (Math.random() < 0.32) {
            const roll = Math.random();
            e.fillStyle = roll < 0.16 ? accentCss : roll < 0.7 ? '#ffd9a0' : '#bfe3ff';
            e.fillRect(x, y, 18, 20);
          }
        }
      }
      const mapTex = new THREE.CanvasTexture(albedo);
      mapTex.colorSpace = THREE.SRGBColorSpace;
      const emisTex = new THREE.CanvasTexture(emis);
      emisTex.colorSpace = THREE.SRGBColorSpace;
      return { mapTex, emisTex };
    };

    const roundRectPath = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    };

    const labelCanvases: { canvas: HTMLCanvasElement; draw: () => void; tex: THREE.CanvasTexture }[] = [];
    const makeLabelTexture = (title: string, subtitle: string, accent: number, w = 512, h = 160) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const accentCss = '#' + accent.toString(16).padStart(6, '0');
      const draw = () => {
        const g = canvas.getContext('2d')!;
        g.clearRect(0, 0, w, h);
        const grad = g.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, 'rgba(12,11,32,0.92)');
        grad.addColorStop(1, 'rgba(30,25,66,0.92)');
        roundRectPath(g, 6, 6, w - 12, h - 12, 26);
        g.fillStyle = grad;
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = accentCss;
        g.stroke();
        g.textAlign = 'center';
        g.direction = 'rtl';
        let titleSize = 46;
        g.font = '700 ' + titleSize + 'px Cairo, Tahoma, sans-serif';
        while (g.measureText(title).width > w - 56 && titleSize > 22) {
          titleSize -= 3;
          g.font = '700 ' + titleSize + 'px Cairo, Tahoma, sans-serif';
        }
        g.fillStyle = '#ffd166';
        g.fillText(title, w / 2, 70);
        let subSize = 27;
        g.font = '600 ' + subSize + 'px Cairo, Tahoma, sans-serif';
        while (g.measureText(subtitle).width > w - 56 && subSize > 16) {
          subSize -= 2;
          g.font = '600 ' + subSize + 'px Cairo, Tahoma, sans-serif';
        }
        g.fillStyle = '#cfcced';
        g.fillText(subtitle, w / 2, 118);
      };
      draw();
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      labelCanvases.push({ canvas, draw, tex });
      return tex;
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        labelCanvases.forEach(l => {
          l.draw();
          l.tex.needsUpdate = true;
        });
      });
    }

    // 6. Premium city landmarks & NPCs
    const buildingMeshes: THREE.Mesh[] = [];
    const npcMarkers: { mesh: THREE.Group; loc: WorldLocation; ring: THREE.Mesh; body: THREE.Mesh }[] = [];

    LOCATIONS.forEach((loc, li) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(loc.position[0], 0, loc.position[2]);
      const faceAngle = loc.position[0] === 0 && loc.position[2] === 0 ? 0 : Math.atan2(-loc.position[0], -loc.position[2]) + Math.PI;
      bGroup.rotation.y = faceAngle;

      const H = loc.buildingHeight;
      const { mapTex, emisTex } = makeFacade(loc.color);
      const towerMat = new THREE.MeshStandardMaterial({
        map: mapTex,
        emissiveMap: emisTex,
        emissive: 0xffffff,
        emissiveIntensity: 0.85,
        roughness: 0.75,
        metalness: 0.25,
      });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(4.4, H, 4.4), towerMat);
      tower.position.y = H / 2;
      tower.castShadow = true;
      tower.receiveShadow = true;
      tower.userData = { location: loc };
      bGroup.add(tower);
      buildingMeshes.push(tower);

      // Setback upper floor for taller towers
      if (H >= 6) {
        const upper = new THREE.Mesh(new THREE.BoxGeometry(3.1, H * 0.42, 3.1), towerMat.clone());
        upper.position.y = H + H * 0.21;
        upper.castShadow = true;
        upper.userData = { location: loc };
        bGroup.add(upper);
        buildingMeshes.push(upper);
      }

      // Roof parapet + antenna
      const parapet = new THREE.Mesh(
        new THREE.BoxGeometry(4.7, 0.28, 4.7),
        new THREE.MeshStandardMaterial({ color: 0x232047, roughness: 0.8 })
      );
      parapet.position.y = H + 0.14;
      bGroup.add(parapet);
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x39365e, roughness: 0.5, metalness: 0.7 })
      );
      antenna.position.y = H + 1.3;
      bGroup.add(antenna);
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 10),
        new THREE.MeshBasicMaterial({ color: loc.color })
      );
      beacon.position.y = H + 2.45;
      bGroup.add(beacon);

      // Entrance: door, glowing canopy, bilingual sign
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.2, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x0b0a1e, roughness: 0.4, metalness: 0.6 })
      );
      door.position.set(0, 1.1, 2.22);
      bGroup.add(door);
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.14, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x14122b, emissive: loc.color, emissiveIntensity: 1.4 })
      );
      canopy.position.set(0, 2.42, 2.45);
      bGroup.add(canopy);
      const signTex = makeLabelTexture(t(loc.nameAr), loc.nameEn, loc.color, 512, 150);
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(3.1, 0.9),
        new THREE.MeshBasicMaterial({ map: signTex, transparent: true })
      );
      sign.position.set(0, 2.6, 3.5);
      bGroup.add(sign);

      scene.add(bGroup);
      // Swap the temporary primitives for authored doors, windows, balconies and roofs.
      const buildingVisual = new THREE.Group();
      buildingVisual.position.copy(bGroup.position);
      buildingVisual.rotation.copy(bGroup.rotation);

      scene.add(buildingVisual);
      const floors = [2, 1, 3, 4, 2, 1, 1][li];
      const oldBuildingParts = bGroup.children.filter(child => child !== sign);
      void assets.building(buildingVisual, floors, oldBuildingParts);
      if (['restaurant', 'clothing', 'supermarket'].includes(loc.id)) {
        const shopfront = new THREE.Group(); shopfront.position.copy(bGroup.position); shopfront.rotation.copy(bGroup.rotation);
        const offset = new THREE.Vector3(0, 0, 3.1).applyAxisAngle(new THREE.Vector3(0, 1, 0), shopfront.rotation.y);
        shopfront.position.add(offset); shopfront.rotation.y += Math.PI;
        scene.add(shopfront); void assets.model('shopfront-authored', shopfront, 5.4);
      }

      // NPC: stylized capsule person with floating name label
      const npcGroup = new THREE.Group();
      npcGroup.position.set(loc.position[0] + 2.5, 0, loc.position[2] + 3.2);

      const npcBody = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.34, 0.85, 6, 14),
        new THREE.MeshStandardMaterial({ color: loc.color, roughness: 0.55, metalness: 0.1 })
      );
      npcBody.position.y = 0.85;
      npcBody.castShadow = true;
      npcGroup.add(npcBody);

      const npcHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.29, 18, 18),
        new THREE.MeshStandardMaterial({ color: 0xf2c9a4, roughness: 0.6 })
      );
      npcHead.position.y = 1.72;
      npcHead.castShadow = true;
      npcGroup.add(npcHead);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.62, 0.78, 40),
        new THREE.MeshBasicMaterial({ color: loc.color, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.03;
      npcGroup.add(ring);

      const labelTex = makeLabelTexture(loc.npcName, loc.npcRole, loc.color, 512, 150);
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthWrite: false, sizeAttenuation: true })
      );
      label.scale.set(2.6, 0.76, 1);
      label.position.y = 2.45;
      npcGroup.add(label);
      void assets.person(npcGroup, [0, 2, 5].includes(li), false, [npcBody, npcHead]);

      scene.add(npcGroup);
      npcMarkers.push({ mesh: npcGroup, loc, ring, body: npcBody });
    });

    // 7. Street lamps & trees
    const lampPositions: [number, number][] = [[6, -6], [-6, 6], [-11, -3], [11, 3], [-3, -11], [3, 11]];
    lampPositions.forEach(([lx, lz]) => {
      const lamp = new THREE.Group();
      lamp.position.set(lx, 0, lz);
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.1, 3.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x2c2a4a, roughness: 0.5, metalness: 0.6 })
      );
      pole.position.y = 1.6;
      pole.castShadow = true;
      lamp.add(pole);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffe0a3 })
      );
      bulb.position.y = 3.3;
      lamp.add(bulb);
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeLabelTexture(' ', ' ', 0xffe0a3, 8, 8),
          color: 0xffd9a0,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
        })
      );
      halo.scale.set(1.6, 1.6, 1);
      halo.position.y = 3.3;
      lamp.add(halo);
      scene.add(lamp);
    });

    const treePositions: [number, number][] = [[-18, 4], [18, -4], [-20, 18], [20, 17], [-17, -16], [17, 16], [4, -17], [-12, 14]];
    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.17, 1.0, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 })
      );
      trunk.position.y = 0.5;
      trunk.castShadow = true;
      tree.add(trunk);
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x1f5c46, roughness: 0.85 })
      );
      foliage.position.y = 1.65;
      foliage.scale.y = 1.25;
      foliage.castShadow = true;
      tree.add(foliage);
      scene.add(tree);
      const treeModel = new THREE.Group();
      treeModel.position.copy(tree.position);
      scene.add(treeModel);
      void assets.model(tx < 0 ? 'tree_oak' : 'tree_palm', treeModel, 3.5, [trunk, foliage]);
    });

    // Floating dusk particles (decorative, skipped for reduced motion)
    let dust: THREE.Points | null = null;
    if (!reducedMotion) {
      const dustCount = 130;
      const dustPos = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 55;
        dustPos[i * 3 + 1] = Math.random() * 9 + 0.5;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 55;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
      dust = new THREE.Points(
        dustGeo,
        new THREE.PointsMaterial({ color: 0xffe8c0, size: 0.07, transparent: true, opacity: 0.5, sizeAttenuation: true })
      );
      scene.add(dust);
    }

    // 8. Interactive player avatar
    const player = new THREE.Group();
    player.position.set(0, 0, 11);

    const pBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.36, 0.85, 6, 14),
      new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.45, metalness: 0.2 })
    );
    pBody.position.y = 0.85;
    pBody.castShadow = true;
    player.add(pBody);

    const pHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    );
    pHead.position.y = 1.76;
    pHead.castShadow = true;
    player.add(pHead);

    const headphones = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.055, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x9b7bff })
    );
    headphones.position.y = 1.76;
    player.add(headphones);

    const pShadowRing = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.72, 36),
      new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    pShadowRing.rotation.x = -Math.PI / 2;
    pShadowRing.position.y = 0.03;
    player.add(pShadowRing);

    scene.add(player);
    travelToRef.current = loc => {
      player.position.set(loc.position[0] + 4.7, 0, loc.position[2] + 5.4);
      keysPressed.current = {};
      joystickRef.current = { active: false, dx: 0, dy: 0 };
    };
    void assets.person(player, false, true, [pBody, pHead, headphones]);

    // Parked vehicles with wheels, mirrors and glass. All models are bundled locally.
    const parkedCars: [string, number, number, number][] = [
      ['sedan', -9, -7, 0.6], ['ambulance', 9, -13, -0.5], ['van', 16, 4, 0.2],
    ];
    parkedCars.forEach(([name, x, z, angle]) => {
      const group = new THREE.Group(); group.position.set(x, 0.05, z); group.rotation.y = angle;
      scene.add(group); void assets.model(name, group, 3.3);
    });
    // Slatted benches, feet and planters use shared materials to limit GPU work.
    const timber = new THREE.MeshStandardMaterial({ color: 0x815c3f, roughness: 0.88 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x374449, metalness: 0.6, roughness: 0.5 });
    [-1, 1].forEach(side => {
      const bench = new THREE.Group(); bench.position.set(side * 5, 0, 2); bench.rotation.y = side * Math.PI / 2;
      for (let i = 0; i < 4; i++) {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.12), timber);
        seat.position.set(0, 0.52, i * 0.15); seat.castShadow = true; bench.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.08), timber);
        back.position.set(0, 0.72 + i * 0.13, 0.48); back.castShadow = true; bench.add(back);
      }
      [-0.72, 0.72].forEach(x => { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.5), steel); leg.position.set(x, 0.25, 0.22); bench.add(leg); });
      scene.add(bench);
    });

    // 9. Key listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault();
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' && nearbyNpcRef.current) {
        playSound('click');
        handleSelectLoc(nearbyNpcRef.current);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 10. Raycast building clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handlePointerClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);
      if (intersects.length > 0) {
        playSound('click');
        const target = intersects[0].object as THREE.Mesh;
        const loc = target.userData.location as WorldLocation;
        handleSelectLoc(loc);
      }
    };
    currentMount.addEventListener('click', handlePointerClick);

    // 11. Movement, camera & ambience loop
    let animId: number;
    let playerAngle = 0;
    const velocity = new THREE.Vector3();
    const desiredVelocity = new THREE.Vector3();
    const previousPosition = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    const desiredCamera = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    const direction = new THREE.Vector3();
    // Each lot is a 6m square and can rotate. Test in the lot's own coordinates.
    const hitsLamp = (x: number, z: number) => lampPositions.some(([lx, lz]) => Math.hypot(x - lx, z - lz) < 0.45);
    const insideBuilding = (x: number, z: number, margin = 0.45) => LOCATIONS.some(loc => {
      const angle = loc.position[0] === 0 && loc.position[2] === 0 ? 0 : Math.atan2(-loc.position[0], -loc.position[2]) + Math.PI;
      const dx = x - loc.position[0], dz = z - loc.position[2];
      return Math.abs(dx * Math.cos(angle) - dz * Math.sin(angle)) < 3 + margin && Math.abs(dx * Math.sin(angle) + dz * Math.cos(angle)) < 3 + margin;
    });
    const clock = new THREE.Clock();
    let lastCoords = { x: 0, z: 4 };
    let lastNearby: string | null = null;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.15);
      const t = clock.elapsedTime;
      previousPosition.copy(player.position);
      desiredVelocity.set(0, 0, 0);
      const keys = keysPressed.current;
      desiredVelocity.x = Number(!!(keys['d'] || keys['arrowright'])) - Number(!!(keys['a'] || keys['arrowleft']));
      desiredVelocity.z = Number(!!(keys['s'] || keys['arrowdown'])) - Number(!!(keys['w'] || keys['arrowup']));
      const joy = joystickRef.current;
      if (joy.active) {
        const length = Math.hypot(joy.dx, joy.dy);
        if (length > 7) {
          const magnitude = Math.pow(Math.min(1, (length - 7) / 33), 1.25);
          desiredVelocity.set(joy.dx / length * magnitude, 0, joy.dy / length * magnitude);
        }
      }
      if (desiredVelocity.lengthSq() > 1) desiredVelocity.normalize();
      desiredVelocity.multiplyScalar(3.4);
      velocity.lerp(desiredVelocity, 1 - Math.exp(-(desiredVelocity.lengthSq() ? 9 : 13) * delta));
      const nextX = Math.max(-25, Math.min(25, player.position.x + velocity.x * delta));
      const nextZ = Math.max(-25, Math.min(25, player.position.z + velocity.z * delta));
      // Slide along walls instead of stopping both axes or entering a rotated corner.
      if (!insideBuilding(nextX, player.position.z) && !hitsLamp(nextX, player.position.z)) player.position.x = nextX; else velocity.x = 0;
      if (!insideBuilding(player.position.x, nextZ) && !hitsLamp(player.position.x, nextZ)) player.position.z = nextZ; else velocity.z = 0;
      const moved = player.position.distanceToSquared(previousPosition) > 0.000001;
      if (moved) {
        const targetAngle = Math.atan2(-velocity.x, -velocity.z);
        const difference = Math.atan2(Math.sin(targetAngle - playerAngle), Math.cos(targetAngle - playerAngle));
        playerAngle += difference * (1 - Math.exp(-12 * delta));
        player.rotation.y = playerAngle;
      }
      soundRef.current?.step(delta, moved && immersive);
      assets.animatePerson(player, moved, delta);
      if (!reducedMotion) {
        pBody.position.y = moved ? 0.85 + Math.sin(t * 14) * 0.07 : 0.85;
        pShadowRing.scale.setScalar(1 + Math.sin(t * 2.2) * 0.07);
        if (dust) dust.rotation.y = t * 0.012;
      }


      // Fixed north-facing camera: moving sideways does not spin the world.
      lookTarget.copy(player.position); lookTarget.y += 1.25;
      desiredCamera.copy(player.position); desiredCamera.y += 2.1; desiredCamera.z += camera.aspect < 1 ? 7 : 5.4;
      direction.copy(desiredCamera).sub(lookTarget);
      // Conservative lot bounds along the sight line keep roofs out of the camera.
      let allowed = 1;
      for (let fraction = 0.08; fraction <= 1; fraction += 0.04) {
        const x = lookTarget.x + direction.x * fraction;
        const z = lookTarget.z + direction.z * fraction;
        if (insideBuilding(x, z, 0.7)) { allowed = Math.max(0.04, fraction - 0.06); break; }
      }
      desiredCamera.copy(lookTarget).addScaledVector(direction, allowed);
      cameraTarget.copy(camera.position).lerp(desiredCamera, 1 - Math.exp(-9 * delta));
      // Collision shortening is immediate; smoothing is only used when space is clear.
      if (insideBuilding(cameraTarget.x, cameraTarget.z, 0.7) || allowed < 1) cameraTarget.copy(desiredCamera);
      cameraTarget.y = Math.min(3.4, Math.max(1.4, cameraTarget.y));
      camera.position.copy(cameraTarget);
      camera.lookAt(lookTarget);

      let foundNearby: WorldLocation | null = null;
      npcMarkers.forEach(({ mesh, loc, ring, body }, i) => {
        const anchorX = loc.position[0] + 2.5, anchorZ = loc.position[2] + 3.2;
        const approaching = player.position.distanceTo(mesh.position) < 6.5;
        const pace = !reducedMotion && !approaching && immersive;
        if (pace) {
          const x = anchorX + Math.sin(t * 0.55 + i) * 0.7;
          const z = anchorZ + Math.cos(t * 0.55 + i) * 0.35;
          if (!insideBuilding(x, z)) { mesh.lookAt(x, 0, z); mesh.position.set(x, 0, z); }
        }
        assets.animatePerson(mesh, pace, delta);
        const dist = player.position.distanceTo(mesh.position);
        if (dist < 4.2) foundNearby = loc;
        if (dist < 6.5) {
          mesh.lookAt(player.position.x, 0, player.position.z);
        }
        if (!reducedMotion) {
          ring.scale.setScalar(1 + Math.sin(t * 2.4 + i) * 0.09);
          body.position.y = 0.85 + Math.sin(t * 1.8 + i * 2.1) * 0.04;
        }
      });

      const newId = foundNearby ? (foundNearby as WorldLocation).id : null;
      if (newId !== lastNearby) {
        lastNearby = newId;
        nearbyNpcRef.current = foundNearby;
        setNearbyNpc(foundNearby);
      }
      const cx = Math.round(player.position.x);
      const cz = Math.round(player.position.z);
      if (cx !== lastCoords.x || cz !== lastCoords.z) {
        lastCoords = { x: cx, z: cz };
        setPlayerCoords(lastCoords);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentMount);
    const clearMovement = () => {
      keysPressed.current = {};
      joystickRef.current = { active: false, dx: 0, dy: 0 };
    };
    window.addEventListener('blur', clearMovement);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('blur', clearMovement);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      currentMount.removeEventListener('click', handlePointerClick);
      cancelAnimationFrame(animId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      cancelled = true;
      environmentTarget?.dispose();
      if (scene.background instanceof THREE.Texture) scene.background.dispose();
      stopWorldGreeting();
      travelToRef.current = null;
      assets.dispose();
      scene.traverse(child => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Sprite) {
          if ('geometry' in child) child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            Object.values(material).forEach(value => { if (value instanceof THREE.Texture) value.dispose(); });
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [is3DMode, handleSelectLoc, immersive]);


  const content = (
    <div ref={worldRef} role={immersive ? 'dialog' : undefined} aria-modal={immersive || undefined} aria-label={immersive ? t('w3.cityAria') : undefined}
      className={immersive ? 'fixed inset-0 z-[9999] bg-[#0a091a] text-right flex flex-col' : 'space-y-6 text-right'}
      style={immersive ? { height: '100dvh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' } : undefined}>
      <div className={immersive ? "absolute top-3 left-3 z-[60] flex gap-1.5 flex-wrap max-w-[calc(100%-1.5rem)]" : "flex gap-2 flex-wrap"} style={{ left: 'max(12px, env(safe-area-inset-left))' }}>
        <button onClick={() => { exitWorld(); onNavigate('dashboard'); }} className="min-h-11 px-3 rounded-xl bg-black/80 border border-white/30 text-white font-bold text-xs">{t('w3.home')}</button>
        <button onClick={() => { exitWorld(); onNavigate('real-life'); }} className="min-h-11 px-3 rounded-xl bg-black/80 border border-white/30 text-white font-bold text-xs">{t('w3.back')}</button>
        {immersive && <button onClick={() => { const value = !muted; mutedRef.current = value; setMuted(value); if (value) stopWorldGreeting(); soundRef.current?.mute(value); if (!value) void soundRef.current?.start(); }} aria-label={muted ? t('w3.unmute') : t('w3.muteAria')} className="min-h-11 px-3 rounded-xl bg-black/80 border border-white/30 text-white text-xs">{muted ? t('w3.mutedOn') : t('w3.mutedOff')}</button>}
        {immersive && <button onClick={exitWorld} className="min-h-11 px-4 rounded-xl bg-black/80 border border-white/30 text-white font-bold flex items-center gap-2"><X className="w-4 h-4" />{t('w3.exit')}</button>}
      </div>
      {immersive && soundNotice && <p role="status" className="absolute top-20 left-3 z-30 text-white bg-black/80 p-2 text-xs">{soundNotice}</p>}
      {immersive && fullscreenHint && <p role="status" className="absolute top-16 left-3 right-3 z-30 bg-black/80 text-white text-xs p-3 rounded-xl pointer-events-none">{fullscreenHint}</p>}
      
      {/* 3D World Section Header */}
      <div className={`${immersive ? 'hidden' : 'flex'} flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('w3.headerBadge')}</span>
          </div>
          <h3 className="text-2xl font-black text-white mt-1">{t('w3.title')}</h3>
          <p className="text-xs text-[#b9b6d5]">
            {t('w3.subtitle')}
          </p>
        </div>

        {/* 2D / 3D Mode Toggle */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => {
              playSound('click');
              setIs3DMode(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              is3DMode
                ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] shadow-md'
                : 'text-[#b9b6d5] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t('w3.mode3d')}</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setIs3DMode(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              !is3DMode
                ? 'bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white shadow-md'
                : 'text-[#b9b6d5] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('w3.mode2d')}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      {is3DMode ? (
        <div className={immersive ? 'relative flex-1 min-h-0 overflow-hidden bg-[#0a091a]' : 'relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0a091a]'}>
          {!immersive && <button onClick={enterWorld} className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/35 text-white cursor-pointer" aria-label={t('w3.enterFullscreen')}>
            <span className="rounded-2xl px-6 py-4 bg-[#ffd166] text-[#0c0b20] font-black flex items-center gap-3 shadow-xl"><Maximize2 className="w-5 h-5" />{t('w3.enterFullscreen')}</span>
            <span className="absolute top-20 rounded-xl px-3 py-2 bg-black/70 text-xs">{t('w3.moveHint')}</span>
          </button>}
          
          {/* Real Three.js Canvas Container */}
          <div ref={mountRef} className={immersive ? 'w-full h-full touch-none' : 'w-full h-[430px] sm:h-[540px] touch-none'} />

          {/* Virtual Joystick (touch devices) */}
          {isTouchDevice && immersive && (
            <div
              className="absolute bottom-6 left-6 z-20 w-28 h-28 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center touch-none select-none"
              onPointerDown={handleJoyStart}
              onPointerMove={handleJoyMove}
              onPointerUp={handleJoyEnd}
              onPointerCancel={handleJoyEnd}
              onLostPointerCapture={handleJoyEnd}
              aria-label={t('w3.joystickAria')}
            >
              <div ref={joyKnobRef} className="w-12 h-12 rounded-full bg-linear-to-br from-[#ffd166] to-[#ff9c66] shadow-lg shadow-[#ffd166]/30 pointer-events-none" />
            </div>
          )}

          {/* Interactive HUD Overlay */}
          <div className="absolute top-16 right-4 flex flex-col items-end gap-2 z-10 pointer-events-none max-w-[65%]">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>X: {playerCoords.x} | Z: {playerCoords.z}</span>
            </div>
            {showControlsHint && <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{isTouchDevice ? t('w3.controlsTouch') : t('w3.controlsKeys')}</span>
            </div>}
          </div>

          {greetingId && WORLD_GREETINGS[greetingId] && (
            <div role="status" className="absolute top-24 left-3 right-3 z-20 max-w-lg mx-auto rounded-2xl bg-[#101521]/95 text-white p-4 border border-white/20 text-xs shadow-xl max-h-[32vh] overflow-auto">
              <button aria-label={t('w3.closeCaptions')} onClick={() => { setGreetingId(null); stopWorldGreeting(); }} className="float-left p-1"><X className="w-4 h-4" /></button>
              <p className="font-bold leading-7">{WORLD_GREETINGS[greetingId].ar}</p>
              <p dir="ltr" className="text-left leading-6 text-cyan-100 mt-2">{WORLD_GREETINGS[greetingId].en}</p>
              <p className="text-[10px] text-slate-300 mt-2">{voiceStatus}</p>
            </div>
          )}
          {/* Proximity Interaction Prompt with NPC */}
          {nearbyNpc && immersive && (
            <div className="absolute bottom-36 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-[22rem]">
              <button onClick={() => greet(nearbyNpc.id)} className="mb-3 mx-auto flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-black/80 text-white border border-white/25 text-xs font-bold"><Volume2 className="w-4 h-4" />{t('w3.hearGreeting')}</button>
              <button
                onClick={() => {
                  playSound('click');
                  handleSelectLoc(nearbyNpc);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] via-[#ff9c66] to-[#ff4f9a] text-[#0c0b20] font-black text-sm shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer ring-4 ring-white/20"
              >
                <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                <span className="text-center leading-relaxed">
                  <span className="block whitespace-nowrap">{t('w3.talkTo')} <bdi>{nearbyNpc.npcName}</bdi></span>
                  <span className="block text-xs font-semibold">{t('w3.pressE')}</span>
                </span>
              </button>
            </div>
          )}

          {/* Quick Fast-Travel Toolbar */}
          <div className={`${immersive ? "flex" : "hidden"} absolute bottom-4 right-4 items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-[calc(100%-10rem)]`}>
            <span className="text-[10px] text-[#ffd166] font-bold px-2 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              {t('w3.fastTravel')}
            </span>
            {LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  playSound('click');
                  travelToRef.current?.(loc);
                  greet(loc.id);
                }}
                aria-label={t('w3.travelTo').replace('{name}', t(loc.nameAr))}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>{loc.icon}</span>
                <span>{t(loc.nameAr).split(' - ')[0]}</span>
              </button>
            ))}
          </div>

        </div>
      ) : (
        /* 2D Fast Map Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCATIONS.map(loc => (
            <div
              key={loc.id}
              onClick={() => {
                playSound('click');
                handleSelectLoc(loc);
              }}
              className="p-5 rounded-2xl bg-linear-to-b from-[#171632] to-[#121128] border border-white/10 hover:border-[#41e7ff]/40 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{loc.icon}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#ffd166] font-bold">
                  {loc.category}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-white group-hover:text-[#41e7ff] transition-colors">{t(loc.nameAr)}</h4>
                <div className="text-xs font-mono text-[#b9b6d5]">{loc.nameEn}</div>
              </div>
              <p className="text-xs text-[#dedbf4] leading-relaxed">{t(loc.descriptionAr)}</p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#c4ff55] font-bold">{t('w3.character')} {loc.npcName}</span>
                <span className="text-[#ffd166] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t('w3.enterSim')} <ChevronLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Location Simulation Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <div className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl bg-linear-to-b from-[#1b1939] to-[#0c0b20] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl relative text-right">
              
              {/* Close Button */}
              <button
                onClick={() => { setSelectedLocation(null); setGreetingId(null); stopWorldGreeting(); }}
                aria-label={t('w3.closeChat')}
                className="absolute top-6 left-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner">
                  {selectedLocation.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#ffd166]">{selectedLocation.category}</div>
                  <h3 className="text-2xl font-black text-white">{selectedLocation.nameAr}</h3>
                  <div className="text-xs font-mono text-[#b9b6d5]">{selectedLocation.nameEn}</div>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-white/5 border border-white/10 space-y-2 text-sm">
                <p className="text-white leading-7">{WORLD_GREETINGS[selectedLocation.id]?.ar}</p>
                <p dir="ltr" className="text-left text-cyan-100 text-xs">{WORLD_GREETINGS[selectedLocation.id]?.en}</p>
                <button onClick={() => greet(selectedLocation.id)} className="min-h-11 text-[#ffd166] flex items-center gap-2"><Volume2 className="w-4 h-4" />{t('w3.replayGreeting')}</button>
                <p className="text-[10px] text-slate-300">{voiceStatus}</p>
              </div>
              {/* NPC Intro Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ff4f9a]/20 border border-[#ff4f9a]/40 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#b9b6d5]">{t('w3.trainer')}</div>
                  <div className="text-sm font-bold text-white">{selectedLocation.npcName} — <span className="text-xs text-[#41e7ff]">{selectedLocation.npcRole}</span></div>
                </div>
              </div>

              <p className="text-sm text-[#dedbf4] leading-relaxed">
                {t(selectedLocation.descriptionAr)}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    playSound('click');
                    if (selectedLocation.id === 'university') {
                      exitWorld(); onNavigate('speaking'); return;
                    }
                    if (onSelectScenario) {
                      onSelectScenario(selectedLocation.scenarioId);
                    } else {
                      try { sessionStorage.setItem('henglish-world-scenario', selectedLocation.scenarioId); } catch { /* Private browsing can disable storage. */ }
                    }
                    exitWorld();
                    onNavigate('real-life');
                    setSelectedLocation(null);
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-sm shadow-xl hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{t('w3.startTraining')}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    exitWorld();
                    onNavigate('speaking');
                    setSelectedLocation(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('w3.pronLab')}</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
  return immersive ? createPortal(content, document.body) : content;
};
