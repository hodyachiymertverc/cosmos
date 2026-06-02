window.CosmoRegistry = {
    // Генератор текстуры (ИСПРАВЛЕНА ПРОБЛЕМА С КВАДРАТОМ)
    createGlowTexture: function(colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, colorHex);
        gradient.addColorStop(0.5, colorHex.replace('1)', '0.3)'));
        // Важно: прозрачный цвет должен сохранять оттенок, иначе будет черное кольцо (квадрат)
        gradient.addColorStop(1, colorHex.replace('1)', '0)')); 
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(canvas);
    },

    // Расширенная база знаний и физические параметры
    data: {
        gargantua: {
            name: "Гаргантюа",
            desc: "Сверхмассивная чёрная дыра. В центре находится «горизонт событий» — абсолютная тьма, область с настолько мощной гравитацией, что её не может покинуть даже свет.\n\nВокруг горизонта вращается раскалённый аккреционный диск из газа и пыли, падающих в бездну. Благодаря законам Кеплера, внутренние слои диска вращаются с околосветовой скоростью, а внешние — значительно медленнее. Из-за колоссального трения материя разогревается до миллионов градусов, испуская ослепительное свечение.",
            type: "blackhole",
            color: "rgba(255,150,50,1)",
            coreRadius: 3.5,
            diskParticles: 60000,
            diskSpeed: 0.6
        },
        sagittarius: {
            name: "Стрелец А*",
            desc: "Колоссальный объект в самом сердце нашей галактики Млечный Путь. От нас его скрывают плотные облака межзвёздной пыли.\n\nМатерия здесь падает в дыру не равномерно, а турбулентными вспышками. Когда гигантские облака газа приближаются к горизонту событий, они разрываются приливными силами, создавая невероятные световые завихрения красных и жёлтых оттенков.",
            type: "blackhole",
            color: "rgba(255,50,20,1)",
            coreRadius: 2.2,
            diskParticles: 45000,
            diskSpeed: 1.0
        },
        ton618: {
            name: "TON 618",
            desc: "Один из самых массивных квазаров во Вселенной. Это чёрная дыра-ультрамастодонт, масса которой равна 66 миллиардам масс Солнца.\n\nОна поглощает материю в таких чудовищных масштабах, что часть её не успевает упасть за горизонт событий и выбрасывается магнитными полями от полюсов со скоростью, близкой к скорости света. Эти выбросы называются «джетами». TON 618 светит ослепительным ультрамариновым светом, затмевая целые галактики.",
            type: "quasar",
            color: "rgba(0,180,255,1)",
            jetColor: "rgba(0,100,255,1)",
            coreRadius: 4.5,
            diskParticles: 80000,
            diskSpeed: 1.5
        },
        "3c273": {
            name: "3C 273",
            desc: "Первый в истории человечества обнаруженный квазар. Находится в созвездии Девы.\n\nЕго аккреционный диск состоит из сверхгорячей плазмы фиолетово-белого цвета. Мощнейшие джеты пронзают космическое пространство на миллионы световых лет. Энергия, излучаемая этим объектом, настолько велика, что свет буквально пульсирует от нестабильности магнитных полей.",
            type: "quasar",
            color: "rgba(210,180,255,1)",
            jetColor: "rgba(150,30,255,1)",
            coreRadius: 3.0,
            diskParticles: 60000,
            diskSpeed: 2.0
        },
        crab: {
            name: "Пульсар в Крабе",
            desc: "Сверхплотный остаток звезды, взорвавшейся как сверхновая. Это нейтронная звезда размером всего с небольшой город, но весящая больше Солнца.\n\nОна вращается с сумасшедшей скоростью — 30 оборотов в секунду! При каждом обороте она пронзает пространство узконаправленными лучами радиации (как космический маяк). Мы видим это как строго ритмичные вспышки жёсткого излучения.",
            type: "pulsar",
            color: "rgba(255,255,255,1)",
            beamColor: "rgba(160,32,240,1)",
            coreRadius: 1.2,
            diskSpeed: 8.0
        },
        vela: {
            name: "Пульсар в Парусах",
            desc: "Молодой и агрессивный пульсар. Его магнитное поле в триллионы раз сильнее магнитного поля Земли.\n\nМагнитные оси не совпадают с осями вращения, из-за чего конусы излучения выписывают в пространстве сложные изумрудные спирали, разгоняя окружающие частицы до колоссальных энергий.",
            type: "pulsar",
            color: "rgba(180,255,220,1)",
            beamColor: "rgba(0,255,150,1)",
            coreRadius: 1.0,
            diskSpeed: 6.5
        }
    },

    build: function(id) {
        const config = this.data[id];
        const group = new THREE.Group();
        const texture = this.createGlowTexture(config.color);
        const isPulsar = config.type === "pulsar";

        // 1. ГОРИЗОНТ СОБЫТИЙ / ЯДРО
        const coreGeo = new THREE.SphereGeometry(config.coreRadius, 64, 64);
        const coreMat = isPulsar 
            ? new THREE.MeshBasicMaterial({ color: 0xffffff }) 
            : new THREE.MeshBasicMaterial({ color: 0x000000 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // 2. МЯГКОЕ СВЕЧЕНИЕ (ГЛОУ) ВОКРУГ ЯДРА - Баг устранен (depthWrite: false)
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 128; glowCanvas.height = 128;
        const gCtx = glowCanvas.getContext('2d');
        const grad = gCtx.createRadialGradient(64,64,0, 64,64,64);
        grad.addColorStop(0, config.color);
        grad.addColorStop(1, config.color.replace('1)', '0)')); 
        gCtx.fillStyle = grad; gCtx.fillRect(0,0,128,128);
        
        const spriteMat = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(glowCanvas),
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7,
            depthWrite: false // ИМЕННО ЭТО УБИРАЕТ ЧЕРНЫЙ КВАДРАТ
        });
        const coreGlow = new THREE.Sprite(spriteMat);
        coreGlow.scale.set(config.coreRadius * 4, config.coreRadius * 4, 1);
        group.add(coreGlow);

        // 3. АККРЕЦИОННЫЙ ДИСК (КЕПЛЕРОВСКАЯ ФИЗИКА ВРАЩЕНИЯ)
        let diskRings = []; // Массив для колец разной скорости
        if (!isPulsar) {
            const ringsCount = 8; // Разбиваем диск на 8 слоев для реалистичного движения
            const particlesPerRing = Math.floor(config.diskParticles / ringsCount);
            const innerBase = config.coreRadius * 1.4;
            const outerBase = innerBase * 5.0;
            const ringWidth = (outerBase - innerBase) / ringsCount;
            const baseColor = new THREE.Color(config.color.replace('1)', ''));

            for (let r = 0; r < ringsCount; r++) {
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(particlesPerRing * 3);
                const colors = new Float32Array(particlesPerRing * 3);
                
                const ringInner = innerBase + (r * ringWidth);
                const ringOuter = ringInner + ringWidth;

                for(let i = 0; i < particlesPerRing; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    // Равномерное распределение внутри кольца
                    const radius = ringInner + Math.random() * (ringOuter - ringInner);
                    
                    pos[i*3] = Math.cos(angle) * radius;
                    // Толщина диска: к центру тоньше, по краям толще
                    pos[i*3+1] = (Math.random() - 0.5) * (radius * 0.15);
                    pos[i*3+2] = Math.sin(angle) * radius;

                    // Чем ближе к дыре, тем цвет горячее (белее)
                    const tempRatio = (radius - innerBase) / (outerBase - innerBase);
                    const mixedColor = baseColor.clone().lerp(new THREE.Color(0xffffff), 1 - (tempRatio * 1.5));
                    colors[i*3] = mixedColor.r;
                    colors[i*3+1] = mixedColor.g;
                    colors[i*3+2] = mixedColor.b;
                }

                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                const mat = new THREE.PointsMaterial({
                    size: 0.35,
                    map: texture,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const ringMesh = new THREE.Points(geo, mat);
                // Скорость по Кеплеру: V ~ 1/sqrt(R)
                const relativeSpeed = 1 / Math.sqrt(ringInner * 0.2); 
                
                diskRings.push({ mesh: ringMesh, speed: relativeSpeed });
                group.add(ringMesh);
            }
            
            // Наклон всего диска (чтобы все кольца смотрели под одним углом)
            diskRings.forEach(r => r.mesh.rotation.x = Math.PI / 3.5);
        }

        // 4. ДЖЕТЫ И ЛУЧИ ЭНЕРГИИ
        let jets = [];
        if (config.type === "quasar" || config.type === "pulsar") {
            const jetColor = config.jetColor || config.beamColor;
            const jetTex = this.createGlowTexture(jetColor);
            const jetCount = config.type === "quasar" ? 10000 : 5000;
            
            const createJetHalf = (direction) => {
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(jetCount * 3);
                const length = config.type === "quasar" ? 60 : 35;

                for(let i=0; i<jetCount; i++) {
                    const zCoord = Math.random() * length * direction;
                    // Форма песочных часов для джетов
                    const spread = Math.pow(Math.abs(zCoord), 0.8) * (config.type === "quasar" ? 0.1 : 0.2);
                    const angle = Math.random() * Math.PI * 2;
                    
                    pos[i*3] = Math.cos(angle) * spread;
                    pos[i*3+1] = zCoord;
                    pos[i*3+2] = Math.sin(angle) * spread;
                }
                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                const mat = new THREE.PointsMaterial({
                    size: 0.4,
                    map: jetTex,
                    transparent: true,
                    opacity: 0.5,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                return new THREE.Points(geo, mat);
            };

            const topJet = createJetHalf(1);
            const bottomJet = createJetHalf(-1);
            group.add(topJet, bottomJet);
            jets.push(topJet, bottomJet);
            
            if(isPulsar) {
                group.rotation.z = Math.PI / 5; // Наклон пульсара
            }
        }

        // 5. ЛОГИКА ДВИЖЕНИЯ В КАДРЕ
        group.userData.update = function(time, speedMultiplier) {
            const step = config.diskSpeed * speedMultiplier;
            
            // Заставляем кольца диска вращаться с РАЗНОЙ скоростью (Эффект Кеплера)
            if (diskRings.length > 0) {
                diskRings.forEach(ring => {
                    // Внутренние кольца обгоняют внешние
                    ring.mesh.rotation.z -= step * ring.speed * 0.015;
                    
                    // Имитация волн плотности (легкое пульсирование прозрачности)
                    ring.mesh.material.opacity = 0.6 + Math.sin(time * 2 + ring.speed) * 0.2;
                });
            }
            
            if (isPulsar) {
                // Пульсар бешено вращается как единое целое
                group.rotation.y += step * 0.2;
                // Вспышки ядра (эффект маяка)
                const pulse = 1 + Math.max(0, Math.sin(time * 15)) * 0.5;
                coreGlow.scale.set(config.coreRadius * 4 * pulse, config.coreRadius * 4 * pulse, 1);
            }

            if (jets.length > 0) {
                jets.forEach((j, idx) => {
                    // Плазма в джетах закручивается по спирали
                    j.rotation.y += (idx === 0 ? 1 : -1) * 0.03 * speedMultiplier;
                    // Пульсация мощности выброса
                    j.scale.x = 1 + Math.sin(time * 10 + idx) * 0.08;
                    j.scale.z = 1 + Math.sin(time * 10 + idx) * 0.08;
                });
            }
        };

        return group;
    }
};