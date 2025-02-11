import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import Point from "./utils/Point";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    //scene
    const scene = new THREE.Scene();

    //camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      500
    );

    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const geometry = new THREE.PlaneGeometry(10000, 10000);
    const material = new THREE.MeshBasicMaterial({
      color: "yellow",
    });
    const controls = new OrbitControls(camera, canvasRef.current);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);

    // const point = new Point(1, 0, 1);
    // point.generateSphere(scene, 1);

    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();
  }, []);
  return <canvas ref={canvasRef} className="webgl" />;
};

export default CanvasComponent;
