// VexedPainter Portfolio - Auto-Updating JavaScript
// Particles, Typing Animation, GitHub API Integration

const USERNAME = 'VexedPainter';

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initSmoothScroll();
    fetchGitHubStats();
    updateLastUpdateTime();
});

// Particles.js Configuration
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

// Typing Animation
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

// Smooth Scroll
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
}

// Fetch GitHub Stats
async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}`);
        if (!response.ok) throw new Error('GitHub API error');
        
        const data = await response.json();
        
        // Update basic stats
        document.getElementById('github-followers').textContent = data.followers || 0;
        document.getElementById('github-repos').textContent = data.public_repos || 0;
        
        // Fetch repos for additional stats
        await fetchRepoStats();
        
        // Render contribution graph
        renderContributionGraph();
        
        // Render language stats
        renderLanguageStats();
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Show fallback data
        document.getElementById('github-followers').textContent = '0';
        document.getElementById('github-repos').textContent = '0';
    }
}

async function fetchRepoStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
        if (!response.ok) throw new Error('Repos API error');
        
        const repos = await response.json();
        
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        document.getElementById('github-stars').textContent = totalStars;
        
        // Calculate language distribution
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        // Store for later use
        window.languageData = languages;
        
    } catch (error) {
        console.error('Error fetching repo stats:', error);
        document.getElementById('github-stars').textContent = '0';
    }
}

function renderContributionGraph() {
    const canvas = document.getElementById('contributionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    // Generate sample contribution data (last 30 days)
    const data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 20));
    const max = Math.max(...data, 1);
    
    // Draw bars
    const barWidth = width / data.length - 2;
    data.forEach((value, i) => {
        const barHeight = (value / max) * (height - 40);
        const x = i * (barWidth + 2);
        const y = height - barHeight - 20;
        
        const gradient = ctx.createLinearGradient(0, y, 0, height - 20);
        gradient.addColorStop(0, '#00d9ff');
        gradient.addColorStop(1, '#7b2ff7');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
    });
}

function renderLanguageStats() {
    const canvas = document.getElementById('languageChart');
    if (!canvas || !window.languageData) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    const languages = Object.entries(window.languageData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (languages.length === 0) return;
    
    const total = languages.reduce((sum, [, count]) => sum + count, 0);
    const colors = ['#00d9ff', '#7b2ff7', '#f72585', '#4cc9f0', '#4361ee'];
    
    let currentAngle = -Math.PI / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    languages.forEach(([lang, count], i) => {
        const sliceAngle = (count / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        // Add label
        const midAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(midAngle) * (radius / 1.5);
        const textY = centerY + Math.sin(midAngle) * (radius / 1.5);
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(lang, textX, textY);
        
        currentAngle += sliceAngle;
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 35, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 35, 0.9)';
    }
});

// Update last update time
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = `Last updated: ${now.toLocaleString()}`;
    }
}

// Theme toggle (if needed)
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}
