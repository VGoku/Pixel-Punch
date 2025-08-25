// Enemy management system

const Enemies = {
    spawnEnemy() {
        const types = Object.keys(ENEMY_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        const config = ENEMY_TYPES[type];
        
        const enemy = {
            type,
            x: Math.random() * (game.canvas.width - config.size),
            y: -config.size,
            health: config.health,
            maxHealth: config.health,
            zone: Math.floor(Math.random() * 4), // 0=q, 1=w, 2=e, 3=r
            ...config
        };
        
        game.enemies.push(enemy);
    },

    updateEnemy(enemy) {
        let speed = enemy.speed;
        
        // Apply modifiers
        if (game.modifiers.active.includes('slowmo')) speed *= 0.3;
        if (game.modifiers.active.includes('gravity')) speed *= -0.5;
        
        enemy.y += speed;
        
        // Update position based on zone
        const zoneWidth = game.canvas.width / 4;
        const targetX = enemy.zone * zoneWidth + zoneWidth / 2 - enemy.size / 2;
        enemy.x += (targetX - enemy.x) * 0.1;
    },

    drawEnemy(enemy) {
        let size = enemy.size;
        
        // Apply modifiers
        if (game.modifiers.active.includes('bighead')) {
            size *= 1.8;
        }
        
        game.ctx.save();
        
        // Set alpha for ghost enemies
        if (enemy.type === 'ghost') {
            game.ctx.globalAlpha = enemy.alpha || 0.3;
        }
        
        // Main body
        game.ctx.fillStyle = enemy.color;
        game.ctx.fillRect(enemy.x, enemy.y, size, size);
        
        // Health bar for multi-hit enemies
        if (enemy.maxHealth > 1) {
            const healthWidth = size;
            const healthHeight = 4;
            const healthPercent = enemy.health / enemy.maxHealth;
            
            game.ctx.fillStyle = '#333';
            game.ctx.fillRect(enemy.x, enemy.y - 8, healthWidth, healthHeight);
            
            game.ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
            game.ctx.fillRect(enemy.x, enemy.y - 8, healthWidth * healthPercent, healthHeight);
        }
        
        // Eyes
        game.ctx.fillStyle = '#fff';
        game.ctx.fillRect(enemy.x + size * 0.2, enemy.y + size * 0.2, size * 0.15, size * 0.15);
        game.ctx.fillRect(enemy.x + size * 0.65, enemy.y + size * 0.2, size * 0.15, size * 0.15);
        
        // Pupils
        game.ctx.fillStyle = '#000';
        game.ctx.fillRect(enemy.x + size * 0.22, enemy.y + size * 0.22, size * 0.1, size * 0.1);
        game.ctx.fillRect(enemy.x + size * 0.67, enemy.y + size * 0.22, size * 0.1, size * 0.1);
        
        // Special effects for explosive enemies
        if (enemy.type === 'explosive') {
            const glowIntensity = Math.sin(game.frameCount * 0.3) * 0.3 + 0.7;
            game.ctx.shadowColor = enemy.color;
            game.ctx.shadowBlur = 15 * glowIntensity;
            game.ctx.fillRect(enemy.x, enemy.y, size, size);
            game.ctx.shadowBlur = 0;
        }
        
        game.ctx.restore();
    },

    hitEnemy(enemy, index) {
        enemy.health--;
        
        // Create hit particles
        Effects.createParticles(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2, enemy.color);
        
        if (enemy.health <= 0) {
            // Enemy defeated
            game.score += enemy.points * (1 + game.combo * 0.1);
            game.enemiesDefeated++;
            game.enemies.splice(index, 1);
            
            // Special effects for different enemy types
            if (enemy.type === 'explosive') {
                Effects.createExplosion(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2);
            }
        }
    }
};