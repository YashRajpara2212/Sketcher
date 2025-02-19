// // export default Polyline;
// import * as THREE from "three";
// import { shapeStore } from "../../ShapeStore";

// class Polyline {
//   constructor(scene, camera, renderer, plane) {
//     this.scene = scene;
//     this.camera = camera;
//     this.renderer = renderer;
//     this.plane = plane;

//     this.mouse = new THREE.Vector2();
//     this.raycaster = new THREE.Raycaster();
//     this.points = [];
//     this.isDrawing = false;
//     this.polyline = null; // This will hold the final polyline
//     this.tempLine = null; // Temporary line that will be drawn during mouse move
//     this.previousPoint = null;

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
//     ); // Finalize on double-click
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
//         // Start drawing the polyline from this point
//         this.startNewPolyline(currentPoint);
//         this.isDrawing = true;
//       } else {
//         // Add a new line segment to the polyline
//         this.addLineSegment(currentPoint);
//       }

//       this.previousPoint = currentPoint; // Update the previous point
//     }
//   }

//   // Handle mouse move event (draw the temporary line without affecting the polyline)
//   handleMouseMove(event) {
//     if (!this.isDrawing || !this.previousPoint) return; // Only show temporary line if drawing

//     this.updateMousePosition(event);

//     // Get the intersection of the mouse with the plane (update temporary line end point)
//     const intersects = this.getIntersection();
//     if (intersects.length > 0) {
//       const currentPoint = intersects[0].point;

//       // If we already have a temporary line, update it dynamically
//       if (this.tempLine) {
//         this.updateTemporaryLine(currentPoint); // Update the temporary line
//       } else {
//         // Create a temporary line from the previous point to the mouse position
//         this.createTemporaryLine(currentPoint);
//       }
//     }
//   }

//   // Handle double-click event to finalize the polyline
//   handleDoubleClick() {
//     this.isDrawing = false; // Stop drawing new line segments
//     shapeStore.addShape(this.polyline); // Add the final polyline to the scene
//     shapeStore.setSelectedShape(null);
//     console.log(this.polyline, "polyline");
//     this.polyline = null;
//     this.removeEventListeners(); // Remove event listeners
//   }

//   // Start a new polyline with the first point
//   startNewPolyline(startPoint) {
//     this.points = [startPoint]; // Start with the first point
//     this.createPolyline(); // Create the polyline object
//   }

//   // Create the polyline object
//   createPolyline() {
//     const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
//     const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//     this.polyline = new THREE.Line(geometry, material);
//     this.polyline.name = "Polyline";
//     this.scene.add(this.polyline); // Add the polyline to the scene
//   }

//   // Add a new line segment to the polyline
//   addLineSegment(currentPoint) {
//     this.points.push(currentPoint); // Add the new point to the points array
//     this.updatePolyline(); // Update the polyline geometry with the new point
//   }

//   // Update the polyline's geometry with the current points
//   updatePolyline() {
//     const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
//     this.polyline.geometry.dispose(); // Dispose of old geometry to free memory
//     this.polyline.geometry = geometry; // Update the geometry of the polyline
//   }

//   // Create the temporary line that follows the mouse during movement
//   createTemporaryLine(currentPoint) {
//     const geometry = new THREE.BufferGeometry().setFromPoints([
//       this.previousPoint,
//       currentPoint,
//     ]);
//     const material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Green color for the temporary line
//     this.tempLine = new THREE.Line(geometry, material);
//     this.scene.add(this.tempLine);
//   }

//   // Update the temporary line segment as the mouse moves
//   updateTemporaryLine(currentPoint) {
//     if (this.tempLine) {
//       const geometry = new THREE.BufferGeometry().setFromPoints([
//         this.previousPoint,
//         currentPoint,
//       ]);
//       this.tempLine.geometry.dispose(); // Dispose of old geometry
//       this.tempLine.geometry = geometry; // Update geometry with the new end point
//     }
//   }

