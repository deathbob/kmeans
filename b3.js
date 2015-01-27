//scene and camera

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 5000 );
camera.position.x = 400;
camera.position.y = 800;
camera.position.z = 2500;

// renderer
var renderer = new THREE.CSS3DRenderer();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.position = 'absolute';
document.getElementById( 'container' ).appendChild( renderer.domElement );

var render = function () {
  renderer.render(scene, camera);
};

// controls
var controls = new THREE.TrackballControls( camera );

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 1.2;

controls.noZoom = false;
controls.noPan = false;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

controls.keys = [ 65, 83, 68 ];

controls.addEventListener( 'change', render );

// scene clearer
THREE.Object3D.prototype.clear = function(){
  var children = this.children;
  for(var i = children.length-1;i>=0;i--){
    var child = children[i];
    child.clear();
    this.remove(child);
  };
};




var squareSize = 10;

var geometry = new THREE.BoxGeometry( squareSize, squareSize, squareSize );

var cubes = [];

function allCubes(pixels){
  cubes = [];
  scene.clear();
  var pixel = null;
  for(var i = 0; i< pixels.length; i++){
    pixel = pixels[i]
    var material = new THREE.MeshBasicMaterial( { color: pixel.color } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.z = 2;
    cube.position.x = pixel.x * squareSize;
    cube.position.y = pixel.y * squareSize;
    cube.updateMatrix();
//    cube.matrixAutoUpdate = false; // turn this on when moving
    scene.add( cube );
    cubes.push(cube);

  }
}

function explode(){
  var szt = squareSize / 2;
  var pixel;
  var target;
  var cube;
  for(var i = 0; i < cubes.length; i++){
    pixel = pixels[i];
    cube = cubes[i];
//    cube.matrixAutoUpdate = true; // doesn't seem to help turning this on and off
    target = {
      x:  pixel.r * szt,
      y:  pixel.g * szt,
      z:  pixel.b * szt
    }
    var tween = new TWEEN.Tween(cube.position)
        .to(target, 4000)
        .onUpdate( function() {
          cube.position.x = this.x;
          cube.position.y = this.y;
          cube.position.z = this.z;
        })
        // .onComplete( function(){
        //   console.log("explode complete!");
        //   cube.matrixAutoUpdate = false;
        // })
        .start();
  }
}

function implode(){
  var pixel;
  var target;
  var cube;
  for(var i = 0; i < cubes.length; i++){
    pixel = pixels[i];
    cube = cubes[i];
//    cube.matrixAutoUpdate = true;
    target = {
      x:  pixel.x * squareSize,
      y:  pixel.y * squareSize,
      z:  2
    }
    var tween = new TWEEN.Tween(cube.position)
        .to(target, 4000)
        .onUpdate( function() {
          cube.position.x = this.x;
          cube.position.y = this.y;
          cube.position.z = this.z;
        })
        // .onComplete( function(){
        //   console.log("implode complete!");
        //   cube.matrixAutoUpdate = false;
        // })
        .start();
  }

}

function animate() {
  TWEEN.update();
  controls.update();

  requestAnimationFrame( animate );
  render()
}



render();
animate();
