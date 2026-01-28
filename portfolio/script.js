document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupScrollAnimations();
    setupContactForm();
    setupPageLoad();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-content p, .section-title, .contact-intro').forEach(el => {
        observer.observe(el);
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name && email && message) {
                const mailtoLink = `mailto:your-email@example.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoLink;
                
                contactForm.reset();
                showFormFeedback('Thank you! Your message is ready to send.', 'success');
            }
        });
    }
}

function showFormFeedback(message, type) {
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        text-align: center;
        font-weight: 500;
        background: ${type === 'success' ? 'rgba(100, 200, 255, 0.15)' : 'rgba(255, 84, 89, 0.15)'};
        color: ${type === 'success' ? '#64c8ff' : '#ff5459'};
        border: 1px solid ${type === 'success' ? 'rgba(100, 200, 255, 0.3)' : 'rgba(255, 84, 89, 0.3)'};
        animation: slideDown 0.3s ease-out;
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(feedback, contactForm);
    
    setTimeout(() => {
        feedback.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

function setupPageLoad() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
}

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});