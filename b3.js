
//scene and camera

var scene = new THREE.Scene();
var maxIters = 10;
var thisIter = 1;
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
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
var squareMulti = (squareSize / 2);
var centroidMulti = 255 * squareMulti;


var centroids = [
  {
    x: Math.random() * centroidMulti,
    y: Math.random() * centroidMulti,
    z: Math.random() * centroidMulti,
    pixels: []
  },
  {
    x: Math.random() * centroidMulti,
    y: Math.random() * centroidMulti,
    z: Math.random() * centroidMulti,
    pixels: []
  },
  {
    x: Math.random() * centroidMulti,
    y: Math.random() * centroidMulti,
    z: Math.random() * centroidMulti,
    pixels: []
  },
  {
    x: Math.random() * centroidMulti,
    y: Math.random() * centroidMulti,
    z: Math.random() * centroidMulti,
    pixels: []
  },
  {
    x: Math.random() * centroidMulti,
    y: Math.random() * centroidMulti,
    z: Math.random() * centroidMulti,
    pixels: []
  },
  {
    x: Math.random() * centroidMulti,
    y: Math.random() * centroidMulti,
    z: Math.random() * centroidMulti,
    pixels: []
  }
]



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

  centroids.forEach(function(centroid){
    var geometry = new THREE.SphereGeometry(50);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 0.8} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = centroid.x;
    sphere.position.y = centroid.y;
    sphere.position.z = centroid.z;
    centroid.sphere = sphere;
    centroid.radius = 50;
    scene.add( sphere );
  })

  //  explode();
}

function explode(){
  var szt = squareMulti;
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

function square(num){
  return Math.pow(num, 2);
}

function dist_cube_to_centroid(cube, centroid){
  var x, y, z;
  x = cube.position.x - centroid.sphere.position.x
  y = cube.position.y - centroid.sphere.position.y
  z = cube.position.z - centroid.sphere.position.z
  var res = square(x) + square(y) + square(z);
  return Math.sqrt(res);
}

function kMeansIter(){
  // pixels is a global
  // cubes is a global
  var mindex;
  var index;
  var distances = cubes.map(function(cube){
    return centroids.map(function(centroid){
      return dist_cube_to_centroid(cube, centroid);
    })
  })
  //  clear centroid pixels array between iters
  centroids.forEach(function(cen){
    cen.old_pixels_length = pixels.length;
    cen.pixels = []
    cen.distances = []
  });

  var mindexs = distances.map(function(distances_array, pixel_index){
    var l_min = _.min(distances_array);
    var closest_centroid = distances_array.indexOf(l_min);
    centroids[closest_centroid].pixels.push(pixel_index)
    centroids[closest_centroid].distances.push(l_min)
  })



  if(thisIter > 2){
    // culling
    console.log("Centroid length before ", centroids.length);
    // remove sphere from scene if no pixels associated with it
    var deadCentroids = _.filter(centroids, function(cen){
      return 0 == cen.pixels.length;
    });
    deadCentroids.forEach(function(cen){
      scene.remove(cen.sphere);
    })

    // set centroids array to only centroids with pixels

    centroids = _.filter(centroids, function(cen){
      return cen.pixels.length > 0;
    });
    console.log("Centroid length after ", centroids.length);
    // end culling
  }


  // reduce pixels distances for each centroid, recompute
  return true;
}

function centroidsRecompute(){
  kMeansIter();

  centroids.forEach(function(centroid){
    var pixel_length = centroid.pixels.length
    var x, y, z;
    if(pixel_length > 0){
      x = centroid.pixels.reduce(function(prev, curr){ return prev + cubes[curr].position.x }, 0) / pixel_length
      y = centroid.pixels.reduce(function(prev, curr){ return prev + cubes[curr].position.y }, 0) / pixel_length
      z = centroid.pixels.reduce(function(prev, curr){ return prev + cubes[curr].position.z }, 0) / pixel_length
    }
    var target = {x: x, y: y, z: z};

    var tween = new TWEEN.Tween(centroid.sphere.position)
        .to(target, 2000)
        .onUpdate( function() {
          centroid.sphere.position.x = this.x;
          centroid.sphere.position.y = this.y;
          centroid.sphere.position.z = this.z;
          var fox, box, cox;
          rox = Math.round(this.x / squareMulti);
          gox = Math.round(this.y / squareMulti);
          box = Math.round(this.z / squareMulti);
          var col = "rgb(" + rox + "," + gox + "," + box + ")"
          //magic nuber dividing pixel length here.
          // really ought to make radius the size of hte most distant pixel owned by this centroid
          centroid.color = col;
          centroid.sphere.material.color.set(col);
        })
        .start();
    var oldRadius = centroid.sphere.geometry.boundingSphere.radius;
    var newRadius = _.max(centroid.distances) * 0.5 ;
    var radRatio = newRadius / oldRadius ;
    // console.log("Old Radius " + oldRadius);
    // console.log("New Radius " + newRadius);
    // console.log("Rad Ratio " + radRatio);
    // console.log("Centroid.sphere.scale " + centroid.sphere.scale);

    var oldScale = centroid.sphere.scale.x;
    var scaleTarget = {
      x: radRatio * oldScale,
      y: radRatio * oldScale,
      z: radRatio * oldScale
    }
    //    console.log("Scale Target ", scaleTarget)
    //    console.log("Centroid.sphere.scale ", centroid.sphere.scale);
    var radiusTarget = {
      radius: newRadius
    }
    var tweenTwo = new TWEEN.Tween({radius: centroid.radius})
        .to({radius: newRadius}, 2000)
        .onUpdate( function(){
          centroid.sphere.geometry = new THREE.SphereGeometry(this.radius);
          centroid.radius = this.radius;
        })
        .onComplete(function(){
          var isCentroidPrime = centroid == centroids[0];
          var notExceededMaxIters = !(thisIter >= maxIters);
          if(isCentroidPrime){
            $("#iterations-left").html( maxIters - thisIter);
            if(notExceededMaxIters){
              setTimeout(function(){
                thisIter++;
                centroidsRecompute();
              }, 500);
            }else{
              showFinalAnswer();
            }
          }
        })
        .start();


  });
  return true
}

function showFinalAnswer(){
  $("final-answer").append("<p>Color Centers!</p>")
  centroids.forEach(function(cen){
    var newSpan = "<div class='swatch' style='background-color: " + cen.color + "'> " + cen.color + "<br/> owns " + cen.pixels.length + " pixels </span>";
    $("#final-answer").append(newSpan);
  })
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
