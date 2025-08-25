// Main game controller and initialization

const GameController = {
    init() {
        // Initialize canvas
        game.canvas = document.getElementById('gameCanvas');
        game.ctx = game.canvas.getContext('2d');
        
        // Initialize audio
        Audio.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize screens
        UI.showScreen('mainMenu');
        UI.updateHighScores();
        
        // Add screen effects
        setTimeout(() => Effects.addScreenEffects(), 100);
    },

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Menu buttons
        document.querySelectorAll('.menu-btn[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                GameState.startGame(e.target.dataset.mode);
            });
        });
        
        // Game over buttons
        document.getElementById('retryBtn').addEventListener('click', () => {
            GameState.startGame(game.mode);
        });
        
        document.getElementById('menuBtn').addEventListener('click', () => {
            UI.showScreen('mainMenu');
        });
        
        // Prevent default behavior for game keys
        document.addEventListener('keydown', (e) => {
            if (['q', 'w', 'e', 'r'].includes(e.key.toLowerCase()) && game.state === 'playing') {
                e.preventDefault();
            }
        });
    },

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (game.state === 'playing' && ['q', 'w', 'e', 'r'].includes(key)) {
            e.preventDefault();
            if (!game.keys[key] && game.punchCooldown <= 0) {
                game.keys[key] = true;
                this.punch(key);
                UI.animatePunchZone(key);
            }
        }
    },

    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (['q', 'w', 'e', 'r'].includes(key)) {
            game.keys[key] = false;
        }
    },

    punch(key) {
        const keyIndex = ['q', 'w', 'e', 'r'].indexOf(key);
        let hitAny = false;
        
        // Play punch sound
        Audio.punch();
        
        game.enemies.forEach((enemy, index) => {
            if (enemy.zone === keyIndex && enemy.y > game.canvas.height - 200 && enemy.y < game.canvas.height) {
                Enemies.hitEnemy(enemy, index);
                hitAny = true;
                
                // Play hit sound
                Audio.hit();
                
                // Special audio for explosive enemies
                if (enemy.type === 'explosive' && enemy.health <= 0) {
                    Audio.explosion();
                }
            }
        });
        
        if (hitAny) {
            game.combo++;
            game.maxCombo = Math.max(game.maxCombo, game.combo);
            game.chaosMeters += 0.2;
            
            // Screen shake effect
            Effects.screenShake();
        } else {
            game.combo = 0;
        }
        
        game.punchCooldown = 10;
        UI.updateUI();
    }
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    GameController.init();
});

// Handle browser focus/blur for audio context
document.addEventListener('visibilitychange', () => {
    if (Audio.context && Audio.context.state === 'suspended') {
        Audio.context.resume();
    }
});

// Click to resume audio context (some browsers require user interaction)
document.addEventListener('click', () => {
    if (Audio.context && Audio.context.state === 'suspended') {
        Audio.context.resume();
    }
}, { once: true });