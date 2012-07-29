'use strict';
/*global CALC, THREE*/

/*
  geometries is an array 6 differently sorted geometries.
  0 : ascending x
  1 : ascending y
  2 : ascending z
  3 : descending x
  4 : descending y
  5 : descending z
*/

(CALC.MultiSortObject = function (geometries, material) {
    THREE.Object3D.call(this);

    this.meshes = [];
    var g, len = geometries.length, mesh;
    for (g = 0; g < len; g++) {
        mesh = new THREE.Mesh(geometries[g], material);
        mesh.doubleSided = true;
        this.meshes.push(mesh);
    }

    this.currentIndex = 0;
    this.currentChild = this.meshes[0];
    this.add(this.meshes[0]);
}).extends(THREE.Object3D, {
    getBoundingBox: function (i) {
        return this.meshes[0].geometry.boundingBox;
    },

    replaceMesh: function (i) {
        if (this.currentIndex !== i) {
            this.remove(this.currentChild);
            this.currentIndex = i;
            this.currentChild = this.meshes[i];
            this.add(this.currentChild);
        }
    },

    prepareFrame: function (renderer) {
        var camera = renderer.camera, camPos, inv, d;

        this.updateMatrix();
        this.updateMatrixWorld();

        camera.updateMatrix();
        camera.updateMatrixWorld();

        camPos = camera.matrix.getPosition().clone();

        inv = new THREE.Matrix4();
        inv.getInverse(this.matrixWorld);

        d = inv.multiplyVector3(camPos);

        this.replaceMesh(
            (Math.abs(d.x) > Math.abs(d.y)
                ? (Math.abs(d.x) > Math.abs(d.z)
                   ? (d.x > 0 ? 0 : 3)
                   : (d.z > 0 ? 2 : 5)
                  )
                : (Math.abs(d.y) > Math.abs(d.z)
                   ? (d.y > 0 ? 1 : 4)
                   : (d.z > 0 ? 2 : 5)
                  )
            )
        );
    }

});