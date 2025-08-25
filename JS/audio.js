// Audio system using Web Audio API

const Audio = {
    context: null,

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.context = null;
        }
    },

    createOscillator(frequency, duration, volume = 0.1) {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },

    punch() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(200, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    },

    hit() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.05, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.05);
    },

    explosion() {
        if (!this.context) return;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                oscillator.frequency.setValueAtTime(100 + Math.random() * 100, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(20, this.context.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0.08, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                
                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.2);
            }, i * 20);
        }
    },

    chaos() {
        if (!this.context) return;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createOscillator(200 + Math.random() * 800, 0.1, 0.03);
            }, i * 50);
        }
    },

    gameOver() {
        if (!this.context) return;
        
        // Descending tone sequence
        const frequencies = [400, 350, 300, 250, 200];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createOscillator(freq, 0.3, 0.08);
            }, index * 200);
        });
    }
}