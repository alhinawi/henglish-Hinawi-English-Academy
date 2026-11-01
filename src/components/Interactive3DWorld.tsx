// ==============================================================================
// Henglish Academy (HENGLISH 2.0) - REAL 3D NAVIGABLE WORLD & SIMULATION CITY
// Fully playable Three.js 3D environment with character movement, NPCs, & physics
// ==============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PageRoute } from '../types';
import { REAL_LIFE_SCENARIOS, SimulationScenario } from '../data/realLifeSimulationsData';
import { playSound } from '../utils/audio';
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
    nameAr: 'مطار القاهرة الدولي - صالة ٣',
    scenarioId: 'sim-airport-checkin',
    category: 'Travel & Aviation',
    icon: '✈️',
    position: [-14, 0, -10],
    color: 0x41e7ff, // Cyan Neon
    buildingHeight: 5,
    descriptionAr: 'مواقف إنهاء إجراءات السفر، وزن الحقائب، بطاقات الصعود، والاستفسار عن بوابات الإقلاع.',
    npcName: 'Officer Sarah',
    npcRole: 'Airline Check-in Agent',
  },
  {
    id: 'restaurant',
    nameEn: 'The Ivy Restaurant & Café',
    nameAr: 'مطعم و كافيه الضيافة',
    scenarioId: 'sim-restaurant-ordering',
    category: 'Hospitality',
    icon: '🍽️',
    position: [-6, 0, 10],
    color: 0xffd166, // Gold Neon
    buildingHeight: 4,
    descriptionAr: 'طلب الطعام الفاخر، حجز الطاولات، السؤال عن مكونات الأطباق، وطلب الحساب بلباقة.',
    npcName: 'Chef Marco',
    npcRole: 'Head Waiter & Sommelier',
  },
  {
    id: 'hospital',
    nameEn: 'St. Mary Medical Center',
    nameAr: 'المركز الطبي والعيادات التخصصية',
    scenarioId: 'sim-doctor-appointment',
    category: 'Healthcare',
    icon: '🩺',
    position: [12, 0, -12],
    color: 0xff4f9a, // Pink Neon
    buildingHeight: 6,
    descriptionAr: 'شرح الأعراض المرضية، مواعيد الطبيب، وصف الأدوية، والصيدلية.',
    npcName: 'Dr. Emily Watson',
    npcRole: 'General Practitioner',
  },
  {
    id: 'tech-office',
    nameEn: 'Tech Innovation Hub',
    nameAr: 'برج التكنولوجيا ومقابلات العمل',
    scenarioId: 'sim-job-interview',
    category: 'Business & Careers',
    icon: '💼',
    position: [14, 0, 8],
    color: 0xc4ff55, // Lime Neon
    buildingHeight: 8,
    descriptionAr: 'مقابلات التوظيف بالإنجليزية، اجتماعات تطوير المنتجات، والتفاوض الوظيفي.',
    npcName: 'David Vance',
    npcRole: 'Senior Talent Acquisition',
  },
  {
    id: 'university',
    nameEn: 'Hinawi Central Academy',
    nameAr: 'أكاديمية هناوي المركزية للغات',
    scenarioId: 'sim-airport-checkin',
    category: 'Academic Campus',
    icon: '🏛️',
    position: [0, 0, 0],
    color: 0x9b7bff, // Purple Neon
    buildingHeight: 7,
    descriptionAr: 'مقر المحاضرات المباشرة، الاختبارات، والمكتبة المركزية الشاملة.',
    npcName: 'Prof. Al-Hinawi',
    npcRole: 'Chief Academic Director',
  },
];

