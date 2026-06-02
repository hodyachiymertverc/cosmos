const container = document.getElementById('canvas-container');
let scene, camera, renderer, currentCosmosObject;
let starsMesh;

let timeMultiplier = 1.0;
const clock = new THREE.Clock();

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020208, 0.012); // Сделал туман чуть прозрачнее

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 32); // Камера чуть выше и дальше, чтобы видеть джеты целиком
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const starsGeo = new THREE.BufferGeometry();
    const count = 10000; // Больше звезд для фона
    const positions = new Float32Array(count * 3);
    const starTexture = window.CosmoRegistry.createGlowTexture("rgba(200,220,255,1)");

    for (let i = 0; i < count * 3; i++) {
        // Звезды располагаются сферой вокруг центра
        const r = 200 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starsMat = new THREE.PointsMaterial({
        size: 0.4,
        map: starTexture,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false // Чтобы звезды не создавали артефактов друг на друге
    });
    starsMesh = new THREE.Points(starsGeo, starsMat);
    scene.add(starsMesh);

    setupUI();
    loadObject('gargantua');
    animate();
}

function loadObject(id) {
    if (currentCosmosObject) {
        scene.remove(currentCosmosObject);
    }

    const info = window.CosmoRegistry.data[id];
    document.getElementById('obj-name').innerText = info.name;
    document.getElementById('obj-desc').innerText = info.desc;

    currentCosmosObject = window.CosmoRegistry.build(id);
    scene.add(currentCosmosObject);
}

function setupUI() {
    const select = document.getElementById('object-select');
    select.addEventListener('change', (e) => loadObject(e.target.value));

    const slider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    slider.addEventListener('input', (e) => {
        timeMultiplier = parseFloat(e.target.value);
        speedVal.innerText = timeMultiplier.toFixed(1);
    });

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let totalTime = 0;
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    totalTime += delta * timeMultiplier;

    starsMesh.rotation.y = totalTime * 0.003;
    starsMesh.rotation.x = totalTime * 0.001;

    if (currentCosmosObject && currentCosmosObject.userData.update) {
        currentCosmosObject.userData.update(totalTime, timeMultiplier);
    }

    // Имитация дыхания камеры (полет)
    camera.position.x = Math.sin(totalTime * 0.1) * 2;
    camera.position.y = 10 + Math.cos(totalTime * 0.15) * 1.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

window.onload = init;