//   // Remove and dispose of the given temporary line
//   removeAndDisposeTemporaryLine() {
//     if (this.tempLine) {
//       this.scene.remove(this.tempLine); // Remove from scene
//       this.tempLine.geometry.dispose(); // Dispose geometry
//       this.tempLine.material.dispose(); // Dispose material
//       this.tempLine = null; // Clear the reference
//     }
//   }

//   getIntersection() {
//     this.raycaster.setFromCamera(this.mouse, this.camera);
//     return this.raycaster.intersectObject(this.plane);
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
    this.polyline = null; // This will hold the final polyline
    this.tempLine = null; // Temporary line that will be drawn during mouse move
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
        // Add a new line segment to the polyline
        this.addLineSegment(currentPoint);
      }

      this.previousPoint = currentPoint; // Update the previous point
    }
  }

  // Handle mouse move event (draw the temporary line without affecting the polyline)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.previousPoint) return; // Only show temporary line if drawing

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update temporary line end point)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const currentPoint = intersects[0].point;

      // If we already have a temporary line, update it dynamically
      if (this.tempLine) {
        this.updateTemporaryLine(currentPoint); // Update the temporary line
      } else {
        // Create a temporary line from the previous point to the mouse position
        this.createTemporaryLine(currentPoint);
      }
    }
  }

  // Handle double-click event to finalize the polyline
  handleDoubleClick() {
    if (this.tempLine) {
      // Include the last segment from the temporary line in the final polyline
      const intersects = this.getIntersection();
      if (intersects.length > 0) {
        const currentPoint = intersects[0].point;

        // Only add the point if it's not the same as the previous one
        if (!this.arePointsEqual(currentPoint, this.previousPoint)) {
          this.addLineSegment(currentPoint); // Add last point from temporary line
        }
      }
    }

    this.isDrawing = false; // Stop drawing new line segments
    shapeStore.addShape(this.polyline); // Add the final polyline to the scene
    shapeStore.setSelectedShape(null);
    console.log(this.polyline, "polyline");
    this.polyline = null;

    this.removeAndDisposeTemporaryLine(); // Clean up the temporary line
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

  // Add a new line segment to the polyline, ensuring no duplicate points
  addLineSegment(currentPoint) {
    if (
      this.points.length === 0 ||
      !this.arePointsEqual(currentPoint, this.points[this.points.length - 1])
    ) {
      this.points.push(currentPoint); // Only add the point if it's not a duplicate
      this.updatePolyline(); // Update the polyline geometry with the new point
    }
  }

  // Update the polyline's geometry with the current points
  updatePolyline() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.polyline.geometry.dispose(); // Dispose of old geometry to free memory
    this.polyline.geometry = geometry; // Update the geometry of the polyline
  }

  // Create the temporary line that follows the mouse during movement
  createTemporaryLine(currentPoint) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      this.previousPoint,
      currentPoint,
    ]);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue color for the temporary line
    this.tempLine = new THREE.Line(geometry, material);
    this.scene.add(this.tempLine);
  }

  // Update the temporary line segment as the mouse moves
  updateTemporaryLine(currentPoint) {
    if (this.tempLine) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        this.previousPoint,
        currentPoint,
      ]);
      this.tempLine.geometry.dispose(); // Dispose of old geometry
      this.tempLine.geometry = geometry; // Update geometry with the new end point
    }
  }

  // Remove and dispose of the given temporary line
  removeAndDisposeTemporaryLine() {
    if (this.tempLine) {
      this.scene.remove(this.tempLine); // Remove from scene
      this.tempLine.geometry.dispose(); // Dispose geometry
      this.tempLine.material.dispose(); // Dispose material
      this.tempLine = null; // Clear the reference
    }
  }

  // Check if two points are the same (within a small tolerance)
  arePointsEqual(point1, point2) {
    const tolerance = 0.001;
    return (
      Math.abs(point1.x - point2.x) < tolerance &&
      Math.abs(point1.y - point2.y) < tolerance &&
      Math.abs(point1.z - point2.z) < tolerance
    );
  }

  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObject(this.plane);
  }
}

export default Polyline;
