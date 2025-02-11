import { useState, useEffect, useRef } from "react";
// import { RiExpandUpDownFill } from "react-icons/ri";
import Line from "./utils/Line";

import * as THREE from "three";
// import Point from "./utils/Point";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [lineInstance, setLineInstance] = useState(null); // To store the current line instance
  const [startPoint, setStartPoint] = useState(null); // starPoint of line
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    //scene
    const scene = new THREE.Scene();

    //camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //onPointerDown
    const onMouseClick = (event) => {
      //update mouse coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      //raycaster origin and direction
      raycaster.setFromCamera(mouse, camera);

      //raycaster intersect point

      const intersects = raycaster.intersectObject(plane);
      console.log(intersects.point, "ER");
      //start  point
      if (intersects.length > 0 && clickCount === 0) {
        //intersect point
        const intersectPoint = intersects[0].point;
        //for generationg point giving that point to Point
        setStartPoint(intersectPoint);
        console.log(startPoint, "ab");

        // new Line instance
        const newLine = new Line(scene, startPoint);
        setLineInstance(newLine);
      }
      if (clickCount === 1) {
        if (!startPoint || !lineInstance) return;
        lineInstance.finalize();
        setClickCount(0);
      }
    };
    //onPointerMove
    const onMouseMove = (event) => {
      if (!startPoint || !lineInstance) return; // Only update if line is being created

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      // Find intersection point with the plane
      const intersects = raycaster.intersectObject(plane);
      if (intersects.length > 0) {
        const endPoint = intersects[0].point;
        lineInstance.update(endPoint); // Update the line's end point
      }
    };

    // const onMouseSecondClick = (event)=>{
    //     if (!startPoint || !lineInstance) return;
    //     lineInstance.finalize();

    // }

    //plane
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshBasicMaterial({
      color: "yellow",
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);

    //event listener
    window.addEventListener("click", onMouseClick);
    window.addEventListener("mousemove", onMouseMove);

    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    // const point = new Point(-1, 0, 1);
    // point.generateSphere(scene);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
    return () => {
      window.removeEventListener("click", onMouseClick);
      window.removeEventListener("mousemove", onMouseMove);
    };

    // Clean up the event listener on component unmount
  }, [clickCount]);

  useEffect(() => {
    if (startPoint) {
      // Create a new Line instance only when the startPoint is set
      const newLine = new Line(scene, startPoint);
      setLineInstance(newLine);
      setClickCount(1); // Move to the next step after setting the startPoint
    }
  }, [startPoint]);
  return <canvas ref={canvasRef} className="webgl" />;
};

export default Canvas;
