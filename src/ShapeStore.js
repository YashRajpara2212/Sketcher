import { makeAutoObservable } from "mobx";
import * as THREE from "three";

class ShapeStore {
  shapes = [];
  currentEntity = null;
  entityId = null;
  scene = null;
  // ellipseRadiusY = [];
  // ellipseRadiusX = [];
  ellipsesRadiusXY = [];

  constructor() {
    makeAutoObservable(this);
  }

  setScene(scene) {
    this.scene = scene;
    console.log(this.scene, "scene1");
  }

  addShape(shapeMesh) {
    this.shapes.push(shapeMesh);
  }

  resetShapes() {
    this.shapes = [];
  }
  Entity() {
    return this.currentEntity;
  }
  setEntity(inEntity) {
    this.currentEntity = inEntity;
  }

  setEllipseRadius(uuid, radiusX, radiusY) {
    // Check if the ellipse already exists in the array by uuid
    const existingEllipse = this.ellipsesRadiusXY.find(
      (ellipse) => ellipse.uuid === uuid
    );

    if (existingEllipse) {
      // If ellipse exists, update the radii
      existingEllipse.radiusX = radiusX;
      existingEllipse.radiusY = radiusY;
    } else {
      // If ellipse does not exist, add a new entry
      this.ellipsesRadiusXY.push({ uuid, radiusX, radiusY });
    }
  }

  // Get method to retrieve ellipse radii using uuid
  getEllipseRadius(uuid) {
    const ellipse = this.ellipsesRadiusXY.find(
      (ellipse) => ellipse.uuid === uuid
    );
    return ellipse ? [ellipse.radiusX, ellipse.radiusY] : null; // Return radii or null if not found
  }

  // Optional: To remove an ellipse's data by uuid
  removeEllipseData(uuid) {
    this.ellipsesRadiusXY = this.ellipsesRadiusXY.filter(
      (ellipse) => ellipse.uuid !== uuid
    );
  }

  // setEllipseRadiusX(uuid, radiusX) {
  //   this.ellipseRadiusX.push({ uuid: radiusX });
  // }

  // getEllipseRadiusX(uuid) {
  //   // Find the object with the matching uuid
  //   const entry = this.ellipseRadiusX.find((entry) => entry.uuid === uuid);

  //   // Return the radiusX value or null if not found
  //   return entry ? entry.uuid : null;
  // }

  // getEllipseRadiusY(uuid) {
  //   // Find the object with the matching uuid
  //   const entry = this.ellipseRadiusY.find((entry) => entry.uuid === uuid);

  //   // Return the radiusX value or null if not found
  //   return entry ? entry.uuid : null;
  // }
  // setEllipseRadiusY(uuid, radiusY) {
  //   this.ellipseRadiusY.push({ uuid: radiusY });
  // }

  hideEntity(entityId) {
    const hideShape = this.shapes.find((e) => e.uuid == entityId);

    // console.log(ent(ityId, "hi");
    if (hideShape) {
      if (hideShape.visible) {
        hideShape.visible = false;
      } else {
        hideShape.visible = true;
      }
    }
  }

  // Remove a shape from the scene and dispose of its geometry/material
  removeEntity(entityId) {
    const removeShape = this.shapes.find((e) => e.uuid == entityId);
    this.removeEllipseData(entityId);
    if (removeShape) {
      if (this.scene) {
        this.scene.remove(removeShape); // Remove shape from the scene
      }
      this.disposeShape(removeShape); // Dispose of geometry and material
      // Remove shape from the shapes array

      console.log(this.scene, "scene2");
      this.shapes = this.shapes.filter((e) => e.uuid !== entityId);
      if (this.currentEntity?.uuid === entityId) {
        this.currentEntity = null; // Clear selection if the selected shape is removed
      }
    }
  }

