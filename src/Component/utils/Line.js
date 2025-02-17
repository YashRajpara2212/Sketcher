import * as THREE from "three";
import { shapeStore } from "../../ShapeStore";

class Line {
  constructor(scene, camera, renderer, plane) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;

    this.mouse = new THREE.Vector2(); 
    this.raycaster = new THREE.Raycaster();
    this.startPoint = null;
    this.endPoint = null;
    this.startSphere = null;
    this.endShere = null;

    // this.flag = true;
    this.line = null; // The line object we will draw
    this.isDrawing = false;

    // Bind event listeners
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    // this.handleMouseUp = this.handleMouseUp.bind(this);

    this.addEventListeners();
  }

  // Add mouse event listeners
  addEventListeners() {
    this.renderer.domElement.addEventListener(
      "mousedown",
      this.handleMouseDown
    );
    this.renderer.domElement.addEventListener(
      "mousemove",
      this.handleMouseMove
    );
    this.renderer.domElement.addEventListener("mouseup", this.handleMouseUp);
  }

  // Remove event listeners (cleanup)
  removeEventListeners() {
    this.renderer.domElement.removeEventListener(
      "mousedown",
      this.handleMouseDown
    );
    this.renderer.domElement.removeEventListener(
      "mousemove",
      this.handleMouseMove
    );
    this.renderer.domElement.removeEventListener("mouseup", this.handleMouseUp);
  }

  // Update mouse position (from normalized device coordinates to world space)
  updateMousePosition(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Handle mouse down event (start drawing line)
  handleMouseDown(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (start point of line)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      //&& this.flag
      if (!this.isDrawing) {
        this.startPoint = intersects[0].point; // Save the start point

    
        this.isDrawing = true; // Set drawing state to true
      } else {
        // On second click, finalize the line (finish drawing)
        this.endPoint = intersects[0].point;
        // this.endSphere.position.copy(this.endPoint);

        this.updateLine(); // Update the line to finalize it
        this.isDrawing = false; // Reset drawing state

        console.log("line ", this.line);
        shapeStore.addShape(this.line);
        shapeStore.setSelectedShape(null);
        this.line = null; // Optional: clear the line object to prevent future updates
        // this.flag = false;
        this.removeEventListeners();
      }
    }
  }

  // Handle mouse move event (draw the line dynamically)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.startPoint) return; // Only start drawing if we have a start point

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update line endpoint)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      this.endPoint = intersects[0].point; // Update the end point

     
      this.updateLine();
    }
  }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane);
  }

  
  // Update the line geometry
  updateLine() {
    if (this.line) {
      // If the line exists, just update the end point
      // this.line.geometry.dispose();
      this.line.geometry.setFromPoints([this.startPoint, this.endPoint]);
    } else {
      // If the line does not exist, create a new one
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        // linewidth: 3,
      });
      const geometry = new THREE.BufferGeometry().setFromPoints([
        this.startPoint,
        this.endPoint,
      ]);
      this.line = new THREE.Line(geometry, material);

      this.line.name = "Line";
      this.scene.add(this.line);
    }
  }
}

export default Line;
