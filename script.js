// --- Global Variables ---
let currentScreen = 1;
const totalScreens = 3;
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

// --- Entrance Logic ---
function nextScreen(screenNum) {
    if (screenNum === 1) {
        // Transition from Hook to Breathing Pause
        document.getElementById('screen1').classList.remove('active');
        const screen2 = document.getElementById('screen2');
        screen2.classList.add('active');
        
        // Auto transition after 3 seconds
        setTimeout(() => {
            nextScreen(2);
        }, 3000);
    } else if (screenNum === 2) {
        // Transition from Breathing to Suspense
        document.getElementById('screen2').classList.remove('active');
        const screen3 = document.getElementById('screen3');
        screen3.classList.add('active');
        
        // Start typing animation for suspense
        typeText("Because this is for someone very special... 💫", "typingSuspense", () => {
            document.getElementById('suspenseActions').style.opacity = '1';
        });
    }
}

function startMainExperience() {
    // Hide intro, show main scrollable content
    const intro = document.getElementById('introExperience');
    const main = document.getElementById('mainContent');
    
    intro.style.transition = 'opacity 1s ease';
    intro.style.opacity = '0';
    
    setTimeout(() => {
        intro.style.display = 'none';
        main.style.display = 'block';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        // Fire initial confetti
        fireConfetti();
        
        // Start music if not playing (user gave interaction)
        if (!isMusicPlaying) toggleMusic();
        
        // Smoothly fade in main content
        setTimeout(() => {
            document.getElementById('revealSection').classList.add('visible');
        }, 100);
    }, 1000);
}

// --- Typing Animation Utility ---
function typeText(text, elementId, callback) {
    const el = document.getElementById(elementId);
    let i = 0;
    el.innerHTML = "";
    
    function typing() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 50); // Speed of typing
        } else if (callback) {
            callback();
        }
    }
    typing();
}

// --- Scroll Progress & Reveal Logic ---
window.onscroll = function() {
    const main = document.getElementById('mainContent');
    if (main.style.display === 'block') {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('scrollProgress').style.width = scrolled + '%';
    }
};

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Special case: fire confetti again if it's the reveal section coming back into view
            if (entry.target.id === 'revealSection') {
                fireConfetti();
            }
        }
    });
}, observerOptions);

// Observe all sections when they are loaded
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => observer.observe(section));
    createParticles();
});

// --- Effects & Particles ---
function fireConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff2d75', '#7b61ff', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff2d75', '#7b61ff', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function createParticles() {
    const container = document.getElementById('particles');
    const heartCount = 15;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '110vh';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        heart.style.animationDuration = (Math.random() * 5 + 7) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(heart);
    }
}

// --- Music Logic ---
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.innerHTML = '🔇';
    } else {
        bgMusic.play().catch(e => console.log('Music play blocked by browser:', e));
        musicIcon.innerHTML = '🎵';
    }
    isMusicPlaying = !isMusicPlaying;
}

// Add Easter Egg
let tapCount = 0;
document.addEventListener('click', (e) => {
    tapCount++;
    if (tapCount % 10 === 0) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
});
