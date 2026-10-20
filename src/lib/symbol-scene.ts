import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Texture,
} from 'three';
import { gsap, ScrollTrigger } from './gsap';

type SymbolSceneOptions = {
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  animated: boolean;
};

export type SymbolScene = { dispose: () => void };

const RING_OUTER = 2.2;
const RING_INNER = 1.1;
const SLASH_LENGTH = 7.4;
const SLASH_WIDTH = 0.5;
const SLASH_ANGLE = -Math.PI / 5;

/** Studio-style environment: a dark room lit by hard softboxes, so reflections read as crisp strips. */
function createStudio(renderer: WebGLRenderer, frontLight: boolean) {
  const room = new Scene();
  const disposables: Array<BufferGeometry | Material> = [];

  const panel = (width: number, height: number, color: Color, x: number, y: number, z: number) => {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ color, side: DoubleSide, toneMapped: false });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    room.add(mesh);
    disposables.push(geometry, material);
  };

  const shell = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0x120405 }));
  disposables.push(shell.geometry, shell.material as Material);

  const hot = (value: number) => new Color().setRGB(value, value, value);
  panel(16, 7, hot(7), 0, 11, 2); // key softbox above
  panel(2.2, 16, hot(9), -10, 1, 3); // tall strip on the left
  panel(2.2, 16, hot(5), 10, 0, -2); // strip on the right, behind
  panel(9, 12, new Color().setRGB(5.5, 0.12, 0.1), 9, -2, 6); // brand-red card
  panel(14, 3, hot(2.4), 0, -9, 4); // floor bounce
  if (frontLight) {
    panel(20, 12, hot(0.3), 0, 1, 14); // soft frontal fill
    panel(15, 4.5, hot(3.2), 0, 6.5, 12); // glossy sweep high in front
    panel(9, 3, hot(1.4), -6, -5.5, 12); // low front-left kicker
  }

  const pmrem = new PMREMGenerator(renderer);
  room.background = new Color(0x0c0304);
  const texture = pmrem.fromScene(room, 0.015).texture;
  pmrem.dispose();
  disposables.forEach((item) => item.dispose());
  return texture;
}

function roundedBarShape(width: number, length: number) {
  const radius = width / 2;
  const half = length / 2;
  const shape = new Shape();
  shape.moveTo(-radius, -half + radius);
  shape.lineTo(-radius, half - radius);
  shape.absarc(0, half - radius, radius, Math.PI, 0, true);
  shape.lineTo(radius, -half + radius);
  shape.absarc(0, -half + radius, radius, 0, Math.PI, true);
  return shape;
}

function bevelled(shape: Shape, depth: number, bevel: number, curveSegments: number) {
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    curveSegments,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: 10,
  });
  geometry.center();
  return geometry;
}

