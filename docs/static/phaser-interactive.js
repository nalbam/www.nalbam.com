class RealisticSpaceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RealisticSpaceScene' });
        this.stars = [];
        this.meteorShowers = [];
        this.nebulaClouds = [];
        this.twinkleGraphics = null;
        this.milkyWayGraphics = null;
        this.backgroundGraphics = null;
        this.lastMeteorTime = 0;
        this.atmosphericDistortion = 0;
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
            
            // Draw star
            this.twinkleGraphics.fillStyle(star.color, finalBrightness);
            this.twinkleGraphics.fillCircle(star.x, star.y, finalSize);
            
            // Add diffraction spikes for brighter stars
            if (star.size > 1.5) {
                const spikeLength = star.size * 3;
                const spikeAlpha = finalBrightness * 0.6;
                this.twinkleGraphics.lineStyle(0.5, star.color, spikeAlpha);
                
                // Vertical spike
                this.twinkleGraphics.lineBetween(
                    star.x, star.y - spikeLength,
                    star.x, star.y + spikeLength
                );
                
                // Horizontal spike
                this.twinkleGraphics.lineBetween(
                    star.x - spikeLength, star.y,
                    star.x + spikeLength, star.y
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
    }

    createMeteor() {
        const { width, height } = this.scale;
        
        // Random entry point
        const side = Math.floor(Math.random() * 4);
        let startX, startY, endX, endY;
        
        switch (side) {
            case 0: // Top
                startX = Math.random() * width;
                startY = -20;
                endX = startX + (Math.random() - 0.5) * 400;
                endY = Math.random() * height;
                break;
            case 1: // Right
                startX = width + 20;
                startY = Math.random() * height;
                endX = Math.random() * width;
                endY = startY + (Math.random() - 0.5) * 400;
                break;
            case 2: // Bottom
                startX = Math.random() * width;
                startY = height + 20;
                endX = startX + (Math.random() - 0.5) * 400;
                endY = Math.random() * height;
                break;
            case 3: // Left
                startX = -20;
                startY = Math.random() * height;
                endX = Math.random() * width;
                endY = startY + (Math.random() - 0.5) * 400;
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
        
        // Animate meteor
        this.tweens.add({
            targets: [meteorGraphics, meteorTrail],
            x: endX,
            y: endY,
            duration: 1500 + Math.random() * 1000,
            ease: 'Linear',
            onComplete: () => {
                // Fade out
                this.tweens.add({
                    targets: [meteorGraphics, meteorTrail],
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        meteorGraphics.destroy();
                        meteorTrail.destroy();
                    }
                });
            }
        });
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;
        
        // Clear all graphics
        this.children.removeAll(true);
        this.stars = [];
        this.meteorShowers = [];
        
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
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
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