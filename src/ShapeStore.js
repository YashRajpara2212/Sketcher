import { makeAutoObservable } from "mobx";

class ShapeStore {
  shapes = [];
  currentEntity = null;
  entityId = null;
  scene = null;

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
