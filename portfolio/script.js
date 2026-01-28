const USERNAME = 'VexedPainter';

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initSmoothScroll();
    fetchGitHubStats();
    updateLastUpdateTime();
});

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00d9ff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#00d9ff', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
                modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }
}

function initTypingAnimation() {
    const texts = ['Full-Stack Developer', 'AI/ML Engineer', 'Data Scientist', 'Cybersecurity Explorer', 'Problem Solver', 'Code Creator'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextElement = document.querySelector('.typed-text');
    
    function type() {
        const current = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    if (typedTextElement) type();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}`);
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        
        const reposEl = document.getElementById('github-repos');
        const followersEl = document.getElementById('github-followers');
        const starsEl = document.getElementById('github-stars');
        
        if (reposEl) reposEl.textContent = data.public_repos || 0;
        if (followersEl) followersEl.textContent = data.followers || 0;
        
        const reposResponse = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
        if (reposResponse.ok) {
            const repos = await reposResponse.json();
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            if (starsEl) starsEl.textContent = totalStars;
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        const reposEl = document.getElementById('github-repos');
        const followersEl = document.getElementById('github-followers');
        const starsEl = document.getElementById('github-stars');
        if (reposEl) reposEl.textContent = '3';
        if (followersEl) followersEl.textContent = '0';
        if (starsEl) starsEl.textContent = '0';
    }
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 35, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 35, 0.9)';
        }
    }
});

function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = `Last updated: ${now.toLocaleString()}`;
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}
