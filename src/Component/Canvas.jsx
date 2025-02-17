import { useEffect, useRef, useState } from "react";
// import { RiExpandUpDownFill } from "react-icons/ri";
import Line from "./utils/Line";
import Circle from "./utils/Circle";
import Ellipse from "./utils/Ellipse";
import Polyline from "./utils/Polyline";
import * as THREE from "three";
import { shapeStore } from "../ShapeStore";
import { observer } from "mobx-react";

// import Point from "./utils/Point";

const Canvas = () => {
  // const shape = selectedShape
  // const shape = selectedShape;
  // console.log(shape, "selected Shape");
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const planeRef = useRef(null);
  const rendererRef = useRef(null);

  const [mouse] = useState(new THREE.Vector2());
  const raycaster = new THREE.Raycaster();

  useEffect(() => {
    if (!sceneRef.current) {
      //scene
      const scene = new THREE.Scene();
      //here scene is add to shapeStore for remove shape.
      shapeStore.setScene(scene);
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
        color: "white",
      });

      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI * 0.5;
      plane.name = "Plane";
      sceneRef.current.add(plane);
      planeRef.current = plane;
    }

    let shapeInstance;
    //shape
    if (shapeStore.selectedShape === "Line") {
      shapeInstance = new Line(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }
    if (shapeStore.selectedShape === "Circle") {
      shapeInstance = new Circle(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }
    if (shapeStore.selectedShape === "Ellipse") {
      shapeInstance = new Ellipse(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }
    if (shapeStore.selectedShape === "Polyline") {
      shapeInstance = new Polyline(
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        planeRef.current
      );
    }

    const selectShape = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.params.Line.threshold = 2.3;
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(shapeStore.shapes);
      if (intersects.length > 0) {
        const canvasSelectedShape = intersects[0];
        console.log(canvasSelectedShape, "shape");
        shapeStore.setEntity(canvasSelectedShape.object);
        console.log(shapeStore?.Entity(), "current");
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("click", selectShape);
    animate();
    // Cleanup function to be executed when the component unmounts
    return () => {
      if (shapeInstance) {
        // Call any cleanup methods on the shape instance
        shapeInstance.removeEventListeners();
      }
      canvas.removeEventListener("click", selectShape);
    };
  }, [shapeStore.selectedShape]);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default observer(Canvas);