  updateEntity(entityId, updatedProperties) {
    const updateShape = this.shapes.find((e) => e.uuid === entityId);

    if (!updateShape) return; // If no shape is found, exit early

    const {
      color,
      opacity,
      lineStart,
      lineEnd,
      ellipseCenter,
      Rx,
      Ry,
      circleCenter,
      circleRadius,
      polylinePoints,
    } = updatedProperties;

    // Line update
    if (updateShape.name === "Line") {
      const newGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array([...lineStart, ...lineEnd]); // Create a new array with updated line positions
      newGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = newGeometry; // Assign the new geometry

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true; // Ensure material updates
    }

    // Ellipse update
    if (updateShape.name === "Ellipse") {
      updateShape.position.set(
        ellipseCenter.x,
        ellipseCenter.y,
        ellipseCenter.z
      );

      const curve = new THREE.EllipseCurve(
        0,
        0, // center at 0, 0
        Rx,
        Ry, // rx and ry values from updatedProperties
        0,
        Math.PI * 2, // full circle
        false,
        0 // no rotation
      );

      const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(64)
      );

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = ellipseGeometry; // Set the new geometry

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
      this.setEllipseRadius(entityId, Rx, Ry);
    }

    // Circle update
    if (updateShape.name === "Circle") {
      updateShape.position.set(circleCenter.x, 0.5, circleCenter.z);
      updateShape.geometry.parameters.radius = circleRadius; // Update radius

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = new THREE.CircleGeometry(circleRadius); // Create a new geometry with updated radius

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    // Polyline update
    if (updateShape.name === "Polyline") {
      const pointsArray = polylinePoints.flatMap((point) => [
        point.x,
        point.y,
        point.z,
      ]);
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(pointsArray, 3)
      );

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = newGeometry; // Set the new geometry

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    // Ensure shape visibility is updated
    // updateShape.visible = updateShape.visible;
  }

  // Helper function to dispose of shape's resources
  disposeShape(shape) {
    if (shape.geometry) {
      shape.geometry.dispose(); // Dispose of geometry
    }

    if (shape.material) {
      if (Array.isArray(shape.material)) {
        shape.material.forEach((material) => material.dispose()); // Dispose of all materials if it's an array
      } else {
        shape.material.dispose(); // Dispose of single material
      }
    }
  }

  //save
  //
  saveAllEntity() {
    const shapesData = this.shapes.map((shape) => {
      const { name, uuid, material, geometry } = shape;

      // Default shared properties
      const sharedProperties = {
        name: name,
        uuid: uuid,
        color: material.color.getHex(), // Color in hex
        opacity: material.opacity,
      };

      // Specific properties for each shape type
      let specificProperties = {};

      if (name === "Line") {
        specificProperties = {
          lineStart: Array.from(
            shape.geometry.attributes.position.array.slice(0, 3)
          ), // Convert to array
          lineEnd: Array.from(
            shape.geometry.attributes.position.array.slice(3, 6)
          ), // Convert to array
        };
      } else if (name === "Circle") {
        specificProperties = {
          // circleCenter: shape.position.toArray(),
          circleCenter: shape.center,
          circleRadius: shape.geometry.parameters.radius,
        };
      } else if (name === "Ellipse") {
        const [Rx, Ry] = shapeStore.getEllipseRadius(uuid); // Fetch Rx and Ry using shapeStore
        specificProperties = {
          ellipseCenter: shape.position.toArray(),
          Rx: Rx,
          Ry: Ry,
        };
      } else if (name === "Polyline") {
        specificProperties = {
          polylinePoints: Array.from(shape.geometry.attributes.position.array), // Convert to array
        };
      }

      // Combine shared properties with specific shape properties
      return { ...sharedProperties, ...specificProperties };
    });

    // Convert shapesData to JSON format
    const dataStr = JSON.stringify(shapesData);

    // Create a Blob object with the JSON data
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shapes.json"; // Name of the file
    link.click(); // Trigger the download
  }

