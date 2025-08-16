document.addEventListener('DOMContentLoaded', function() {
    
    /* Theme Toggle */
    
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    const currentTheme = savedTheme;

    document.documentElement.setAttribute('data-theme', currentTheme);

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️'; 
        } else {
            themeIcon.textContent = '🌙'; 
        }
    }
    
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });

    /* Scroll */
    const navLinks = document.querySelectorAll('.dock-list a, .cta-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navOffset = 80;
                    const targetPosition = targetSection.offsetTop - navOffset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    /* Contact From */

    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) {

            highlightEmptyFields([nameInput, emailInput, messageInput]);
            return;
        }

        if (!isValidEmail(email)) {
            emailInput.style.borderColor = '#cc241d';
            emailInput.focus();
            return;
        }

        showSuccessMessage();

        contactForm.reset();

        resetFormStyling([nameInput, emailInput, messageInput]);
    });

    function highlightEmptyFields(fields) {
        fields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#cc241d';
                field.style.boxShadow = '0 0 0 3px rgba(204, 36, 29, 0.1)';
            } else {
                field.style.borderColor = 'var(--border-color)';
                field.style.boxShadow = 'none';
            }
        });

        const firstEmpty = fields.find(field => !field.value.trim());
        if (firstEmpty) {
            firstEmpty.focus();
        }
    }

    function resetFormStyling(fields) {
        fields.forEach(field => {
            field.style.borderColor = 'var(--border-color)';
            field.style.boxShadow = 'none';
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            successMessage.style.transition = 'all 0.3s ease-out';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            successMessage.style.transition = 'all 0.3s ease-out';
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 300);
        }, 5000);
    }

    const formInputs = [
        document.getElementById('name'),
        document.getElementById('email'),
        document.getElementById('message')
    ];
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        });
        
        input.addEventListener('blur', function() {
            if (this.type === 'email' && this.value.trim()) {
                if (!isValidEmail(this.value.trim())) {
                    this.style.borderColor = '#cc241d';
                    this.style.boxShadow = '0 0 0 3px rgba(204, 36, 29, 0.1)';
                }
            } else if (!this.value.trim()) {
                this.style.borderColor = '#cc241d';
                this.style.boxShadow = '0 0 0 3px rgba(204, 36, 29, 0.1)';
            }
        });
    });
    
    /*  Active Nav*/
    const sections = document.querySelectorAll('section[id]');
    const dockLinks = document.querySelectorAll('.dock-list a');

    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        dockLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    const style = document.createElement('style');
    style.textContent = `
        .dock-list a.active {
            background: var(--accent-primary) !important;
            color: var(--bg-primary) !important;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    /* Scroll AAnimation */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.bento-box, .project-card, .blog-card'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });

    /* Optimization */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedScrollHandler = debounce(updateActiveNav, 10);
    window.removeEventListener('scroll', updateActiveNav);
    window.addEventListener('scroll', debouncedScrollHandler);
});
    //Loading Screen and Card Animation
    document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loaderText = loadingScreen.querySelector('.loader-text');
    const introCard = document.getElementById('intro-card');
    const mainContent = document.getElementById('main-content');
    const cardFront = document.getElementById('card-front');
    const cardBack = document.getElementById('card-back');

    // ---- Loader Animation 0-100%
    let progress = 0;
    const interval = 20;
    const duration = 1500;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            animateCard();
        }
        loaderText.textContent = `${Math.floor(progress)}%`;
    }, interval);

    // ---- Card Animation Sequence
    function animateCard() {
        // Slide card down and fade in
        introCard.style.top = '50%';
        introCard.style.opacity = '1';
        introCard.style.transform = 'translate(-50%, -50%) rotateY(0deg) scale(1)';

        setTimeout(() => {
            cardFront.style.opacity = '0';
        }, 1200);

        setTimeout(() => {
            // Flip card
            introCard.style.transform = 'translate(-50%, -50%) rotateY(180deg) scale(1)';
        }, 1200);

        setTimeout(() => {
            // Zoom card slightly
            introCard.style.transform = 'translate(-50%, -50%) rotateY(180deg) scale(10)';

            // Wait for zoom transition to finish (assume 1s) before fading loader
            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 0.5s ease';
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000); // <-- wait for zoom transition
        }, 2400);

        // Optionally hide card after animation
        setTimeout(() => {
            introCard.style.opacity = '0';
            loadingScreen.style.opacity = '0';
        }, 2800);
                
    }
});




