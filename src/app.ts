import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Event } from 'three';

// Debug GUI
// const gui = new dat.GUI();

// Texture Loader
const loader = new THREE.TextureLoader();
// Load a custom texture
const crossStar = loader.load('./Star.png');

// Canvas
const canvas = document.querySelector('canvas.viewport');

// Scene
const scene = new THREE.Scene();

// Torus geometry
const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

// Star (particle) geometry
const patricleGeometry = new THREE.BufferGeometry();

// Number of Stars
const particleCount = 5000;

const posArray = new Float32Array(particleCount * 3);

// O(n) operation to place stars
for (let i = 0; i < particleCount * 3; i++) {
	posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}

// Set the position attribute of each star
patricleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// The point style material for the torus geometry
const torusMaterial = new THREE.PointsMaterial({
	size: 0.005,
});

// The point style material for the star material. *Uses a custom texture.
const particleMaterial = new THREE.PointsMaterial({
	size: 0.001,
	map: crossStar,
	transparent: true,
	color: '#e6f0fc',
});

// Combine the torus geometry and material into a mesh.
const torus = new THREE.Points(torusGeometry, torusMaterial);
// Combine the custom star material with the point geometry into a mesh.
const stars = new THREE.Points(patricleGeometry, particleMaterial);
// Add both the torus and the stars to the scene
scene.add(torus, stars);

// Add a point light to the scene
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Store the display sizes as an object we can access and manipulate
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Adjust to match display resolution on window resize
window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Add a camera to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Create our renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas!,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#21282a'), 1);

// Capute mouse inputs for scene manipulation
document.addEventListener('mousemove', animateParticles);

// Init inputs
let mouseX = 0;
let mouseY = 0;

/**
 * Update mouse positions on event occurance.
 *
 * @param event The document event object.
 */
function animateParticles(event: Event) {
	mouseY = event.clientY;
	mouseX = event.clientX;
}

// Generate a clock to assist with animated tranlations.
const clock = new THREE.Clock();

/**
 * Recursive function which provides attribute updates on frame "tick"
 */
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Rotate the torus
	torus.rotation.y = 0.5 * elapsedTime;

	// Provide inital rotation for the stars
	stars.rotation.y = -0.1 * elapsedTime;

	// Rotate the stars given an input
	if (mouseX > 0) {
		stars.rotation.x = -mouseY * elapsedTime * 0.00008;
		stars.rotation.y = -mouseX * elapsedTime * 0.00008;
	}

	// Render the scene
	renderer.render(scene, camera);

	// Recursive call to next frame
	window.requestAnimationFrame(tick);
};
// Initial call into our recursive event / "game" loop
tick();
