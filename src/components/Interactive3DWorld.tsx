import React, { useEffect, useRef, useState } from 'react';
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
  Volume2
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
}

const LOCATIONS: WorldLocation[] = [
  {
    id: 'airport',
    nameEn: 'International Airport',
    nameAr: 'مطار القاهرة الدولي - صالة ٣',
    scenarioId: 'sim-airport-checkin',
    category: 'Travel & Aviation',
    icon: '✈️',
    position: [-10, 0, -6],
    color: 0x41e7ff, // Cyan Neon
    buildingHeight: 4,
    descriptionAr: 'مواقف إنهاء إجراءات السفر، وزن الحقائب، بطاقات الصعود، والاستفسار عن بوابات الإقلاع.',
  },
  {
    id: 'restaurant',
    nameEn: 'The Ivy Restaurant & Café',
    nameAr: 'مطعم و كافيه الضيافة',
    scenarioId: 'sim-restaurant-ordering',
    category: 'Hospitality',
    icon: '🍽️',
    position: [-4, 0, 8],
    color: 0xffd166, // Gold Neon
    buildingHeight: 3,
    descriptionAr: 'طلب الطعام الفاخر، حجز الطاولات، السؤال عن مكونات الأطباق، وطلب الحساب بلباقة.',
  },
  {
    id: 'hospital',
    nameEn: 'St. Mary Medical Center',
    nameAr: 'المركز الطبي والعيادات التخصصية',
    scenarioId: 'sim-doctor-appointment',
    category: 'Healthcare',
    icon: '🩺',
    position: [8, 0, -8],
    color: 0xff4f9a, // Pink Neon
    buildingHeight: 5,
    descriptionAr: 'شرح الأعراض المرضية، مواعيد الطبيب، وصف الأدوية، والصيدلية.',
  },
  {
    id: 'tech-office',
    nameEn: 'Tech Innovation Hub',
    nameAr: 'برج التكنولوجيا ومقابلات العمل',
    scenarioId: 'sim-job-interview',
    category: 'Business & Careers',
    icon: '💼',
    position: [10, 0, 6],
    color: 0xc4ff55, // Lime Neon
    buildingHeight: 7,
    descriptionAr: 'مقابلات التوظيف بالإنجليزية، اجتماعات تطوير المنتجات، والتفاوض الوظيفي.',
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
    buildingHeight: 6,
    descriptionAr: 'مقر المحاضرات المباشرة، الاختبارات، والمكتبة المركزية الشاملة.',
  },
];

