// Game state management

// Main game state object
const game = {
    canvas: null,
    ctx: null,
    state: 'menu', // 'menu', 'playing', 'paused', 'gameOver'
    mode: 'classic',
    score: 0,
    level: 1,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    chaosMeters: 0,
    enemiesDefeated: 0,
    enemies: [],
    particles: [],
    keys: { q: false, w: false, e: false, r: false },
    punchCooldown: 0,
    frameCount: 0,
    modifiers: {
        active: [],
        duration: 0
    }
};

// Game state management functions
const GameState = {
    startGame(mode) {
        game.mode = mode;
        const modeConfig = GAME_MODES[mode];
        
        // Reset game state
        game.score = 0;
        game.level = 1;
        game.lives = modeConfig.lives;
        game.combo = 0;
        game.maxCombo = 0;
        game.chaosMeters = 0;
        game.enemiesDefeated = 0;
        game.enemies = [];
        game.particles = [];
        game.frameCount = 0;
        game.punchCooldown = 0;
        game.modifiers.active = [];
        game.modifiers.duration = 0;
        
        game.state = 'playing';
        UI.showScreen('gameScreen');
        UI.updateUI();
        
        // Start game loop
        this.gameLoop();
    },

    gameLoop() {
        if (game.state !== 'playing') return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    },

    update() {
        game.frameCount++;
        
        // Update cooldowns
        if (game.punchCooldown > 0) game.punchCooldown--;
        
        // Spawn enemies
        if (game.frameCount % Math.max(60 - game.level * 2, 20) === 0) {
            Enemies.spawnEnemy();
        }
        
        // Update enemies
        game.enemies.forEach((enemy, index) => {
            Enemies.updateEnemy(enemy);
            
            // Remove enemies that went off screen (lose life)
            if (enemy.y > game.canvas.height + 50) {
                game.enemies.splice(index, 1);
                this.loseLife();
            }
        });
        
        // Update particles
        game.particles = game.particles.filter(particle => {
            particle.life--;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
        
        // Update modifiers
        if (game.modifiers.duration > 0) {
            game.modifiers.duration--;
            if (game.modifiers.duration <= 0) {
                game.modifiers.active = [];
                document.getElementById('modifierDisplay').textContent = '';
            }
        }
        
        // Level progression
        if (game.enemiesDefeated >= game.level * 10) {
            game.level++;
            UI.updateUI();
            
            // Trigger chaos modifier in chaos mode
            if (GAME_MODES[game.mode].chaosEnabled && Math.random() < 0.7) {
                Effects.triggerChaosModifier();
            }
        }
    },

    render() {
        // Clear canvas
        game.ctx.fillStyle = '#000011';
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        
        // Apply modifiers to rendering
        game.ctx.save();
        
        if (game.modifiers.active.includes('mirror')) {
            game.ctx.scale(-1, 1);
            game.ctx.translate(-game.canvas.width, 0);
        }
        
        if (game.modifiers.active.includes('colorshift')) {
            game.ctx.filter = `hue-rotate(${game.frameCount * 2}deg)`;
        }
        
        // Draw punch zones on canvas
        this.drawPunchZones();
        
        // Draw enemies
        game.enemies.forEach(enemy => {
            Enemies.drawEnemy(enemy);
        });
        
        // Draw particles
        game.particles.forEach(particle => {
            Effects.drawParticle(particle);
        });
        
        // Draw storm effect
        if (game.modifiers.active.includes('storm')) {
            Effects.drawStorm();
        }
        
        game.ctx.restore();
    },

    drawPunchZones() {
        const zoneWidth = game.canvas.width / 4;
        const zoneHeight = 150;
        const zoneY = game.canvas.height - zoneHeight;
        
        game.ctx.strokeStyle = '#00ff0040';
        game.ctx.lineWidth = 2;
        
        for (let i = 0; i < 4; i++) {
            const x = i * zoneWidth;
            game.ctx.strokeRect(x, zoneY, zoneWidth, zoneHeight);
            
            // Draw zone label
            game.ctx.fillStyle = '#00ff0060';
            game.ctx.font = 'bold 24px Courier New';
            game.ctx.textAlign = 'center';
            game.ctx.fillText(['Q', 'W', 'E', 'R'][i], x + zoneWidth / 2, zoneY + 30);
        }
    },

    loseLife() {
        game.lives--;
        game.combo = 0;
        
        if (game.lives <= 0) {
            this.gameOver();
        } else {
            UI.updateUI();
            
            // Flash effect
            game.canvas.style.filter = 'brightness(2)';
            setTimeout(() => game.canvas.style.filter = 'none', 200);
        }
    },

    gameOver() {
        game.state = 'gameOver';
        
        // Save high score
        UI.saveHighScore();
        
        // Show game over screen
        document.getElementById('finalScore').textContent = Math.floor(game.score);
        document.getElementById('maxCombo').textContent = game.maxCombo;
        document.getElementById('enemiesDefeated').textContent = game.enemiesDefeated;
        document.getElementById('levelReached').textContent = game.level;
        
        // Random death quote
        const quote = DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)];
        document.getElementById('deathQuote').textContent = `"${quote}"`;
        
        // Check for new achievements
        UI.checkAchievements();
        
        UI.showScreen('gameOverScreen');
    }
};