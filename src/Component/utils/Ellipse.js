import * as THREE from "three";
import { shapeStore } from "../../ShapeStore";
class Ellipse {
  constructor(scene, camera, renderer, plane) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;

    this.mouse = new THREE.Vector2(); // Mouse position in normalized device coordinates
    this.raycaster = new THREE.Raycaster(); // Raycaster for mouse picking
    this.center = null; // Center of the ellipse
    this.radiusX = 0; // Horizontal radius (major axis)
    this.radiusY = 0; // Vertical radius (minor axis)
    this.ellipse = null; // The ellipse object
    this.isDrawing = false; // Track if the ellipse is being drawn

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

  // Update mouse position (from normalized device coordinates to world space)
  updateMousePosition(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Handle mouse down event (start drawing ellipse)
  handleMouseDown(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (center point of the ellipse)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        // Set the center of the ellipse to the intersection point
        this.center = intersects[0].point;
        console.log("Center of the ellipse:", this.center);
        this.isDrawing = true; // Set drawing state to true
      } else {
        // On second click, finalize the ellipse (finish drawing)
        const mousePos = intersects[0].point;
        this.radiusX = Math.abs(this.center.x - mousePos.x); // Set horizontal radius
        this.radiusY = Math.abs(this.center.z - mousePos.z); // Set vertical radius
        this.updateEllipse(); // Update the ellipse to finalize it
        this.isDrawing = false; // Reset drawing state
        shapeStore.addShape(this.ellipse);
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
      // If the ellipse exists, just update the radii
      const geometry = new THREE.EllipseCurve(
        0, // X center  this.center.x but this not work so put 0
        0, // Y center this.center.z but this not work so put 0
        this.radiusX, // X radius (horizontal)
        this.radiusY, // Y radius (vertical)
        0, // Start angle (default 0)
        Math.PI * 2, // End angle (full ellipse)
        false, // Clockwise
        0 // Rotation
      );
      const points = geometry.getPoints(64); // Get points for the ellipse curve
      this.ellipse.geometry.setFromPoints(points); // Update the ellipse geometry with new points
      this.ellipse.geometry.attributes.position.needsUpdate = true;
    } else {
      // If the ellipse does not exist, create a new one
      const geometry = new THREE.EllipseCurve(
        0, // X center this.center.x but this not work so put 0
        0, // Y center this.center.z but this not work so put 0
        this.radiusX, // X radius (horizontal)
        this.radiusY, // Y radius (vertical)
        0, // Start angle (default 0)
        Math.PI * 2, // End angle (full ellipse)
        false, // Clockwise
        0 // Rotation
      );
      const points = geometry.getPoints(64); // Get points for the ellipse curve
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
      });
      const geometryBuffer = new THREE.BufferGeometry().setFromPoints(points); // Create geometry from points
      this.ellipse = new THREE.LineLoop(geometryBuffer, material); // Create a LineLoop for ellipse
      this.ellipse.rotation.x = Math.PI * 0.5; // Rotate the ellipse to lie flat on the X-Y plane
      this.ellipse.position.set(this.center.x, 0.5, this.center.z); // Set position to center
      this.ellipse.name = "Ellipse";
      this.scene.add(this.ellipse);
    }
  }
}

export default Ellipse;