export const Interactive3DWorld: React.FC<Interactive3DWorldProps> = ({
  onNavigate,
  onSelectScenario,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [hoveredLocationName, setHoveredLocationName] = useState<string | null>(null);

  useEffect(() => {
    if (!is3DMode || !mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || 800;
    const height = Math.min(500, window.innerHeight * 0.55);

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0b20);
    scene.fog = new THREE.FogExp2(0x0c0b20, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 18, 26);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(15, 25, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x41e7ff, 2, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 3. Ground Grid Plane with Neon Cyber Styling
    const gridHelper = new THREE.GridHelper(36, 36, 0x41e7ff, 0x1f1d43);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Circular ground glow
    const groundGeo = new THREE.CircleGeometry(18, 64);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x121128,
      transparent: true,
      opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // 4. Interactive 3D Buildings & Beacons
    const buildingMeshes: THREE.Mesh[] = [];
    const beacons: THREE.Mesh[] = [];

    LOCATIONS.forEach(loc => {
      // Main Building block
      const geo = new THREE.BoxGeometry(3, loc.buildingHeight, 3);
      const mat = new THREE.MeshStandardMaterial({
        color: loc.color,
        roughness: 0.25,
        metalness: 0.6,
        emissive: loc.color,
        emissiveIntensity: 0.15,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(loc.position[0], loc.buildingHeight / 2, loc.position[2]);
      mesh.userData = { location: loc };
      scene.add(mesh);
      buildingMeshes.push(mesh);

      // Floating pulsating beacon marker above building
      const beaconGeo = new THREE.OctahedronGeometry(0.7, 0);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(loc.position[0], loc.buildingHeight + 1.6, loc.position[2]);
      scene.add(beacon);
      beacons.push(beacon);
    });

    // 5. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        const loc = target.userData.location as WorldLocation;
        setHoveredLocationName(loc.nameAr);
        currentMount.style.cursor = 'pointer';
      } else {
        setHoveredLocationName(null);
        currentMount.style.cursor = 'grab';
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);
      if (intersects.length > 0) {
        playSound('click');
        const target = intersects[0].object as THREE.Mesh;
        const loc = target.userData.location as WorldLocation;
        setSelectedLocation(loc);
      }
    };

    currentMount.addEventListener('mousemove', handlePointerMove);
    currentMount.addEventListener('click', handleClick);

    // 6. Animation Loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle orbital camera float
      angle += 0.003;
      camera.position.x = Math.sin(angle) * 24;
      camera.position.z = Math.cos(angle) * 24;
      camera.lookAt(0, 2, 0);

      // Rotate beacons
      beacons.forEach((b, i) => {
        b.rotation.y += 0.02;
        b.position.y += Math.sin(Date.now() * 0.003 + i) * 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = Math.min(500, window.innerHeight * 0.55);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handlePointerMove);
      currentMount.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [is3DMode]);

  return (
    <div className="space-y-6 text-right">
      
      {/* 3D World Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D INTERACTIVE CITY • العالم الافتراضي ثلاثي الأبعاد</span>
          </div>
          <h3 className="text-2xl font-black text-white mt-1">خريطة المدينة الإنجليزية الافتراضية 🌐</h3>
          <p className="text-xs text-[#b9b6d5]">
            تجوّل بين معالم المدينة وتفاعل مباشرة مع المواقع لدخول المحاكاة الحية لمواقف المطار، المطعم، المستشفى والوظائف.
          </p>
        </div>

        {/* 2D / 3D Mode Toggle */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => {
              playSound('click');
              setIs3DMode(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              is3DMode
                ? 'bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black shadow-md'
                : 'text-[#b9b6d5] hover:text-white'
            }`}
          >
            العالم ثلاثي الأبعاد 3D
          </button>
          <button
            onClick={() => {
              playSound('click');
              setIs3DMode(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !is3DMode
                ? 'bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black shadow-md'
                : 'text-[#b9b6d5] hover:text-white'
            }`}
          >
            الخريطة السريعة 2D
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      {is3DMode ? (
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0c0b20] shadow-2xl">
          <div ref={mountRef} className="w-full h-[460px] touch-none" />

          {/* Hover Overlay Hint */}
          <div className="absolute top-4 right-4 pointer-events-none z-10">
            {hoveredLocationName ? (
              <div className="px-4 py-2 rounded-xl bg-[#171632]/90 backdrop-blur-md border border-[#ffd166] text-white text-xs font-black shadow-lg animate-pulse">
                انقر للدخول: {hoveredLocationName} 📍
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 text-[11px] text-[#b9b6d5]">
                حرّك الفأرة للاستكشاف • انقر على أي مبنى للدخول
              </div>
            )}
          </div>

          {/* Quick Location Pills at Bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center gap-2 flex-wrap pointer-events-auto">
            {LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  playSound('click');
                  setSelectedLocation(loc);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#171632]/90 hover:bg-[#171632] border border-white/15 text-xs font-bold text-white shadow-lg flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
              >
                <span>{loc.icon}</span>
                <span>{loc.nameAr.split('-')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Lightweight 2D Grid Fallback */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCATIONS.map(loc => (
            <div
              key={loc.id}
              onClick={() => {
                playSound('click');
                setSelectedLocation(loc);
              }}
              className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-3 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{loc.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#ffd166]">
                  {loc.category}
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-white">{loc.nameAr}</h4>
                <span className="text-xs font-mono text-[#41e7ff]">{loc.nameEn}</span>
              </div>
              <p className="text-xs text-[#b9b6d5] leading-relaxed line-clamp-2">
                {loc.descriptionAr}
              </p>
              <button className="text-xs font-bold text-[#ffd166] flex items-center gap-1">
                <span>فتح المحاكاة التفاعلية</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selected Location Details Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLocation(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#171632] border border-white/20 p-6 sm:p-8 shadow-2xl text-right z-10 space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="إغلاق النافذة"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedLocation.icon}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedLocation.nameAr}</h3>
                    <div className="text-xs font-mono text-[#ffd166]">{selectedLocation.nameEn}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed">
                {selectedLocation.descriptionAr}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    if (onSelectScenario) {
                      onSelectScenario(selectedLocation.scenarioId);
                    }
                    onNavigate('real-life');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>بدء سيناريو المحادثة التفاعلية ⚡</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    onNavigate('real-life');
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 cursor-pointer"
                >
                  استعراض جميع سيناريوهات الموقع
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
