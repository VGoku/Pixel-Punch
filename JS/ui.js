// User interface management

const UI = {
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    },

    updateUI() {
        document.getElementById('scoreValue').textContent = Math.floor(game.score);
        document.getElementById('levelValue').textContent = game.level;
        document.getElementById('comboValue').textContent = game.combo;
        
        // Update lives display
        const livesDisplay = document.getElementById('livesDisplay');
        livesDisplay.innerHTML = '';
        for (let i = 0; i < Math.min(game.lives, 10); i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            livesDisplay.appendChild(heart);
        }
        
        // Update chaos meter
        const chaosFill = document.getElementById('chaosFill');
        const chaosPercent = Math.min((game.chaosMeters % 1) * 100, 100);
        chaosFill.style.width = chaosPercent + '%';
        
        // Trigger chaos modifier when meter is full
        if (game.chaosMeters >= 1 && GAME_MODES[game.mode].chaosEnabled) {
            game.chaosMeters = 0;
            Effects.triggerChaosModifier();
        }
    },

    animatePunchZone(key) {
        const zone = document.querySelector(`[data-key="${key}"]`);
        zone.classList.add('active');
        setTimeout(() => zone.classList.remove('active'), 100);
    },

    saveHighScore() {
        const highScores = this.getHighScores();
        const newScore = {
            score: Math.floor(game.score),
            mode: game.mode,
            level: game.level,
            date: new Date().toLocaleDateString()
        };
        
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(5); // Keep only top 5
        
        try {
            localStorage.setItem('pixelPunchScores', JSON.stringify(highScores));
        } catch (e) {
            console.log('Could not save high score');
        }
        
        this.updateHighScores();
    },

    getHighScores() {
        try {
            const scores = localStorage.getItem('pixelPunchScores');
            return scores ? JSON.parse(scores) : [];
        } catch (e) {
            return [];
        }
    },

    updateHighScores() {
        const scoresList = document.getElementById('scoresList');
        const highScores = this.getHighScores();
        
        if (highScores.length === 0) {
            scoresList.innerHTML = '<div>No scores yet!</div>';
            return;
        }
        
        scoresList.innerHTML = highScores.map((score, index) => 
            `<div>${index + 1}. ${score.score} pts (${GAME_MODES[score.mode].name}) - Level ${score.level}</div>`
        ).join('');
    },

    checkAchievements() {
        const unlockedAchievements = this.getUnlockedAchievements();
        const newAchievements = [];
        
        ACHIEVEMENTS.forEach(achievement => {
            if (!unlockedAchievements.includes(achievement.id) && achievement.check()) {
                newAchievements.push(achievement);
                unlockedAchievements.push(achievement.id);
            }
        });
        
        if (newAchievements.length > 0) {
            // Save unlocked achievements
            try {
                localStorage.setItem('pixelPunchAchievements', JSON.stringify(unlockedAchievements));
            } catch (e) {
                console.log('Could not save achievements');
            }
            
            // Display new achievements
            const achievementsDisplay = document.getElementById('newAchievements');
            achievementsDisplay.innerHTML = '<h3>🏆 New Achievements!</h3>' +
                newAchievements.map(a => 
                    `<div class="achievement">${a.name}: ${a.description}</div>`
                ).join('');
        }
    },

    getUnlockedAchievements() {
        try {
            const achievements = localStorage.getItem('pixelPunchAchievements');
            return achievements ? JSON.parse(achievements) : [];
        } catch (e) {
            return [];
        }
    }
};