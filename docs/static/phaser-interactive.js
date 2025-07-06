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
            console.log('Pointer up at:', pointer.x, pointer.y);
            this.createBlackHole(pointer.x, pointer.y);
        });
        
        // Create invisible interactive zone
        const zone = this.add.zone(width/2, height/2, width, height);
        zone.setInteractive();
        zone.on('pointerdown', (pointer) => {
            console.log('Zone clicked at:', pointer.x, pointer.y);
            this.createBlackHole(pointer.x, pointer.y);
        });
        
        // Alternative click detection
        this.input.setDefaultCursor('pointer');
        this.input.topOnly = false;
        
        // Debug log
        console.log('Mouse interaction enabled with zone');
        
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
            { x: width * 0.2, y: height * 0.3, color: 0xff6b6b, alpha: 0.15, size: 150 }, // Red nebula
            { x: width * 0.8, y: height * 0.6, color: 0x4ecdc4, alpha: 0.12, size: 120 }, // Cyan nebula
            { x: width * 0.5, y: height * 0.7, color: 0x45b7d1, alpha: 0.1, size: 100 },  // Blue nebula
            { x: width * 0.1, y: height * 0.8, color: 0x9b59b6, alpha: 0.08, size: 80 },  // Purple nebula
            { x: width * 0.9, y: height * 0.2, color: 0xf39c12, alpha: 0.06, size: 90 }   // Orange nebula
        ];
        
        nebulaeData.forEach(nebula => {
            const nebulaGraphics = this.add.graphics();
            
            // Create organic nebula shape with multiple layers
            for (let layer = 0; layer < 5; layer++) {
                const layerSize = nebula.size * (1 - layer * 0.15);
                const layerAlpha = nebula.alpha * (1 - layer * 0.3);
                
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = Math.random() * layerSize * 0.5;
                    const x = nebula.x + Math.cos(angle) * distance;
                    const y = nebula.y + Math.sin(angle) * distance;
                    const size = layerSize * (0.3 + Math.random() * 0.4);
                    
                    nebulaGraphics.fillStyle(nebula.color, layerAlpha);
                    nebulaGraphics.fillCircle(x, y, size);
                }
            }
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

    update() {
        const currentTime = this.time.now;
        
        // Create meteors occasionally
        if (currentTime - this.lastMeteorTime > 5000) {
            if (Math.random() < 0.3) {
                this.createMeteor();
                this.lastMeteorTime = currentTime;
            }
        }
        
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
        
        // Create meteor head
        meteorGraphics.fillStyle(0xffffff, 1);
        meteorGraphics.fillCircle(0, 0, 2);
        meteorGraphics.fillStyle(0xffeaa7, 0.8);
        meteorGraphics.fillCircle(0, 0, 4);
        
        // Create meteor trail
        const trailLength = 60;
        for (let i = 0; i < trailLength; i++) {
            const alpha = 1 - (i / trailLength);
            const size = 2 * alpha;
            meteorTrail.fillStyle(0xffffff, alpha * 0.8);
            meteorTrail.fillCircle(-i * 2, 0, size);
            meteorTrail.fillStyle(0xffeaa7, alpha * 0.6);
            meteorTrail.fillCircle(-i * 2, 0, size * 1.5);
        }
        
        meteorGraphics.setPosition(startX, startY);
        meteorTrail.setPosition(startX, startY);
        
        const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
        meteorGraphics.setRotation(angle);
        meteorTrail.setRotation(angle);
        
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
            isActive: true,
            speed: 2.5,
            angle: angle
        };
        
        this.meteors.push(meteor);
        
        // Calculate duration based on distance for consistent speed
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const speed = 200; // pixels per second
        const duration = (distance / speed) * 1000;
        
        // Animate meteor
        this.tweens.add({
            targets: [meteorGraphics, meteorTrail],
            x: endX,
            y: endY,
            duration: duration,
            ease: 'Linear',
            onUpdate: () => {
                meteor.currentX = meteorGraphics.x;
                meteor.currentY = meteorGraphics.y;
            },
            onComplete: () => {
                this.removeMeteor(meteor);
            }
        });
    }

    removeMeteor(meteor) {
        // Remove meteor from tracking array
        const index = this.meteors.indexOf(meteor);
        if (index > -1) {
            this.meteors.splice(index, 1);
        }
        
        // Fade out and destroy
        this.tweens.add({
            targets: [meteor.graphics, meteor.trail],
            alpha: 0,
            duration: 200,
            onComplete: () => {
                meteor.graphics.destroy();
                meteor.trail.destroy();
            }
        });
    }

    onPointerDown(pointer) {
        // Debug log
        console.log('Clicked at:', pointer.x, pointer.y);
        
        // Create black hole at click position
        this.createBlackHole(pointer.x, pointer.y);
    }

    createBlackHole(x, y) {
        console.log('Creating black hole at:', x, y);
        
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
        
        console.log('Black holes count:', this.blackHoles.length);

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
        const maxDistance = blackHole.size * 6;
        const consumeDistance = blackHole.size * 2.5;
        const strongPullDistance = blackHole.size * 4;
        
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            if (!meteor.isActive) continue;
            
            const distance = Phaser.Math.Distance.Between(
                meteor.currentX, meteor.currentY, blackHole.x, blackHole.y
            );
            
            if (distance < consumeDistance) {
                // Meteor gets consumed by black hole
                console.log('Meteor consumed by black hole! Distance:', distance);
                
                // Create spectacular absorption effect
                this.createMeteorAbsorptionEffect(meteor.currentX, meteor.currentY, blackHole.x, blackHole.y);
                
                // Stop the original tween
                this.tweens.killTweensOf([meteor.graphics, meteor.trail]);
                
                // Remove meteor
                meteor.isActive = false;
                this.removeMeteor(meteor);
                
            } else if (distance < strongPullDistance) {
                // Strong gravitational pull - redirect meteor towards black hole
                const pullStrength = (strongPullDistance - distance) / strongPullDistance;
                
                // Stop current tween
                this.tweens.killTweensOf([meteor.graphics, meteor.trail]);
                
                // Calculate direct path to black hole with some spiral
                const angleToBlackHole = Phaser.Math.Angle.Between(
                    meteor.currentX, meteor.currentY, blackHole.x, blackHole.y
                );
                
                // Add spiral effect based on pull strength
                const spiralOffset = pullStrength * 0.5;
                const newAngle = angleToBlackHole + spiralOffset;
                
                // Calculate new target - closer to black hole
                const pullDistance = distance * (1 - pullStrength * 0.8);
                const newEndX = blackHole.x + Math.cos(angleToBlackHole) * pullDistance;
                const newEndY = blackHole.y + Math.sin(angleToBlackHole) * pullDistance;
                
                meteor.angle = newAngle;
                meteor.endX = newEndX;
                meteor.endY = newEndY;
                
                // Update rotation
                meteor.graphics.setRotation(newAngle);
                meteor.trail.setRotation(newAngle);
                
                // Accelerate towards black hole
                const newDuration = Math.max(300, 1000 * (1 - pullStrength));
                
                this.tweens.add({
                    targets: [meteor.graphics, meteor.trail],
                    x: newEndX,
                    y: newEndY,
                    duration: newDuration,
                    ease: 'Power2',
                    onUpdate: () => {
                        meteor.currentX = meteor.graphics.x;
                        meteor.currentY = meteor.graphics.y;
                    },
                    onComplete: () => {
                        // Check if still active after tween
                        if (meteor.isActive) {
                            this.removeMeteor(meteor);
                        }
                    }
                });
                
            } else if (distance < maxDistance) {
                // Light gravitational deflection
                const pullStrength = (maxDistance - distance) / maxDistance;
                const angleToBlackHole = Phaser.Math.Angle.Between(
                    meteor.currentX, meteor.currentY, blackHole.x, blackHole.y
                );
                
                // Slight deflection
                const deflectionStrength = pullStrength * 0.3;
                const newAngle = meteor.angle + deflectionStrength;
                
                // Update meteor direction - continue to screen edge
                const { width, height } = this.scale;
                const directionDistance = 1000; // Far enough to reach screen edge
                let newEndX = meteor.currentX + Math.cos(newAngle) * directionDistance;
                let newEndY = meteor.currentY + Math.sin(newAngle) * directionDistance;
                
                // Clamp to screen boundaries with buffer
                if (newEndX < -50) newEndX = -50;
                if (newEndX > width + 50) newEndX = width + 50;
                if (newEndY < -50) newEndY = -50;
                if (newEndY > height + 50) newEndY = height + 50;
                
                // Stop current tween and start new one with deflected path
                this.tweens.killTweensOf([meteor.graphics, meteor.trail]);
                
                meteor.angle = newAngle;
                meteor.endX = newEndX;
                meteor.endY = newEndY;
                
                // Apply visual bend to the meteor
                meteor.graphics.setRotation(newAngle);
                meteor.trail.setRotation(newAngle);
                
                // Continue with new trajectory - calculate proper duration
                const newDistance = Phaser.Math.Distance.Between(
                    meteor.currentX, meteor.currentY, newEndX, newEndY
                );
                const newDuration = (newDistance / 200) * 1000; // 200 pixels per second
                
                this.tweens.add({
                    targets: [meteor.graphics, meteor.trail],
                    x: newEndX,
                    y: newEndY,
                    duration: Math.max(500, newDuration),
                    ease: 'Linear',
                    onUpdate: () => {
                        meteor.currentX = meteor.graphics.x;
                        meteor.currentY = meteor.graphics.y;
                    },
                    onComplete: () => {
                        this.removeMeteor(meteor);
                    }
                });
            }
        }
    }

    createMeteorAbsorptionEffect(meteorX, meteorY, blackHoleX, blackHoleY) {
        // Create dramatic absorption effect for meteors
        const graphics = this.add.graphics();
        const particles = [];
        
        // Create more particles for meteors than stars
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: meteorX + (Math.random() - 0.5) * 20,
                y: meteorY + (Math.random() - 0.5) * 20,
                angle: Math.random() * Math.PI * 2,
                speed: 3 + Math.random() * 4,
                size: 1 + Math.random() * 2,
                color: Math.random() < 0.5 ? 0xffffff : 0xffeaa7
            });
        }
        
        // Create flash effect
        const flashGraphics = this.add.graphics();
        flashGraphics.fillStyle(0xffffff, 0.8);
        flashGraphics.fillCircle(meteorX, meteorY, 20);
        
        this.tweens.add({
            targets: flashGraphics,
            alpha: 0,
            duration: 300,
            onComplete: () => flashGraphics.destroy()
        });
        
        const updateParticles = () => {
            graphics.clear();
            
            particles.forEach((particle, index) => {
                // Move particle towards black hole with spiral motion
                const angle = Phaser.Math.Angle.Between(particle.x, particle.y, blackHoleX, blackHoleY);
                const spiralAngle = angle + Math.sin(this.time.now * 0.01 + index) * 0.3;
                
                particle.x += Math.cos(spiralAngle) * particle.speed;
                particle.y += Math.sin(spiralAngle) * particle.speed;
                
                // Draw particle with trail effect
                const alpha = 1 - (index * 0.05);
                graphics.fillStyle(particle.color, alpha);
                graphics.fillCircle(particle.x, particle.y, particle.size);
                
                // Add glow effect for meteor particles
                graphics.fillStyle(particle.color, alpha * 0.3);
                graphics.fillCircle(particle.x, particle.y, particle.size * 3);
                
                // Remove if close to black hole
                const distance = Phaser.Math.Distance.Between(particle.x, particle.y, blackHoleX, blackHoleY);
                if (distance < 15) {
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length === 0) {
                graphics.destroy();
            }
        };
        
        this.tweens.add({
            targets: {},
            duration: 50,
            repeat: 60,
            onRepeat: updateParticles,
            onComplete: () => graphics.destroy()
        });
    }

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