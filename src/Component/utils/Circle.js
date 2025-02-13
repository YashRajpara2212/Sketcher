import * as THREE from "three";
import { shapeStore } from "../../ShapeStore";

class Circle {
  constructor(scene, camera, renderer, plane) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;

    this.mouse = new THREE.Vector2(); // Mouse position in normalized device coordinates
    this.raycaster = new THREE.Raycaster(); // Raycaster for mouse picking
    this.center = null; // Center of the circle
    this.radius = 0; // Radius of the circle
    this.circle = null; // The circle object
    this.isDrawing = false; // Track if the circle is being drawn

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
    // this.renderer.domElement.addEventListener("mouseup", this.handleMouseUp);
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
    // this.renderer.domElement.removeEventListener("mouseup", this.handleMouseUp);
  }

  // Update mouse position (from normalized device coordinates to world space)
  updateMousePosition(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Handle mouse down event (start drawing circle)
  handleMouseDown(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (center point of the circle)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        this.center = intersects[0].point; // Save the center point
        console.log(this.center, "center");
        this.isDrawing = true; // Set drawing state to true
      } else {
        // On second click, finalize the circle (finish drawing)
        this.radius = this.center.distanceTo(intersects[0].point);
        this.updateCircle(); // Update the circle to finalize it
        this.isDrawing = false; // Reset drawing state
        shapeStore.addShape(this.circle);
        this.circle = null; // Optional: clear the circle object to prevent future updates
        this.removeEventListeners();
      }
    }
  }

  // Handle mouse move event (draw the circle dynamically)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.center) return; // Only start drawing if we have a center

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update circle radius)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      this.radius = this.center.distanceTo(intersects[0].point); // Update the radius

      // Update or create the circle in the scene
      this.updateCircle();
    }
  }

  // Handle mouse up event (finalize circle)
  //   handleMouseUp(event) {
  //     // Circle is finalized on mouse down, no need for specific logic here
  //   }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane);
  }

  // Update the circle geometry
  updateCircle() {
    if (this.circle) {
      // If the circle exists, just update the radius
      // this.circle.geometry.dispose();
      this.circle.geometry = new THREE.CircleGeometry(this.radius, 64);
    } else {
      // If the circle does not exist, create a new one

      const geometry = new THREE.CircleGeometry(this.radius, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
      });
      this.circle = new THREE.Mesh(geometry, material);
      this.circle.rotation.x = Math.PI * 0.5; // Rotate the ring to lie flat on the X-Y plane
      this.circle.position.set(this.center.x, 0.5, this.center.z);
      this.circle.name = "Circle";
      this.scene.add(this.circle);
      console.log(this.circle);
    }
  }
}

export default Circle;
