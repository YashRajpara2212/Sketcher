// import * as THREE from "three";
// import { shapeStore } from "../../ShapeStore";
// // import { shapeStore } from "../../ShapeStore";

// class Polyline {
//   constructor(scene, camera, renderer, plane) {
//     this.scene = scene;
//     this.camera = camera;
//     this.renderer = renderer;
//     this.plane = plane;

//     this.mouse = new THREE.Vector2(); // Mouse position in normalized device coordinates
//     this.raycaster = new THREE.Raycaster(); // Raycaster for mouse picking
//     this.points = []; // Store the points of the polyline
//     this.isDrawing = false; // Track if a new line segment is being drawn
//     this.line = null; // Store the current line object
//     this.polyline = null; // Store the lines of the polyline
//     this.previousPoint = null; // Keep track of the last point in the polyline

//     this.startSphere = null;
//     this.endShere = null;
//     // Bind event listeners
//     this.handleMouseDown = this.handleMouseDown.bind(this);
//     this.handleMouseMove = this.handleMouseMove.bind(this);
//     this.handleDoubleClick = this.handleDoubleClick.bind(this);

//     this.addEventListeners();
//   }

//   // Add mouse event listeners
//   addEventListeners() {
//     this.renderer.domElement.addEventListener(
//       "mousedown",
//       this.handleMouseDown
//     );
//     this.renderer.domElement.addEventListener(
//       "mousemove",
//       this.handleMouseMove
//     );
//     this.renderer.domElement.addEventListener(
//       "dblclick",
//       this.handleDoubleClick
//     ); // Listen for double-click to finalize
//   }

//   // Remove event listeners (cleanup)
//   removeEventListeners() {
//     this.renderer.domElement.removeEventListener(
//       "mousedown",
//       this.handleMouseDown
//     );
//     this.renderer.domElement.removeEventListener(
//       "mousemove",
//       this.handleMouseMove
//     );
//     this.renderer.domElement.removeEventListener(
//       "dblclick",
//       this.handleDoubleClick
//     );
//   }

//   // Update mouse position (from normalized device coordinates to world space)
//   updateMousePosition(event) {
//     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   // Handle mouse down event (start new line segment or add to polyline)
//   handleMouseDown(event) {
//     this.updateMousePosition(event);

//     // Get the intersection of the mouse with the plane (start or end point of the line)
//     const intersects = this.getIntersection();
//     if (intersects.length > 0) {
//       const currentPoint = intersects[0].point;

//       if (!this.isDrawing) {
//         // Start drawing the polyline
//         this.startNewPolyline(); // currentPoint  Clear previous polyline and start a new one
//         this.points.push(currentPoint); // Add the starting point
//         this.isDrawing = true;
//         this.previousPoint = currentPoint; // Set the starting point
//       } else {
//         // Draw a new line segment from the last point to the current point
//         this.points.push(currentPoint);
//         this.updatePolyline();
//         this.previousPoint = currentPoint; // Update the previous point
//       }
//     }
//   }

//   // Handle mouse move event (update the line dynamically)
//   handleMouseMove(event) {
//     if (!this.isDrawing || !this.previousPoint) return; // Only update if a line is being drawn

//     this.updateMousePosition(event);

//     // Get the intersection of the mouse with the plane (update line end point)
//     const intersects = this.getIntersection();
//     if (intersects.length > 0) {
//       const currentPoint = intersects[0].point;
//       this.updateLineSegment(currentPoint); // Update the current line segment
//     }
//   }

//   // Handle double-click event to finalize the polyline
//   handleDoubleClick() {
//     this.isDrawing = false; // Stop drawing new line segments
//     console.log(this.polyline, "polyline");
//     shapeStore.addShape(this.polyline);
//     this.line = null; // Clear the current line object
//     this.previousPoint = null; // Clear the last point reference
//     this.startPoint = null;
//     this.removeEventListeners();
//   }

//   // Start a new polyline, reset the points and lines for it
//   startNewPolyline() {
//     //currentPoint
//     this.points = []; // Reset the points array for the new polyline
//     // this.points.push(currentPoint); // Add the first point of the new polyline
//   }

