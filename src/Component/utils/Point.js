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

 //raycaster
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();

    //  //onClick
    //  const onClick = (event) => {
    //     //update mouse coordinates
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //     //raycaster origin and direction
    //     raycaster.setFromCamera(mouse, camera);
  
    //     //raycaster intersect point
  
    //     const intersects = raycaster.intersectObject(plane);
    
    //     //show point
    //     if (intersects.length > 0) {
    //       //intersect point
    //       const intersectPoint = intersects[0].point;
    //       //for generationg point giving that point to Point
    //       const newPoint = new Point(
    //         intersectPoint.x,
    //         intersectPoint.y,
    //         intersectPoint.z
    //       );
    //       newPoint.generateSphere(scene);
    //     }
    //   };
  
    //   //add eventLister
    //   window.addEventListener("click", onClick);

    // return () => {
    //     window.removeEventListener("click", onClick);
    //   };