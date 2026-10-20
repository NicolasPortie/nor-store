import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap, ScrollTrigger } from './gsap';

type SymbolSceneOptions = {
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  animated: boolean;
};

export type SymbolScene = { dispose: () => void };

/** The NØR mark as a glossy 3D object: a ring crossed by a diagonal bar. */
export function createSymbolScene({ canvas, section, animated }: SymbolSceneOptions): SymbolScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;

  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 9.5);

  const material = new MeshPhysicalMaterial({
    color: new Color('#0b0707'),
    metalness: 0.55,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.25,
  });

  const ring = new Mesh(new TorusGeometry(1.7, 0.52, 48, 160), material);
  ring.scale.z = 0.72;

  const bar = new Mesh(new RoundedBoxGeometry(0.42, 5.4, 0.62, 6, 0.18), material);
  bar.rotation.z = -Math.PI / 5.2;

  const mark = new Group();
  mark.add(ring, bar);
  scene.add(mark);

  const key = new DirectionalLight(0xff3b30, 1.6);
  key.position.set(-4, 3, 5);
  scene.add(key);
  const rim = new DirectionalLight(0xf5e9e2, 1.1);
  rim.position.set(5, -2, -3);
  scene.add(rim);

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  const scroll = { progress: 0 };
  let visible = false;
  let spin = 0;

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  const draw = (delta: number) => {
    smooth.x += (pointer.x - smooth.x) * Math.min(1, delta * 4);
    smooth.y += (pointer.y - smooth.y) * Math.min(1, delta * 4);
    if (animated) spin += delta * 0.6;
    mark.rotation.y = Math.sin(spin) * 0.45 + smooth.x * 0.4 + (scroll.progress - 0.5) * 0.7;
    mark.rotation.x = smooth.y * 0.35 - 0.12;
    renderer.render(scene, camera);
  };

  const tick = (_time: number, deltaMs: number) => {
    if (visible) draw(deltaMs / 1000);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (visible) draw(0);
  });
  resizeObserver.observe(canvas);
  resize();
  draw(0);

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      visible = self.isActive;
    },
    onUpdate: (self) => {
      scroll.progress = self.progress;
      if (!animated) draw(0);
    },
  });

  if (animated) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    gsap.ticker.add(tick);
  }

  return {
    dispose() {
      trigger.kill();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      gsap.ticker.remove(tick);
      ring.geometry.dispose();
      bar.geometry.dispose();
      material.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
