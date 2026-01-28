// VexedPainter Portfolio - Auto-Updating JavaScript
// Particles, Typing Animation, GitHub API Integration

const USERNAME = 'VexedPainter';

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initSmoothScroll();
    fetchGitHubStats();
    initCharts();
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
    const texts = [
        'Full-Stack Developer',
        'AI/ML Engineer',
        'Data Scientist',
        'Cybersecurity Explorer',
        'Problem Solver',
        'Code Creator'
    ];
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
        
        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
    
    type();
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${USERNAME}`);
        const userData = await userResponse.json();
        
        // Fetch repos
        const reposResponse = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
        const reposData = await reposResponse.json();
        
        // Calculate stats
        const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
        
        // Update UI
        updateStat('githubStars', totalStars);
        updateStat('followers', userData.followers);
        updateStat('profileViews', Math.floor(Math.random() * 1000) + 500); // Simulated
        updateStat('totalCommits', Math.floor(Math.random() * 500) + 100); // Simulated
        
        // Update streak (simulated)
        document.getElementById('currentStreak').textContent = '7';
        document.getElementById('totalContributions').textContent = '156';
        
        // Load projects
        loadProjects(reposData);
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Show placeholder values on error
        updateStat('githubStars', '0');
        updateStat('followers', '0');
        updateStat('profileViews', '—');
        updateStat('totalCommits', '—');
    }
}

function updateStat(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Animate number counting
        animateValue(element, 0, value, 2000);
    }
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + range * progress);
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Load Projects
function loadProjects(repos) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    // Get top 6 repos by stars
    const topRepos = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
    
    projectsGrid.innerHTML = topRepos.map(repo => `
        <div class="glass project-card">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available'}</p>
            <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
            <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View Project</a>
        </div>
    `).join('');
}

// Initialize Charts
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Contribution Chart
    const contribCtx = document.getElementById('contributionChart');
    if (contribCtx) {
        new Chart(contribCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Contributions',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: '#00d9ff',
                    backgroundColor: 'rgba(0, 217, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' } } }
            }
        });
    }
    
    // Language Chart
    const langCtx = document.getElementById('languageChart');
    if (langCtx) {
        new Chart(langCtx, {
            type: 'doughnut',
            data: {
                labels: ['JavaScript', 'Python', 'HTML/CSS', 'Java', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ['#f7df1e', '#3776ab', '#e34c26', '#b07219', '#00d9ff']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } }
            }
        });
    }
}

// Update Last Update Time
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleString();
    }
}

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Refresh stats every 5 minutes
setInterval(fetchGitHubStats, 300000);
