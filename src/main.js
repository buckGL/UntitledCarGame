import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Creating the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#game'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
camera.position.setZ(5);
camera.position.setY(2);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //camera.lookAt(vehicle.position.x, vehicle.position.y, vehicle.position.z)
})

//User Input
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

let direction = "forward";
let speed = 0.1;

function keyDownHandler(e) {
  if(e.keyCode == "65") {
    direction = "left";
  }
  else if(e.keyCode == "68") {
    direction = "right";
  }
}

function keyUpHandler(e) {
  if(e.keyCode == "65") {
    direction = "forward";
  }
  else if(e.keyCode == "68") {
    direction = "forward";
  }
}

//Mobile touchscreen
document.getElementById("left").addEventListener('touchstart', () => {
  direction = "left"
})

document.getElementById("left").addEventListener('touchend', () => {
  direction = "forward"
})

document.getElementById("right").addEventListener('touchstart', () => {
  direction = "right"
})

document.getElementById("right").addEventListener('touchend', () => {
  direction = "forward"
})

//3D model directory
const models = [
  "./ambulance.glb",
  "./delivery.glb",
  "./deliveryFlat.glb",
  "./firetruck.glb",
  "./garbageTruck.glb",
  "./hatchbackSports.glb",
  "./police.glb",
  "./race.glb",
  "./raceFuture.glb",
  "./sedan.glb",
  "./sedanSports.glb",
  "./suv.glb",
  "./suvLuxury.glb",
  "./taxi.glb",
  "./tractor.glb",
  "./tractorShovel.glb",
  "./truck.glb",
  "./truckFlat.glb",
  "./van.glb"
]
let modelPath = models[Math.floor(Math.random() * models.length)];


//Loading manager
const manager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./325.jpg')
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

const loader = new GLTFLoader();
let loaded = 0;
let vehicle;
const vehicleBoundingBox = new THREE.Box3(); 

loader.load( modelPath, function ( gltf ) {
  vehicle = gltf.scene
  vehicle.traverse((o) => {
    if (o.isMesh) o.material = matcapMaterial;
  });
  scene.add(vehicle)
  loaded++;
  if(loaded > 2) {
    animate()
  }
}, undefined, function ( error ) {
	console.error( error );
} );

let flag
const flagBoundingBox = new THREE.Box3()

loader.load( "./flag.glb", function ( gltf ) {
  flag = gltf.scene;
  flag.traverse((o) => {
    if (o.isMesh) o.material = matcapMaterial;
  });
  scene.add(flag);
  flag.position.set((Math.floor((Math.random() * 10) + 1)), 0, (Math.floor((Math.random() * 10) + 1)))
  flagBoundingBox.setFromObject(flag)
  loaded++;
  if(loaded > 2) {
    animate()
  }
}, undefined, function ( error ) {
	console.error( error );
} );

const ring = new THREE.Mesh(
  new THREE.RingGeometry(0.8, 1, 32),
  matcapMaterial
)
scene.add(ring)
ring.rotation.x = -(Math.PI / 2)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000, 100, 100),
  new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true })
)
scene.add(floor)
floor.position.y = -0.5
floor.rotation.x = -(Math.PI / 2)

let arrow
loader.load( "./arrow.glb", function ( gltf ) {
  arrow = gltf.scene;
  arrow.traverse((o) => {
    if (o.isMesh) o.material = matcapMaterial;
  });
  scene.add(arrow);
  loaded++;
  if(loaded > 2) {
    animate()
  }
}, undefined, function ( error ) {
	console.error( error );
} );

let score = 0


//Animate the scene
function animate() {
  requestAnimationFrame(animate);

  vehicleBoundingBox.setFromObject(vehicle)
  if(direction == "left") {
    vehicle.rotation.y += 0.05;
  }
  else if(direction == "right") {
    vehicle.rotation.y -= 0.05;
  }

  ring.position.x = flag.position.x
  ring.position.z = flag.position.z

  arrow.lookAt(flag.position.x, flag.position.y, flag.position.z)
  arrow.position.set(vehicle.position.x, vehicle.position.y, vehicle.position.z)

  vehicle.translateZ(-speed);
  camera.lookAt(vehicle.position.x, vehicle.position.y, vehicle.position.z)

  if(vehicleBoundingBox.intersectsBox(flagBoundingBox)) {
    flag.position.set((Math.floor((Math.random() * 50) + 1) - 25), 0, (Math.floor((Math.random() * 50) + 1)-25))
    flagBoundingBox.setFromObject(flag)
    score++
    if(score > 3) {
      document.getElementById("instructions").style.display = 'none';
    }
    document.getElementById("score").innerText = score
    speed = speed + 0.01
  }

  renderer.render(scene, camera);
}