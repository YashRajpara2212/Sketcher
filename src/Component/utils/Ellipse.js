import * as THREE from "three";
import { shapeStore } from "../../ShapeStore";
class Ellipse {
  constructor(scene, camera, renderer, plane) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.center = null;
    this.radiusX = 0;
    this.radiusY = 0;
    this.ellipse = null;
    this.isDrawing = false;
    this.uuid = null;
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
        this.center = intersects[0].point;
        console.log("Center of the ellipse:", this.center);
        this.isDrawing = true; // Set drawing state to true
      } else {
        // On second click, finalize the ellipse (finish drawing)
        const mousePos = intersects[0].point;
        this.radiusX = Math.abs(this.center.x - mousePos.x);
        this.radiusY = Math.abs(this.center.z - mousePos.z);
        this.updateEllipse(); // Update the ellipse to finalize it
        this.isDrawing = false; // Reset drawing state
        shapeStore.addShape(this.ellipse);
        shapeStore.setSelectedShape(null);
        shapeStore.setEllipseRadius(this.uuid, this.radiusX, this.radiusY);

        // console.log(this.ellipse, "elipse");
        // console.log(this.center, "elipse-center");
        // console.log(this.radiusX, "elipse-x");
        // console.log(this.radiusY, "elipse-y");
        this.ellipse = null; // Optional: clear the ellipse object to prevent future updates
        this.removeEventListeners();
      }
    }
  }

  // Handle mouse move event (draw the ellipse dynamically)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.center) return; // Only start drawing if we have a center

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update ellipse radius)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const mousePos = intersects[0].point;
      this.radiusX = Math.abs(this.center.x - mousePos.x); // Update horizontal radius
      this.radiusY = Math.abs(this.center.z - mousePos.z); // Update vertical radius

      // Update or create the ellipse in the scene
      this.updateEllipse();
    }
  }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane); // Perform the raycasting against the plane
  }

  // Update the ellipse geometry
  updateEllipse() {
    if (this.ellipse) {
      const geometry = new THREE.EllipseCurve(
        0,
        0,
        this.radiusX,
        this.radiusY,
        0,
        Math.PI * 2,
        false,
        0
      );
      const points = geometry.getPoints(64); // Get points for the ellipse curve
      this.ellipse.geometry.setFromPoints(points); // Update the ellipse geometry with new points
      this.ellipse.geometry.attributes.position.needsUpdate = true;
    } else {
      // If the ellipse does not exist, create a new one
      const geometry = new THREE.EllipseCurve(
        0,
        0,
        this.radiusX,
        this.radiusY,
        0,
        Math.PI * 2,
        false,
        0
      );
      const points = geometry.getPoints(64); // Get points for the ellipse curve
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
      });
      const geometryBuffer = new THREE.BufferGeometry().setFromPoints(points);
      this.ellipse = new THREE.LineLoop(geometryBuffer, material);
      this.ellipse.rotation.x = Math.PI * 0.5;
      this.ellipse.position.set(
        this.center.x,
        this.center.y + 0.01,
        this.center.z
      ); // Set position to center
      this.ellipse.name = "Ellipse";

      this.ellipse.center = this.center;
      // console.log(this.ellipse, "ellipse");

      this.uuid = this.ellipse.uuid;
      console.log(this.uuid, "ellipse-uuid");

      this.scene.add(this.ellipse);
    }
  }
}

export default Ellipse;