  //upload
  uploadAllEntity(shapesData) {
    if (!this.scene) {
      console.error("Scene is not defined.");
      return; // Exit early if the scene is not available
    }

    // First, remove all shapes from the scene except for camera, renderer, and plane
    if (this.scene) {
      this.scene.traverse((object) => {
        // Check if the object or any of its children is named "Plane"
        let isPlanePresent = false;

        // Check the current object
        if (object.name === "Plane") {
          isPlanePresent = true;
        }

        // Check all children of the object
        if (object.children && object.children.length > 0) {
          object.children.forEach((child) => {
            if (child.name === "Plane") {
              isPlanePresent = true;
            }
          });
        }

        // Only remove objects that are not "Camera", "Renderer", or "Plane" (or their children)
        if (
          object.name !== "Camera" &&
          object.name !== "Renderer" &&
          !isPlanePresent
        ) {
          this.scene.remove(object);
          this.disposeShape(object); // Dispose of the shape resources
        }
      });
    }

    // Clear out the shapes array
    this.shapes = [];
    this.ellipsesRadiusXY = [];

    // Now, add the shapes back to the scene from the JSON data
    shapesData.forEach((shapeData) => {
      const { name, color, opacity, ...specificProperties } = shapeData;
      let newShape;

      // Create the shape based on the name
      if (name === "Line") {
        if (
          !Array.isArray(specificProperties.lineStart) ||
          !Array.isArray(specificProperties.lineEnd)
        ) {
          console.error("invalid lineStart and lineend:", shapeData);
          return;
        }
        const lineGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
          ...specificProperties.lineStart,
          ...specificProperties.lineEnd,
        ]);
        lineGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        const lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Line(lineGeometry, lineMaterial);
        newShape.name = "Line";
      } else if (name === "Circle") {
        // if (!Array.isArray(specificProperties.circleCenter)) {
        //   console.error(
        //     "Invalid circleCenter:",
        //     specificProperties.circleCenter
        //   );
        //   return; // Exit early if it's not an array
        // }
        const circleGeometry = new THREE.CircleGeometry(
          specificProperties.circleRadius
        );
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Mesh(circleGeometry, circleMaterial);

        newShape.center = { ...specificProperties.circleCenter };
        newShape.position.set(newShape.center.x, 0, newShape.center.z);
        // newShape.position.set(...specificProperties.circleCenter);
        newShape.rotation.x = -Math.PI * 0.5;
        newShape.name = "Circle";
      } else if (name === "Ellipse") {
        const ellipseGeometry = new THREE.EllipseCurve(
          0,
          0, // center
          specificProperties.Rx,
          specificProperties.Ry, // radii
          0,
          Math.PI * 2 // full circle
        ).getPoints(64);

        const ellipseBufferGeometry = new THREE.BufferGeometry().setFromPoints(
          ellipseGeometry
        );
        const ellipseMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Line(ellipseBufferGeometry, ellipseMaterial);
        console.log(...specificProperties.ellipseCenter, "ellipse-center");
        newShape.position.set(...specificProperties.ellipseCenter);
        newShape.rotation.x = Math.PI * 0.5;
        // newShape.position.x(...specificProperties.ellipseCenter[0]);
        // newShape.position.y(0.5);
        // newShape.position.z(...specificProperties.ellipseCenter[2]);
        newShape.name = "Ellipse";
        this.setEllipseRadius(
          newShape.uuid,
          specificProperties.Rx,
          specificProperties.Ry
        );
      } else if (name === "Polyline") {
        const polylineGeometry = new THREE.BufferGeometry();
        const points = new Float32Array(specificProperties.polylinePoints);
        polylineGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(points, 3)
        );
        const polylineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Line(polylineGeometry, polylineMaterial);
        newShape.name = "Polyline";
      }

