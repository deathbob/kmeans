var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );



var renderer = new THREE.CSS3DRenderer();
//var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.position = 'absolute';
document.getElementById( 'container' ).appendChild( renderer.domElement );



//      renderer.setSize( window.innerWidth, window.innerHeight );
//      document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 500;
var objects = [];


var element = document.createElement( 'div' );
element.className = 'row';
var e2 = document.createElement("div");
e2.className = "col-md-12 text-center";
element.appendChild(e2);

e2.textContent = "Bob Rules";
hh = document.createElement("h1");
hh.textContent = "Auctions";
e2.appendChild(hh);
ss = document.createElement("span");
ss.className = "odometer";
ss.id = "auction-odometer"
e2.appendChild(ss);

element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

var object = new THREE.CSS3DObject( element );
object.position.x = 200;
object.position.y = 200;
object.position.z = 5;
scene.add( object );
objects.push( object );

var render = function () {
  requestAnimationFrame( render );

  object.rotation.x += 0.01;
  object.rotation.y += 0.01;

  renderer.render(scene, camera);
};

render();
