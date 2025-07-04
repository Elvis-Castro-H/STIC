// PulleyScene.tsx  –  v2.5
//
//  - rearFlangeRatio   (0–1)  ancho pestaña posterior / land
//  - frontFlangeRatio  (0–1)  ancho pestaña frontal  / land
//  - noShading         true ⇒ MeshBasicMaterial + sin luces
//

"use client";
import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshPhongMaterial,
  MeshBasicMaterial,
  AmbientLight,
  DirectionalLight,
  LatheGeometry,
  Vector2,
  Color,
  SRGBColorSpace,
} from "three";

// @ts-ignore – three/examples no tiene defs
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/*──────── Perfiles clásicos ────────*/
const belt = {
  A: { w: 12.0, h: 7.9 },
  B: { w: 15.9, h: 10.3 },
  C: { w: 22.0, h: 14.0 },
} as const;
type BeltType = keyof typeof belt;

/*──────── Props ────────*/
export interface PulleySceneProps {
  outerDiameter?: number;
  holeDiameter?: number;
  numGrooves?: number;
  beltType?: BeltType;
  landRatio?: number;         // 0.3-0.5
  flatRatio?: number;         // 0-0.2
  rearFlangeRatio?: number;   // 0-1
  frontFlangeRatio?: number;  // 0-1
  hubRadiusRatio?: number;    // 0.5-0.8
  hubLength?: number;         // mm (0 → 30 % Ø)
  noShading?: boolean;        // true = sin luces
}

const PulleyScene = ({
  outerDiameter     = 120,
  holeDiameter      = 25,
  numGrooves        = 2,
  beltType          = "B",
  landRatio         = 0.4,
  flatRatio         = 0.15,
  rearFlangeRatio   = 0.6,   // pestaña trasera fina
  frontFlangeRatio  = 1.0,   // pestaña frontal = land
  hubRadiusRatio    = 0.6,
  hubLength         = 0,
  noShading         = false,
}: PulleySceneProps) => {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spec = belt[beltType];
    if (!spec || numGrooves < 1 || outerDiameter <= holeDiameter) return;

    /*── Dimensiones base ────────────────────*/
    const W = spec.w;
    const H = spec.h;

    const landW  = W * landRatio;
    const flatW  = W * flatRatio;
    const flangeFrontW = landW * frontFlangeRatio;
    const flangeRearW  = landW * rearFlangeRatio;

    const pitch     = W + landW;
    const bodyHalf  = (numGrooves * pitch) / 2;

    const Rext  = outerDiameter / 2;
    const Rskin = Rext - 0.25;
    const Rroot = Rskin - H;
    const Rint  = holeDiameter / 2;

    const hubLen = hubLength || outerDiameter * 0.3;
    const hubRad = Rext * hubRadiusRatio;

    /*── Three.js setup ──────────────────────*/
    const el = mount.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.outputColorSpace = SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const cam = new PerspectiveCamera(45, w / h, 1, 2000);
    cam.position.set(0, 0, outerDiameter * 2);
    const controls = new OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true;

    if (!noShading) {
      scene.add(new AmbientLight(0x666666));
      const dir = new DirectionalLight(0xffffff, 1);
      dir.position.set(-1, 1.1, 2);
      scene.add(dir);
    }

    /*── Perfil radius-axial ──────────────────*/
    const pts: Vector2[] = [];
    const yFrontFlange = -bodyHalf - flangeFrontW;
    const yGrooveStart = -bodyHalf;

    // flange frontal
    pts.push(new Vector2(Rskin, yFrontFlange));
    pts.push(new Vector2(Rskin, yGrooveStart));

    // canales
    for (let g = 0; g < numGrooves; g++) {
      const base = yGrooveStart + g * pitch;
      const y0 = base;
      const y1 = base + landW;
      const y2 = y1 + (W - flatW) / 2;
      const y3 = y2 + flatW;
      const y4 = base + landW + W;

      pts.push(new Vector2(Rskin, y0));
      pts.push(new Vector2(Rskin, y1));
      pts.push(new Vector2(Rroot, y2));
      pts.push(new Vector2(Rroot, y3));
      pts.push(new Vector2(Rskin, y4));
    }

    // flange trasero
    const yRearStart = bodyHalf;
    const yRearEnd   = bodyHalf + flangeRearW;
    pts.push(new Vector2(Rskin, yRearStart));
    pts.push(new Vector2(Rskin, yRearEnd));

    // eje y cierre
    pts.push(new Vector2(Rint, yRearEnd));
    pts.push(new Vector2(Rint, yFrontFlange));
    pts.push(new Vector2(Rskin, yFrontFlange));

    const segs = Math.max(128, Math.round(Rext));
    const bodyGeo = new LatheGeometry(pts, segs);

    /*── Cubo lateral ─────────────────────────*/
    const hubY0 = yRearEnd;
    const hubY1 = hubY0 + hubLen;
    const hubPts: Vector2[] = [
      new Vector2(hubRad, hubY0),
      new Vector2(hubRad, hubY1),
      new Vector2(Rint,   hubY1),
      new Vector2(Rint,   hubY0),
      new Vector2(hubRad, hubY0),
    ];
    const hubGeo = new LatheGeometry(hubPts, segs);

    /*── Material sin/sombreado ───────────────*/
    const grey = 0xd0d0d3;
    const mat = noShading
      ? new MeshBasicMaterial({ color: grey })
      : new MeshPhongMaterial({ color: grey });

    const body = new Mesh(bodyGeo, mat);
    body.rotateX(Math.PI / 2);
    const hub  = new Mesh(hubGeo, mat);
    hub.rotateX(Math.PI / 2);
    scene.add(body, hub);

    /*── Loop ────────────────────────────────*/
    const loop = () => {
      controls.update();
      renderer.render(scene, cam);
      requestAnimationFrame(loop);
    };
    loop();

    /*── Cleanup ─────────────────────────────*/
    return () => {
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [
    outerDiameter, holeDiameter,
    numGrooves, beltType,
    landRatio, flatRatio,
    rearFlangeRatio, frontFlangeRatio,
    hubRadiusRatio, hubLength,
    noShading,
  ]);

  return <div ref={mount} style={{ width: "100%", height: "100vh" }} />;
};

export default PulleyScene;