      // Add the new shape to the scene and the shapes array
      if (newShape) {
        this.scene.add(newShape);
        this.shapes.push(newShape);
      }
    });
  }
  // uploadAllEntity(shapesData) {
  //   // First, remove all shapes from the scene except for camera, renderer, and plane
  //   if (this.scene) {
  //     this.scene.traverse((object) => {
  //       // Check if the object or any of its children is named "Plane"
  //       let isPlanePresent = false;

  //       // Check the current object
  //       if (object.name === "Plane") {
  //         isPlanePresent = true;
  //       }

  //       // Check all children of the object
  //       if (object.children && object.children.length > 0) {
  //         object.children.forEach((child) => {
  //           if (child.name === "Plane") {
  //             isPlanePresent = true;
  //           }
  //         });
  //       }

  //       // Only remove objects that are not "Camera", "Renderer", or "Plane" (or their children)
  //       if (
  //         object.name !== "Camera" &&
  //         object.name !== "Renderer" &&
  //         !isPlanePresent
  //       ) {
  //         this.scene.remove(object);
  //         this.disposeShape(object); // Dispose of the shape resources
  //       }
  //     });
  //   }

  //   // Clear out the shapes array
  //   this.shapes = [];

  //   // Now, add the shapes back to the scene from the JSON data
  //   shapesData.forEach((shapeData) => {
  //     const { name, color, opacity, ...specificProperties } = shapeData;
  //     let newShape;

  //     // Create the shape based on the name
  //     if (name === "Line") {
  //       const lineGeometry = new THREE.BufferGeometry();
  //       const positions = new Float32Array([
  //         ...specificProperties.lineStart,
  //         ...specificProperties.lineEnd,
  //       ]);
  //       lineGeometry.setAttribute(
  //         "position",
  //         new THREE.BufferAttribute(positions, 3)
  //       );
  //       const lineMaterial = new THREE.LineBasicMaterial({
  //         color: new THREE.Color(color),
  //         opacity,
  //       });
  //       newShape = new THREE.Line(lineGeometry, lineMaterial);
  //     } else if (name === "Circle") {
  //       const circleGeometry = new THREE.CircleGeometry(
  //         specificProperties.circleRadius
  //       );
  //       const circleMaterial = new THREE.MeshBasicMaterial({
  //         color: new THREE.Color(color),
  //         opacity,
  //       });
  //       newShape = new THREE.Mesh(circleGeometry, circleMaterial);
  //       newShape.position.set(...specificProperties.circleCenter);
  //     } else if (name === "Ellipse") {
  //       const ellipseGeometry = new THREE.EllipseCurve(
  //         0,
  //         0, // center
  //         specificProperties.Rx,
  //         specificProperties.Ry, // radii
  //         0,
  //         Math.PI * 2 // full circle
  //       ).getPoints(64);

  //       const ellipseBufferGeometry = new THREE.BufferGeometry().setFromPoints(
  //         ellipseGeometry
  //       );
  //       const ellipseMaterial = new THREE.LineBasicMaterial({
  //         color: new THREE.Color(color),
  //         opacity,
  //       });
  //       newShape = new THREE.Line(ellipseBufferGeometry, ellipseMaterial);
  //       newShape.position.set(...specificProperties.ellipseCenter);
  //     } else if (name === "Polyline") {
  //       const polylineGeometry = new THREE.BufferGeometry();
  //       const points = new Float32Array(specificProperties.polylinePoints);
  //       polylineGeometry.setAttribute(
  //         "position",
  //         new THREE.BufferAttribute(points, 3)
  //       );
  //       const polylineMaterial = new THREE.LineBasicMaterial({
  //         color: new THREE.Color(color),
  //         opacity,
  //       });
  //       newShape = new THREE.Line(polylineGeometry, polylineMaterial);
  //     }

  //     // Add the new shape to the scene and the shapes array
  //     if (newShape) {
  //       this.scene.add(newShape);
  //       this.shapes.push(newShape);
  //     }
  //   });
  // }
  // uploadAllEntity(file) {
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const data = JSON.parse(event.target.result);
  //     console.log(data, "data");

  //     // First, remove all shapes from the scene except for camera, renderer, and plane
  //     // if (this.scene) {
  //     //   // Loop through all objects in the scene and remove shapes, but keep camera, renderer, and plane (even in children)
  //     //   this.scene.traverse((object) => {
  //     //     // Check if the object or any of its children is a plane, if so, skip removal
  //     //     if (object.name !== "Camera" && object.name !== "Renderer") {
  //     //       // If the object is a group, check its children for Plane
  //     //       if (object.children && object.children.length > 0) {
  //     //         const isPlanePresent = object.children.some(child => child.name === "Plane");
  //     //         if (isPlanePresent) {
  //     //           return; // Skip removal if 'Plane' is found in the children
  //     //         }
  //     //       }
  //     if (this.scene) {
  //       // Loop through all objects in the scene and remove shapes, but keep camera, renderer, and plane
  //       this.scene.traverse((object) => {
  //         // Only remove objects that are shapes and not camera, renderer, or plane
  //         if (
  //           object.name !== "Camera" &&
  //           object.name !== "Renderer" &&
  //           object.name !== "Plane"
  //         ) {
  //           this.scene.remove(object);
  //           this.disposeShape(object); // Dispose of the shape resources (geometry and material)
  //         }
  //       });
  //     }

  //     // Clear out the shapes array
  //     this.shapes = [];

  //     // Now, add the shapes back to the scene from the JSON data
  //     data.forEach((shapeData) => {
  //       const { name, color, opacity, specificProperties } = shapeData; //uuid
  //       let newShape;

  //       // Create the shape based on the name
  //       if (name === "Line") {
  //         const lineGeometry = new THREE.BufferGeometry();
  //         const positions = new Float32Array([
  //           ...specificProperties.lineStart,
  //           ...specificProperties.lineEnd,
  //         ]);
  //         lineGeometry.setAttribute(
  //           "position",
  //           new THREE.BufferAttribute(positions, 3)
  //         );
  //         const lineMaterial = new THREE.LineBasicMaterial({
  //           color: new THREE.Color(color),
  //           opacity,
  //         });
  //         newShape = new THREE.Line(lineGeometry, lineMaterial);
  //       } else if (name === "Circle") {
  //         const circleGeometry = new THREE.CircleGeometry(
  //           specificProperties.circleRadius
  //         );
  //         const circleMaterial = new THREE.MeshBasicMaterial({
  //           color: new THREE.Color(color),
  //           opacity,
  //         });
  //         newShape = new THREE.Mesh(circleGeometry, circleMaterial);
  //         newShape.position.set(...specificProperties.circleCenter);
  //       } else if (name === "Ellipse") {
  //         const ellipseGeometry = new THREE.EllipseCurve(
  //           0,
  //           0, // center
  //           specificProperties.Rx,
  //           specificProperties.Ry, // radii
  //           0,
  //           Math.PI * 2 // full circle
  //         ).getPoints(64);

  //         const ellipseBufferGeometry =
  //           new THREE.BufferGeometry().setFromPoints(ellipseGeometry);
  //         const ellipseMaterial = new THREE.LineBasicMaterial({
  //           color: new THREE.Color(color),
  //           opacity,
  //         });
  //         newShape = new THREE.Line(ellipseBufferGeometry, ellipseMaterial);
  //         newShape.position.set(...specificProperties.ellipseCenter);
  //       } else if (name === "Polyline") {
  //         const polylineGeometry = new THREE.BufferGeometry();
  //         const points = new Float32Array(specificProperties.polylinePoints);
  //         polylineGeometry.setAttribute(
  //           "position",
  //           new THREE.BufferAttribute(points, 3)
  //         );
  //         const polylineMaterial = new THREE.LineBasicMaterial({
  //           color: new THREE.Color(color),
  //           opacity,
  //         });
  //         newShape = new THREE.Line(polylineGeometry, polylineMaterial);
  //       }

  //       // Add the new shape to the scene and the shapes array
  //       if (newShape) {
  //         this.scene.add(newShape);
  //         this.shapes.push(newShape);
  //       }
  //     });
  //   };

  //   reader.readAsText(file); // Read the uploaded file
  // }
}

export const shapeStore = new ShapeStore();

// updateEntity(entityId) {
//   const updateShape = this.shapes.find((e) => e.uuid == entityId);
//   if (updateShape.name === "Line") {
//     updateShape.geometry.attributes.position.array = [
//       ...lineStart,
//       ...lineEnd,
//     ];
//   }
//   if (updateShape.name === "Circle") {
//   }
//   if (updateShape.name === "Polyline") {
//   }
//   if (updateShape.name === "Ellipse") {
//   }
// }
