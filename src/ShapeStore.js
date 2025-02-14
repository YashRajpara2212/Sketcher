import { makeAutoObservable } from "mobx";

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

    // console.log(entityId, "hi");
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
}

export const shapeStore = new ShapeStore();
