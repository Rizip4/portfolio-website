"use client";

import { useRef, useEffect, useMemo, useState, type CSSProperties } from "react";
import * as THREE from "three";

interface AnimationConfig { animate: boolean; speed: number; }
interface SingleColorConfig { mode: "single"; color: string; }
interface MultiColorConfig { mode: "multi"; color1: string; color2: string; }
interface RandomColorConfig { mode: "random"; }
type RaysColorConfig = SingleColorConfig | MultiColorConfig | RandomColorConfig;

interface RaysProps {
  intensity?: number;
  rays?: number;
  reach?: number;
  position?: number;
  radius?: string;
  backgroundColor?: string;
  animation?: AnimationConfig;
  raysColor?: RaysColorConfig;
  style?: CSSProperties;
  className?: string;
}

const RAY_Y_POSITION_1 = -0.4;
const RAY_Y_POSITION_2 = -0.5;

function colorToRGB(hex: string): [number, number, number] {
  let r = 1, g = 1, b = 1;
  if (hex.startsWith("#")) {
    const c = hex.slice(1);
    if (c.length === 3) {
      r = parseInt(c[0] + c[0], 16) / 255;
      g = parseInt(c[1] + c[1], 16) / 255;
      b = parseInt(c[2] + c[2], 16) / 255;
    } else if (c.length >= 6) {
      r = parseInt(c.slice(0, 2), 16) / 255;
      g = parseInt(c.slice(2, 4), 16) / 255;
      b = parseInt(c.slice(4, 6), 16) / 255;
    }
  }
  return [r, g, b];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; }
  else if (h >= 60 && h < 120) { r = x; g = c; }
  else if (h >= 120 && h < 180) { g = c; b = x; }
  else if (h >= 180 && h < 240) { g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [r + m, g + m, b + m];
}

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

const VERTEX_SHADER = `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FRAGMENT_SHADER = `
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);
    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;
    float strength1 = rayStrength(u_rayPos1, normalize(vec2(1.0, -0.116)), coord, 36.2214*speed, 21.11349*speed, 1.5*speed);
    float strength2 = rayStrength(u_rayPos2, normalize(vec2(1.0, 0.241)), coord, 22.39910*speed, 18.0234*speed, 1.1*speed);
    float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);
    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;
    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;
    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);
    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);
    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

export default function Rays({
  intensity = 13, rays = 32, reach = 16, position = 50,
  radius = "0px", backgroundColor = "#000",
  animation = { animate: true, speed: 10 },
  raysColor = { mode: "single", color: "#639AFF" },
  style, className,
}: RaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | undefined>(undefined);
  const animationRef = useRef<AnimationConfig>(animation);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); return () => setIsMounted(false); }, []);
  useEffect(() => { animationRef.current = animation; }, [animation]);

  const [randomColor1RGB, randomColor2RGB] = useMemo(() => {
    if (raysColor.mode === "random") {
      const h = Math.random() * 360;
      const s = 60 + Math.random() * 40;
      return [hslToRgb(h, s, 50), hslToRgb(h, s, 65)];
    }
    return [[1, 1, 1], [1, 1, 1]] as [[number, number, number], [number, number, number]];
  }, [raysColor.mode]);

  const [color1RGB, color2RGB] = useMemo((): [[number, number, number], [number, number, number]] => {
    if (raysColor.mode === "random") return [randomColor1RGB, randomColor2RGB];
    let color1 = "#fff", color2 = "#fff";
    if (raysColor.mode === "single") { color1 = raysColor.color; color2 = raysColor.color; }
    else if (raysColor.mode === "multi") { color1 = raysColor.color1; color2 = raysColor.color2; }
    return [colorToRGB(color1), colorToRGB(color2)];
  }, [raysColor, randomColor1RGB, randomColor2RGB]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMounted) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, premultipliedAlpha: true, alpha: true, antialias: true, precision: "highp", powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);
    const geometry = new THREE.PlaneGeometry(1024, 1024);
    const material = new THREE.ShaderMaterial({
      fragmentShader: FRAGMENT_SHADER, vertexShader: VERTEX_SHADER,
      uniforms: {
        u_colors: { value: [new THREE.Vector4(color1RGB[0], color1RGB[1], color1RGB[2], 1), new THREE.Vector4(color2RGB[0], color2RGB[1], color2RGB[2], 1)] },
        u_intensity: { value: mapRange(intensity, 0, 100, 0, 0.5) },
        u_rays: { value: mapRange(rays, 0, 100, 0, 0.3) },
        u_reach: { value: mapRange(reach, 0, 100, 0, 0.5) },
        u_time: { value: Math.random() * 10000 },
        u_resolution: { value: [container.clientWidth, container.clientHeight] },
        u_rayPos1: { value: [(position / 100) * container.clientWidth, RAY_Y_POSITION_1 * container.clientHeight] },
        u_rayPos2: { value: [(position / 100 + 0.02) * container.clientWidth, RAY_Y_POSITION_2 * container.clientHeight] },
      },
      wireframe: false, dithering: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;
    let lastTime = 0;
    const animate = (time: number) => {
      const anim = animationRef.current;
      if (!anim.animate) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      if (mesh.material instanceof THREE.ShaderMaterial && anim.animate) {
        mesh.material.uniforms.u_time.value += (delta * anim.speed) / 1000 / 10;
      }
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    frameIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameIdRef.current !== undefined) cancelAnimationFrame(frameIdRef.current);
      renderer.dispose(); geometry.dispose(); material.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isMounted]);

  useEffect(() => {
    if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
      const material = meshRef.current.material;
      const container = containerRef.current;
      if (!container) return;
      material.uniforms.u_colors.value = [new THREE.Vector4(color1RGB[0], color1RGB[1], color1RGB[2], 1), new THREE.Vector4(color2RGB[0], color2RGB[1], color2RGB[2], 1)];
      material.uniforms.u_intensity.value = mapRange(intensity, 0, 100, 0, 0.5);
      material.uniforms.u_rays.value = mapRange(rays, 0, 100, 0, 0.3);
      material.uniforms.u_reach.value = mapRange(reach, 0, 100, 0, 0.5);
      material.uniforms.u_rayPos1.value = [(position / 100) * container.clientWidth, RAY_Y_POSITION_1 * container.clientHeight];
      material.uniforms.u_rayPos2.value = [(position / 100 + 0.02) * container.clientWidth, RAY_Y_POSITION_2 * container.clientHeight];
    }
  }, [intensity, rays, reach, position, color1RGB, color2RGB]);

  return (
    <div ref={containerRef} className={className}
      style={{ position: "absolute", inset: 0, zIndex: -1, borderRadius: radius, overflow: "hidden", backgroundColor, ...style }}
    />
  );
}