function createShadowTexture() {
  const size = 256;
  const surface = document.createElement('canvas');
  surface.width = size;
  surface.height = size;
  const context = surface.getContext('2d')!;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)');
  gradient.addColorStop(0.55, 'rgba(0,0,0,0.18)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(surface);
  texture.minFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * The NØR mark as a machined 3D object: a bevelled ring pierced by a chrome bar, lit by a studio
 * environment. It assembles itself on entry, floats, tilts with the pointer and can be dragged.
 */
export function createSymbolScene({ canvas, section, animated }: SymbolSceneOptions): SymbolScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const environment: Texture = createStudio(renderer, true);
  const darkEnvironment: Texture = createStudio(renderer, false);
  scene.environment = environment;

  const camera = new PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.set(0, 0, 12.6);

  const ringShape = new Shape();
  ringShape.absarc(0, 0, RING_OUTER, 0, Math.PI * 2, false);
  const hole = new Path();
  hole.absarc(0, 0, RING_INNER, 0, Math.PI * 2, true);
  ringShape.holes.push(hole);

  const ringMaterial = new MeshPhysicalMaterial({
    color: new Color('#0a0606'),
    metalness: 0.15,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMap: darkEnvironment,
    envMapIntensity: 1.35,
  });
  const slashMaterial = new MeshPhysicalMaterial({
    color: new Color('#efe6e1'),
    metalness: 1,
    roughness: 0.14,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.5,
  });

  const ringGeometry = bevelled(ringShape, 0.46, 0.16, 128);
  const slashGeometry = bevelled(roundedBarShape(SLASH_WIDTH, SLASH_LENGTH), 0.9, 0.1, 24);
  const ring = new Mesh(ringGeometry, ringMaterial);
  const slash = new Mesh(slashGeometry, slashMaterial);
  const slashPivot = new Group();
  slashPivot.rotation.z = SLASH_ANGLE;
  slashPivot.add(slash);

  const orbitMaterial = new MeshBasicMaterial({
    color: 0xf5e9e2,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const orbitGeometry = new TorusGeometry(3.25, 0.011, 8, 220);
  const beadGeometry = new SphereGeometry(0.075, 16, 16);
  const orbitRing = new Mesh(orbitGeometry, orbitMaterial);
  const bead = new Mesh(beadGeometry, new MeshBasicMaterial({ color: 0xffffff }));
  bead.position.x = 3.25;
  const orbit = new Group();
  orbit.rotation.set(1.18, 0.34, 0);
  orbit.add(orbitRing, bead);

  const shadowTexture = createShadowTexture();
  const shadowMaterial = new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
  const shadowGeometry = new PlaneGeometry(6, 1.05);
  const shadow = new Mesh(shadowGeometry, shadowMaterial);
  shadow.position.set(0, -3.15, -1);

  const mark = new Group();
  mark.add(ring, slashPivot, orbit);
  scene.add(mark, shadow);

  const key = new DirectionalLight(0xff3b30, 1.2);
  key.position.set(-5, 3, 6);
  scene.add(key);

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  const drag = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, lastX: 0, lastY: 0 };
  const state = { hover: 0, hoverTarget: 0, kick: 0, build: animated ? 0 : 1, scroll: 0 };
  let visible = false;
  let time = 0;

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  const draw = (delta: number) => {
    time += delta;
    const ease = Math.min(1, delta * 5);
    smooth.x += (pointer.x - smooth.x) * ease;
    smooth.y += (pointer.y - smooth.y) * ease;
    drag.x += (drag.targetX - drag.x) * Math.min(1, delta * 12);
    drag.y += (drag.targetY - drag.y) * Math.min(1, delta * 12);
    state.hover += (state.hoverTarget - state.hover) * Math.min(1, delta * 6);

    const build = state.build;
    const idle = animated ? Math.sin(time * 0.7) : 0;
    mark.rotation.y =
      idle * 0.42 + smooth.x * 0.38 + (state.scroll - 0.5) * 0.6 + drag.x + state.kick + (1 - build) * 0.6;
    mark.rotation.x = smooth.y * 0.28 - 0.1 + drag.y + Math.sin(time * 0.5) * (animated ? 0.05 : 0);
    mark.position.y = animated ? Math.sin(time * 0.9) * 0.12 : 0;
    mark.scale.setScalar(build * (1 + state.hover * 0.035));

    slash.position.y = (1 - build) * -9 + state.hover * 0.32;
    ring.rotation.z = (1 - build) * -Math.PI * 1.1;
    orbit.rotation.z = time * 0.35;
    orbitMaterial.opacity = 0.5 * build;
    bead.rotation.z = -orbit.rotation.z;

    const lift = mark.position.y;
    shadow.scale.setScalar(build * (1 - lift * 0.4));
    shadowMaterial.opacity = build * (0.85 - lift * 0.5);
    renderer.render(scene, camera);
  };

  const tick = (_time: number, deltaMs: number) => {
    if (visible) draw(Math.min(deltaMs / 1000, 0.05));
  };

  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    if (!drag.active) return;
    drag.targetX += (event.clientX - drag.lastX) * 0.012;
    drag.targetY += (event.clientY - drag.lastY) * 0.008;
    drag.targetY = gsap.utils.clamp(-0.9, 0.9, drag.targetY);
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
  };

  const release = () => {
    if (!drag.active) return;
    drag.active = false;
    canvas.classList.remove('is-dragging');
    // Rotate the object back to rest along the nearest full turn, with a springy settle.
    const turns = Math.round(drag.targetX / (Math.PI * 2));
    gsap.to(drag, { targetX: turns * Math.PI * 2, targetY: 0, duration: 1.6, ease: 'elastic.out(1, 0.55)' });
  };

  const onPointerDown = (event: PointerEvent) => {
    gsap.killTweensOf(drag);
    drag.active = true;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    canvas.classList.add('is-dragging');
    canvas.setPointerCapture(event.pointerId);
  };

  const onEnter = () => {
    state.hoverTarget = 1;
  };
  const onLeave = () => {
    state.hoverTarget = 0;
  };

  const onClick = () => {
    if (Math.abs(drag.targetX) > 0.2) return;
    gsap.to(state, { kick: state.kick + Math.PI * 2, duration: 1.4, ease: 'power4.out' });
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (visible) draw(0);
  });
  resizeObserver.observe(canvas);
  resize();
  draw(0);

  const scrollTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      visible = self.isActive;
    },
    onUpdate: (self) => {
      state.scroll = self.progress;
      if (!animated) draw(0);
    },
  });

  let intro: gsap.core.Tween | undefined;
  let entryTrigger: ScrollTrigger | undefined;
  if (animated) {
    const play = () => {
      if (intro) return;
      intro = gsap.to(state, { build: 1, duration: 2.1, ease: 'expo.out', delay: 0.1 });
    };
    entryTrigger = ScrollTrigger.create({ trigger: section, start: 'top 72%', onEnter: play });
    if (entryTrigger.progress > 0) play();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick);
    gsap.ticker.add(tick);
  }

  return {
    dispose() {
      scrollTrigger.kill();
      entryTrigger?.kill();
      intro?.kill();
      gsap.killTweensOf(drag);
      gsap.killTweensOf(state);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', release);
      canvas.removeEventListener('pointercancel', release);
      canvas.removeEventListener('pointerenter', onEnter);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      [ringGeometry, slashGeometry, orbitGeometry, beadGeometry, shadowGeometry].forEach((item) => item.dispose());
      [ringMaterial, slashMaterial, orbitMaterial, shadowMaterial, bead.material as Material].forEach((item) =>
        item.dispose(),
      );
      shadowTexture.dispose();
      environment.dispose();
      darkEnvironment.dispose();
      renderer.dispose();
    },
  };
}
