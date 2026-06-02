const container = document.getElementById('canvas-container');
let scene, camera, renderer, currentCosmosObject;
let starsMesh;
let postprocessing = {};
let lights = [];

let timeMultiplier = 1.0;
const clock = new THREE.Clock();

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.008);
    scene.background = new THREE.Color(0x000510);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 28);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ==================== ОСВЕЩЕНИЕ ====================
    
    // Основное направленное освещение (имитация звёздного света)
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.3);
    mainLight.position.set(10, 15, 10);
    scene.add(mainLight);
    lights.push(mainLight);

    // Окружающее освещение
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.4);
    scene.add(ambientLight);

    // Точечные источники света (энергия в центре сцены)
    const coreLight = new THREE.PointLight(0xff6633, 1.5, 100);
    coreLight.position.set(0, 0, 0);
    coreLight.castShadow = true;
    scene.add(coreLight);
    lights.push(coreLight);

    // ==================== ЗВЁЗДЫ ====================
    
    const starsGeo = new THREE.BufferGeometry();
    const count = 20000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const r = 200 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);

        // Разнообразие цветов звёзд
        const starColor = Math.random();
        if (starColor < 0.6) {
            colors[i*3] = 0.8 + Math.random() * 0.2;     // R - белые
            colors[i*3+1] = 0.8 + Math.random() * 0.2;   // G
            colors[i*3+2] = 0.8 + Math.random() * 0.2;   // B
        } else if (starColor < 0.8) {
            colors[i*3] = 1.0;                            // R - голубые
            colors[i*3+1] = 0.9 + Math.random() * 0.1;   // G
            colors[i*3+2] = 0.6 + Math.random() * 0.2;   // B
        } else {
            colors[i*3] = 1.0;                            // R - красные
            colors[i*3+1] = 0.5 + Math.random() * 0.3;   // G
            colors[i*3+2] = 0.3 + Math.random() * 0.2;   // B
        }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starTexture = window.CosmoRegistry.createGlowTexture("rgba(200,220,255,1)");
    const starsMat = new THREE.PointsMaterial({
        size: 0.5,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });
    starsMesh = new THREE.Points(starsGeo, starsMat);
    scene.add(starsMesh);

    // ==================== ПОСТОБРАБОТКА ====================
    
    setupPostprocessing();
    setupUI();
    loadObject('gargantua');
    animate();
}

function setupPostprocessing() {
    // Создание отдельного canvas для эффектов (если понадобятся шейдеры)
    // На данный момент используем встроенные эффекты Three.js
    postprocessing.enabled = true;
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
    
    // Анимация появления
    currentCosmosObject.scale.set(0, 0, 0);
    const startTime = Date.now();
    const animatePop = () => {
        const elapsed = (Date.now() - startTime) / 800;
        if (elapsed < 1) {
            const easeOut = 1 - Math.pow(1 - elapsed, 3);
            currentCosmosObject.scale.set(easeOut, easeOut, easeOut);
            requestAnimationFrame(animatePop);
        } else {
            currentCosmosObject.scale.set(1, 1, 1);
        }
    };
    animatePop();
}

function setupUI() {
    const select = document.getElementById('object-select');
    select.addEventListener('change', (e) => {
        loadObject(e.target.value);
    });

    const slider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    slider.addEventListener('input', (e) => {
        timeMultiplier = parseFloat(e.target.value);
        speedVal.innerText = timeMultiplier.toFixed(1);
    });

    window.addEventListener('resize', onWindowResize);
    
    // Добавляем обработчик для полноэкранного режима
    document.addEventListener('dblclick', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen().catch(err => console.log(err));
        }
    });
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

    // ==================== ДВИЖЕНИЕ КАМЕРЫ ====================
    
    // Плавный полёт вокруг объекта
    const orbitRadius = 28;
    camera.position.x = Math.sin(totalTime * 0.08) * orbitRadius;
    camera.position.y = 8 + Math.cos(totalTime * 0.15) * 3;
    camera.position.z = Math.cos(totalTime * 0.08) * orbitRadius;
    
    camera.lookAt(0, 1, 0);

    // ==================== ЗВЁЗДЫ И КОСМОС ====================
    
    // Медленное вращение звёздного неба
    starsMesh.rotation.y = totalTime * 0.0005;
    starsMesh.rotation.x = totalTime * 0.0002;

    // ==================== ДИНАМИЧЕСКОЕ ОСВЕЩЕНИЕ ====================
    
    if (lights.length > 0) {
        const coreLight = lights[1];
        coreLight.intensity = 1.5 + Math.sin(totalTime * 2) * 0.5;
    }

    // ==================== ОБНОВЛЕНИЕ ОБЪЕКТА ====================
    
    if (currentCosmosObject && currentCosmosObject.userData.update) {
        currentCosmosObject.userData.update(totalTime, timeMultiplier);
    }

    // ==================== РЕНДЕРИНГ ====================
    
    renderer.render(scene, camera);
}

window.onload = init;

// Обработка видимости страницы для оптимизации
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clock.stop();
    } else {
        clock.start();
    }
});