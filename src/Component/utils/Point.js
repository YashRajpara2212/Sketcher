import * as THREE from "three";

class Point {
  constructor(mX, mY, mZ) {
    // Initialize the coordinates of the point
    this.mX = mX;
    this.mY = mY;
    this.mZ = mZ;
  }

  generateSphere(scene) {
    // Create sphere geometry with the specified radius
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);

    // Set the position of the sphere at this point (x, y, z)
    sphere.position.set(this.mX, this.mY, this.mZ);

    // Add the sphere to the passed scene
    scene.add(sphere);
  }
}

export default Point;

