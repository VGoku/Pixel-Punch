// Visual effects and particle system

const Effects = {
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            game.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1,
                size: Math.random() * 4 + 2
            });
        }
    },

    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            game.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                color: '#ffff40',
                life: 60,
                maxLife: 60,
                alpha: 1,
                size: Math.random() * 8 + 4
            });
        }
    },

    drawParticle(particle) {
        game.ctx.save();
        game.ctx.globalAlpha = particle.alpha;
        game.ctx.fillStyle = particle.color;
        
        const size = particle.size * (particle.life / particle.maxLife);
        game.ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
        
        game.ctx.restore();
    },

    drawStorm() {
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * game.canvas.width;
            const y = Math.random() * game.canvas.height;
            const size = Math.random() * 3 + 1;
            
            game.ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.5})`;
            game.ctx.fillRect(x, y, size, size);
        }
    },

    triggerChaosModifier() {
        const modifier = CHAOS_MODIFIERS[Math.floor(Math.random() * CHAOS_MODIFIERS.length)];
        
        game.modifiers.active = [modifier.effect];
        game.modifiers.duration = modifier.duration;
        
        document.getElementById('modifierDisplay').textContent = modifier.name;
        
        // Apply visual effects
        if (modifier.effect === 'glitch') {
            document.querySelector('.game-container').classList.add('glitch');
            setTimeout(() => document.querySelector('.game-container').classList.remove('glitch'), modifier.duration * 16);
        }
    },

    screenShake() {
        document.querySelector('.game-container').classList.add('screen-shake');
        setTimeout(() => document.querySelector('.game-container').classList.remove('screen-shake'), 300);
    },

    flashEffect() {
        game.canvas.style.filter = 'brightness(2)';
        setTimeout(() => game.canvas.style.filter = 'none', 200);
    },

    addScreenEffects() {
        // Add screen curvature effect
        const style = document.createElement('style');
        style.textContent = `
            .game-container::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.3) 100%);
                pointer-events: none;
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }
};