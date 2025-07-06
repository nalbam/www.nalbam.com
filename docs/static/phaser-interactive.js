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
    }

    create() {
        const { width, height } = this.scale;
        
        // Create layers in order
        this.createDeepSpaceBackground(width, height);
        this.createDistantStars(width, height);
        this.createNebulae(width, height);
        this.createForegroundStars(width, height);
        
        // Start atmospheric effects
        this.startAtmosphericEffects();
        
        // Enable mouse interaction - multiple methods
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointerup', (pointer) => {
            this.createBlackHole(pointer.x, pointer.y);
        });
        
        // Create invisible interactive zone
        const zone = this.add.zone(width/2, height/2, width, height);
        zone.setInteractive();
        zone.on('pointerdown', (pointer) => {
            this.createBlackHole(pointer.x, pointer.y);
        });
        
        // Alternative click detection
        this.input.setDefaultCursor('pointer');
        this.input.topOnly = false;
        
        // Handle resize
        this.scale.on('resize', this.handleResize, this);
    }

    createDeepSpaceBackground(width, height) {
        this.backgroundGraphics = this.add.graphics();
        
        // Create deep space gradient with multiple layers
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
        
        // Add subtle color variations for depth
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
        
        // Create tiny distant stars
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
        
        // Create the main galactic band
        const cloudDensity = 200;
        for (let i = 0; i < cloudDensity; i++) {
            const x = (i / cloudDensity) * width * 1.5 - width * 0.25;
            const y = bandY + Math.sin(i * 0.1) * bandHeight * 0.2;
            
            // Create organic cloud shapes
            const cloudSize = 40 + Math.random() * 120;
            const alpha = 0.08 + Math.random() * 0.12;
            
            // Vary the galactic colors
            const colors = [0xffffff, 0xfff8e1, 0xe8e8ff, 0xf0f0ff];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.milkyWayGraphics.fillStyle(color, alpha);
            this.milkyWayGraphics.fillCircle(x, y, cloudSize);
        }
        
        // Add dust lanes (darker areas)
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = bandY + (Math.random() - 0.5) * bandHeight;
            const size = 20 + Math.random() * 60;
            
            this.milkyWayGraphics.fillStyle(0x000000, 0.3);
            this.milkyWayGraphics.fillCircle(x, y, size);
        }
        
        // Add bright galactic center
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
            { x: width * 0.5, y: height * 0.7, color: 0x45b7d1, alpha: 0.1, size: 100, driftX: 0.06, driftY: -0.04 },  // Blue nebula
            { x: width * 0.1, y: height * 0.8, color: 0x9b59b6, alpha: 0.08, size: 80, driftX: -0.04, driftY: 0.08 },  // Purple nebula
            { x: width * 0.9, y: height * 0.2, color: 0xf39c12, alpha: 0.06, size: 90, driftX: 0.03, driftY: 0.06 }   // Orange nebula
        ];
        
        nebulaeData.forEach((nebula, index) => {
            const nebulaGraphics = this.add.graphics();
            
            // Store nebula object with movement properties
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
            
            // Generate layer data
            for (let layer = 0; layer < 5; layer++) {
                const layerSize = nebula.size * (1 - layer * 0.15);
                const layerAlpha = nebula.alpha * (1 - layer * 0.3);
                const layerData = [];
                
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = Math.random() * layerSize * 0.5;
                    const size = layerSize * (0.3 + Math.random() * 0.4);
                    
                    layerData.push({
                        angle: angle,
                        distance: distance,
                        size: size,
                        alpha: layerAlpha,
                        individualSpeed: 0.3 + Math.random() * 0.7, // Individual flow speed
                        driftPhase: Math.random() * Math.PI * 2, // Random phase offset
                        sizeVariation: 0.7 + Math.random() * 0.6, // Size variation
                        flowPhaseX: Math.random() * Math.PI * 2, // Flow phase for X direction
                        flowPhaseY: Math.random() * Math.PI * 2, // Flow phase for Y direction
                        flowAmplitudeX: 5 + Math.random() * 15, // Flow amplitude X
                        flowAmplitudeY: 3 + Math.random() * 10, // Flow amplitude Y
                        turbulenceScale: 0.01 + Math.random() * 0.02, // Turbulence frequency
                        spiralRadius: Math.random() * 20 + 10, // Spiral component radius
                        spiralSpeed: (Math.random() - 0.5) * 0.002 // Spiral speed
                    });
                }
                
                nebulaObj.layers.push(layerData);
            }
            
            this.nebulaClouds.push(nebulaObj);
        });
    }

    createForegroundStars(width, height) {
        this.twinkleGraphics = this.add.graphics();
        
        // Create prominent foreground stars
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
            // Calculate atmospheric twinkle
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
            
            // Calculate smooth drift movement
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
                    
                    // Create flowing turbulence like real nebulae
                    const turbulenceX = Math.sin(individualTime * cloudlet.turbulenceScale + cloudlet.flowPhaseX) * cloudlet.flowAmplitudeX;
                    const turbulenceY = Math.cos(individualTime * cloudlet.turbulenceScale * 0.7 + cloudlet.flowPhaseY) * cloudlet.flowAmplitudeY;
                    
                    // Add secondary turbulence for more complex flow
                    const turbulence2X = Math.sin(individualTime * cloudlet.turbulenceScale * 2.3 + cloudlet.flowPhaseX + 1) * cloudlet.flowAmplitudeX * 0.4;
                    const turbulence2Y = Math.cos(individualTime * cloudlet.turbulenceScale * 1.7 + cloudlet.flowPhaseY + 2) * cloudlet.flowAmplitudeY * 0.4;
                    
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
                    const x = nebula.currentX + baseX + turbulenceX + turbulence2X + spiralX;
                    const y = nebula.currentY + baseY + turbulenceY + turbulence2Y + spiralY;
                    
                    // Gentle size pulsing like gas clouds
                    const sizePulse1 = Math.sin(individualTime * 0.004 + cloudlet.driftPhase) * 3;
                    const sizePulse2 = Math.cos(individualTime * 0.007 + cloudlet.driftPhase + 1) * 2;
                    const size = cloudlet.size * cloudlet.sizeVariation + sizePulse1 + sizePulse2;
                    
                    // Gentle alpha variation like flowing gas
                    const alphaFlow = 0.85 + Math.sin(individualTime * 0.003 + cloudlet.driftPhase) * 0.15;
                    const alphaFlow2 = 0.9 + Math.cos(individualTime * 0.005 + cloudlet.driftPhase + 1) * 0.1;
                    
                    nebula.graphics.fillStyle(nebula.color, cloudlet.alpha * alphaFlow * alphaFlow2);
                    nebula.graphics.fillCircle(x, y, Math.max(1, size));
                });
            });
        });
    }

    update() {
        const currentTime = this.time.now;
        
        // Create meteors occasionally - one at a time, every 10 seconds
        if (currentTime - this.lastMeteorTime > 10000 && this.meteors.length === 0) {
            this.createMeteor();
            this.lastMeteorTime = currentTime;
        }
        
        // Update meteors manually
        this.updateMeteors();
        
        // Update black holes
        this.updateBlackHoles();
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
        
        // Create meteor head - appropriate size
        meteorGraphics.fillStyle(0xffeaa7, 0.9);
        meteorGraphics.fillCircle(0, 0, 4);
        meteorGraphics.fillStyle(0xffffff, 1);
        meteorGraphics.fillCircle(0, 0, 2);
        
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
            maxTrailLength: 20,
            scale: 1.0,
            alpha: 1.0,
            originalSize: 4
        };
        
        this.meteors.push(meteor);
        
        
        // Calculate initial velocity
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const duration = (distance / meteor.speed) * 1000;
        
        meteor.velocityX = (endX - startX) / (duration / 1000);
        meteor.velocityY = (endY - startY) / (duration / 1000);
        
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
                const size = Math.max(0.8, 4 * alpha);
                
                if (alpha > 0.1) {
                    // Orange glow (background)
                    meteor.trail.fillStyle(0xffeaa7, alpha * 0.7);
                    meteor.trail.fillCircle(pos.x, pos.y, size * 1.8);
                    
                    // Yellow middle
                    meteor.trail.fillStyle(0xffff88, alpha * 0.8);
                    meteor.trail.fillCircle(pos.x, pos.y, size * 1.2);
                    
                    // White core (bright center)
                    meteor.trail.fillStyle(0xffffff, alpha * 0.95);
                    meteor.trail.fillCircle(pos.x, pos.y, size * 0.6);
                }
            }
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

    onPointerDown(pointer) {
        this.createBlackHole(pointer.x, pointer.y);
    }

    createBlackHole(x, y) {
        const blackHole = {
            x: x,
            y: y,
            graphics: this.add.graphics(),
            createdAt: this.time.now,
            size: 0,
            maxSize: 80,
            rotation: 0,
            consumedStars: []
        };

        // Add swirling effect around black hole
        blackHole.accretionDisk = this.add.graphics();
        
        this.blackHoles.push(blackHole);

        // Animate black hole creation
        this.tweens.add({
            targets: blackHole,
            size: blackHole.maxSize,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Start countdown for destruction (3 seconds)
                this.time.delayedCall(3000, () => {
                    this.destroyBlackHole(blackHole);
                });
            }
        });
    }

    updateBlackHoles() {
        this.blackHoles.forEach((blackHole, index) => {
            if (!blackHole.graphics.active) {
                this.blackHoles.splice(index, 1);
                return;
            }

            // Update rotation for swirling effect
            blackHole.rotation += 0.05;

            // Clear and redraw black hole
            blackHole.graphics.clear();
            blackHole.accretionDisk.clear();

            // Draw accretion disk (swirling matter)
            const diskRadius = blackHole.size * 2;
            for (let i = 0; i < 60; i++) {
                const angle = (i / 60) * Math.PI * 2 + blackHole.rotation;
                const radius = blackHole.size * 1.2 + Math.sin(angle * 3) * 20;
                const x = blackHole.x + Math.cos(angle) * radius;
                const y = blackHole.y + Math.sin(angle) * radius;
                
                const alpha = 0.3 + Math.sin(angle * 2 + blackHole.rotation) * 0.2;
                const size = 1 + Math.sin(angle * 4) * 0.5;
                
                // Color varies from orange to red
                const colorIntensity = Math.sin(angle + blackHole.rotation * 2) * 0.5 + 0.5;
                const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    { r: 255, g: 140, b: 0 },  // Orange
                    { r: 255, g: 0, b: 0 },    // Red
                    1,
                    colorIntensity
                );
                
                blackHole.accretionDisk.fillStyle(
                    Phaser.Display.Color.GetColor(color.r, color.g, color.b), 
                    alpha
                );
                blackHole.accretionDisk.fillCircle(x, y, size);
            }

            // Draw event horizon (black center)
            blackHole.graphics.fillStyle(0x000000, 1);
            blackHole.graphics.fillCircle(blackHole.x, blackHole.y, blackHole.size * 0.8);
            
            // Draw gravitational lensing effect
            const lensRadius = blackHole.size * 1.5;
            blackHole.graphics.lineStyle(2, 0x666666, 0.3);
            blackHole.graphics.strokeCircle(blackHole.x, blackHole.y, lensRadius);
            
            // Subtle outer glow
            blackHole.graphics.lineStyle(1, 0x333333, 0.2);
            blackHole.graphics.strokeCircle(blackHole.x, blackHole.y, lensRadius * 1.3);

            // Distort and consume nearby stars
            this.distortAndConsumeStars(blackHole);
            
            // Affect nearby meteors
            this.affectMeteors(blackHole);
        });
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
                
                // Remove star from array
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
                
                // Calculate much stronger pull force
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


    // Removed meteor absorption effect - meteors now disappear silently

    destroyBlackHole(blackHole) {
        // Restore consumed stars first
        this.restoreConsumedStars(blackHole);
        
        // Animate destruction
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
                // Calculate random position around black hole
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
        
        // Recreate scene
        this.createDeepSpaceBackground(width, height);
        this.createDistantStars(width, height);
        this.createNebulae(width, height);
        this.createForegroundStars(width, height);
        this.startAtmosphericEffects();
    }
}

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