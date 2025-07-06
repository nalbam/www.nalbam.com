class RealisticSpaceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RealisticSpaceScene' });
        this.stars = [];
        this.meteors = [];
        this.nebulaClouds = [];
        this.twinkleGraphics = null;
        this.milkyWayGraphics = null;
        this.backgroundGraphics = null;
        this.lastMeteorTime = 0;
        this.atmosphericDistortion = 0;
        this.blackHoles = [];
        this.lastRandomBlackHoleTime = 0;
        this.randomBlackHoleInterval = 45000 + Math.random() * 30000; // 45-75 seconds
        this.ufos = [];
        this.lastUfoTime = 0;
        this.ufoInterval = 3000; // 3 seconds for testing
        this.asteroids = [];
        this.lastAsteroidTime = 0;
    }

    preload() {
        this.load.image('ufo', 'static/images/ufo.png');
        this.load.image('asteroid1', 'static/images/asteroid1.png');
        this.load.image('asteroid2', 'static/images/asteroid2.png');
        this.load.image('asteroid3', 'static/images/asteroid3.png');
    }

    create() {
        const { width, height } = this.scale;

        this.createDeepSpaceBackground(width, height);
        this.createDistantStars(width, height);
        this.createNebulae(width, height);
        this.createForegroundStars(width, height);

        // Begin real-time atmospheric distortion
        this.startAtmosphericEffects();

        this.input.on('pointerup', (pointer) => {
            this.createAsteroidAtPosition(pointer.x, pointer.y);
        });

        this.input.setDefaultCursor('pointer');
        this.input.topOnly = false;

        this.scale.on('resize', this.handleResize, this);
    }

    createDeepSpaceBackground(width, height) {
        this.backgroundGraphics = this.add.graphics();

        // Multi-layered cosmic background gradient
        const gradientSteps = 50;
        const colors = [
            { r: 8, g: 8, b: 16 },    // Deep space blue
            { r: 12, g: 12, b: 24 },  // Slightly lighter
            { r: 16, g: 16, b: 32 },  // Mid space
            { r: 8, g: 8, b: 20 },    // Back to darker
            { r: 4, g: 4, b: 12 }     // Deepest space
        ];

        for (let i = 0; i < gradientSteps; i++) {
            const progress = i / gradientSteps;
            const colorIndex = Math.floor(progress * (colors.length - 1));
            const localProgress = (progress * (colors.length - 1)) - colorIndex;

            const color1 = colors[colorIndex];
            const color2 = colors[Math.min(colorIndex + 1, colors.length - 1)];

            const r = Math.floor(color1.r + (color2.r - color1.r) * localProgress);
            const g = Math.floor(color1.g + (color2.g - color1.g) * localProgress);
            const b = Math.floor(color1.b + (color2.b - color1.b) * localProgress);

            const color = (r << 16) + (g << 8) + b;
            this.backgroundGraphics.fillStyle(color, 1);
            this.backgroundGraphics.fillRect(0, i * height / gradientSteps, width, height / gradientSteps + 1);
        }

        // Color depth variations for realism
        this.addColorVariations(width, height);
    }

    addColorVariations(width, height) {
        const variations = [
            { color: 0x1a1a2e, alpha: 0.3, count: 12 },
            { color: 0x2e1a2e, alpha: 0.2, count: 8 },
            { color: 0x1a2e2e, alpha: 0.15, count: 6 },
            { color: 0x2e2e1a, alpha: 0.1, count: 4 }
        ];

        variations.forEach(variation => {
            for (let i = 0; i < variation.count; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const radius = 80 + Math.random() * 200;

                this.backgroundGraphics.fillStyle(variation.color, variation.alpha);
                this.backgroundGraphics.fillCircle(x, y, radius);
            }
        });
    }

    createDistantStars(width, height) {
        const distantStars = this.add.graphics();

        for (let i = 0; i < 800; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 0.3 + Math.random() * 0.7;
            const brightness = 0.3 + Math.random() * 0.4;

            // Slightly different colors for realism
            const colorVariation = Math.random();
            let color;
            if (colorVariation < 0.7) {
                color = 0xffffff; // White
            } else if (colorVariation < 0.85) {
                color = 0xfff8e1; // Warm white
            } else if (colorVariation < 0.95) {
                color = 0xe1f5ff; // Cool white
            } else {
                color = 0xffeaa7; // Slightly yellow
            }

            distantStars.fillStyle(color, brightness);
            distantStars.fillCircle(x, y, size);
        }
    }

    createMilkyWay(width, height) {
        this.milkyWayGraphics = this.add.graphics();

        // Create Milky Way band across the sky
        const bandHeight = height * 0.4;
        const bandY = height * 0.3;

        const cloudDensity = 200;
        for (let i = 0; i < cloudDensity; i++) {
            const x = (i / cloudDensity) * width * 1.5 - width * 0.25;
            const y = bandY + Math.sin(i * 0.1) * bandHeight * 0.2;

            const cloudSize = 40 + Math.random() * 120;
            const alpha = 0.08 + Math.random() * 0.12;

            // Vary the galactic colors
            const colors = [0xffffff, 0xfff8e1, 0xe8e8ff, 0xf0f0ff];
            const color = colors[Math.floor(Math.random() * colors.length)];

            this.milkyWayGraphics.fillStyle(color, alpha);
            this.milkyWayGraphics.fillCircle(x, y, cloudSize);
        }

        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = bandY + (Math.random() - 0.5) * bandHeight;
            const size = 20 + Math.random() * 60;

            this.milkyWayGraphics.fillStyle(0x000000, 0.3);
            this.milkyWayGraphics.fillCircle(x, y, size);
        }

        const centerX = width * 0.7;
        const centerY = bandY;
        this.milkyWayGraphics.fillStyle(0xffeaa7, 0.4);
        this.milkyWayGraphics.fillCircle(centerX, centerY, 80);
        this.milkyWayGraphics.fillStyle(0xffffff, 0.2);
        this.milkyWayGraphics.fillCircle(centerX, centerY, 50);
    }

    createNebulae(width, height) {
        const nebulaeData = [
            { x: width * 0.2, y: height * 0.3, color: 0xff6b6b, alpha: 0.15, size: 150, driftX: 0.1, driftY: 0.05 }, // Red nebula
            { x: width * 0.8, y: height * 0.6, color: 0x4ecdc4, alpha: 0.12, size: 120, driftX: -0.08, driftY: 0.12 }, // Cyan nebula
            { x: width * 0.5, y: height * 0.5, color: 0x45b7d1, alpha: 0.1, size: 100, driftX: 0.06, driftY: -0.04 },  // Blue nebula
            { x: width * 0.1, y: height * 0.8, color: 0x9b59b6, alpha: 0.08, size: 80, driftX: -0.04, driftY: 0.08 },  // Purple nebula
            { x: width * 0.9, y: height * 0.2, color: 0xf39c12, alpha: 0.06, size: 90, driftX: 0.03, driftY: 0.06 }   // Orange nebula
        ];

        nebulaeData.forEach((nebula, index) => {
            const nebulaGraphics = this.add.graphics();

            const nebulaObj = {
                graphics: nebulaGraphics,
                baseX: nebula.x,
                baseY: nebula.y,
                currentX: nebula.x,
                currentY: nebula.y,
                color: nebula.color,
                alpha: nebula.alpha,
                size: nebula.size,
                driftX: nebula.driftX,
                driftY: nebula.driftY,
                time: 0,
                phaseOffset: index * 0.7,
                rotationSpeed: 0.001 + Math.random() * 0.003, // Even slower rotation speed between 0.001 and 0.004
                rotationDirection: Math.random() < 0.5 ? 1 : -1, // Random direction (clockwise or counterclockwise)
                currentRotation: 0,
                layers: []
            };

            const coreLayer = [{
                angle: 0,
                distance: 0,
                size: nebula.size * 0.3, // Core size
                alpha: nebula.alpha * 2.5, // More opaque core
                individualSpeed: 0.1,
                driftPhase: 0,
                sizeVariation: 1.0,
                flowPhaseX: 0,
                flowPhaseY: 0,
                flowAmplitudeX: 2,
                flowAmplitudeY: 2,
                turbulenceScale: 0.005,
                spiralRadius: 5,
                spiralSpeed: 0.0005,
                isCore: true
            }];
            nebulaObj.layers.push(coreLayer);

            // Layers 1-4: Surrounding cloud layers (more transparent)
            for (let layer = 1; layer < 5; layer++) {
                const layerSize = nebula.size * (1.2 - layer * 0.2);
                const layerAlpha = nebula.alpha * (0.6 - layer * 0.1); // More transparent
                const layerData = [];

                // Fewer, larger cloud puffs for more realistic look
                const cloudCount = Math.max(3, 8 - layer); // Fewer clouds in outer layers
                for (let i = 0; i < cloudCount; i++) {
                    const angle = (i / cloudCount) * Math.PI * 2 + Math.random() * 0.5;
                    const distance = (layer * 0.3 + Math.random() * 0.4) * layerSize;
                    const size = layerSize * (0.4 + Math.random() * 0.6); // Larger cloud puffs

                    layerData.push({
                        angle: angle,
                        distance: distance,
                        size: size,
                        alpha: layerAlpha,
                        individualSpeed: 0.3 + Math.random() * 0.7,
                        driftPhase: Math.random() * Math.PI * 2,
                        sizeVariation: 0.8 + Math.random() * 0.4,
                        flowPhaseX: Math.random() * Math.PI * 2,
                        flowPhaseY: Math.random() * Math.PI * 2,
                        flowAmplitudeX: 8 + Math.random() * 20, // Increased flow
                        flowAmplitudeY: 5 + Math.random() * 15,
                        turbulenceScale: 0.008 + Math.random() * 0.015,
                        spiralRadius: Math.random() * 30 + 15,
                        spiralSpeed: (Math.random() - 0.5) * 0.001,
                        isCore: false
                    });
                }

                nebulaObj.layers.push(layerData);
            }

            this.nebulaClouds.push(nebulaObj);
        });
    }

    createForegroundStars(width, height) {
        this.twinkleGraphics = this.add.graphics();

        const starTypes = [
            { count: 150, size: 1, brightness: 0.8, twinkle: 0.7 },
            { count: 80, size: 1.5, brightness: 0.9, twinkle: 0.8 },
            { count: 40, size: 2, brightness: 1.0, twinkle: 0.9 },
            { count: 20, size: 2.5, brightness: 1.0, twinkle: 1.0 },
            { count: 10, size: 3, brightness: 1.0, twinkle: 1.0 }
        ];

        starTypes.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;

                // Star color based on temperature
                const temp = Math.random();
                let color;
                if (temp < 0.1) {
                    color = 0xff6b6b; // Red giant
                } else if (temp < 0.3) {
                    color = 0xffeaa7; // Yellow
                } else if (temp < 0.7) {
                    color = 0xffffff; // White
                } else if (temp < 0.9) {
                    color = 0xe8f4ff; // Blue-white
                } else {
                    color = 0xb8e6ff; // Blue
                }

                this.stars.push({
                    x: x,
                    y: y,
                    size: type.size,
                    color: color,
                    brightness: type.brightness,
                    twinkleIntensity: type.twinkle,
                    twinkleSpeed: 0.5 + Math.random() * 1.5,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }
        });
    }

    startAtmosphericEffects() {
        // Subtle atmospheric distortion
        this.tweens.add({
            targets: { value: 0 },
            value: Math.PI * 2,
            duration: 10000,
            repeat: -1,
            onUpdate: (tween) => {
                this.atmosphericDistortion = tween.targets[0].value;
                this.updateStarTwinkle();
                this.updateNebulae();
            }
        });
    }

    updateStarTwinkle() {
        if (!this.twinkleGraphics) return;

        this.twinkleGraphics.clear();
        const time = this.time.now * 0.001;

        this.stars.forEach(star => {
            const distortion = Math.sin(this.atmosphericDistortion + star.twinklePhase) * 0.1;
            const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
            const finalBrightness = star.brightness * twinkle * star.twinkleIntensity;
            const finalSize = star.size * (1 + distortion);

            // Draw star (use visual position if distorted by black hole)
            const drawX = star.visualX !== undefined ? star.visualX : star.x;
            const drawY = star.visualY !== undefined ? star.visualY : star.y;

            this.twinkleGraphics.fillStyle(star.color, finalBrightness);
            this.twinkleGraphics.fillCircle(drawX, drawY, finalSize);

            // Add diffraction spikes for brighter stars
            if (star.size > 1.5) {
                const spikeLength = star.size * 3;
                const spikeAlpha = finalBrightness * 0.6;
                this.twinkleGraphics.lineStyle(0.5, star.color, spikeAlpha);

                // Vertical spike
                this.twinkleGraphics.lineBetween(
                    drawX, drawY - spikeLength,
                    drawX, drawY + spikeLength
                );

                // Horizontal spike
                this.twinkleGraphics.lineBetween(
                    drawX - spikeLength, drawY,
                    drawX + spikeLength, drawY
                );
            }
        });
    }

    updateNebulae() {
        const time = this.time.now * 0.001;

        this.nebulaClouds.forEach(nebula => {
            // Update nebula time
            nebula.time += 0.016;

            const driftPhase = nebula.time * 0.3 + nebula.phaseOffset;
            const driftX = Math.sin(driftPhase) * nebula.driftX;
            const driftY = Math.cos(driftPhase * 0.7) * nebula.driftY;

            // Update position
            nebula.currentX = nebula.baseX + driftX * 100;
            nebula.currentY = nebula.baseY + driftY * 100;

            // Update rotation
            nebula.currentRotation += nebula.rotationSpeed * nebula.rotationDirection;

            // Redraw nebula
            nebula.graphics.clear();

            // Draw each layer with nebula-like flowing movement
            nebula.layers.forEach((layerData, layerIndex) => {
                const layerDrift = nebula.time * 0.003 + layerIndex * 0.008; // Very slow layer drift
                const layerRotation = nebula.currentRotation + layerIndex * 0.003; // Gentle rotation per layer

                layerData.forEach(cloudlet => {
                    // Nebula-like flowing movement
                    const individualTime = nebula.time * cloudlet.individualSpeed;

                    let x, y, size, finalAlpha;

                    if (cloudlet.isCore) {
                        // Core stays centered with minimal movement
                        x = nebula.currentX + Math.sin(individualTime * 0.001) * cloudlet.flowAmplitudeX;
                        y = nebula.currentY + Math.cos(individualTime * 0.001) * cloudlet.flowAmplitudeY;

                        // Steady size with subtle pulsing
                        const corePulse = Math.sin(individualTime * 0.002) * 2;
                        size = cloudlet.size + corePulse;

                        // More stable alpha for core
                        const coreAlphaFlow = 0.95 + Math.sin(individualTime * 0.001) * 0.05;
                        finalAlpha = cloudlet.alpha * coreAlphaFlow;
                    } else {
                        // Surrounding clouds with more movement
                        // Create flowing turbulence like real nebulae
                        const turbulenceX = Math.sin(individualTime * cloudlet.turbulenceScale + cloudlet.flowPhaseX) * cloudlet.flowAmplitudeX;
                        const turbulenceY = Math.cos(individualTime * cloudlet.turbulenceScale * 0.7 + cloudlet.flowPhaseY) * cloudlet.flowAmplitudeY;

                        // Add secondary turbulence for more complex flow
                        const turbulence2X = Math.sin(individualTime * cloudlet.turbulenceScale * 2.3 + cloudlet.flowPhaseX + 1) * cloudlet.flowAmplitudeX * 0.3;
                        const turbulence2Y = Math.cos(individualTime * cloudlet.turbulenceScale * 1.7 + cloudlet.flowPhaseY + 2) * cloudlet.flowAmplitudeY * 0.3;

                        // Gentle spiral motion
                        const spiralAngle = individualTime * cloudlet.spiralSpeed + cloudlet.angle;
                        const spiralX = Math.cos(spiralAngle) * cloudlet.spiralRadius * Math.sin(individualTime * 0.001);
                        const spiralY = Math.sin(spiralAngle) * cloudlet.spiralRadius * 0.6 * Math.cos(individualTime * 0.0008);

                        // Base position with gentle rotation
                        const angle = cloudlet.angle + layerDrift + layerRotation;
                        const distance = cloudlet.distance + Math.sin(individualTime * 0.002 + cloudlet.driftPhase) * 8;
                        const baseX = Math.cos(angle) * distance;
                        const baseY = Math.sin(angle) * distance;

                        // Combine all movements for nebula-like flow
                        x = nebula.currentX + baseX + turbulenceX + turbulence2X + spiralX;
                        y = nebula.currentY + baseY + turbulenceY + turbulence2Y + spiralY;

                        // Gentle size pulsing like gas clouds
                        const sizePulse1 = Math.sin(individualTime * 0.004 + cloudlet.driftPhase) * 4;
                        const sizePulse2 = Math.cos(individualTime * 0.007 + cloudlet.driftPhase + 1) * 3;
                        size = cloudlet.size * cloudlet.sizeVariation + sizePulse1 + sizePulse2;

                        // More transparent and variable alpha for clouds
                        const alphaFlow = 0.7 + Math.sin(individualTime * 0.003 + cloudlet.driftPhase) * 0.3;
                        const alphaFlow2 = 0.8 + Math.cos(individualTime * 0.005 + cloudlet.driftPhase + 1) * 0.2;
                        finalAlpha = cloudlet.alpha * alphaFlow * alphaFlow2;
                    }

                    nebula.graphics.fillStyle(nebula.color, finalAlpha);
                    nebula.graphics.fillCircle(x, y, Math.max(1, size));
                });
            });
        });
    }

    update() {
        const currentTime = this.time.now;

        // Create meteors occasionally - one at a time, every 12 seconds
        if (currentTime - this.lastMeteorTime > 12000 && this.meteors.length === 0) {
            this.createMeteor();
            this.lastMeteorTime = currentTime;
        }

        // Create asteroids occasionally - every 7 seconds
        if (currentTime - this.lastAsteroidTime > 7000) {
            this.createAsteroid();
            this.lastAsteroidTime = currentTime;
        }

        // Randomly spawn black holes every 45-75 seconds
        if (currentTime - this.lastRandomBlackHoleTime > this.randomBlackHoleInterval) {
            this.createRandomBlackHole();
            this.lastRandomBlackHoleTime = currentTime;
            // Set next random interval between 45-75 seconds
            this.randomBlackHoleInterval = 45000 + Math.random() * 30000;
        }

        // UFO investigation triggered by black hole events

        this.updateMeteors();

        // Update asteroids
        this.updateAsteroids();

        // Check for collisions between asteroids and meteors
        this.checkCollisions();

        this.updateBlackHoles();

        // Update UFOs
        this.updateUfos();

        // Apply nebula gravity to meteors and asteroids
        this.applyNebulaGravity();
    }

    createMeteor() {
        const { width, height } = this.scale;
        // Random entry and exit points on opposite sides
        const side = Math.floor(Math.random() * 4);
        let startX, startY, endX, endY;

        switch (side) {
            case 0: // Top to Bottom
                startX = Math.random() * width;
                startY = -50;
                endX = Math.random() * width;
                endY = height + 50;
                break;
            case 1: // Right to Left
                startX = width + 50;
                startY = Math.random() * height;
                endX = -50;
                endY = Math.random() * height;
                break;
            case 2: // Bottom to Top
                startX = Math.random() * width;
                startY = height + 50;
                endX = Math.random() * width;
                endY = -50;
                break;
            case 3: // Left to Right
                startX = -50;
                startY = Math.random() * height;
                endX = width + 50;
                endY = Math.random() * height;
                break;
        }
        const meteorGraphics = this.add.graphics();
        const meteorTrail = this.add.graphics();

        // Create meteor head - smaller size
        meteorGraphics.fillStyle(0xffeaa7, 0.9);
        meteorGraphics.fillCircle(0, 0, 2);
        meteorGraphics.fillStyle(0xffffff, 1);
        meteorGraphics.fillCircle(0, 0, 1);

        // Create meteor trail - will be drawn dynamically
        // meteorTrail will be redrawn each frame based on position history

        meteorGraphics.setPosition(startX, startY);
        meteorTrail.setPosition(0, 0); // Trail uses absolute coordinates

        // Make sure graphics are visible
        meteorGraphics.setVisible(true);
        meteorTrail.setVisible(true);
        const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
        meteorGraphics.setRotation(angle);
        // Don't rotate trail - it will draw its own path

        // Store meteor data for black hole interaction
        const meteor = {
            graphics: meteorGraphics,
            trail: meteorTrail,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            currentX: startX,
            currentY: startY,
            velocityX: 0,
            velocityY: 0,
            isActive: true,
            speed: 220,
            angle: angle,
            targetAngle: angle,
            isBeingPulled: false,
            originalTween: null,
            positionHistory: [],
            maxTrailLength: 15,
            scale: 1.0,
            alpha: 1.0,
            originalSize: 2,
            size: 4 // For collision detection (diameter)
        };

        this.meteors.push(meteor);
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const duration = (distance / meteor.speed) * 1000;

        meteor.velocityX = (endX - startX) / (duration / 1000);
        meteor.velocityY = (endY - startY) / (duration / 1000);

    }

    createAsteroid() {
        const { width, height } = this.scale;

        // Random entry and exit points on opposite sides
        const side = Math.floor(Math.random() * 4);
        let startX, startY, endX, endY;

        switch (side) {
            case 0: // Top to Bottom
                startX = Math.random() * width;
                startY = -50;
                endX = Math.random() * width;
                endY = height + 50;
                break;
            case 1: // Right to Left
                startX = width + 50;
                startY = Math.random() * height;
                endX = -50;
                endY = Math.random() * height;
                break;
            case 2: // Bottom to Top
                startX = Math.random() * width;
                startY = height + 50;
                endX = Math.random() * width;
                endY = -50;
                break;
            case 3: // Left to Right
                startX = -50;
                startY = Math.random() * height;
                endX = width + 50;
                endY = Math.random() * height;
                break;
        }

        // Create asteroid sprite with random image
        const asteroidImages = ['asteroid1', 'asteroid2', 'asteroid3'];
        const randomImage = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
        const asteroidSprite = this.add.image(startX, startY, randomImage);

        // Scale down from 300x300 to approximately 40x40
        asteroidSprite.setScale(0.13);

        const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
        asteroidSprite.setRotation(angle);

        // Store asteroid data for black hole interaction
        const asteroid = {
            sprite: asteroidSprite,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            currentX: startX,
            currentY: startY,
            velocityX: 0,
            velocityY: 0,
            isActive: true,
            speed: 60, // Slower than meteors
            angle: angle,
            rotationSpeed: (Math.random() - 0.5) * 0.02, // Random rotation
            scale: 0.13,
            alpha: 1.0,
            size: 40 // For collision detection
        };

        this.asteroids.push(asteroid);

        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const duration = (distance / asteroid.speed) * 1000;

        asteroid.velocityX = (endX - startX) / (duration / 1000);
        asteroid.velocityY = (endY - startY) / (duration / 1000);
    }

    createAsteroidAtPosition(x, y) {
        // Create asteroid sprite at clicked position with random image
        const asteroidImages = ['asteroid1', 'asteroid2', 'asteroid3'];
        const randomImage = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
        const asteroidSprite = this.add.image(x, y, randomImage);

        // Scale down from 300x300 to approximately 40x40
        asteroidSprite.setScale(0.13);

        // Random initial rotation
        const initialRotation = Math.random() * Math.PI * 2;
        asteroidSprite.setRotation(initialRotation);

        // Store asteroid data
        const asteroid = {
            sprite: asteroidSprite,
            startX: x,
            startY: y,
            endX: x, // Will be set by initial velocity
            endY: y,
            currentX: x,
            currentY: y,
            velocityX: (Math.random() - 0.5) * 100, // Random initial velocity
            velocityY: (Math.random() - 0.5) * 100,
            isActive: true,
            speed: 60,
            angle: initialRotation,
            rotationSpeed: (Math.random() - 0.5) * 0.02, // Random rotation
            scale: 0.13,
            alpha: 1.0,
            size: 40 // For collision detection
        };

        this.asteroids.push(asteroid);
    }

    updateMeteors() {
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            if (!meteor.isActive) continue;

            const deltaTime = this.game.loop.delta / 1000;

            // Update position based on velocity
            meteor.currentX += meteor.velocityX * deltaTime;
            meteor.currentY += meteor.velocityY * deltaTime;

            // Update graphics position
            meteor.graphics.x = meteor.currentX;
            meteor.graphics.y = meteor.currentY;

            // Update angle based on velocity
            meteor.angle = Math.atan2(meteor.velocityY, meteor.velocityX);
            meteor.graphics.setRotation(meteor.angle);

            // Update scale and alpha
            meteor.graphics.setScale(meteor.scale);
            meteor.graphics.setAlpha(meteor.alpha);
            meteor.trail.setAlpha(meteor.alpha);

            // Update trail
            this.updateMeteorTrail(meteor);
            // Check if meteor is off screen
            const { width, height } = this.scale;
            if (meteor.currentX < -100 || meteor.currentX > width + 100 ||
                meteor.currentY < -100 || meteor.currentY > height + 100) {
                this.removeMeteor(meteor);
            }
        }
    }

    updateMeteorTrail(meteor) {
        // Add current position to history
        meteor.positionHistory.unshift({
            x: meteor.currentX,
            y: meteor.currentY
        });

        // Keep only the last N positions
        if (meteor.positionHistory.length > meteor.maxTrailLength) {
            meteor.positionHistory.pop();
        }

        // Redraw trail based on position history
        meteor.trail.clear();

        if (meteor.positionHistory.length > 1) {
            for (let i = 1; i < meteor.positionHistory.length; i++) {
                const pos = meteor.positionHistory[i];
                const progress = i / meteor.positionHistory.length;
                const alpha = Math.max(0, 1 - progress);
                const size = Math.max(0.5, 2 * alpha);

                if (alpha > 0.1) {
                    // Orange glow (background)
                    meteor.trail.fillStyle(0xffeaa7, alpha * 0.7);
                    meteor.trail.fillCircle(pos.x, pos.y, size * 1.5);

                    // Yellow middle
                    meteor.trail.fillStyle(0xffff88, alpha * 0.8);
                    meteor.trail.fillCircle(pos.x, pos.y, size * 1.0);

                    // White core (bright center)
                    meteor.trail.fillStyle(0xffffff, alpha * 0.95);
                    meteor.trail.fillCircle(pos.x, pos.y, size * 0.5);
                }
            }
        }
    }

    updateAsteroids() {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            if (!asteroid.isActive) continue;

            const deltaTime = this.game.loop.delta / 1000;

            // Update position based on velocity
            asteroid.currentX += asteroid.velocityX * deltaTime;
            asteroid.currentY += asteroid.velocityY * deltaTime;

            // Update sprite position
            asteroid.sprite.x = asteroid.currentX;
            asteroid.sprite.y = asteroid.currentY;

            // Update rotation
            asteroid.angle += asteroid.rotationSpeed;
            asteroid.sprite.setRotation(asteroid.angle);

            // Update scale and alpha
            asteroid.sprite.setScale(asteroid.scale);
            asteroid.sprite.setAlpha(asteroid.alpha);

            // Check if asteroid is off screen
            const { width, height } = this.scale;
            if (asteroid.currentX < -100 || asteroid.currentX > width + 100 ||
                asteroid.currentY < -100 || asteroid.currentY > height + 100) {
                this.removeAsteroid(asteroid);
            }
        }
    }

    removeAsteroid(asteroid) {
        // Remove asteroid from tracking array
        const index = this.asteroids.indexOf(asteroid);
        if (index > -1) {
            this.asteroids.splice(index, 1);
        }

        // Destroy sprite immediately
        if (asteroid.sprite && asteroid.sprite.active) {
            asteroid.sprite.destroy();
        }
    }

    removeMeteor(meteor) {
        // Remove meteor from tracking array
        const index = this.meteors.indexOf(meteor);
        if (index > -1) {
            this.meteors.splice(index, 1);
        }

        // Destroy graphics immediately
        if (meteor.graphics && meteor.graphics.active) {
            meteor.graphics.destroy();
        }
        if (meteor.trail && meteor.trail.active) {
            meteor.trail.destroy();
        }
    }
    createBlackHoleObject(x, y, isManual = true) {
        const blackHole = {
            x: x,
            y: y,
            graphics: this.add.graphics(),
            createdAt: this.time.now,
            size: 0,
            maxSize: 80,
            rotation: 0,
            consumedStars: [],
            isManuallyCreated: isManual,
        };

        blackHole.accretionDisk = this.add.graphics();
        return blackHole;
    }

    animateBlackHoleCreation(blackHole) {
        this.tweens.add({
            targets: blackHole,
            size: blackHole.maxSize,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Auto-destroy after 3 seconds
                this.time.delayedCall(3000, () => {
                    this.destroyBlackHole(blackHole);
                });
            }
        });
    }

    createBlackHole(x, y) {
        const blackHole = this.createBlackHoleObject(x, y, true);
        this.blackHoles.push(blackHole);
        this.animateBlackHoleCreation(blackHole);
    }

    updateBlackHoles() {
        this.blackHoles.forEach((blackHole, index) => {
            if (!blackHole.graphics.active) {
                this.blackHoles.splice(index, 1);
                return;
            }

            blackHole.rotation += 0.05;

            blackHole.graphics.clear();
            blackHole.accretionDisk.clear();

            this.drawSimpleAccretionDisk(blackHole);

            // Event horizon (black center)
            blackHole.graphics.fillStyle(0x000000, 1);
            blackHole.graphics.fillCircle(blackHole.x, blackHole.y, blackHole.size * 0.8);

            // Gravitational lensing effect
            blackHole.graphics.lineStyle(2, 0x666666, 0.3);
            blackHole.graphics.strokeCircle(blackHole.x, blackHole.y, blackHole.size * 1.5);

            this.distortAndConsumeStars(blackHole);
            this.affectMeteors(blackHole);
            this.affectAsteroids(blackHole);
        });
    }

    drawSimpleAccretionDisk(blackHole) {
        // Gargantua-inspired accretion disk with Doppler effect
        const numParticles = 60;
        const baseRadius = blackHole.size * 1.2;

        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2 + blackHole.rotation;
            const radius = baseRadius + Math.sin(angle * 3) * 20;
            const x = blackHole.x + Math.cos(angle) * radius;
            const y = blackHole.y + Math.sin(angle) * radius;

            const approaching = Math.cos(angle) > 0;
            const alpha = 0.4 + Math.sin(angle * 2 + blackHole.rotation) * 0.3;
            const size = 1.5 + Math.sin(angle * 4) * 0.8;

            if (approaching) {
                // Blue-shifted (approaching)
                const blueIntensity = 0.5 + Math.sin(angle + blackHole.rotation) * 0.5;
                blackHole.accretionDisk.fillStyle(
                    Phaser.Display.Color.GetColor(
                        Math.floor(100 + blueIntensity * 155),
                        Math.floor(150 + blueIntensity * 105),
                        255
                    ),
                    alpha
                );
            } else {
                // Red-shifted (receding)
                const redIntensity = 0.5 + Math.sin(angle + blackHole.rotation) * 0.5;
                blackHole.accretionDisk.fillStyle(
                    Phaser.Display.Color.GetColor(
                        255,
                        Math.floor(100 + redIntensity * 100),
                        Math.floor(50 + redIntensity * 50)
                    ),
                    alpha
                );
            }

            blackHole.accretionDisk.fillCircle(x, y, size);
        }

        // Inner photon ring
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2 + blackHole.rotation * 1.5;
            const radius = blackHole.size * 1.0;
            const x = blackHole.x + Math.cos(angle) * radius;
            const y = blackHole.y + Math.sin(angle) * radius;

            blackHole.accretionDisk.fillStyle(0xffffff, 0.6);
            blackHole.accretionDisk.fillCircle(x, y, 1);
        }
    }

    distortAndConsumeStars(blackHole) {
        const maxDistance = blackHole.size * 4;
        const consumeDistance = blackHole.size * 1.2;

        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            const distance = Phaser.Math.Distance.Between(
                star.x, star.y, blackHole.x, blackHole.y
            );

            if (distance < consumeDistance) {
                // Star gets consumed by black hole
                blackHole.consumedStars.push({
                    x: star.x,
                    y: star.y,
                    size: star.size,
                    color: star.color,
                    brightness: star.brightness,
                    twinkleIntensity: star.twinkleIntensity,
                    twinkleSpeed: star.twinkleSpeed,
                    twinklePhase: star.twinklePhase
                });

                this.stars.splice(i, 1);

                // Create absorption effect
                this.createAbsorptionEffect(star.x, star.y, blackHole.x, blackHole.y);

            } else if (distance < maxDistance) {
                // Gravitational pull effect
                const pullStrength = (maxDistance - distance) / maxDistance;
                const angle = Phaser.Math.Angle.Between(
                    star.x, star.y, blackHole.x, blackHole.y
                );

                // Pull star towards black hole
                const pullDistance = pullStrength * 3;
                star.x += Math.cos(angle) * pullDistance;
                star.y += Math.sin(angle) * pullDistance;

                // Gravitational lensing effect
                const bendAngle = angle + pullStrength * 0.3;
                star.visualX = star.x + Math.cos(bendAngle) * pullStrength * 8;
                star.visualY = star.y + Math.sin(bendAngle) * pullStrength * 8;
            } else {
                star.visualX = star.x;
                star.visualY = star.y;
            }
        }
    }

    createAbsorptionEffect(starX, starY, blackHoleX, blackHoleY) {
        // Create particle trail effect when star gets absorbed
        const graphics = this.add.graphics();
        const particles = [];

        for (let i = 0; i < 8; i++) {
            particles.push({
                x: starX,
                y: starY,
                angle: Math.random() * Math.PI * 2,
                speed: 2 + Math.random() * 3
            });
        }

        const updateParticles = () => {
            graphics.clear();

            particles.forEach((particle, index) => {
                // Move particle towards black hole
                const angle = Phaser.Math.Angle.Between(particle.x, particle.y, blackHoleX, blackHoleY);
                particle.x += Math.cos(angle) * particle.speed;
                particle.y += Math.sin(angle) * particle.speed;

                // Fade particle
                const alpha = 1 - (index * 0.1);
                graphics.fillStyle(0xffffff, alpha);
                graphics.fillCircle(particle.x, particle.y, 1);

                // Remove if close to black hole
                const distance = Phaser.Math.Distance.Between(particle.x, particle.y, blackHoleX, blackHoleY);
                if (distance < 10) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length === 0) {
                graphics.destroy();
            }
        };

        this.tweens.add({
            targets: {},
            duration: 100,
            repeat: 30,
            onRepeat: updateParticles,
            onComplete: () => graphics.destroy()
        });
    }

    affectMeteors(blackHole) {
        const maxDistance = blackHole.size * 15; // Increased gravitational range
        const disappearDistance = blackHole.size * 0.8; // Disappear very close to center
        const strongPullDistance = blackHole.size * 8; // Increased strong pull range

        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            if (!meteor.isActive) continue;

            const distance = Phaser.Math.Distance.Between(
                meteor.currentX, meteor.currentY, blackHole.x, blackHole.y
            );

            if (distance < disappearDistance) {
                // Silently disappear when very close to black hole center
                meteor.isActive = false;
                this.removeMeteor(meteor);
                continue;
            }

            if (distance < strongPullDistance) {
                // Much stronger gravitational pull
                const pullStrength = Math.pow((strongPullDistance - distance) / strongPullDistance, 3); // Cubic falloff for stronger effect
                const angleToBlackHole = Phaser.Math.Angle.Between(
                    meteor.currentX, meteor.currentY, blackHole.x, blackHole.y
                );

                const pullForce = pullStrength * 3000; // Increased from 1200 to 3000
                const pullAccelX = Math.cos(angleToBlackHole) * pullForce;
                const pullAccelY = Math.sin(angleToBlackHole) * pullForce;

                // Apply acceleration to velocity
                const deltaTime = this.game.loop.delta / 1000;
                meteor.velocityX += pullAccelX * deltaTime;
                meteor.velocityY += pullAccelY * deltaTime;

                // Increase max speed for dramatic effect when close
                const maxSpeed = 1500; // Increased max speed
                const currentSpeed = Math.sqrt(meteor.velocityX * meteor.velocityX + meteor.velocityY * meteor.velocityY);
                if (currentSpeed > maxSpeed) {
                    meteor.velocityX = (meteor.velocityX / currentSpeed) * maxSpeed;
                    meteor.velocityY = (meteor.velocityY / currentSpeed) * maxSpeed;
                }

                // Gradual fading as it gets closer
                const fadeStart = strongPullDistance * 0.5;
                if (distance < fadeStart) {
                    const fadeProgress = 1 - (distance / fadeStart);
                    meteor.scale = Math.max(0.1, 1 - fadeProgress * 0.7);
                    meteor.alpha = Math.max(0.2, 1 - fadeProgress * 0.6);
                }

            } else if (distance < maxDistance) {
                // Medium gravitational influence - stronger than before
                const pullStrength = (maxDistance - distance) / maxDistance;
                const angleToBlackHole = Phaser.Math.Angle.Between(
                    meteor.currentX, meteor.currentY, blackHole.x, blackHole.y
                );

                // Stronger deflection force
                const deflectionForce = pullStrength * 600; // Increased from 200 to 600
                const deflectAccelX = Math.cos(angleToBlackHole) * deflectionForce;
                const deflectAccelY = Math.sin(angleToBlackHole) * deflectionForce;

                // Apply gradual acceleration
                const deltaTime = this.game.loop.delta / 1000;
                meteor.velocityX += deflectAccelX * deltaTime;
                meteor.velocityY += deflectAccelY * deltaTime;

                // Reset scale and alpha when at medium distance
                meteor.scale = 1.0;
                meteor.alpha = 1.0;
            } else {
                // Reset scale and alpha when far from black hole
                meteor.scale = 1.0;
                meteor.alpha = 1.0;
            }
        }
    }

    affectAsteroids(blackHole) {
        const maxDistance = blackHole.size * 15; // Same gravitational range as meteors
        const disappearDistance = blackHole.size * 0.8; // Disappear very close to center
        const strongPullDistance = blackHole.size * 8; // Strong pull range

        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            if (!asteroid.isActive) continue;

            const distance = Phaser.Math.Distance.Between(
                asteroid.currentX, asteroid.currentY, blackHole.x, blackHole.y
            );

            if (distance < disappearDistance) {
                // Silently disappear when very close to black hole center
                asteroid.isActive = false;
                this.removeAsteroid(asteroid);
                continue;
            }

            if (distance < strongPullDistance) {
                // Much stronger gravitational pull
                const pullStrength = Math.pow((strongPullDistance - distance) / strongPullDistance, 3);
                const angleToBlackHole = Phaser.Math.Angle.Between(
                    asteroid.currentX, asteroid.currentY, blackHole.x, blackHole.y
                );

                const pullForce = pullStrength * 2500; // Slightly less than meteors (3000)
                const pullAccelX = Math.cos(angleToBlackHole) * pullForce;
                const pullAccelY = Math.sin(angleToBlackHole) * pullForce;

                // Apply acceleration to velocity
                const deltaTime = this.game.loop.delta / 1000;
                asteroid.velocityX += pullAccelX * deltaTime;
                asteroid.velocityY += pullAccelY * deltaTime;

                // Limit max speed
                const maxSpeed = 1200; // Slightly slower than meteors
                const currentSpeed = Math.sqrt(asteroid.velocityX * asteroid.velocityX + asteroid.velocityY * asteroid.velocityY);
                if (currentSpeed > maxSpeed) {
                    asteroid.velocityX = (asteroid.velocityX / currentSpeed) * maxSpeed;
                    asteroid.velocityY = (asteroid.velocityY / currentSpeed) * maxSpeed;
                }

                // Gradual fading and size reduction as it gets closer
                const fadeStart = strongPullDistance * 0.5;
                if (distance < fadeStart) {
                    const fadeProgress = 1 - (distance / fadeStart);
                    asteroid.scale = Math.max(0.05, 0.13 - fadeProgress * 0.08);
                    asteroid.alpha = Math.max(0.3, 1 - fadeProgress * 0.5);
                }

                // Increase rotation speed when being pulled
                asteroid.rotationSpeed += pullStrength * 0.01;

            } else if (distance < maxDistance) {
                // Medium gravitational influence
                const pullStrength = (maxDistance - distance) / maxDistance;
                const angleToBlackHole = Phaser.Math.Angle.Between(
                    asteroid.currentX, asteroid.currentY, blackHole.x, blackHole.y
                );

                // Moderate deflection force
                const deflectionForce = pullStrength * 500; // Slightly less than meteors
                const deflectAccelX = Math.cos(angleToBlackHole) * deflectionForce;
                const deflectAccelY = Math.sin(angleToBlackHole) * deflectionForce;

                // Apply gradual acceleration
                const deltaTime = this.game.loop.delta / 1000;
                asteroid.velocityX += deflectAccelX * deltaTime;
                asteroid.velocityY += deflectAccelY * deltaTime;

                // Reset scale and alpha when at medium distance
                asteroid.scale = 0.13;
                asteroid.alpha = 1.0;
            } else {
                // Reset scale and alpha when far from black hole
                asteroid.scale = 0.13;
                asteroid.alpha = 1.0;
            }
        }
    }
    // Removed meteor absorption effect - meteors now disappear silently

    createRandomBlackHole() {
        const { width, height } = this.scale;

        // Generate random position with some margin from edges
        const margin = 100;
        const x = margin + Math.random() * (width - margin * 2);
        const y = margin + Math.random() * (height - margin * 2);

        // Avoid creating black holes too close to existing ones
        let tooClose = false;
        for (const existingBlackHole of this.blackHoles) {
            const distance = Phaser.Math.Distance.Between(x, y, existingBlackHole.x, existingBlackHole.y);
            if (distance < 200) {
                tooClose = true;
                break;
            }
        }

        // Only create if not too close to existing black holes
        if (!tooClose) {
            const blackHole = this.createBlackHoleObject(x, y, false);
            this.blackHoles.push(blackHole);
            this.animateBlackHoleCreation(blackHole);
        }
    }

    applyNebulaGravity() {
        // Apply moderate gravitational effects from nebulae to meteors and asteroids
        this.meteors.forEach(meteor => {
            if (!meteor.isActive) return;

            this.nebulaClouds.forEach(nebula => {
                const distance = Phaser.Math.Distance.Between(
                    meteor.currentX, meteor.currentY, nebula.currentX, nebula.currentY
                );

                // Nebula gravity range - larger area of influence
                const gravityRange = nebula.size * 4;

                if (distance < gravityRange && distance > 5) {
                    // Subtle gravitational pull - weaker than black holes
                    const pullStrength = Math.pow((gravityRange - distance) / gravityRange, 1.2);
                    const subtlePullStrength = pullStrength * 0.3; // Reduced from 0.8 to 0.3

                    const angleToNebula = Phaser.Math.Angle.Between(
                        meteor.currentX, meteor.currentY, nebula.currentX, nebula.currentY
                    );

                    const deflectionForce = subtlePullStrength * 80; // Reduced from 200 to 80
                    const deflectAccelX = Math.cos(angleToNebula) * deflectionForce;
                    const deflectAccelY = Math.sin(angleToNebula) * deflectionForce;

                    // Apply moderate acceleration - enough to visibly curve the path
                    const deltaTime = this.game.loop.delta / 1000;
                    meteor.velocityX += deflectAccelX * deltaTime;
                    meteor.velocityY += deflectAccelY * deltaTime;

                    // Optional: Limit the total speed change to prevent too dramatic effects
                    const currentSpeed = Math.sqrt(meteor.velocityX * meteor.velocityX + meteor.velocityY * meteor.velocityY);
                    const maxSpeedIncrease = meteor.speed * 1.5; // Allow 50% speed increase
                    if (currentSpeed > maxSpeedIncrease) {
                        meteor.velocityX = (meteor.velocityX / currentSpeed) * maxSpeedIncrease;
                        meteor.velocityY = (meteor.velocityY / currentSpeed) * maxSpeedIncrease;
                    }
                }
            });
        });

        // Apply same nebula gravity to asteroids
        this.asteroids.forEach(asteroid => {
            if (!asteroid.isActive) return;

            this.nebulaClouds.forEach(nebula => {
                const distance = Phaser.Math.Distance.Between(
                    asteroid.currentX, asteroid.currentY, nebula.currentX, nebula.currentY
                );

                // Nebula gravity range - larger area of influence
                const gravityRange = nebula.size * 4;

                if (distance < gravityRange && distance > 5) {
                    // Subtle gravitational pull - asteroids are heavier so much less affected
                    const pullStrength = Math.pow((gravityRange - distance) / gravityRange, 1.2);
                    const subtlePullStrength = pullStrength * 0.15; // Much less than meteors (0.3)

                    const angleToNebula = Phaser.Math.Angle.Between(
                        asteroid.currentX, asteroid.currentY, nebula.currentX, nebula.currentY
                    );

                    const deflectionForce = subtlePullStrength * 50; // Much less than meteors (80)
                    const deflectAccelX = Math.cos(angleToNebula) * deflectionForce;
                    const deflectAccelY = Math.sin(angleToNebula) * deflectionForce;

                    // Apply moderate acceleration
                    const deltaTime = this.game.loop.delta / 1000;
                    asteroid.velocityX += deflectAccelX * deltaTime;
                    asteroid.velocityY += deflectAccelY * deltaTime;

                    // Limit the total speed change
                    const currentSpeed = Math.sqrt(asteroid.velocityX * asteroid.velocityX + asteroid.velocityY * asteroid.velocityY);
                    const maxSpeedIncrease = asteroid.speed * 1.2; // Much less speed increase than meteors (1.5)
                    if (currentSpeed > maxSpeedIncrease) {
                        asteroid.velocityX = (asteroid.velocityX / currentSpeed) * maxSpeedIncrease;
                        asteroid.velocityY = (asteroid.velocityY / currentSpeed) * maxSpeedIncrease;
                    }

                    // Very slight rotation change due to nebula influence
                    asteroid.rotationSpeed += subtlePullStrength * 0.0005;
                }
            });
        });
    }

    checkCollisions() {
        // Check asteroid-asteroid collisions
        for (let i = 0; i < this.asteroids.length; i++) {
            const asteroid1 = this.asteroids[i];
            if (!asteroid1.isActive) continue;

            for (let j = i + 1; j < this.asteroids.length; j++) {
                const asteroid2 = this.asteroids[j];
                if (!asteroid2.isActive) continue;

                const distance = Phaser.Math.Distance.Between(
                    asteroid1.currentX, asteroid1.currentY,
                    asteroid2.currentX, asteroid2.currentY
                );

                // Check if asteroids are colliding (considering their sizes)
                const collisionDistance = (asteroid1.size + asteroid2.size) / 2;
                if (distance < collisionDistance) {
                    this.handleAsteroidCollision(asteroid1, asteroid2);
                }
            }
        }

        // Check asteroid-meteor collisions
        for (let i = 0; i < this.asteroids.length; i++) {
            const asteroid = this.asteroids[i];
            if (!asteroid.isActive) continue;

            for (let j = 0; j < this.meteors.length; j++) {
                const meteor = this.meteors[j];
                if (!meteor.isActive) continue;

                const distance = Phaser.Math.Distance.Between(
                    asteroid.currentX, asteroid.currentY,
                    meteor.currentX, meteor.currentY
                );

                // Check if asteroid and meteor are colliding
                const collisionDistance = (asteroid.size + meteor.size) / 2;
                if (distance < collisionDistance) {
                    this.handleAsteroidMeteorCollision(asteroid, meteor);
                }
            }
        }
    }

    handleAsteroidCollision(asteroid1, asteroid2) {
        const angle = Phaser.Math.Angle.Between(
            asteroid1.currentX, asteroid1.currentY,
            asteroid2.currentX, asteroid2.currentY
        );

        const mass1 = asteroid1.size * asteroid1.size;
        const mass2 = asteroid2.size * asteroid2.size;
        const totalMass = mass1 + mass2;

        const v1 = asteroid1.velocityX * Math.cos(angle) + asteroid1.velocityY * Math.sin(angle);
        const v2 = asteroid2.velocityX * Math.cos(angle) + asteroid2.velocityY * Math.sin(angle);

        const u1 = -asteroid1.velocityX * Math.sin(angle) + asteroid1.velocityY * Math.cos(angle);
        const u2 = -asteroid2.velocityX * Math.sin(angle) + asteroid2.velocityY * Math.cos(angle);

        // Elastic collision formulas
        const newV1 = (v1 * (mass1 - mass2) + 2 * mass2 * v2) / totalMass;
        const newV2 = (v2 * (mass2 - mass1) + 2 * mass1 * v1) / totalMass;

        // Convert back to x,y coordinates
        asteroid1.velocityX = newV1 * Math.cos(angle) - u1 * Math.sin(angle);
        asteroid1.velocityY = newV1 * Math.sin(angle) + u1 * Math.cos(angle);
        asteroid2.velocityX = newV2 * Math.cos(angle) - u2 * Math.sin(angle);
        asteroid2.velocityY = newV2 * Math.sin(angle) + u2 * Math.cos(angle);

        // Separate asteroids to prevent overlap
        const separationDistance = (asteroid1.size + asteroid2.size) / 2 + 5;
        const currentDistance = Phaser.Math.Distance.Between(
            asteroid1.currentX, asteroid1.currentY,
            asteroid2.currentX, asteroid2.currentY
        );

        if (currentDistance < separationDistance) {
            const separationRatio = (separationDistance - currentDistance) / 2;
            const separationX = Math.cos(angle) * separationRatio;
            const separationY = Math.sin(angle) * separationRatio;

            asteroid1.currentX -= separationX;
            asteroid1.currentY -= separationY;
            asteroid2.currentX += separationX;
            asteroid2.currentY += separationY;
        }

        // Add some rotation change due to collision
        asteroid1.rotationSpeed += (Math.random() - 0.5) * 0.02;
        asteroid2.rotationSpeed += (Math.random() - 0.5) * 0.02;
    }

    handleAsteroidMeteorCollision(asteroid, meteor) {
        // Meteor explodes
        this.createMeteorExplosion(meteor.currentX, meteor.currentY);
        this.removeMeteor(meteor);

        const collisionAngle = Phaser.Math.Angle.Between(
            meteor.currentX, meteor.currentY,
            asteroid.currentX, asteroid.currentY
        );

        // Get current asteroid velocity magnitude
        const currentSpeed = Math.sqrt(asteroid.velocityX * asteroid.velocityX +
                                      asteroid.velocityY * asteroid.velocityY);

        const meteorAngle = Math.atan2(meteor.velocityY, meteor.velocityX);

        // Use the collision normal (perpendicular to collision line)
        const normalAngle = collisionAngle;

        const incidentAngle = meteorAngle - normalAngle;

        // Reflection formula: reflected = incident - 2 * (incident · normal) * normal
        const reflectedAngle = normalAngle - incidentAngle;

        // Transfer some momentum from meteor to asteroid
        const meteorMomentum = Math.sqrt(meteor.velocityX * meteor.velocityX +
                                        meteor.velocityY * meteor.velocityY);

        const momentumTransfer = meteorMomentum * 0.6; // 60% of meteor momentum transferred
        const finalSpeed = Math.max(currentSpeed * 0.8, momentumTransfer * 1.2);

        // Apply the reflected velocity
        asteroid.velocityX = Math.cos(reflectedAngle) * finalSpeed;
        asteroid.velocityY = Math.sin(reflectedAngle) * finalSpeed;

        // Add rotation change based on impact angle and speed
        const rotationImpact = (Math.sin(incidentAngle) * finalSpeed) / 1000;
        asteroid.rotationSpeed += rotationImpact;
    }

    destroyBlackHole(blackHole) {
        // Restore consumed stars first
        this.restoreConsumedStars(blackHole);

        // Store black hole position for UFO investigation
        const blackHoleX = blackHole.x;
        const blackHoleY = blackHole.y;

        this.tweens.add({
            targets: blackHole,
            size: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                blackHole.graphics.destroy();
                blackHole.accretionDisk.destroy();

                // Remove from array
                const index = this.blackHoles.indexOf(blackHole);
                if (index > -1) {
                    this.blackHoles.splice(index, 1);
                }

                // UFO always appears to investigate randomly created black holes
                // Only if no other UFOs are currently active AND only for randomly created black holes
                if (this.ufos.length === 0 && !blackHole.isManuallyCreated) { // 100% chance, no existing UFOs, and not manually created
                    this.time.delayedCall(1000 + Math.random() * 2000, () => {
                        this.createInvestigationUfo(blackHoleX, blackHoleY);
                    });
                }
            }
        });
    }

    restoreConsumedStars(blackHole) {
        // Create explosion effect and restore stars
        const explosionGraphics = this.add.graphics();
        let explosionRadius = 0;

        // Animate explosion
        this.tweens.add({
            targets: { radius: 0 },
            radius: blackHole.maxSize * 3,
            duration: 1000,
            ease: 'Power2',
            onUpdate: (tween) => {
                explosionRadius = tween.targets[0].radius;
                explosionGraphics.clear();

                // Draw explosion ring
                explosionGraphics.lineStyle(3, 0xffffff, 1 - tween.progress);
                explosionGraphics.strokeCircle(blackHole.x, blackHole.y, explosionRadius);
                explosionGraphics.lineStyle(6, 0xffd700, (1 - tween.progress) * 0.5);
                explosionGraphics.strokeCircle(blackHole.x, blackHole.y, explosionRadius * 0.8);
            },
            onComplete: () => {
                explosionGraphics.destroy();
            }
        });

        // Restore consumed stars with scatter effect
        blackHole.consumedStars.forEach((starData, index) => {
            this.time.delayedCall(index * 100, () => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                const newX = blackHole.x + Math.cos(angle) * distance;
                const newY = blackHole.y + Math.sin(angle) * distance;

                // Restore star with new position
                const restoredStar = {
                    x: newX,
                    y: newY,
                    size: starData.size,
                    color: starData.color,
                    brightness: starData.brightness,
                    twinkleIntensity: starData.twinkleIntensity,
                    twinkleSpeed: starData.twinkleSpeed,
                    twinklePhase: starData.twinklePhase
                };

                this.stars.push(restoredStar);

                // Create restoration effect
                this.createRestorationEffect(blackHole.x, blackHole.y, newX, newY);
            });
        });
    }

    createRestorationEffect(startX, startY, endX, endY) {
        // Create sparkle effect for star restoration
        const graphics = this.add.graphics();
        let progress = 0;

        this.tweens.add({
            targets: { value: 0 },
            value: 1,
            duration: 800,
            ease: 'Power2',
            onUpdate: (tween) => {
                progress = tween.targets[0].value;
                graphics.clear();

                // Draw moving sparkle
                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;

                graphics.fillStyle(0xffffff, 1 - progress * 0.5);
                graphics.fillCircle(currentX, currentY, 2);
                graphics.fillStyle(0xffd700, 1 - progress * 0.3);
                graphics.fillCircle(currentX, currentY, 4);

                // Add sparkle trail
                for (let i = 0; i < 5; i++) {
                    const trailProgress = Math.max(0, progress - i * 0.1);
                    if (trailProgress > 0) {
                        const trailX = startX + (endX - startX) * trailProgress;
                        const trailY = startY + (endY - startY) * trailProgress;
                        const alpha = (1 - progress) * (1 - i * 0.2);

                        graphics.fillStyle(0xffffff, alpha);
                        graphics.fillCircle(trailX, trailY, 1);
                    }
                }
            },
            onComplete: () => {
                graphics.destroy();
            }
        });
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;

        // Clear all graphics
        this.children.removeAll(true);
        this.stars = [];
        this.meteors = [];
        this.blackHoles = [];
        this.ufos = [];
        this.asteroids = [];

        // Recreate scene
        this.createDeepSpaceBackground(width, height);
        this.createDistantStars(width, height);
        this.createNebulae(width, height);
        this.createForegroundStars(width, height);
        this.startAtmosphericEffects();
    }

    createUfo() {
        // UFOs now use warp travel instead of linear movement
        // This method is kept for compatibility but won't be used for investigation UFOs
        console.log("Regular UFO creation - deprecated in favor of warp travel");
    }

    updateUfos() {
        const mousePointer = this.input.activePointer;

        for (let i = this.ufos.length - 1; i >= 0; i--) {
            const ufo = this.ufos[i];
            if (!ufo.isActive) continue;

            const deltaTime = this.game.loop.delta / 1000;
            ufo.wobbleTime += deltaTime;

            // Warp-based investigation behavior
            if (ufo.isInvestigating) {
                const distanceToTarget = Phaser.Math.Distance.Between(
                    ufo.currentX, ufo.currentY, ufo.targetX, ufo.targetY
                );

                if (ufo.investigationPhase === 'approaching') {
                    // Fast movement toward target
                    const angleToTarget = Phaser.Math.Angle.Between(
                        ufo.currentX, ufo.currentY, ufo.targetX, ufo.targetY
                    );
                    ufo.velocityX = Math.cos(angleToTarget) * ufo.speed;
                    ufo.velocityY = Math.sin(angleToTarget) * ufo.speed;

                    if (distanceToTarget < ufo.investigationRadius) {
                        ufo.investigationPhase = 'investigating';
                        ufo.investigationTime = 0;
                        // Rapid deceleration
                        ufo.velocityX *= 0.1;
                        ufo.velocityY *= 0.1;
                    }
                }

                if (ufo.investigationPhase === 'investigating') {
                    ufo.investigationTime += deltaTime * 1000;

                    // Orbit around the investigation site
                    const orbitAngle = ufo.investigationTime * 0.002;
                    const orbitRadius = 50;
                    const orbitCenterX = ufo.targetX + Math.cos(orbitAngle) * orbitRadius;
                    const orbitCenterY = ufo.targetY + Math.sin(orbitAngle) * orbitRadius;

                    // Fast movement toward orbit position
                    const orbitX = (orbitCenterX - ufo.currentX) * 4 * deltaTime;
                    const orbitY = (orbitCenterY - ufo.currentY) * 4 * deltaTime;

                    ufo.velocityX = orbitX;
                    ufo.velocityY = orbitY;

                    // Finish investigation and prepare to leave
                    if (ufo.investigationTime > ufo.investigationDuration) {
                        ufo.investigationPhase = 'leaving';
                        // Choose random leave direction
                        const leaveAngle = Math.random() * Math.PI * 2;
                        ufo.leaveDirection = {
                            x: Math.cos(leaveAngle),
                            y: Math.sin(leaveAngle)
                        };
                    }
                }

                if (ufo.investigationPhase === 'leaving') {
                    // Move in chosen direction for a longer distance before warping out
                    ufo.velocityX = ufo.leaveDirection.x * ufo.speed * 0.7;
                    ufo.velocityY = ufo.leaveDirection.y * ufo.speed * 0.7;

                    // After moving 200-250 pixels, warp out
                    const moveDistance = Phaser.Math.Distance.Between(
                        ufo.targetX, ufo.targetY, ufo.currentX, ufo.currentY
                    );
                    if (moveDistance > 200 + Math.random() * 50) {
                        ufo.investigationPhase = 'warping-out';
                        this.warpOutUfo(ufo);
                    }
                }
            }

            // Mouse avoidance and capture behavior (works during all phases)
            if (mousePointer) {
                const mouseDistance = Phaser.Math.Distance.Between(
                    ufo.currentX, ufo.currentY, mousePointer.x, mousePointer.y
                );

                // Check if UFO gets caught
                if (mouseDistance < ufo.captureRadius) {
                    // Warp to random location
                    this.warpUfo(ufo);
                    continue;
                }

                if (mouseDistance < ufo.avoidanceRadius) {
                    const avoidanceStrength = Math.pow((ufo.avoidanceRadius - mouseDistance) / ufo.avoidanceRadius, 2);
                    const angleAwayFromMouse = Phaser.Math.Angle.Between(
                        mousePointer.x, mousePointer.y, ufo.currentX, ufo.currentY
                    );

                    // Extremely strong avoidance force - warp-level speed
                    const panicMultiplier = 2 + (1 - mouseDistance / ufo.avoidanceRadius) * 6; // Up to 8x faster
                    const avoidanceX = Math.cos(angleAwayFromMouse) * ufo.avoidanceForce * avoidanceStrength * panicMultiplier;
                    const avoidanceY = Math.sin(angleAwayFromMouse) * ufo.avoidanceForce * avoidanceStrength * panicMultiplier;

                    ufo.velocityX += avoidanceX * deltaTime;
                    ufo.velocityY += avoidanceY * deltaTime;

                    // Extreme erratic movement when in panic mode
                    const panicFactor = Math.max(0, 1 - mouseDistance / ufo.avoidanceRadius);
                    const erraticForce = 600 * panicFactor; // Doubled erratic force
                    ufo.velocityX += (Math.random() - 0.5) * erraticForce * deltaTime;
                    ufo.velocityY += (Math.random() - 0.5) * erraticForce * deltaTime;

                    // Much higher max speed when panicking - warp speed
                    const maxPanicSpeed = 800; // Doubled max panic speed
                    const currentSpeed = Math.sqrt(ufo.velocityX * ufo.velocityX + ufo.velocityY * ufo.velocityY);
                    if (currentSpeed > maxPanicSpeed) {
                        ufo.velocityX = (ufo.velocityX / currentSpeed) * maxPanicSpeed;
                        ufo.velocityY = (ufo.velocityY / currentSpeed) * maxPanicSpeed;
                    }
                }
            }

            // UFO laser defense system - shoot at nearby meteors and asteroids
            const currentTime = this.time.now;
            if (currentTime - ufo.lastLaserTime > ufo.laserCooldown) {
                let targetFound = false;

                // First check for meteors
                for (let j = 0; j < this.meteors.length; j++) {
                    const meteor = this.meteors[j];
                    if (!meteor.isActive) continue;

                    const meteorDistance = Phaser.Math.Distance.Between(
                        ufo.currentX, ufo.currentY, meteor.currentX, meteor.currentY
                    );

                    if (meteorDistance < ufo.laserRange) {
                        // Fire laser at meteor
                        this.fireLaserAtMeteor(ufo, meteor);
                        ufo.lastLaserTime = currentTime;
                        targetFound = true;
                        break; // Only shoot one target at a time
                    }
                }

                // If no meteors in range, check for asteroids
                if (!targetFound) {
                    for (let k = 0; k < this.asteroids.length; k++) {
                        const asteroid = this.asteroids[k];
                        if (!asteroid.isActive) continue;

                        const asteroidDistance = Phaser.Math.Distance.Between(
                            ufo.currentX, ufo.currentY, asteroid.currentX, asteroid.currentY
                        );

                        if (asteroidDistance < ufo.laserRange) {
                            // Fire laser at asteroid
                            this.fireLaserAtAsteroid(ufo, asteroid);
                            ufo.lastLaserTime = currentTime;
                            break; // Only shoot one target at a time
                        }
                    }
                }
            }

            // Add subtle wobble movement
            const wobbleX = Math.sin(ufo.wobbleTime * 1.5) * ufo.wobbleIntensity * deltaTime;
            const wobbleY = Math.cos(ufo.wobbleTime * 2) * ufo.wobbleIntensity * 0.5 * deltaTime;

            // Update position
            ufo.currentX += ufo.velocityX * deltaTime + wobbleX;
            ufo.currentY += ufo.velocityY * deltaTime + wobbleY + ufo.hoverOffset * Math.sin(ufo.wobbleTime * ufo.bobSpeed) * deltaTime;

            // Update sprite position
            ufo.sprite.setPosition(ufo.currentX, ufo.currentY + ufo.hoverOffset);

            // Check if UFO is off screen
            const { width, height } = this.scale;
            if (ufo.currentX < -150 || ufo.currentX > width + 150 ||
                ufo.currentY < -150 || ufo.currentY > height + 150) {
                this.removeUfo(ufo);
            }
        }
    }

    removeUfo(ufo) {
        // Remove UFO from tracking array
        const index = this.ufos.indexOf(ufo);
        if (index > -1) {
            this.ufos.splice(index, 1);
        }

        // Destroy sprite
        if (ufo.sprite && ufo.sprite.active) {
            ufo.sprite.destroy();
        }
    }

    warpUfo(ufo) {
        const { width, height } = this.scale;

        // Find a safe warp location away from mouse
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 10;
        const safeDistance = 200; // Minimum distance from mouse

        do {
            newX = 100 + Math.random() * (width - 200);
            newY = 100 + Math.random() * (height - 200);
            attempts++;

            if (attempts >= maxAttempts) {
                // If can't find safe spot, warp to corners
                const corners = [
                    { x: 100, y: 100 },
                    { x: width - 100, y: 100 },
                    { x: 100, y: height - 100 },
                    { x: width - 100, y: height - 100 }
                ];
                const corner = corners[Math.floor(Math.random() * corners.length)];
                newX = corner.x;
                newY = corner.y;
                break;
            }
        } while (this.input.activePointer &&
                 Phaser.Math.Distance.Between(newX, newY, this.input.activePointer.x, this.input.activePointer.y) < safeDistance);

        // Create escape warp effect with pre-warp energy surge
        this.createEscapeWarpEffect(ufo, newX, newY);

        // UFO disappears briefly during warp
        ufo.sprite.setAlpha(0);

        // Reappear at new location after warp delay
        this.time.delayedCall(300, () => {
            // Update UFO position
            ufo.currentX = newX;
            ufo.currentY = newY;
            ufo.sprite.setPosition(newX, newY);

            // Dramatic reappearance
            this.createArrivalBurst(newX, newY);
            ufo.sprite.setAlpha(1);
            ufo.sprite.setScale(0.05);

            this.tweens.add({
                targets: ufo.sprite,
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 400,
                ease: 'Back.easeOut'
            });

            // Reset velocity to prevent carrying momentum
            ufo.velocityX *= 0.3;
            ufo.velocityY *= 0.3;
        });

        // Add some random velocity to escape
        const escapeAngle = Math.random() * Math.PI * 2;
        const escapeSpeed = 100;
        ufo.velocityX += Math.cos(escapeAngle) * escapeSpeed;
        ufo.velocityY += Math.sin(escapeAngle) * escapeSpeed;
    }

    createWarpEffect(startX, startY, endX, endY) {
        // Simplified warp effect with correct direction
        const warpGraphics = this.add.graphics();
        const warpDuration = 500;

        // Calculate warp direction and distance
        const warpAngle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
        const warpDistance = Phaser.Math.Distance.Between(startX, startY, endX, endY);

        // Create fewer, simpler warp streaks
        const streaks = [];
        for (let i = 0; i < 8; i++) {
            const spread = (Math.random() - 0.5) * 0.2; // Smaller spread
            const streakAngle = warpAngle + spread;
            const offsetDist = (Math.random() - 0.5) * 20;

            streaks.push({
                startX: startX + Math.cos(warpAngle + Math.PI/2) * offsetDist,
                startY: startY + Math.sin(warpAngle + Math.PI/2) * offsetDist,
                angle: streakAngle,
                length: 30 + Math.random() * 20
            });
        }

        this.tweens.add({
            targets: { progress: 0 },
            progress: 1,
            duration: warpDuration,
            ease: 'Power2.easeIn',
            onUpdate: (tween) => {
                const progress = tween.targets[0].progress;
                warpGraphics.clear();

                // Draw accelerating streaks in correct direction
                streaks.forEach(streak => {
                    const currentLength = streak.length * (1 + progress * 3);
                    const alpha = 0.8 * (1 - progress * 0.6);

                    if (alpha > 0.1) {
                        // Draw streak pointing toward target
                        const streakEndX = streak.startX + Math.cos(streak.angle) * currentLength * progress;
                        const streakEndY = streak.startY + Math.sin(streak.angle) * currentLength * progress;

                        // White core
                        warpGraphics.lineStyle(2, 0xffffff, alpha);
                        warpGraphics.lineBetween(streak.startX, streak.startY, streakEndX, streakEndY);

                        // Blue glow
                        warpGraphics.lineStyle(4, 0x4da6ff, alpha * 0.5);
                        warpGraphics.lineBetween(streak.startX, streak.startY, streakEndX, streakEndY);
                    }
                });

                // Simple flash at end
                if (progress > 0.8) {
                    const flashAlpha = (progress - 0.8) * 5 * (1 - progress);
                    warpGraphics.fillStyle(0xffffff, flashAlpha);
                    warpGraphics.fillCircle(endX, endY, 15);
                }
            },
            onComplete: () => {
                warpGraphics.destroy();
            }
        });
    }

    createInvestigationUfo(targetX, targetY) {
        const { width, height } = this.scale;

        // UFO warps in from much farther distance
        const warpDistance = 300 + Math.random() * 200; // 300-500 pixels away from target
        const warpAngle = Math.random() * Math.PI * 2;
        const startX = targetX + Math.cos(warpAngle) * warpDistance;
        const startY = targetY + Math.sin(warpAngle) * warpDistance;

        // Ensure UFO warps within screen bounds
        const clampedX = Math.max(100, Math.min(width - 100, startX));
        const clampedY = Math.max(100, Math.min(height - 100, startY));

        // Create UFO sprite at warp location (initially invisible for warp-in effect)
        const ufoSprite = this.add.image(clampedX, clampedY, 'ufo');
        ufoSprite.setScale(0.2);
        ufoSprite.setTint(0xffffff);
        ufoSprite.setAlpha(0); // Start invisible

        // Store UFO data with investigation behavior
        const ufo = {
            sprite: ufoSprite,
            targetX: targetX, // Black hole investigation site
            targetY: targetY,
            currentX: clampedX,
            currentY: clampedY,
            velocityX: 0,
            velocityY: 0,
            speed: 300, // Much faster warp-capable speed
            isActive: true,
            avoidanceRadius: 150,
            avoidanceForce: 800, // Stronger avoidance for warp-capable UFO
            captureRadius: 25, // Smaller capture radius - harder to catch
            wobbleTime: 0,
            wobbleIntensity: 8,
            hoverOffset: 0,
            bobSpeed: 2,
            isInvestigating: true,
            investigationTime: 0,
            investigationDuration: 3000 + Math.random() * 4000, // 3-7 seconds
            hasReachedTarget: false,
            investigationRadius: 80,
            laserRange: 200,
            lastLaserTime: 0,
            laserCooldown: 300, // Much faster laser cooldown
            investigationPhase: 'approaching', // approaching, investigating, leaving, warping-out
            leaveDirection: null
        };

        // Create warp-in effect from farther away
        const warpFromX = clampedX + Math.cos(warpAngle + Math.PI) * 200;
        const warpFromY = clampedY + Math.sin(warpAngle + Math.PI) * 200;
        this.createWarpEffect(warpFromX, warpFromY, clampedX, clampedY);

        // UFO appears with dramatic warp-in effect
        this.time.delayedCall(400, () => {
            // Create arrival energy burst
            this.createArrivalBurst(clampedX, clampedY);

            // UFO materializes with scale and alpha animation
            ufoSprite.setAlpha(1);
            ufoSprite.setScale(0.05); // Start very small

            this.tweens.add({
                targets: ufoSprite,
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 600,
                ease: 'Back.easeOut',
                onComplete: () => {
                    // UFO is fully materialized, can start investigation
                }
            });
        });

        this.ufos.push(ufo);

        // Add floating animation
        this.tweens.add({
            targets: ufo,
            hoverOffset: 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Create investigation scanning effect
        this.createScanningEffect(targetX, targetY);
    }

    createEscapeWarpEffect(ufo, newX, newY) {
        // Quick escape warp effect
        const escapeGraphics = this.add.graphics();
        const currentX = ufo.currentX;
        const currentY = ufo.currentY;

        // Quick red energy flash
        this.tweens.add({
            targets: { progress: 0 },
            progress: 1,
            duration: 150,
            ease: 'Power3.easeIn',
            onUpdate: (tween) => {
                const progress = tween.targets[0].progress;
                escapeGraphics.clear();

                const size = 12 + progress * 20;
                const alpha = 0.8 * (1 - progress * 0.5);

                // Red panic energy
                escapeGraphics.fillStyle(0xff6666, alpha);
                escapeGraphics.fillCircle(currentX, currentY, size);

                escapeGraphics.fillStyle(0xffffff, alpha * 0.7);
                escapeGraphics.fillCircle(currentX, currentY, size * 0.5);
            },
            onComplete: () => {
                this.createWarpEffect(currentX, currentY, newX, newY);
                escapeGraphics.destroy();
            }
        });
    }

    createArrivalBurst(x, y) {
        // Simple arrival burst effect
        const burstGraphics = this.add.graphics();

        this.tweens.add({
            targets: { radius: 0, alpha: 1 },
            radius: 40,
            alpha: 0,
            duration: 400,
            ease: 'Power2.easeOut',
            onUpdate: (tween) => {
                const radius = tween.targets[0].radius;
                const alpha = tween.targets[0].alpha;

                burstGraphics.clear();

                // Simple expanding ring
                burstGraphics.lineStyle(2, 0xffffff, alpha);
                burstGraphics.strokeCircle(x, y, radius);

                burstGraphics.lineStyle(3, 0x4da6ff, alpha * 0.6);
                burstGraphics.strokeCircle(x, y, radius * 0.7);

                // Small center flash
                if (alpha > 0.5) {
                    burstGraphics.fillStyle(0xffffff, alpha);
                    burstGraphics.fillCircle(x, y, 8);
                }
            },
            onComplete: () => {
                burstGraphics.destroy();
            }
        });
    }

    createScanningEffect(x, y) {
        // Create scanning beam effect at the investigation site
        const scanGraphics = this.add.graphics();
        let scanRadius = 0;
        let scanAlpha = 0.8;

        const scanAnimation = this.tweens.add({
            targets: { radius: 0, alpha: 0.8 },
            radius: 100,
            alpha: 0,
            duration: 3000,
            repeat: 2,
            ease: 'Power2',
            onUpdate: (tween) => {
                scanRadius = tween.targets[0].radius;
                scanAlpha = tween.targets[0].alpha;

                scanGraphics.clear();
                scanGraphics.lineStyle(2, 0x00ff00, scanAlpha);
                scanGraphics.strokeCircle(x, y, scanRadius);
                scanGraphics.lineStyle(1, 0x00ff00, scanAlpha * 0.5);
                scanGraphics.strokeCircle(x, y, scanRadius * 0.7);
            },
            onComplete: () => {
                scanGraphics.destroy();
            }
        });
    }

    fireLaserAtMeteor(ufo, meteor) {
        // Create laser beam visual effect
        const laserGraphics = this.add.graphics();

        const startX = ufo.currentX;
        const startY = ufo.currentY;
        const endX = meteor.currentX;
        const endY = meteor.currentY;

        // Draw bright laser beam
        laserGraphics.lineStyle(3, 0x00ff00, 1); // Green laser
        laserGraphics.lineBetween(startX, startY, endX, endY);

        // Add laser glow effect
        laserGraphics.lineStyle(6, 0x00ff00, 0.3);
        laserGraphics.lineBetween(startX, startY, endX, endY);

        // Destroy meteor immediately
        meteor.isActive = false;
        this.removeMeteor(meteor);

        // Create explosion effect at meteor location
        this.createMeteorExplosion(endX, endY);

        // Remove laser after short duration
        this.tweens.add({
            targets: laserGraphics,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                laserGraphics.destroy();
            }
        });
    }

    fireLaserAtAsteroid(ufo, asteroid) {
        // Create laser beam visual effect
        const laserGraphics = this.add.graphics();

        const startX = ufo.currentX;
        const startY = ufo.currentY;
        const endX = asteroid.currentX;
        const endY = asteroid.currentY;

        // Draw bright laser beam
        laserGraphics.lineStyle(3, 0x00ff00, 1); // Green laser
        laserGraphics.lineBetween(startX, startY, endX, endY);

        // Add laser glow effect
        laserGraphics.lineStyle(6, 0x00ff00, 0.3);
        laserGraphics.lineBetween(startX, startY, endX, endY);

        // Destroy asteroid immediately
        asteroid.isActive = false;
        this.removeAsteroid(asteroid);

        // Create explosion effect at asteroid location
        this.createAsteroidExplosion(endX, endY);

        // Remove laser after short duration
        this.tweens.add({
            targets: laserGraphics,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                laserGraphics.destroy();
            }
        });
    }

    createMeteorExplosion(x, y) {
        // Create explosion effect when meteor is destroyed
        const explosionGraphics = this.add.graphics();
        let explosionSize = 0;

        this.tweens.add({
            targets: { size: 0 },
            size: 30,
            duration: 400,
            ease: 'Power2',
            onUpdate: (tween) => {
                explosionSize = tween.targets[0].size;
                explosionGraphics.clear();

                // Draw explosion with multiple layers
                explosionGraphics.fillStyle(0xffffff, 1 - tween.progress);
                explosionGraphics.fillCircle(x, y, explosionSize * 0.3);

                explosionGraphics.fillStyle(0xffff00, (1 - tween.progress) * 0.8);
                explosionGraphics.fillCircle(x, y, explosionSize * 0.6);

                explosionGraphics.fillStyle(0xff6600, (1 - tween.progress) * 0.6);
                explosionGraphics.fillCircle(x, y, explosionSize);

                // Add sparkle effects
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const sparkleDistance = explosionSize * 1.2;
                    const sparkleX = x + Math.cos(angle) * sparkleDistance;
                    const sparkleY = y + Math.sin(angle) * sparkleDistance;

                    explosionGraphics.fillStyle(0xffffff, (1 - tween.progress) * 0.8);
                    explosionGraphics.fillCircle(sparkleX, sparkleY, 2);
                }
            },
            onComplete: () => {
                explosionGraphics.destroy();
            }
        });
    }

    createAsteroidExplosion(x, y) {
        // Create explosion effect when asteroid is destroyed
        const explosionGraphics = this.add.graphics();
        let explosionSize = 0;

        this.tweens.add({
            targets: { size: 0 },
            size: 40,
            duration: 500,
            ease: 'Power2',
            onUpdate: (tween) => {
                explosionSize = tween.targets[0].size;
                explosionGraphics.clear();

                // Draw explosion with multiple layers - asteroid colors (gray/brown)
                explosionGraphics.fillStyle(0xffffff, 1 - tween.progress);
                explosionGraphics.fillCircle(x, y, explosionSize * 0.3);

                explosionGraphics.fillStyle(0xcccccc, (1 - tween.progress) * 0.8);
                explosionGraphics.fillCircle(x, y, explosionSize * 0.6);

                explosionGraphics.fillStyle(0x8b4513, (1 - tween.progress) * 0.6);
                explosionGraphics.fillCircle(x, y, explosionSize);

                // Add debris fragments
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const fragmentDistance = explosionSize * 1.3;
                    const fragmentX = x + Math.cos(angle) * fragmentDistance;
                    const fragmentY = y + Math.sin(angle) * fragmentDistance;

                    explosionGraphics.fillStyle(0x696969, (1 - tween.progress) * 0.7);
                    explosionGraphics.fillCircle(fragmentX, fragmentY, 3);
                }
            },
            onComplete: () => {
                explosionGraphics.destroy();
            }
        });
    }

    createDepartureChargeUp(x, y) {
        // Simple charge-up effect before UFO warps out
        const chargeGraphics = this.add.graphics();

        this.tweens.add({
            targets: { progress: 0 },
            progress: 1,
            duration: 400,
            ease: 'Power2.easeIn',
            onUpdate: (tween) => {
                const progress = tween.targets[0].progress;
                chargeGraphics.clear();

                // Simple pulsing core
                const coreSize = 8 + progress * 15;
                const alpha = 0.8;

                // Blue to white color progression
                const color = progress < 0.5 ? 0x4da6ff : 0xffffff;

                chargeGraphics.fillStyle(color, alpha * (1 - progress * 0.3));
                chargeGraphics.fillCircle(x, y, coreSize);

                // Simple ring
                chargeGraphics.lineStyle(2, color, alpha * progress);
                chargeGraphics.strokeCircle(x, y, coreSize * 1.5);
            },
            onComplete: () => {
                chargeGraphics.destroy();
            }
        });
    }

    warpOutUfo(ufo) {
        const warpOutAngle = Math.atan2(ufo.velocityY, ufo.velocityX);
        const warpToX = ufo.currentX + Math.cos(warpOutAngle) * 300;
        const warpToY = ufo.currentY + Math.sin(warpOutAngle) * 300;

        // Create departure charge-up effect first
        this.createDepartureChargeUp(ufo.currentX, ufo.currentY);

        // UFO starts shrinking and accelerating
        this.tweens.add({
            targets: ufo.sprite,
            scaleX: 0.05,
            scaleY: 0.05,
            alpha: 0.3,
            duration: 600,
            ease: 'Power2.easeIn',
            onComplete: () => {
                // Create dramatic warp-out effect to farther destination
                this.createWarpEffect(ufo.currentX, ufo.currentY, warpToX, warpToY);

                // Remove UFO after warp effect completes
                this.time.delayedCall(800, () => {
                    this.removeUfo(ufo);
                });
            }
        });

        // Accelerate UFO movement during warp-out
        this.tweens.add({
            targets: ufo,
            velocityX: ufo.velocityX * 3,
            velocityY: ufo.velocityY * 3,
            duration: 600,
            ease: 'Power3.easeIn'
        });
    }
}

// Update UFO behavior to handle investigation

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser-game',
    backgroundColor: '#080810',
    scene: RealisticSpaceScene,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        antialias: true,
        pixelArt: false
    },
    input: {
        activePointers: 1
    }
};

// Initialize game
let game;
window.addEventListener('load', () => {
    game = new Phaser.Game(config);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game && game.scale) {
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
});
