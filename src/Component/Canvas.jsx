import { useEffect, useRef } from "react";
// import { RiExpandUpDownFill } from "react-icons/ri";
import Line from "./utils/Line";
import Circle from "./utils/Circle";
import Ellipse from "./utils/Ellipse";
import Polyline from "./utils/Polyline";
import * as THREE from "three";

// import Point from "./utils/Point";

const Canvas = ({ selectedShape }) => {
  const shape = selectedShape;
  console.log(shape, "selected Shape");
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const planeRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) {
      //scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      //camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      camera.position.set(0, 10, 0);
      camera.lookAt(0, 0, 0);

      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current = renderer;
    }
    //plane
    if (!planeRef.current) {
      const geometry = new THREE.PlaneGeometry(10000, 10000);
      const material = new THREE.MeshBasicMaterial({
        color: "yellow",
      });

      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI * 0.5;
      sceneRef.current.add(plane);
      planeRef.current = plane;
    }
    //event listener

    // window.addEventListener("mousemove", onMouseMove);

    // const point = new Point(-1, 0, 1);
    // point.generateSphere(scene);
    let shapeInstance;
    if (shape === "Line") {
      shapeInstance = new Line(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }
    if (shape === "Circle") {
      shapeInstance = new Circle(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }
    if (shape === "Ellipse") {
      shapeInstance = new Ellipse(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }
    if (shape === "Polyline") {
      shapeInstance = new Polyline(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }

    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();
    // Cleanup function to be executed when the component unmounts
    return () => {
      if (shapeInstance) {
        // Call any cleanup methods on the shape instance
        shapeInstance.removeEventListeners();
      }
    };
  }, [shape]);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default Canvas;

// {`${className}`}
