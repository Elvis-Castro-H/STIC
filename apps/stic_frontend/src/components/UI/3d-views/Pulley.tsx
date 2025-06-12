"use client";
import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  MeshPhongMaterial,
  Mesh,
  CylinderGeometry,
  TorusGeometry,
  DoubleSide,
  Color,
  SRGBColorSpace,
  Group,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type PulleySceneProps = {
  radius?: number;
  thickness?: number;
  grooveDepth?: number;
  grooveWidth?: number;
  centerHoleRadius?: number;
  ropeRadius?: number;
  ropeLength?: number;
};

const PulleyScene = ({
  radius = 5,
  thickness = 1.5,
  grooveDepth = 0.5,
  grooveWidth = 0.8,
  centerHoleRadius = 1,
  ropeRadius = 0.3,
  ropeLength = 20,
}: PulleySceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.outputColorSpace = SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 10, 20);

    // Lights
    const ambientLight = new AmbientLight(0x666666);
    const directionalLight1 = new DirectionalLight(0xeeeeee);
    directionalLight1.position.set(-1, 1, 1);
    const directionalLight2 = new DirectionalLight(0xcccccc);
    directionalLight2.position.set(1, -1, -1);
    scene.add(ambientLight, directionalLight1, directionalLight2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Materials
    const pulleyMaterial = new MeshPhongMaterial({
      color: new Color(0x8B4513), // Brown color for wood
      shininess: 30,
    });

    const grooveMaterial = new MeshPhongMaterial({
      color: new Color(0xA0522D), // Darker brown for groove
      shininess: 20,
    });

    const ropeMaterial = new MeshPhongMaterial({
      color: new Color(0xD3D3D3), // Light gray for rope
      side: DoubleSide,
    });

    // Create pulley group
    const pulleyGroup = new Group();
    scene.add(pulleyGroup);

    // Main pulley body
    const pulleyBody = new CylinderGeometry(
      radius,
      radius,
      thickness,
      32
    );
    const pulleyMesh = new Mesh(pulleyBody, pulleyMaterial);
    pulleyGroup.add(pulleyMesh);

    // Groove (as a torus)
    const groove = new TorusGeometry(
      radius - grooveDepth,
      grooveWidth,
      16,
      32
    );
    const grooveMesh = new Mesh(groove, grooveMaterial);
    grooveMesh.rotation.x = Math.PI / 2;
    pulleyGroup.add(grooveMesh);

    // Center hole
    const hole = new CylinderGeometry(
      centerHoleRadius,
      centerHoleRadius,
      thickness + 0.2,
      32
    );
    const holeMesh = new Mesh(hole, pulleyMaterial);
    holeMesh.position.y = 0;
    pulleyGroup.add(holeMesh);

    // Rope (as a cylinder)
    const rope = new CylinderGeometry(
      ropeRadius,
      ropeRadius,
      ropeLength,
      16
    );
    const ropeMesh = new Mesh(rope, ropeMaterial);
    ropeMesh.position.set(radius + grooveWidth / 2, -ropeLength / 2, 0);
    ropeMesh.rotation.z = Math.PI / 2;
    pulleyGroup.add(ropeMesh);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [radius, thickness, grooveDepth, grooveWidth, centerHoleRadius, ropeRadius, ropeLength]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PulleyScene;