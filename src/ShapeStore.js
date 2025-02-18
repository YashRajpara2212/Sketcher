import { makeAutoObservable } from "mobx";
import * as THREE from "three";

class ShapeStore {
  shapes = [];
  currentEntity = null;
  entityId = null;
  scene = null;
  selectedShape = null;
  ellipsesRadiusXY = [];

  lines = [];
  circles = [];
  ellipses = [];
  polylines = [];

  constructor() {
    makeAutoObservable(this);
  }

  setScene(scene) {
    this.scene = scene;
    // console.log(this.scene, "scene1");
  }

  addShape(shapeMesh) {
    if (shapeMesh.name === "Line") {
      this.lines.push(shapeMesh);
      shapeMesh.number = this.lines.length; // Assign number based on length
    } else if (shapeMesh.name === "Circle") {
      this.circles.push(shapeMesh);
      shapeMesh.number = this.circles.length;
    } else if (shapeMesh.name === "Ellipse") {
      this.ellipses.push(shapeMesh);
      shapeMesh.number = this.ellipses.length;
    } else if (shapeMesh.name === "Polyline") {
      this.polylines.push(shapeMesh);
      shapeMesh.number = this.polylines.length;
    }

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
  setSelectedShape(shape) {
    this.selectedShape = shape;
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

  // Get the number of a specific shape by its name and uuid
  getShapeNumberByNameAndUUID(shapeName, uuid) {
    let shapeArray;

    // Find the corresponding array of shapes
    switch (shapeName) {
      case "Line":
        shapeArray = this.lines;
        break;
      case "Circle":
        shapeArray = this.circles;
        break;
      case "Ellipse":
        shapeArray = this.ellipses;
        break;
      case "Polyline":
        shapeArray = this.polylines;
        break;
      default:
        return null;
    }

    // Find the shape with the given uuid
    const shape = shapeArray.find((s) => s.uuid === uuid);

    if (shape) {
      // Return the shape's position (index + 1) as the shape's number
      // return shapeArray.indexOf(shape) + 1;
      return shape.number;
    }

    return null; // Return null if no shape found with the given uuid
  }

  // Remove a shape from the scene and dispose of its geometry/material
  removeEntity(entityId) {
    //before changes //
    const removeShape = this.shapes.find((e) => e.uuid == entityId);
    if (removeShape) {
      // for number

      if (removeShape.name === "Line") {
        this.lines = this.lines.filter((shape) => shape.uuid !== entityId);
      } else if (removeShape.name === "Circle") {
        this.circles = this.circles.filter((shape) => shape.uuid !== entityId);
      } else if (removeShape.name === "Ellipse") {
        this.ellipses = this.ellipses.filter(
          (shape) => shape.uuid !== entityId
        );
      } else if (removeShape.name === "Polyline") {
        this.polylines = this.polylines.filter(
          (shape) => shape.uuid !== entityId
        );
      }

      this.lines.forEach((shape, index) => {
        shape.number = index + 1;
      });
      this.circles.forEach((shape, index) => {
        shape.number = index + 1;
      });
      this.ellipses.forEach((shape, index) => {
        shape.number = index + 1;
      });
      this.polylines.forEach((shape, index) => {
        shape.number = index + 1;
      });

      //            //
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
    this.removeEllipseData(entityId);
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
      const { name, uuid, number, material, geometry } = shape;

      // Default shared properties
      const sharedProperties = {
        name: name,
        uuid: uuid,
        number: number,
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
        this.lines.push(newShape);
        newShape.number = this.lines.length;
      } else if (name === "Circle") {
        const circleGeometry = new THREE.CircleGeometry(
          specificProperties.circleRadius
        );
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Mesh(circleGeometry, circleMaterial);

        newShape.center = { ...specificProperties.circleCenter };
        newShape.position.set(newShape.center.x, 0.5, newShape.center.z);
        // newShape.position.set(...specificProperties.circleCenter);
        newShape.rotation.x = -Math.PI * 0.5;
        newShape.name = "Circle";
        this.circles.push(newShape);
        newShape.number = this.circles.length;
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

        newShape.name = "Ellipse";
        this.ellipses.push(newShape);
        newShape.number = this.ellipses.length;
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
        this.polylines.push(newShape);
        newShape.number = this.polylines.length;
      }

      // Add the new shape to the scene and the shapes array
      if (newShape) {
        this.scene.add(newShape);
        this.shapes.push(newShape);
      }
    });
  }
}

export const shapeStore = new ShapeStore();
