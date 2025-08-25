// Game configuration and constants

// Game modes configuration
const GAME_MODES = {
    classic: { lives: 3, chaosEnabled: false, name: "Classic Mode" },
    chaos: { lives: 3, chaosEnabled: true, name: "Chaos Mode" },
    onehit: { lives: 1, chaosEnabled: false, name: "One-Hit Survival" },
    endless: { lives: 999, chaosEnabled: true, name: "Endless Mayhem" }
};

// Enemy types configuration
const ENEMY_TYPES = {
    basic: { speed: 2, health: 1, points: 10, color: '#ff4040', size: 30 },
    fast: { speed: 4, health: 1, points: 15, color: '#40ff40', size: 25 },
    tank: { speed: 1, health: 3, points: 25, color: '#4040ff', size: 40 },
    ghost: { speed: 2, health: 1, points: 20, color: '#ff40ff', size: 30, alpha: 0.3 },
    explosive: { speed: 2, health: 1, points: 30, color: '#ffff40', size: 35 }
};

// Chaos modifiers configuration
const CHAOS_MODIFIERS = [
    { name: 'Big Head Mode', effect: 'bighead', duration: 300, description: 'Enemies have huge heads!' },
    { name: 'Gravity Flip', effect: 'gravity', duration: 400, description: 'Enemies fall upward!' },
    { name: 'Slow Motion', effect: 'slowmo', duration: 250, description: 'Time slows down!' },
    { name: 'Pixel Storm', effect: 'storm', duration: 350, description: 'Particles everywhere!' },
    { name: 'Color Chaos', effect: 'colorshift', duration: 300, description: 'Colors go wild!' },
    { name: 'Mirror World', effect: 'mirror', duration: 400, description: 'Everything is mirrored!' },
    { name: 'Glitch Mode', effect: 'glitch', duration: 200, description: 'Reality breaks down!' }
];

// Death quotes
const DEATH_QUOTES = [
    "Your reflexes need some work!",
    "The pixels consumed you!",
    "Better luck next time, warrior!",
    "The arcade spirits are not pleased!",
    "Your combo was weak!",
    "The retro gods demand sacrifice!",
    "Game over, man! Game over!",
    "Your button-mashing skills need training!"
];

// Achievements configuration
const ACHIEVEMENTS = [
    { id: 'first_blood', name: 'First Blood', description: 'Defeat your first enemy', check: () => game.enemiesDefeated >= 1 },
    { id: 'combo_master', name: 'Combo Master', description: 'Reach a 10x combo', check: () => game.maxCombo >= 10 },
    { id: 'survivor', name: 'Survivor', description: 'Reach level 5', check: () => game.level >= 5 },
    { id: 'chaos_lord', name: 'Chaos Lord', description: 'Trigger 5 chaos modifiers', check: () => game.chaosMeters >= 5 },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Complete a level without taking damage', check: () => game.combo >= 20 },
    { id: 'button_masher', name: 'Button Masher', description: 'Score 1000 points', check: () => game.score >= 1000 }
];