export const Interactive3DWorld: React.FC<Interactive3DWorldProps> = ({
  onNavigate,
  onSelectScenario,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [nearbyNpc, setNearbyNpc] = useState<WorldLocation | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [playerCoords, setPlayerCoords] = useState<{ x: number; z: number }>({ x: 0, z: 4 });

  // Movement keys state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const handleSelectLoc = useCallback((loc: WorldLocation) => {
    setSelectedLocation(loc);
  }, []);

  useEffect(() => {
    if (!is3DMode || !mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || 800;
    const height = Math.min(540, window.innerHeight * 0.6);

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a091a);
    scene.fog = new THREE.FogExp2(0x0a091a, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const centerGlow = new THREE.PointLight(0x41e7ff, 2.5, 30);
    centerGlow.position.set(0, 5, 0);
    scene.add(centerGlow);

    // 5. Ground Grid & Cyber Roadways
    const gridHelper = new THREE.GridHelper(50, 50, 0x41e7ff, 0x1f1d43);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const groundGeo = new THREE.CircleGeometry(26, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f0e26,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // 6. Build City Landmarks & NPCs
    const buildingMeshes: THREE.Mesh[] = [];
    const npcMarkers: { mesh: THREE.Group; loc: WorldLocation }[] = [];

    LOCATIONS.forEach(loc => {
      // Building Group
      const bGroup = new THREE.Group();
      bGroup.position.set(loc.position[0], 0, loc.position[2]);

      // Main Architecture Tower
      const geo = new THREE.BoxGeometry(4.5, loc.buildingHeight, 4.5);
      const mat = new THREE.MeshStandardMaterial({
        color: loc.color,
        roughness: 0.3,
        metalness: 0.7,
        emissive: loc.color,
        emissiveIntensity: 0.15,
      });
      const tower = new THREE.Mesh(geo, mat);
      tower.position.y = loc.buildingHeight / 2;
      tower.userData = { location: loc };
      bGroup.add(tower);
      buildingMeshes.push(tower);

      // Crown Hologram
      const crownGeo = new THREE.OctahedronGeometry(0.9, 0);
      const crownMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = loc.buildingHeight + 1.8;
      bGroup.add(crown);

      // Entrance Gate & Light
      const gateGeo = new THREE.BoxGeometry(2, 2.5, 0.4);
      const gateMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const gate = new THREE.Mesh(gateGeo, gateMat);
      gate.position.set(0, 1.25, 2.3);
      bGroup.add(gate);

      scene.add(bGroup);

      // NPC Character standing outside
      const npcGroup = new THREE.Group();
      npcGroup.position.set(loc.position[0] + 2.5, 0, loc.position[2] + 3.2);

      // NPC Body
      const npcBodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16);
      const npcBodyMat = new THREE.MeshStandardMaterial({ color: loc.color, metalness: 0.3 });
      const npcBody = new THREE.Mesh(npcBodyGeo, npcBodyMat);
      npcBody.position.y = 0.7;
      npcGroup.add(npcBody);

      // NPC Head
      const npcHeadGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const npcHeadMat = new THREE.MeshStandardMaterial({ color: 0xffdfba });
      const npcHead = new THREE.Mesh(npcHeadGeo, npcHeadMat);
      npcHead.position.y = 1.6;
      npcGroup.add(npcHead);

      // Floating NPC Ring Indicator
      const ringGeo = new THREE.RingGeometry(0.6, 0.75, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: loc.color, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      npcGroup.add(ring);

      scene.add(npcGroup);
      npcMarkers.push({ mesh: npcGroup, loc });
    });

    // 7. Interactive Player Character Avatar
    const player = new THREE.Group();
    player.position.set(0, 0, 4);

    // Player Body
    const pBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.4, 16);
    const pBodyMat = new THREE.MeshStandardMaterial({ color: 0xff4f9a, metalness: 0.5 });
    const pBody = new THREE.Mesh(pBodyGeo, pBodyMat);
    pBody.position.y = 0.7;
    player.add(pBody);

    // Player Head & Headphones
    const pHeadGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pHead = new THREE.Mesh(pHeadGeo, pHeadMat);
    pHead.position.y = 1.65;
    player.add(pHead);

    const headphonesGeo = new THREE.TorusGeometry(0.38, 0.06, 8, 24);
    const headphonesMat = new THREE.MeshBasicMaterial({ color: 0x41e7ff });
    const headphones = new THREE.Mesh(headphonesGeo, headphonesMat);
    headphones.position.y = 1.65;
    player.add(headphones);

    // Player shadow ring
    const pShadowGeo = new THREE.CircleGeometry(0.6, 32);
    const pShadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
    const pShadow = new THREE.Mesh(pShadowGeo, pShadowMat);
    pShadow.rotation.x = -Math.PI / 2;
    pShadow.position.y = 0.02;
    player.add(pShadow);

    scene.add(player);

    // 8. Key Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' && nearbyNpc) {
        playSound('click');
        handleSelectLoc(nearbyNpc);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 9. Mouse Raycasting for Building Clicks
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

    // 10. Real-time Movement & Camera Tracking Loop
    let animId: number;
    let playerSpeed = 0.16;
    let playerAngle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Handle Keyboard Walking Controls (WASD & Arrows)
      let moved = false;
      const keys = keysPressed.current;

      if (keys['w'] || keys['arrowup']) {
        player.position.x -= Math.sin(playerAngle) * playerSpeed;
        player.position.z -= Math.cos(playerAngle) * playerSpeed;
        moved = true;
      }
      if (keys['s'] || keys['arrowdown']) {
        player.position.x += Math.sin(playerAngle) * playerSpeed;
        player.position.z += Math.cos(playerAngle) * playerSpeed;
        moved = true;
      }
      if (keys['a'] || keys['arrowleft']) {
        playerAngle += 0.04;
        player.rotation.y = playerAngle;
      }
      if (keys['d'] || keys['arrowright']) {
        playerAngle -= 0.04;
        player.rotation.y = playerAngle;
      }

      // Keep within city bounds (-24 to +24)
      player.position.x = Math.max(-23, Math.min(23, player.position.x));
      player.position.z = Math.max(-23, Math.min(23, player.position.z));

      // Walking bounce animation
      if (moved) {
        pBody.position.y = 0.7 + Math.sin(Date.now() * 0.012) * 0.08;
      } else {
        pBody.position.y = 0.7;
      }

      // Smooth 3rd-Person Follow Camera
      const cameraOffset = new THREE.Vector3(
        Math.sin(playerAngle) * 9,
        6.5,
        Math.cos(playerAngle) * 9
      );
      camera.position.lerp(player.position.clone().add(cameraOffset), 0.08);
      camera.lookAt(player.position.x, player.position.y + 1.2, player.position.z);

      // Check Proximity to NPCs (< 4.5 units)
      let foundNearby: WorldLocation | null = null;
      npcMarkers.forEach(({ mesh, loc }) => {
        const dist = player.position.distanceTo(mesh.position);
        if (dist < 4.2) {
          foundNearby = loc;
        }
        mesh.rotation.y += 0.01;
      });
      setNearbyNpc(foundNearby);

      // Update state for HUD display
      setPlayerCoords({
        x: Math.round(player.position.x),
        z: Math.round(player.position.z),
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = Math.min(540, window.innerHeight * 0.6);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      currentMount.removeEventListener('click', handlePointerClick);
      cancelAnimationFrame(animId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [is3DMode, handleSelectLoc]);

  return (
    <div className="space-y-6 text-right">
      
      {/* 3D World Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HENGLISH 3D OPEN WORLD • عالم المحاكاة المفتوح</span>
          </div>
          <h3 className="text-2xl font-black text-white mt-1">المدينة الإنجليزية ثلاثية الأبعاد التفاعلية 🌐</h3>
          <p className="text-xs text-[#b9b6d5]">
            تحرك بشخصيتك داخل المدينة باستخدام لوحة المفاتيح (W, A, S, D أو الأسهم)، اقترب من الشخصيات (NPCs) وتحدث معهم بالإنجليزية.
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
            <span>عالم 3D التفاعلي</span>
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
            <span>الخريطة السريعة (2D)</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      {is3DMode ? (
        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0a091a]">
          
          {/* Real Three.js Canvas Container */}
          <div ref={mountRef} className="w-full h-[360px] sm:h-[480px] cursor-grab active:cursor-grabbing" />

          {/* Interactive HUD Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>X: {playerCoords.x} | Z: {playerCoords.z}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#ff4f9a]/20 backdrop-blur-md border border-[#ff4f9a]/30 text-[11px] font-bold text-[#ff8bb9] flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>تحرك بـ W, A, S, D أو الأسهم</span>
            </div>
          </div>

          {/* Proximity Interaction Prompt with NPC */}
          {nearbyNpc && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <button
                onClick={() => {
                  playSound('click');
                  handleSelectLoc(nearbyNpc);
                }}
                className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] via-[#ff9c66] to-[#ff4f9a] text-[#0c0b20] font-black text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer ring-4 ring-white/20"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>اضغط E أو انقر لبدء المحادثة مع {nearbyNpc.npcName} ({nearbyNpc.icon})</span>
              </button>
            </div>
          )}

          {/* Quick Fast-Travel Toolbar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-[90vw]">
            <span className="text-[10px] text-[#ffd166] font-bold px-2 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              انتقال سريع:
            </span>
            {LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  playSound('click');
                  handleSelectLoc(loc);
                }}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>{loc.icon}</span>
                <span className="hidden sm:inline">{loc.nameEn.split(' ')[0]}</span>
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
                <h4 className="text-lg font-black text-white group-hover:text-[#41e7ff] transition-colors">{loc.nameAr}</h4>
                <div className="text-xs font-mono text-[#b9b6d5]">{loc.nameEn}</div>
              </div>
              <p className="text-xs text-[#dedbf4] leading-relaxed">{loc.descriptionAr}</p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#c4ff55] font-bold">الشخصية: {loc.npcName}</span>
                <span className="text-[#ffd166] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  دخول المحاكاة <ChevronLeft className="w-3.5 h-3.5" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className="w-full max-w-2xl rounded-3xl bg-linear-to-b from-[#1b1939] to-[#0c0b20] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl relative text-right">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedLocation(null)}
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

              {/* NPC Intro Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ff4f9a]/20 border border-[#ff4f9a]/40 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#b9b6d5]">شخصية الذكاء الاصطناعي المسؤولة:</div>
                  <div className="text-sm font-bold text-white">{selectedLocation.npcName} — <span className="text-xs text-[#41e7ff]">{selectedLocation.npcRole}</span></div>
                </div>
              </div>

              <p className="text-sm text-[#dedbf4] leading-relaxed">
                {selectedLocation.descriptionAr}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    playSound('click');
                    if (onSelectScenario) {
                      onSelectScenario(selectedLocation.scenarioId);
                    }
                    onNavigate('real-life');
                    setSelectedLocation(null);
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-sm shadow-xl hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>بدء محاكاة المحادثة الحية الآن</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    onNavigate('speaking');
                    setSelectedLocation(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>معمل النطق الصوتي</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
