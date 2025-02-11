import * as THREE from "three";

class Line {
  constructor(scene, startPoint) {
    this.scene = scene;
    this.startPoint = startPoint;
    this.endPoint = startPoint;
    this.startSphere = null;
    this.endSphere = null;
    this.finalSphere = null;

    // Create the geometry for the line
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setFromPoints([this.startPoint, this.endPoint]);
    // Create the material for the line
    this.material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // Create the line mesh and add it to the scene
    this.line = new THREE.Line(this.geometry, this.material);
    this.scene.add(this.line);

    this.startSphere = this.createSphere(this.startPoint);
  }

  createSphere(position) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32); // Small sphere
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    this.scene.add(sphere);
    return sphere;
  }

  update(endPoint) {
    // Update the end point of the line
    this.endPoint = endPoint;

    // Update the geometry to reflect the new end point
    this.geometry.attributes.position.array[3] = endPoint.x;
    this.geometry.attributes.position.array[4] = endPoint.y;
    this.geometry.attributes.position.array[5] = endPoint.z;

    // Mark the geometry as needing update
    this.geometry.attributes.position.needsUpdate = true;

    if (!this.endSphere) {
      this.endSphere = this.createSphere(endPoint); // Green for moving endpoint
    } else {
      this.endSphere.position.set(endPoint.x, endPoint.y, endPoint.z);
    }
  }
  finalize() {
    if (this.endSphere) {
      this.finalSphere = this.createSphere(this.endSphere.position); // Blue for final endpoint
      this.endSphere = null;
    }
  }
}
export default Line;
