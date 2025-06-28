class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.stars = [];
        this.planets = [];
        this.nebula = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
    }

    preload() {
        this.createSpaceTextures();
    }

    create() {
        this.cameras.main.setBackgroundColor('0x0a0a1a');
        
        this.createSpaceBackground();
        this.createInteractiveEffects();
        this.setupMouseTracking();
        this.createAmbientEffects();
    }

    createSpaceTextures() {
        // Small stars - 더 부드러운 원형
        const starGraphics = this.add.graphics();
        starGraphics.fillStyle(0xffffff, 1);
        starGraphics.fillCircle(4, 4, 3);
        starGraphics.fillStyle(0xffffff, 0.5);
        starGraphics.fillCircle(4, 4, 4);
        starGraphics.generateTexture('star', 8, 8);
        starGraphics.destroy();

        // Medium stars with glow - 더 큰 원형
        const mediumStarGraphics = this.add.graphics();
        mediumStarGraphics.fillStyle(0xffffff, 1);
        mediumStarGraphics.fillCircle(8, 8, 4);
        mediumStarGraphics.fillStyle(0xffffff, 0.6);
        mediumStarGraphics.fillCircle(8, 8, 6);
        mediumStarGraphics.fillStyle(0xffffff, 0.2);
        mediumStarGraphics.fillCircle(8, 8, 8);
        mediumStarGraphics.generateTexture('mediumStar', 16, 16);
        mediumStarGraphics.destroy();

        // Large stars - 가장 부드러운 원형
        const largeStarGraphics = this.add.graphics();
        largeStarGraphics.fillStyle(0xffffff, 1);
        largeStarGraphics.fillCircle(12, 12, 6);
        largeStarGraphics.fillStyle(0x88aaff, 0.7);
        largeStarGraphics.fillCircle(12, 12, 8);
        largeStarGraphics.fillStyle(0x88aaff, 0.3);
        largeStarGraphics.fillCircle(12, 12, 12);
        largeStarGraphics.generateTexture('largeStar', 24, 24);
        largeStarGraphics.destroy();

        // Nebula particle - 더 큰 부드러운 원형
        const nebulaGraphics = this.add.graphics();
        nebulaGraphics.fillStyle(0x6644ff, 0.4);
        nebulaGraphics.fillCircle(16, 16, 8);
        nebulaGraphics.fillStyle(0x4466ff, 0.25);
        nebulaGraphics.fillCircle(16, 16, 12);
        nebulaGraphics.fillStyle(0x6644ff, 0.1);
        nebulaGraphics.fillCircle(16, 16, 16);
        nebulaGraphics.generateTexture('nebula', 32, 32);
        nebulaGraphics.destroy();

        // Planet - 더 부드러운 원형
        const planetGraphics = this.add.graphics();
        planetGraphics.fillStyle(0x64ffda, 0.9);
        planetGraphics.fillCircle(16, 16, 8);
        planetGraphics.fillStyle(0x64ffda, 0.5);
        planetGraphics.fillCircle(16, 16, 12);
        planetGraphics.fillStyle(0x64ffda, 0.2);
        planetGraphics.fillCircle(16, 16, 16);
        planetGraphics.generateTexture('planet', 32, 32);
        planetGraphics.destroy();
    }

    createSpaceBackground() {
        const isMobile = window.innerWidth <= 768;
        const starCount = isMobile ? 150 : 300;
        const nebulaCount = isMobile ? 15 : 30;
        
        // Create background stars
        for (let i = 0; i < starCount; i++) {
            const starType = Math.random();
            let texture, scale, alpha;
            
            if (starType < 0.7) {
                texture = 'star';
                scale = Phaser.Math.FloatBetween(0.5, 1.2);
                alpha = Phaser.Math.FloatBetween(0.3, 0.9);
            } else if (starType < 0.9) {
                texture = 'mediumStar';
                scale = Phaser.Math.FloatBetween(0.8, 1.5);
                alpha = Phaser.Math.FloatBetween(0.6, 1);
            } else {
                texture = 'largeStar';
                scale = Phaser.Math.FloatBetween(0.6, 1.2);
                alpha = Phaser.Math.FloatBetween(0.7, 1);
            }
            
            const star = this.add.image(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                texture
            );
            
            star.setAlpha(alpha);
            star.setScale(scale);
            star.originalAlpha = alpha;
            star.twinkleSpeed = Phaser.Math.FloatBetween(0.01, 0.03);
            
            // Add subtle movement
            star.velocityX = Phaser.Math.FloatBetween(-0.2, 0.2);
            star.velocityY = Phaser.Math.FloatBetween(-0.2, 0.2);
            
            this.stars.push(star);
        }
        
        // Create nebula clouds
        for (let i = 0; i < nebulaCount; i++) {
            const nebula = this.add.image(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                'nebula'
            );
            
            nebula.setAlpha(Phaser.Math.FloatBetween(0.1, 0.3));
            nebula.setScale(Phaser.Math.FloatBetween(2, 6));
            nebula.setTint(Phaser.Math.Between(0x4444ff, 0x8844ff));
            
            // Slow rotation
            nebula.rotationSpeed = Phaser.Math.FloatBetween(-0.001, 0.001);
            
            this.nebula.push(nebula);
        }
        
        // Create a few distant planets
        for (let i = 0; i < 3; i++) {
            const planet = this.add.image(
                Phaser.Math.Between(50, this.scale.width - 50),
                Phaser.Math.Between(50, this.scale.height - 50),
                'planet'
            );
            
            planet.setAlpha(Phaser.Math.FloatBetween(0.4, 0.7));
            planet.setScale(Phaser.Math.FloatBetween(0.5, 1.2));
            
            const colors = [0x64ffda, 0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24];
            planet.setTint(colors[Math.floor(Math.random() * colors.length)]);
            
            // Orbital motion
            planet.orbitCenterX = planet.x;
            planet.orbitCenterY = planet.y;
            planet.orbitRadius = Phaser.Math.Between(20, 60);
            planet.orbitSpeed = Phaser.Math.FloatBetween(0.001, 0.005);
            planet.orbitAngle = Math.random() * Math.PI * 2;
            
            this.planets.push(planet);
        }
    }

    createInteractiveEffects() {
        const profileImage = document.querySelector('.pop-pic img');
        const socialLinks = document.querySelectorAll('.pop-sns a');
        
        if (profileImage) {
            profileImage.addEventListener('mouseenter', () => {
                this.createBurstEffect(this.scale.width / 2, this.scale.height * 0.35);
            });
        }

        socialLinks.forEach((link, index) => {
            link.addEventListener('mouseenter', () => {
                const rect = link.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                this.createSparkleEffect(x, y);
            });
        });
    }

    createBurstEffect(x, y) {
        // Create cosmic explosion effect
        for (let i = 0; i < 20; i++) {
            const burstParticle = this.add.image(x, y, 'largeStar');
            burstParticle.setAlpha(1);
            burstParticle.setScale(0.3);
            burstParticle.setTint(Phaser.Math.Between(0x64ffda, 0xffffff));
            
            const angle = (i / 20) * Math.PI * 2;
            const speed = Phaser.Math.Between(80, 200);
            
            this.tweens.add({
                targets: burstParticle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    burstParticle.destroy();
                }
            });
        }
        
        // Add nebula burst
        for (let i = 0; i < 5; i++) {
            const nebulaBurst = this.add.image(x, y, 'nebula');
            nebulaBurst.setAlpha(0.6);
            nebulaBurst.setScale(0.5);
            nebulaBurst.setTint(0x8844ff);
            
            this.tweens.add({
                targets: nebulaBurst,
                alpha: 0,
                scale: 3,
                duration: 1200,
                ease: 'Power1',
                onComplete: () => {
                    nebulaBurst.destroy();
                }
            });
        }
    }

    createSparkleEffect(x, y) {
        // Create cosmic sparkle effect
        for (let i = 0; i < 12; i++) {
            const sparkle = this.add.image(x, y, 'mediumStar');
            sparkle.setAlpha(1);
            sparkle.setScale(0.6);
            sparkle.setTint(0xffd700);
            
            const offsetX = Phaser.Math.Between(-40, 40);
            const offsetY = Phaser.Math.Between(-40, 40);
            
            this.tweens.add({
                targets: sparkle,
                x: x + offsetX,
                y: y + offsetY,
                alpha: 0,
                scale: 0.1,
                rotation: Math.PI * 2,
                duration: 800,
                ease: 'Power1',
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
        
        // Add shooting star effect
        const shootingStar = this.add.image(x - 50, y, 'largeStar');
        shootingStar.setAlpha(0.8);
        shootingStar.setScale(0.4);
        shootingStar.setTint(0x64ffda);
        
        this.tweens.add({
            targets: shootingStar,
            x: x + 100,
            y: y + 20,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                shootingStar.destroy();
            }
        });
    }

    createAmbientEffects() {
        // Create occasional shooting stars
        this.time.addEvent({
            delay: 3000,
            callback: this.createShootingStar,
            callbackScope: this,
            loop: true
        });
        
        // Create pulsing distant stars
        const isMobile = window.innerWidth <= 768;
        const pulseStarCount = isMobile ? 5 : 10;
        
        for (let i = 0; i < pulseStarCount; i++) {
            const pulseStar = this.add.image(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                'largeStar'
            );
            
            pulseStar.setAlpha(0.3);
            pulseStar.setScale(0.5);
            pulseStar.setTint(Phaser.Math.Between(0x64ffda, 0xffffff));
            
            this.tweens.add({
                targets: pulseStar,
                alpha: 0.8,
                scale: 1.2,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    createShootingStar() {
        const startX = this.scale.width + 50;
        const startY = Phaser.Math.Between(0, this.scale.height);
        const endX = -50;
        const endY = startY + Phaser.Math.Between(-200, 200);
        
        const shootingStar = this.add.image(startX, startY, 'largeStar');
        shootingStar.setAlpha(0.8);
        shootingStar.setScale(0.6);
        shootingStar.setTint(0xffffff);
        
        // Trail effect
        const trail = this.add.image(startX, startY, 'nebula');
        trail.setAlpha(0.3);
        trail.setScale(0.8);
        trail.setTint(0x64ffda);
        
        this.tweens.add({
            targets: [shootingStar, trail],
            x: endX,
            y: endY,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                shootingStar.destroy();
                trail.destroy();
            }
        });
    }

    setupMouseTracking() {
        this.input.on('pointermove', (pointer) => {
            this.mouseX = pointer.x;
            this.mouseY = pointer.y;
        });
        
        this.input.on('pointerdown', (pointer) => {
            this.createBurstEffect(pointer.x, pointer.y);
        });
    }

    update() {
        this.time += 0.01;
        
        // Update stars with twinkling and mouse interaction
        this.stars.forEach((star, index) => {
            // Subtle movement
            star.x += star.velocityX;
            star.y += star.velocityY;
            
            // Twinkling effect
            const twinkle = Math.sin(this.time * star.twinkleSpeed + index) * 0.3;
            star.setAlpha(star.originalAlpha + twinkle);
            
            // Mouse interaction
            const distance = Phaser.Math.Distance.Between(
                star.x, star.y, 
                this.mouseX, this.mouseY
            );
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                star.setAlpha(star.originalAlpha + force * 0.5);
                star.setScale(star.scaleX + force * 0.5);
            } else {
                star.setScale(star.scaleX * 0.99 + 0.01);
            }
            
            // Wrap around screen
            if (star.x < -10) star.x = this.scale.width + 10;
            if (star.x > this.scale.width + 10) star.x = -10;
            if (star.y < -10) star.y = this.scale.height + 10;
            if (star.y > this.scale.height + 10) star.y = -10;
        });
        
        // Update nebula clouds
        this.nebula.forEach((cloud) => {
            cloud.rotation += cloud.rotationSpeed;
        });
        
        // Update planets with orbital motion
        this.planets.forEach((planet) => {
            planet.orbitAngle += planet.orbitSpeed;
            planet.x = planet.orbitCenterX + Math.cos(planet.orbitAngle) * planet.orbitRadius;
            planet.y = planet.orbitCenterY + Math.sin(planet.orbitAngle) * planet.orbitRadius;
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser-game',
    transparent: true,
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
    
    window.addEventListener('resize', () => {
        game.scale.setGameSize(window.innerWidth, window.innerHeight);
    });
});