//   // Get the intersection between the mouse and the plane
//   getIntersection() {
//     this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
//     return this.raycaster.intersectObject(this.plane);
//   }

//   // Update the current line segment being drawn
//   updateLineSegment(currentPoint) {
//     if (this.line) {
//       // If a line exists, update it to the current mouse position
//       this.line.geometry.setFromPoints([this.previousPoint, currentPoint]);
//     } else {
//       // Create a new line if no line exists yet
//       const geometry = new THREE.BufferGeometry().setFromPoints([
//         this.previousPoint,
//         currentPoint,
//       ]);
//       const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//       this.line = new THREE.Line(geometry, material);
//       this.scene.add(this.line);
//     }
//   }

//   // createSphere(position) {
//   //   const geometry = new THREE.SphereGeometry(0.1, 32, 32);
//   //   const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//   //   const sphere = new THREE.Mesh(geometry, material);
//   //   sphere.position.set(position.x, position.y, position.z);
//   //   return sphere;
//   // }

//   // Update the polyline with new segments
//   updatePolyline() {
//     const geometry = new THREE.BufferGeometry().setFromPoints(this.points);

//     const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//     this.polyline = new THREE.Line(geometry, material);
//     console.log(this.polyline, "poly");
//     this.polyline.name = "Polyline";
//     this.scene.add(this.polyline);
//   }
// }

// export default Polyline;

import * as THREE from "three";
import { shapeStore } from "../../ShapeStore";

class Polyline {
  constructor(scene, camera, renderer, plane) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.points = [];
    this.isDrawing = false;
    this.line = null;
    this.previousPoint = null;
    
    // Bind event listeners
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

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
    this.renderer.domElement.addEventListener(
      "dblclick",
      this.handleDoubleClick
    ); // Finalize on double-click
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
    this.renderer.domElement.removeEventListener(
      "dblclick",
      this.handleDoubleClick
    );
  }

  // Update mouse position (from normalized device coordinates to world space)
  updateMousePosition(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Handle mouse down event (start new line segment or add to polyline)
  handleMouseDown(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (start or end point of the line)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const currentPoint = intersects[0].point;

      if (!this.isDrawing) {
        // Start drawing the polyline from this point
        this.startNewPolyline(currentPoint);
        this.isDrawing = true;
      } else {
        // Add a new line segment from the last point to the current point
        this.addLineSegment(currentPoint);
      }

      this.previousPoint = currentPoint; // Update the previous point
    }
  }

  // Handle mouse move event (update the line dynamically)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.previousPoint) return; // Only update if a line is being drawn

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update line end point)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const currentPoint = intersects[0].point;
      this.updateLastLineSegment(currentPoint); // Update the current line segment
    }
  }

  // Handle double-click event to finalize the polyline
  handleDoubleClick() {
    this.isDrawing = false; // Stop drawing new line segments
    shapeStore.addShape(this.polyline); // Add the final polyline to the scene
    this.removeEventListeners(); // Remove event listeners
  }

  // Start a new polyline with the first point
  startNewPolyline(startPoint) {
    this.points = [startPoint]; // Start with the first point
    this.createPolyline(); // Create the polyline object
  }

  // Create the polyline object
  createPolyline() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    this.polyline = new THREE.Line(geometry, material);
    this.polyline.name = "Polyline";
    this.scene.add(this.polyline); // Add the polyline to the scene
  }

  // Add a new line segment to the polyline
  addLineSegment(currentPoint) {
    this.points.push(currentPoint); // Add the new point to the points array
    this.updatePolyline(); // Update the polyline geometry with the new point
  }

  // Update the polyline's geometry with the current points
  updatePolyline() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.polyline.geometry.dispose(); // Dispose of old geometry to free memory
    this.polyline.geometry = geometry; // Update the geometry of the polyline
  }

  // Update the last line segment being drawn dynamically as the mouse moves
  updateLastLineSegment(currentPoint) {
    if (this.points.length > 0) {
      // Update the last segment
      this.points[this.points.length - 1] = currentPoint;
      this.updatePolyline();
    }
  }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane); // Check for intersection with the plane
  }
}

export default Polyline;
