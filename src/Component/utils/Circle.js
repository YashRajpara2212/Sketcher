import * as THREE from "three";
import { shapeStore } from "../../ShapeStore";

class Circle {
  constructor(scene, camera, renderer, plane) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.center = null;
    this.radius = 0;
    this.circle = null;
    this.isDrawing = false;

    // Bind event listeners
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

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
  }

  updateMousePosition(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  handleMouseDown(event) {
    this.updateMousePosition(event);

    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        this.center = intersects[0].point; // Save the center point
        console.log(this.center, "center");
        this.isDrawing = true;
      } else {
        // On second click, finalize the circle (finish drawing)
        this.radius = this.center.distanceTo(intersects[0].point);
        this.updateCircle();
        this.isDrawing = false;
        shapeStore.addShape(this.circle);
        console.log(this.radius, "circle radius");
        this.circle = null;
        this.removeEventListeners();
      }
    }
  }

  handleMouseMove(event) {
    if (!this.isDrawing || !this.center) return;
    this.updateMousePosition(event);

    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      this.radius = this.center.distanceTo(intersects[0].point); // Update the radius

      this.updateCircle();
    }
  }

  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane);
  }

  // Update the circle geometry
  updateCircle() {
    if (this.circle) {
      this.circle.geometry = new THREE.CircleGeometry(this.radius, 64);
    } else {
      const geometry = new THREE.CircleGeometry(this.radius, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
      });
      this.circle = new THREE.Mesh(geometry, material);
      this.circle.rotation.x = Math.PI * 0.5; // Rotate the ring to lie flat on the X-Y plane
      this.circle.position.set(this.center.x, 0.5, this.center.z);
      this.circle.name = "Circle";
      this.circle.center = this.center;

      this.scene.add(this.circle);
      console.log(this.circle);
    }
  }
}

export default Circle;
