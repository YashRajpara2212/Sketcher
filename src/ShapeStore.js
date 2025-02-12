import { makeAutoObservable } from "mobx";

class ShapeStore {
  shapes = [];
  currentEntity = null;
  entityId = null;

  constructor() {
    makeAutoObservable(this);
  }

  addShape(shapeMesh) {
    this.shapes.push(shapeMesh);
  }

  resetShapes() {
    this.shapes = [];
  }
  get Entity() {
    return this.currentEntity;
  }
  setEntity(inEntity) {
    this.currentEntity = inEntity;
  }

  //   hideEntity(entityId) {
  //     for (let i = 0; i < this.shapes.length; i++) {
  //       if (this.shapes[i].uuid === entityId) {
  //         // Check for matching entityId
  //         // Toggle visibility based on the current state
  //         this.shapes[i].visible = !this.shapes[i].visible;
  //         break; // No need to continue after finding the shape
  //       }
  //     }
  //   }
  //   hideEntity(entityId) {
  //     for (let i = 0; i < this.shapes.length; i++) {
  //       if (this.shapes[i].uuid === entityId) {
  //         if (this.shapes[i].visible) {
  //           this.shapes[i].visible = false;
  //         } else {
  //           this.shapes[i].visible = true;
  //         }
  //       }
  //     }
  hideEntity(entityId) {
    const hideShape = this.shapes.find((e) => (e.uuid = entityId));
    if (hideShape) {
      if (hideShape.visible) {
        hideShape.visible = false;
      } else {
        hideShape.visible = true;
      }
    }
  }
}


export const shapeStore = new ShapeStore();
