window.CosmoRegistry = {
    // ==================== УТИЛИТЫ ДЛЯ ТЕКСТУР ====================
    
    createGlowTexture: function(colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, colorHex);
        gradient.addColorStop(0.5, colorHex.replace('1)', '0.3)'));
        gradient.addColorStop(1, colorHex.replace('1)', '0)'));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(canvas);
    },

    // Создание текстуры с Perlin-подобным шумом для реалистичности
    createNoiseTexture: function(colorStr, scale = 1.0) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(128, 128);
        const data = imageData.data;

        // Простой Перлин-подобный шум
        for (let i = 0; i < data.length; i += 4) {
            const idx = i / 4;
            const x = idx % 128;
            const y = Math.floor(idx / 128);
            
            // Несколько слоев синусов для имитации шума
            const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) +
                         Math.sin(x * 0.05 + y * 0.05) * 0.5 +
                         Math.random() * 0.3;
            
            const intensity = (noise + 1) / 2;
            
            data[i] = 200 + intensity * 55;     // R
            data[i+1] = 150 + intensity * 105;  // G
            data[i+2] = 100 + intensity * 155;  // B
            data[i+3] = intensity * 200;        // A
        }

        ctx.putImageData(imageData, 0, 0);
        return new THREE.CanvasTexture(canvas);
    },

    // Генерация текстуры с горячим спектром
    createHotTexture: function() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.2, '#440000');
        gradient.addColorStop(0.4, '#ff4400');
        gradient.addColorStop(0.6, '#ffff00');
        gradient.addColorStop(0.8, '#ffffff');
        gradient.addColorStop(1, '#ccffff');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        return new THREE.CanvasTexture(canvas);
    },

    // Текстура для плазмы с волновыми паттернами
    createPlasmaTexture: function(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                const wave1 = Math.sin(x * 0.02 + y * 0.01) * 0.5 + 0.5;
                const wave2 = Math.cos(x * 0.01 - y * 0.02) * 0.5 + 0.5;
                const combined = (wave1 + wave2) / 2;
                
                const hue = combined * 360;
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${combined * 0.8})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        return new THREE.CanvasTexture(canvas);
    },

    // ==================== БАЗА ДАННЫХ ОБЪЕКТОВ ====================
    
    data: {
        gargantua: {
            name: "Гаргантюа",
            desc: "Сверхмассивная чёрная дыра с гигантским светящимся аккреционным диском. Её горизонт событий окружен раскалённой плазмой в миллионы градусов, испускающей яркое рентгеновское излучение.\n\nВнутренние слои диска движутся со скоростью, близкой к световой, создавая мощное магнитное поле, которое иногда выбрасывает материю в виде релятивистских джетов на миллионы километров.",
            type: "blackhole",
            color: "rgba(255,150,50,1)",
            jetColor: "rgba(0,150,255,1)",
            coreRadius: 3.5,
            diskParticles: 120000,
            diskSpeed: 0.6,
            hasJets: true,
            jetLength: 50,
            particleCount: 50000
        },
        sagittarius: {
            name: "Стрелец А*",
            desc: "Центр нашей галактики Млечный Путь. Её масса равна 4 миллионам масс Солнца. Скрыта плотными облаками пыли, но рентгеновские обсерватории видят её мощные всплески энергии.\n\nТурбулентные вихри горячего газа красного и жёлтого цвета падают в её утробу, создавая одно из самых динамичных зрелищ во Вселенной.",
            type: "blackhole",
            color: "rgba(255,80,20,1)",
            jetColor: "rgba(255,100,0,1)",
            coreRadius: 2.5,
            diskParticles: 100000,
            diskSpeed: 1.0,
            hasJets: true,
            jetLength: 40,
            particleCount: 60000,
            turbulent: true
        },
        ton618: {
            name: "TON 618",
            desc: "Один из самых массивных объектов во Вселенной — 66 миллиардов солнечных масс! Его аккреционный диск переливается ультрамариновым и голубым светом, светя ярче триллиона звёзд.\n\nМощные джеты вырываются из полюсов с релятивистскими скоростями, пронизывая космическое пространство на миллионы световых лет. Его светимость может затмить целую галактику.",
            type: "quasar",
            color: "rgba(50,180,255,1)",
            jetColor: "rgba(0,100,255,1)",
            coreRadius: 4.5,
            diskParticles: 150000,
            diskSpeed: 1.8,
            hasJets: true,
            jetLength: 70,
            jetIntensity: 2.0,
            particleCount: 80000,
            coronaRing: true
        },
        "3c273": {
            name: "3C 273",
            desc: "Первый открытый квазар в истории астрономии. Его диск состоит из сверхгорячей плазмы фиолетово-белого цвета. Мощные джеты пронзают пространство на многие миллионы световых лет.\n\nПульсирующее излучение свидетельствует о бурных процессах в его сердце — материя падает в чёрную дыру неравномерно, создавая волны энергии.",
            type: "quasar",
            color: "rgba(210,160,255,1)",
            jetColor: "rgba(150,0,255,1)",
            coreRadius: 3.0,
            diskParticles: 120000,
            diskSpeed: 2.0,
            hasJets: true,
            jetLength: 60,
            jetIntensity: 1.8,
            particleCount: 70000,
            pulsing: true
        },
        crab: {
            name: "Пульсар в Крабе",
            desc: "Остаток сверхновой, взорвавшейся в 1054 году. Это нейтронная звезда размером с город, но весящая больше Солнца. Она вращается 30 раз в секунду!\n\nМощные магнитные поля ускоряют частицы до релятивистских энергий, создавая видимое свечение. При каждом обороте магнитные полюсы разрезают пространство пучком радиации, как космический маяк.",
            type: "pulsar",
            color: "rgba(255,220,200,1)",
            beamColor: "rgba(160,32,240,1)",
            coreRadius: 1.2,
            diskSpeed: 8.0,
            pulseFreq: 30,
            beamCount: 2,
            particleCount: 40000,
            nebula: true
        },
        vela: {
            name: "Пульсар в Парусах",
            desc: "Молодой и агрессивный пульсар в облаке газа «Паруса». Его магнитное поле в триллионы раз сильнее земного. Пульсирует с частотой около 11 раз в секунду.\n\nМагнитные оси не совпадают с осями вращения, поэтому конусы излучения рисуют в пространстве сложные спирали изумрудного цвета, ускоряя окружающие частицы до фантастических энергий.",
            type: "pulsar",
            color: "rgba(180,255,220,1)",
            beamColor: "rgba(0,255,150,1)",
            coreRadius: 1.0,
            diskSpeed: 6.5,
            pulseFreq: 11,
            beamCount: 2,
            particleCount: 50000,
            nebula: true,
            nebulaColor: "rgba(0,200,150,0.3)"
        }
    },

    // ==================== КОНСТРУКТОР ОБЪЕКТОВ ====================
    
    build: function(id) {
        const config = this.data[id];
        const group = new THREE.Group();
        const isPulsar = config.type === "pulsar";

        // 1. СОЗДАНИЕ ЯДРА / ГОРИЗОНТА СОБЫТИЙ
        if (isPulsar) {
            // Нейтронная звезда — белое светящееся ядро
            const coreGeo = new THREE.SphereGeometry(config.coreRadius, 64, 64);
            const coreMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.6,
                roughness: 0.2,
                emissive: 0xffaa00,
                emissiveIntensity: 1.5
            });
            const core = new THREE.Mesh(coreGeo, coreMat);
            group.add(core);

            // Сияние вокруг нейтронной звезды
            const glowGeo = new THREE.SphereGeometry(config.coreRadius * 2.5, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.4,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            group.add(glow);
        } else {
            // Чёрная дыра — абсолютная чёрнота
            const coreGeo = new THREE.SphereGeometry(config.coreRadius, 64, 64);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const core = new THREE.Mesh(coreGeo, coreMat);
            group.add(core);
        }

        // 2. ЯРКОЕ СВЕЧЕНИЕ ВОКРУГ ЯДРА
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 256;
        glowCanvas.height = 256;
        const gCtx = glowCanvas.getContext('2d');
        
        const glowGrad = gCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
        const colorStr = config.color;
        glowGrad.addColorStop(0, colorStr);
        glowGrad.addColorStop(0.5, colorStr.replace('1)', '0.5)'));
        glowGrad.addColorStop(1, colorStr.replace('1)', '0)'));
        
        gCtx.fillStyle = glowGrad;
        gCtx.fillRect(0, 0, 256, 256);
        
        // Добавляем лучи света для большего эффекта
        gCtx.strokeStyle = colorStr.replace('1)', '0.4)');
        gCtx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 128 + 128;
            const y = Math.sin(angle) * 128 + 128;
            gCtx.beginPath();
            gCtx.moveTo(128, 128);
            gCtx.lineTo(x, y);
            gCtx.stroke();
        }

        const spriteMat = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(glowCanvas),
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
            depthWrite: false
        });
        const coreGlow = new THREE.Sprite(spriteMat);
        coreGlow.scale.set(config.coreRadius * 5, config.coreRadius * 5, 1);
        group.add(coreGlow);

        // 3. АККРЕЦИОННЫЙ ДИСК С МНОГОУРОВНЕВОЙ ФИЗИКОЙ
        let diskRings = [];
        let dustClouds = [];

        if (!isPulsar) {
            const ringsCount = 12; // Больше слоев для плавности
            const particlesPerRing = Math.floor(config.diskParticles / ringsCount);
            const innerBase = config.coreRadius * 1.5;
            const outerBase = innerBase * 5.5;
            const ringWidth = (outerBase - innerBase) / ringsCount;

            // Создание градиента цвета для диска
            const diskTexture = this.createHotTexture();

            for (let r = 0; r < ringsCount; r++) {
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(particlesPerRing * 3);
                const colors = new Float32Array(particlesPerRing * 3);
                const sizes = new Float32Array(particlesPerRing);
                
                const ringInner = innerBase + (r * ringWidth);
                const ringOuter = ringInner + ringWidth;
                const tempRatio = r / ringsCount; // 0 = холодно, 1 = горячо

                for (let i = 0; i < particlesPerRing; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = ringInner + Math.random() * (ringOuter - ringInner);
                    
                    pos[i*3] = Math.cos(angle) * radius;
                    pos[i*3+1] = (Math.random() - 0.5) * (radius * 0.2 * (1 - tempRatio * 0.5));
                    pos[i*3+2] = Math.sin(angle) * radius;

                    // Спектральный градиент: красный -> жёлтый -> белый -> голубой
                    let r, g, b;
                    if (tempRatio < 0.3) {
                        // Красный к жёлтому
                        const t = tempRatio / 0.3;
                        r = 1;
                        g = 0.3 + t * 0.7;
                        b = 0;
                    } else if (tempRatio < 0.6) {
                        // Жёлтый к белому
                        const t = (tempRatio - 0.3) / 0.3;
                        r = 1;
                        g = 1;
                        b = t * 0.5;
                    } else {
                        // Белый к голубому
                        const t = (tempRatio - 0.6) / 0.4;
                        r = 1 - t * 0.3;
                        g = 1 - t * 0.2;
                        b = 0.5 + t * 0.5;
                    }

                    colors[i*3] = r;
                    colors[i*3+1] = g;
                    colors[i*3+2] = b;

                    // Размер частиц увеличивается для внешних слоёв
                    sizes[i] = 0.2 + (tempRatio * 0.6);
                }

                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

                const mat = new THREE.PointsMaterial({
                    size: 0.4,
                    map: this.createGlowTexture("rgba(255,255,255,1)"),
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.9,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    sizeAttenuation: true
                });

                const ringMesh = new THREE.Points(geo, mat);
                const relativeSpeed = 1 / Math.sqrt(ringInner * 0.2);
                
                diskRings.push({ 
                    mesh: ringMesh, 
                    speed: relativeSpeed,
                    tempRatio: tempRatio,
                    r: r
                });
                group.add(ringMesh);
            }
            
            // Наклон диска
            diskRings.forEach(ring => {
                ring.mesh.rotation.x = Math.PI / 3.5;
            });

            // Облака пыли между кольцами (более крупные частицы)
            for (let d = 0; d < 3; d++) {
                const cloudGeo = new THREE.BufferGeometry();
                const cloudCount = 15000;
                const pos = new Float32Array(cloudCount * 3);
                const colors = new Float32Array(cloudCount * 3);

                const cloudInner = innerBase * (1 + d * 0.8);
                const cloudOuter = cloudInner * 1.5;

                for (let i = 0; i < cloudCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = cloudInner + Math.random() * (cloudOuter - cloudInner);
                    
                    pos[i*3] = Math.cos(angle) * radius;
                    pos[i*3+1] = (Math.random() - 0.5) * (radius * 0.25);
                    pos[i*3+2] = Math.sin(angle) * radius;

                    colors[i*3] = 0.7 + Math.random() * 0.3;
                    colors[i*3+1] = 0.3 + Math.random() * 0.3;
                    colors[i*3+2] = 0.1 + Math.random() * 0.2;
                }

                cloudGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                cloudGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                const cloudMat = new THREE.PointsMaterial({
                    size: 0.8,
                    map: this.createGlowTexture("rgba(200,100,50,1)"),
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.4,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const cloudMesh = new THREE.Points(cloudGeo, cloudMat);
                cloudMesh.rotation.x = Math.PI / 3.5;
                
                dustClouds.push({
                    mesh: cloudMesh,
                    speed: 0.3 + Math.random() * 0.4
                });
                
                group.add(cloudMesh);
            }
        }

        // 4. ДЖЕТЫ ДЛЯ КВАЗАРОВ И МОЩНЫЕ ЛУЧИ ЭНЕРГИИ ДЛЯ ПУЛЬСАРОВ
        let jets = [];
        if ((config.type === "quasar" && config.hasJets) || (config.type === "pulsar")) {
            const jetTex = this.createGlowTexture(isPulsar ? config.beamColor : config.jetColor);
            
            if (config.type === "quasar" && config.hasJets) {
                // Джеты квазаров — спиралевидные потоки плазмы
                const createJetHalf = (direction) => {
                    const jetGeo = new THREE.BufferGeometry();
                    const jetCount = config.jetIntensity ? config.diskParticles * 0.8 : 20000;
                    const pos = new Float32Array(jetCount * 3);
                    const colors = new Float32Array(jetCount * 3);

                    for (let i = 0; i < jetCount; i++) {
                        const progress = Math.random();
                        const zCoord = progress * config.jetLength * direction;
                        
                        // Спиралевидная форма джета
                        const spreadBase = Math.pow(progress, 0.7) * 2.5;
                        const spiral = Math.sin(progress * 20) * 0.5;
                        const angle = Math.random() * Math.PI * 2 + spiral;
                        
                        pos[i*3] = Math.cos(angle) * spreadBase;
                        pos[i*3+1] = Math.sin(angle) * spreadBase;
                        pos[i*3+2] = zCoord;

                        // Цвет от голубого к жёлтому
                        colors[i*3] = 0.2 + progress * 0.8;
                        colors[i*3+1] = 0.4 + progress * 0.6;
                        colors[i*3+2] = 1 - progress * 0.7;
                    }

                    jetGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                    jetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                    const jetMat = new THREE.PointsMaterial({
                        size: 0.5,
                        map: jetTex,
                        vertexColors: true,
                        transparent: true,
                        opacity: 0.7,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });

                    return new THREE.Points(jetGeo, jetMat);
                };

                const topJet = createJetHalf(1);
                const bottomJet = createJetHalf(-1);
                group.add(topJet, bottomJet);
                jets.push({ top: topJet, bottom: bottomJet, type: "quasar" });

            } else if (config.type === "pulsar") {
                // Лучи пульсара — точные конусы излучения
                const createBeam = (direction) => {
                    const beamGeo = new THREE.BufferGeometry();
                    const beamCount = 15000;
                    const pos = new Float32Array(beamCount * 3);
                    const colors = new Float32Array(beamCount * 3);

                    for (let i = 0; i < beamCount; i++) {
                        const progress = Math.random();
                        const zCoord = progress * 35 * direction;
                        
                        // Конусообразная форма
                        const spreadBase = Math.pow(progress, 0.6) * 1.8;
                        const angle = Math.random() * Math.PI * 2;
                        
                        pos[i*3] = Math.cos(angle) * spreadBase;
                        pos[i*3+1] = Math.sin(angle) * spreadBase;
                        pos[i*3+2] = zCoord;

                        colors[i*3] = 0.6 + progress * 0.4;
                        colors[i*3+1] = progress * 1.0;
                        colors[i*3+2] = 1 - progress * 0.5;
                    }

                    beamGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                    beamGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                    const beamMat = new THREE.PointsMaterial({
                        size: 0.4,
                        map: jetTex,
                        vertexColors: true,
                        transparent: true,
                        opacity: 0.8,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });

                    return new THREE.Points(beamGeo, beamMat);
                };

                const topBeam = createBeam(1);
                const bottomBeam = createBeam(-1);
                group.add(topBeam, bottomBeam);
                jets.push({ top: topBeam, bottom: bottomBeam, type: "pulsar" });
                group.rotation.z = Math.PI / 5;
            }
        }

        // 5. ТУМАННОСТЬ ВОКРУГ ПУЛЬСАРА
        let nebula = null;
        if (isPulsar && config.nebula) {
            const nebulaGeo = new THREE.SphereGeometry(25, 32, 32);
            const nebulaMat = new THREE.MeshBasicMaterial({
                color: config.nebulaColor ? parseInt(config.nebulaColor.replace('rgba(', '').split(',')[0]) : 0x00cc99,
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide,
                wireframe: false
            });
            nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
            group.add(nebula);
        }

        // 6. КОРОНА И ЭФФЕКТЫ ДЛЯ МАССИВНЫХ ЧЕРНЫХ ДЫР
        let corona = null;
        if (config.coronaRing) {
            const coronaGeo = new THREE.TorusGeometry(config.coreRadius * 4, config.coreRadius * 0.5, 16, 100);
            const coronaMat = new THREE.MeshBasicMaterial({
                color: 0x0099ff,
                transparent: true,
                opacity: 0.6,
                emissive: 0x0099ff,
                emissiveIntensity: 1.0
            });
            corona = new THREE.Mesh(coronaGeo, coronaMat);
            corona.rotation.x = Math.PI / 4;
            group.add(corona);
        }

        // 7. ЛОГИКА ОБНОВЛЕНИЯ КАДРА
        group.userData.update = function(time, speedMultiplier) {
            const step = config.diskSpeed * speedMultiplier;
            
            // Вращение диска с физикой Кеплера
            if (diskRings.length > 0) {
                diskRings.forEach((ring, idx) => {
                    ring.mesh.rotation.z -= step * ring.speed * 0.015;
                    
                    // Волны плотности в диске
                    const waveIntensity = 0.6 + Math.sin(time * 1.5 + ring.r) * 0.25;
                    ring.mesh.material.opacity = waveIntensity;
                    
                    // Пульсирующее свечение в зависимости от температуры
                    ring.mesh.material.opacity *= (0.8 + Math.sin(time * 3 + ring.r * 0.5) * 0.2);
                });
            }

            // Облака пыли вращаются медленнее
            if (dustClouds.length > 0) {
                dustClouds.forEach((cloud, idx) => {
                    cloud.mesh.rotation.z -= step * cloud.speed * 0.01;
                    cloud.mesh.material.opacity = 0.3 + Math.sin(time * 2 + idx) * 0.15;
                });
            }

            // Поведение пульсара
            if (isPulsar) {
                group.rotation.y += step * 0.15; // Быстрое вращение
                
                // Вспышки излучения
                const pulseIntensity = Math.max(0, Math.sin(time * config.pulseFreq * Math.PI * 2));
                coreGlow.material.opacity = 0.4 + pulseIntensity * 0.6;
                coreGlow.scale.set(
                    config.coreRadius * 5 * (1 + pulseIntensity * 0.4),
                    config.coreRadius * 5 * (1 + pulseIntensity * 0.4),
                    1
                );

                if (nebula) {
                    nebula.material.opacity = 0.1 + pulseIntensity * 0.15;
                }
            }

            // Движение джетов и лучей
            if (jets.length > 0) {
                jets.forEach((jetPair, idx) => {
                    if (config.type === "quasar") {
                        // Спиралевидное движение плазмы в джетах
                        jetPair.top.rotation.y += 0.04 * speedMultiplier;
                        jetPair.bottom.rotation.y -= 0.04 * speedMultiplier;
                        
                        // Пульсация мощности
                        const jetPulse = 0.8 + Math.sin(time * 8) * 0.2;
                        jetPair.top.scale.set(jetPulse, jetPulse, 1);
                        jetPair.bottom.scale.set(jetPulse, jetPulse, 1);
                        
                        // Волны в джетах
                        jetPair.top.material.opacity = 0.5 + Math.sin(time * 5) * 0.3;
                        jetPair.bottom.material.opacity = 0.5 + Math.sin(time * 5) * 0.3;
                    } else if (config.type === "pulsar") {
                        // Вращение лучей вместе с пульсаром
                        jetPair.top.rotation.z += step * 0.15;
                        jetPair.bottom.rotation.z += step * 0.15;
                    }
                });
            }

            // Вращение коронки
            if (corona) {
                corona.rotation.x += 0.003 * speedMultiplier;
                corona.rotation.z += 0.002 * speedMultiplier;
                corona.material.opacity = 0.5 + Math.sin(time * 3) * 0.1;
            }

            // Пульсирующее свечение ядра
            const corePulse = 0.7 + Math.sin(time * 2) * 0.3;
            coreGlow.material.opacity = corePulse;
        };

        return group;
    }
};