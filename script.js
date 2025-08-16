/* ===========================================
   PORTFOLIO WEBSITE JAVASCRIPT
   =========================================== */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    
    /* ===========================================
       THEME TOGGLE FUNCTIONALITY
       =========================================== */
    
    // Get theme toggle button and icon elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    const currentTheme = savedTheme;
    
    // Apply the saved/default theme on page load
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update the theme icon based on current theme
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️'; // Sun icon for switching to light
        } else {
            themeIcon.textContent = '🌙'; // Moon icon for switching to dark
        }
    }
    
    // Set initial icon
    updateThemeIcon(currentTheme);
    
    // Theme toggle click event handler
    themeToggle.addEventListener('click', function() {
        // Get current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Determine new theme (toggle between light and dark)
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme to document
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon to reflect new state
        updateThemeIcon(newTheme);
        
        // Save theme preference to localStorage for persistence
        localStorage.setItem('theme', newTheme);
        
        // Add subtle animation feedback
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    /* ===========================================
       SMOOTH SCROLLING FOR NAVIGATION LINKS
       =========================================== */
    
    // Get all navigation links and CTA button
    const navLinks = document.querySelectorAll('.dock-list a, .cta-button');
    
    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if link has a hash (internal link)
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault(); // Prevent default jump behavior
                
                // Find the target section
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed navigation
                    const navOffset = 80; // Adjust based on your navigation height
                    const targetPosition = targetSection.offsetTop - navOffset;
                    
                    // Smooth scroll to target position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    /* ===========================================
       CONTACT FORM HANDLING
       =========================================== */
    
    // Get contact form and success message elements
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    // Contact form submit event handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent actual form submission
        
        // Get form input elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Simple form validation
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        // Check if all fields are filled
        if (!name || !email || !message) {
            // Show error styling for empty fields
            highlightEmptyFields([nameInput, emailInput, messageInput]);
            return;
        }
        
        // Basic email validation
        if (!isValidEmail(email)) {
            emailInput.style.borderColor = '#cc241d'; // Gruvbox red for error
            emailInput.focus();
            return;
        }
        
        // If validation passes, show success message
        showSuccessMessage();
        
        // Reset form after successful submission
        contactForm.reset();
        
        // Reset any error styling
        resetFormStyling([nameInput, emailInput, messageInput]);
    });
    
    // Function to highlight empty form fields
    function highlightEmptyFields(fields) {
        fields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#cc241d'; // Gruvbox red for error
                field.style.boxShadow = '0 0 0 3px rgba(204, 36, 29, 0.1)';
            } else {
                field.style.borderColor = 'var(--border-color)';
                field.style.boxShadow = 'none';
            }
        });
        
        // Focus on first empty field
        const firstEmpty = fields.find(field => !field.value.trim());
        if (firstEmpty) {
            firstEmpty.focus();
        }
    }
    
    // Function to reset form field styling
    function resetFormStyling(fields) {
        fields.forEach(field => {
            field.style.borderColor = 'var(--border-color)';
            field.style.boxShadow = 'none';
        });
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to show success message with animation
    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-10px)';
        
        // Animate in
        setTimeout(() => {
            successMessage.style.transition = 'all 0.3s ease-out';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMessage.style.transition = 'all 0.3s ease-out';
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 300);
        }, 5000);
    }
    
    // Add real-time validation for form inputs
    const formInputs = [
        document.getElementById('name'),
        document.getElementById('email'),
        document.getElementById('message')
    ];
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Reset error styling when user starts typing
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        });
        
        input.addEventListener('blur', function() {
            // Validate on blur (when user leaves the field)
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
    
    /* ===========================================
       ACTIVE NAVIGATION HIGHLIGHTING
       =========================================== */
    
    // Get all sections and navigation links
    const sections = document.querySelectorAll('section[id]');
    const dockLinks = document.querySelectorAll('.dock-list a');
    
    // Function to update active navigation item
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Check if section is in viewport (with offset for navigation)
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all links and add to current
        dockLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Add scroll event listener for active navigation
    window.addEventListener('scroll', updateActiveNav);
    
    // Add CSS for active navigation state
    const style = document.createElement('style');
    style.textContent = `
        .dock-list a.active {
            background: var(--accent-primary) !important;
            color: var(--bg-primary) !important;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
    /* ===========================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       =========================================== */
    
    // Create intersection observer for scroll animations
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
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.bento-box, .project-card, .blog-card'
    );
    
    animatedElements.forEach(element => {
        // Set initial state for animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        // Start observing
        observer.observe(element);
    });
    
    /* ===========================================
       KEYBOARD NAVIGATION SUPPORT
       =========================================== */
    
    // Add keyboard navigation for dock
    dockLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add keyboard support for theme toggle
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    /* ===========================================
       PERFORMANCE OPTIMIZATIONS
       =========================================== */
    
    // Debounce scroll events for better performance
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
    
    // Apply debounce to scroll handler
    const debouncedScrollHandler = debounce(updateActiveNav, 10);
    window.removeEventListener('scroll', updateActiveNav);
    window.addEventListener('scroll', debouncedScrollHandler);
    
    /* ===========================================
       ACCESSIBILITY ENHANCEMENTS
       =========================================== */
    
    // Add focus management for better keyboard navigation
    function manageFocus() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--accent-primary)';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = 'none';
                this.style.outlineOffset = '0';
            });
        });
    }
    
    // Initialize focus management
    manageFocus();
    
    console.log('Portfolio website loaded successfully! 🚀');
});