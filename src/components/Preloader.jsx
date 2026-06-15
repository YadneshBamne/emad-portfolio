import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ThreeErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}



const START_COLOR = new THREE.Color('#0D0D0C');
const END_COLOR = new THREE.Color('#ffffff');
const tempColor = new THREE.Color();

function CameraModel() {
  const { scene } = useGLTF('/scene.gltf');
  const texture = useTexture('/textures/cam2_u1_v1_diffuse.jpeg');
  const { viewport } = useThree();
  const groupRef = useRef();
  const fadeOpacity = useRef(0); // Track fade-in progress

  useEffect(() => {
    if (scene && texture) {
      // Configure texture parameters for GLTF UV alignment and color space
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      // 1. Reset scale and position first to get clean bounds
      scene.scale.set(1, 1, 1);
      scene.position.set(0, 0, 0);
      scene.rotation.set(0, 0, 0);

      // 2. Configure mesh properties and force-assign the diffuse map
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.map = texture;
            
            // PBR configurations to make the camera body completely matte with no shininess
            child.material.roughness = 0.95; // High roughness = fully diffuse, non-reflective finish
            child.material.metalness = 0.0;  // Zero metalness = flat matte composite body
            
            // Set starting color to match background (#0D0D0C) for a clean color fade-in
            child.material.color.copy(START_COLOR);

            // Enable transparency and start at 0 opacity for a smooth fade-in
            child.material.transparent = true;
            child.material.opacity = 0.0;
            
            child.material.needsUpdate = true;
          }
        }
      });

      // 3. Compute bounding bounds using mesh nodes only to ignore helpers or scanners
      const box = new THREE.Box3();
      let hasMesh = false;
      scene.traverse((child) => {
        if (child.isMesh) {
          if (!hasMesh) {
            box.setFromObject(child);
            hasMesh = true;
          } else {
            box.expandByObject(child);
          }
        }
      });

      if (hasMesh) {
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Dynamically scale model target size based on aspect ratio to prevent clipping on mobile portrait viewports
        const responsiveTargetSize = Math.min(2.4, viewport.width * 0.7);
        const scaleFactor = responsiveTargetSize / (maxDim || 1);
        
        scene.scale.setScalar(scaleFactor);

        // Position model center exactly at origin (0, 0, 0)
        const center = new THREE.Vector3();
        box.getCenter(center);
        scene.position.copy(center).multiplyScalar(-scaleFactor);
      }
    }
  }, [scene, texture, viewport.width]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // 2.2 rad/s (faster dynamic spin to showcase reflective metallic details)
      groupRef.current.rotation.y += delta * 2.2;
      
      // Floating wobble animation to make the camera feel suspended in space
      const elapsed = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(elapsed * 1.8) * 0.08;
    }

    // Smoothly fade in all camera meshes on load/mount
    if (scene && fadeOpacity.current < 1.0) {
      // Fade-in duration of ~0.6 seconds (delta * 1.6)
      fadeOpacity.current = Math.min(1.0, fadeOpacity.current + delta * 1.6);
      
      // Interpolate material color from starting bg color (#0D0D0C) to standard white (#ffffff)
      tempColor.lerpColors(START_COLOR, END_COLOR, fadeOpacity.current);

      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.copy(tempColor);
          child.material.opacity = fadeOpacity.current;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/scene.gltf');
useTexture.preload('/textures/cam2_u1_v1_diffuse.jpeg');

const words1 = ["CINEMATIC", "AESTHETIC", "DYNAMIC", "BEAUTIFUL"];
const words2 = ["ARTISTRY", "MOTION", "DESIGN", "CRAFT"];
const words3 = ["IMMERSIVE", "ELEVATED", "REFINED", "STUNNING"];
const words4 = ["VISION", "EXPERIENCE", "JOURNEY", "CREATIVITY"];

const CyclingWord = ({ words, interval = 2500, offset = 0, align = "center" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      const id = setInterval(() => {
        setIndex((prev) => (prev + 1) % words.length);
      }, interval);
      return () => clearInterval(id);
    }, offset);
    return () => clearTimeout(timer);
  }, [words, interval, offset]);

  // Adjust alignment class based on prop to keep text from jumping
  const alignClass = align === "left" ? "justify-start md:justify-start" : align === "right" ? "justify-end md:justify-end" : "justify-center";

  return (
    <div className={`relative flex items-center ${alignClass} h-4 md:h-5 w-full`}>
      <AnimatePresence>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute text-white/40 text-[10px] md:text-xs font-light tracking-[0.4em] md:tracking-[0.8em] uppercase whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const updateBrowserThemeColor = (color) => {
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', color);

  const metaTile = document.querySelector('meta[name="msapplication-TileColor"]');
  if (metaTile) {
    metaTile.setAttribute('content', color);
  }

  if (document.body) {
    document.body.style.backgroundColor = color;
  }
  if (document.documentElement) {
    document.documentElement.style.backgroundColor = color;
  }
};

export default function Preloader({ children }) {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showContent, setShowContent] = useState(() => {
    // Skip preloader if not on the home page
    return window.location.pathname !== '/';
  });

  useEffect(() => {
    if (showContent) return;
    updateBrowserThemeColor('#0D0D0C');
  }, [showContent]);

  useEffect(() => {
    if (showContent) return; // Don't run animation if we're skipping
    
    let currentProgress = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const updateProgress = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Increments by 18% per second (reaches 100% in ~5.5 seconds, ensuring other page assets load in the background)
      const increment = 18 * (deltaTime / 1000); 

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoadingComplete(true);
        updateBrowserThemeColor('#050505');
        setTimeout(() => setShowContent(true), 1000);
      }, 300);
    }
  }, [progress]);

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0C] transition-opacity duration-1000 ${loadingComplete ? 'opacity-0' : 'opacity-100'} overflow-hidden`}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 1%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-1%, 3%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(1%, 2%); }
          70% { transform: translate(3%, -1%); }
          80% { transform: translate(-2%, 1%); }
          90% { transform: translate(1%, 3%); }
          100% { transform: translate(0, 0); }
        }
      `}} />

      {/* Dynamic Animated Film Grain Noise overlay */}
      <div 
        className="absolute pointer-events-none opacity-[0.24] mix-blend-overlay z-20"
        style={{
          width: '120%',
          height: '120%',
          top: '-10%',
          left: '-10%',
          backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')`,
          animation: 'noiseShift 0.15s infinite steps(6)'
        }}
      />

      {/* Inspiring Words Background */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between py-[12vh] md:py-0 px-0 md:px-24 pointer-events-none z-0">
        <motion.div 
          className="flex flex-col gap-3 md:gap-4 items-center md:items-start w-64"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
        >
          <CyclingWord words={words1} interval={3000} offset={0} align="center" />
          <CyclingWord words={words2} interval={3000} offset={1500} align="center" />
        </motion.div>

        <motion.div 
          className="flex flex-col gap-3 md:gap-4 items-center md:items-end w-64"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
        >
          <CyclingWord words={words3} interval={3000} offset={750} align="center" />
          <CyclingWord words={words4} interval={3000} offset={2250} align="center" />
        </motion.div>
      </div>
      
      <div className="relative w-full max-w-[800px] h-[60vh] md:h-[500px] flex items-center justify-center px-4 z-10">
        
        {/* 3D Camera Model Canvas */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
        >
          <Canvas 
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.5
            }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
          >
            <ambientLight intensity={1.0} />
            {/* Rich studio lighting + cinematic red rim lights to match portfolio colors */}
            <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
            <directionalLight position={[-5, 3, 5]} intensity={0.8} color="#e2ebff" />
            <directionalLight position={[0, 5, -5]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[0, -5, 0]} intensity={0.5} color="#dce2e2" />
            
            {/* Colored PBR Rim Lights - Red Theme */}
            <directionalLight position={[-4, 4, -4]} intensity={3.5} color="#FF0000" /> {/* Left Red Rim */}
            <directionalLight position={[4, -2, -2]} intensity={2.5} color="#FF0000" /> {/* Right Red Rim */}
            
            {/* Red Back-Light Point Light to create a glowing silhouette halo */}
            <pointLight position={[0, 0, -1.8]} intensity={15.0} color="#FF0000" distance={6} decay={1.2} />
            
            <Suspense fallback={null}>
              <ThreeErrorBoundary fallback={null}>
                <CameraModel />
              </ThreeErrorBoundary>
            </Suspense>
          </Canvas>
        </div>

        {/* Minimalist Progress Counter and Thin Red Loading Line below the model */}
        <div className="absolute bottom-6 flex flex-col items-center gap-2.5 pointer-events-none">
          <span className="text-white/50 text-[10px] font-light tracking-[0.4em] uppercase" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(progress)}%
          </span>
          <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-[#FF0000] shadow-[0_0_8px_#FF0000]" 
              style={{ 
                width: `${progress}%`,
                transition: 'width 100ms ease-out' 
              }}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
