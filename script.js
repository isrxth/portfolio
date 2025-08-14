const projectsData = [
            {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with React frontend and Node.js backend, featuring user authentication, shopping cart, and payment integration.",
                tags: ["React", "Node.js", "MongoDB", "Stripe"],
                image: "assets/img/project-01.jpg",
                github: "https://github.com/username/ecommerce-platform",
                demo: "https://ecommerce-demo.com",
                category: "web"
            },
            {
                title: "Task Management App",
                description: "Mobile-first task management application built with React Native, featuring offline support and real-time synchronization.",
                tags: ["React Native", "Firebase", "Redux"],
                image: "assets/img/project-02.jpg",
                github: "https://github.com/username/task-manager",
                demo: "https://taskmanager-demo.com",
                category: "mobile"
            },
            {
                title: "AI Image Classifier",
                description: "Machine learning model for image classification using TensorFlow, deployed as a web service with Flask API.",
                tags: ["Python", "TensorFlow", "Flask", "OpenCV"],
                image: "assets/img/project-03.jpg",
                github: "https://github.com/username/image-classifier",
                demo: "https://classifier-demo.com",
                category: "ai"
            },
            {
                title: "Weather Dashboard",
                description: "Real-time weather dashboard with interactive maps, forecasts, and location-based recommendations.",
                tags: ["JavaScript", "Chart.js", "Weather API"],
                image: "assets/img/project-04.jpg",
                github: "https://github.com/username/weather-dashboard",
                demo: "https://weather-demo.com",
                category: "web"
            },
            {
                title: "Budget Tracker",
                description: "Personal finance tracker with expense categorization, budget planning, and financial insights visualization.",
                tags: ["Vue.js", "D3.js", "Express"],
                image: "assets/img/project-05.jpg",
                github: "https://github.com/username/budget-tracker",
                demo: "https://budget-demo.com",
                category: "web"
            },
            {
                title: "IoT Monitoring System",
                description: "IoT device monitoring system with real-time data visualization and alert notifications.",
                tags: ["Arduino", "MQTT", "Node.js", "WebSocket"],
                image: "assets/img/project-06.jpg",
                github: "https://github.com/username/iot-monitor",
                demo: "https://iot-demo.com",
                category: "misc"
            }
        ];

let blogsData = [
    { title: "The Future of JavaScript", category: "tech", excerpt: "Upcoming features and trends in the JS ecosystem.", link: "#" },
    { title: "Minimalist Web Design Principles", category: "design", excerpt: "Tips for creating clean, user-friendly designs.", link: "#" },
    { title: "Work From Anywhere: My Routine", category: "lifestyle", excerpt: "How I stay productive while traveling.", link: "#" },
    // Add more blogs here...
];
        // Global variables
        let currentFilter = 'all';
        let loadedProjects = 0;
        const projectsPerLoad = 3;
        let currentBlogFilter = 'all';
        let loadedBlogs = 0;
        let blogsPerLoad = 4;
        let isBlogLoading = false;
        let isLoading = false;

        // DOM elements
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinksContainer = document.querySelector('.nav-links');
        const backToTopBtn = document.getElementById('back-to-top');
        const projectsGrid = document.getElementById('projects-grid');
        const blogFilterBtns = document.querySelectorAll('#blog .filter-btn');
        const blogGrid = document.getElementById('blog-grid');
        const blogLoadMoreTrigger = document.getElementById('blog-load-more-trigger');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const loadMoreTrigger = document.getElementById('load-more-trigger');
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            setupNavigation();
            setupScrollEffects();
            setupInfiniteScroll();
            setupProjectFilters();
            setupContactForm();
            loadInitialProjects();
            setupIntersectionObserver();
            setupBlogFilters();
            setupBlogInfiniteScroll();
            loadInitialBlogs();
        });

        // Navigation setup
        function setupNavigation() {
            // Mobile menu toggle
            mobileMenuToggle.addEventListener('click', () => {
                const isOpen = navLinksContainer.classList.contains('active');
                navLinksContainer.classList.toggle('active');
                mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navLinksContainer.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Smooth scrolling and active link highlighting
            function updateActiveNavLink() {
                const sections = document.querySelectorAll('section[id]');
                const scrollPos = window.scrollY + 100;

                sections.forEach(section => {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    const id = section.getAttribute('id');
                    const correspondingLink = document.querySelector(`a[href="#${id}"]`);

                    if (scrollPos >= top && scrollPos <= bottom) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        if (correspondingLink) {
                            correspondingLink.classList.add('active');
                        }
                    }
                });
            }

            window.addEventListener('scroll', updateActiveNavLink);
        }

        // Scroll effects setup
        function setupScrollEffects() {
            // Back to top button
            function toggleBackToTopBtn() {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            window.addEventListener('scroll', toggleBackToTopBtn);
        }

        // Intersection Observer for fade-in animations
        function setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        }

        // Project filtering
        function setupProjectFilters() {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    
                    // Update active filter button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Reset and filter projects
                    currentFilter = filter;
                    loadedProjects = 0;
                    projectsGrid.innerHTML = '';
                    loadInitialProjects();
                });
            });
        }

        // Infinite scroll setup
        function setupInfiniteScroll() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isLoading) {
                        loadMoreProjects();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(loadMoreTrigger);
        }

        // Load initial projects
        function loadInitialProjects() {
            loadMoreProjects();
        }

        // Load more projects with infinite scroll
        function loadMoreProjects() {
            if (isLoading) return;
            
            isLoading = true;
            
            // Show loading skeleton
            showLoadingSkeleton();
            
            // Simulate API delay
            setTimeout(() => {
                const filteredProjects = getFilteredProjects();
                const startIndex = loadedProjects;
                const endIndex = Math.min(startIndex + projectsPerLoad, filteredProjects.length);
                const projectsToLoad = filteredProjects.slice(startIndex, endIndex);
                
                // Remove loading skeleton
                removeLoadingSkeleton();
                
                // Add new projects
                projectsToLoad.forEach((project, index) => {
                    const projectCard = createProjectCard(project);
                    projectsGrid.appendChild(projectCard);
                    
                    // Animate card appearance
                    setTimeout(() => {
                        projectCard.classList.add('visible');
                    }, index * 100);
                });
                
                loadedProjects = endIndex;
                isLoading = false;
                
                // Hide load more trigger if all projects loaded
                if (loadedProjects >= filteredProjects.length) {
                    loadMoreTrigger.style.display = 'none';
                } else {
                    loadMoreTrigger.style.display = 'block';
                }
            }, 800);
        }

        // Get filtered projects based on current filter
        function getFilteredProjects() {
            if (currentFilter === 'all') {
                return projectsData;
            }
            return projectsData.filter(project => project.category === currentFilter);
        }

        // Create project card HTML
        function createProjectCard(project) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-category', project.category);
            
            card.innerHTML = `
                <div class="project-image">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-buttons">
                        <a href="${project.github}" class="btn-primary" target="_blank" rel="noopener noreferrer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                            </svg>
                            GitHub
                        </a>
                        <a href="${project.demo}" class="btn-secondary" target="_blank" rel="noopener noreferrer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15,3 21,3 21,9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Live Demo
                        </a>
                    </div>
                </div>
            `;
            
            return card;
        }

        // Show loading skeleton
        function showLoadingSkeleton() {
            for (let i = 0; i < projectsPerLoad; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'project-card loading-skeleton';
                skeleton.style.height = '400px';
                skeleton.setAttribute('data-skeleton', 'true');
                projectsGrid.appendChild(skeleton);
            }
        }

        // Remove loading skeleton
        function removeLoadingSkeleton() {
            document.querySelectorAll('[data-skeleton="true"]').forEach(el => {
                el.remove();
            });
        }

        // Blog filtering
        function setupBlogFilters() {
        blogFilterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;

            // Update active filter button
            blogFilterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // Reset and filter blogs
            currentBlogFilter = filter;
            loadedBlogs = 0;
            blogGrid.innerHTML = "";
            loadInitialBlogs();
            });
        });
        }

        // Infinite scroll setup for blogs
        function setupBlogInfiniteScroll() {
        const observer = new IntersectionObserver(
            (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isBlogLoading) {
                loadMoreBlogs();
                }
            });
            },
            { threshold: 0.1 }
        );

        observer.observe(blogLoadMoreTrigger);
        }

        // Load initial blogs
        function loadInitialBlogs() {
        loadMoreBlogs();
        }

        // Load more blogs with infinite scroll
        function loadMoreBlogs() {
        if (isBlogLoading) return;

        isBlogLoading = true;

        // Show loading skeleton
        showBlogLoadingSkeleton();

        // Simulate API delay
        setTimeout(() => {
            const filteredBlogs = getFilteredBlogs();
            const startIndex = loadedBlogs;
            const endIndex = Math.min(startIndex + blogsPerLoad, filteredBlogs.length);
            const blogsToLoad = filteredBlogs.slice(startIndex, endIndex);

            // Remove loading skeleton
            removeBlogLoadingSkeleton();

            // Add new blogs
            blogsToLoad.forEach((blog, index) => {
            const blogCard = createBlogCard(blog);
            blogGrid.appendChild(blogCard);

            // Animate card appearance
            setTimeout(() => {
                blogCard.classList.add("visible");
            }, index * 100);
            });

            loadedBlogs = endIndex;
            isBlogLoading = false;

            // Hide load more trigger if all blogs loaded
            if (loadedBlogs >= filteredBlogs.length) {
            blogLoadMoreTrigger.style.display = "none";
            } else {
            blogLoadMoreTrigger.style.display = "block";
            }
        }, 800);
        }

        // Get filtered blogs based on current filter
        function getFilteredBlogs() {
        if (currentBlogFilter === "all") {
            return blogsData;
        }
        return blogsData.filter((blog) => blog.category === currentBlogFilter);
        }

        // Create blog card HTML
        function createBlogCard(blog) {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.setAttribute("data-category", blog.category);

        card.innerHTML = `
                <div class="blog-image">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16v16H4z"/>
                        <path d="M4 9h16"/>
                        <path d="M9 4v16"/>
                    </svg>
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.excerpt}</p>
                    <a href="${blog.link}" class="read-more" target="_blank" rel="noopener noreferrer">
                        Read More
                    </a>
                </div>
            `;

        return card;
        }

        // Show loading skeleton
        function showBlogLoadingSkeleton() {
        for (let i = 0; i < blogsPerLoad; i++) {
            const skeleton = document.createElement("div");
            skeleton.className = "blog-card loading-skeleton";
            skeleton.style.height = "300px";
            skeleton.setAttribute("data-skeleton", "true");
            blogGrid.appendChild(skeleton);
        }
        }

        // Remove loading skeleton
        function removeBlogLoadingSkeleton() {
        document.querySelectorAll('[data-skeleton="true"]').forEach((el) => {
            el.remove();
        });
        }
        
        // Contact form
        function setupContactForm() {
          contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector(
              'button[type="submit"]'
            );

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Sending...
        `;

            setTimeout(() => {
              showFormStatus(
                "success",
                "Thank you! Your message has been sent successfully."
              );
              contactForm.reset();

              // Reset button
              submitBtn.disabled = false;
              submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
                Send Message
            `;
            }, 1500);
          });
        }

        // Show form status message
        function showFormStatus(type, message) {
          formStatus.className = `form-status ${type}`;
          formStatus.textContent = message;
          formStatus.style.display = "block";

          setTimeout(() => {
            formStatus.style.display = "none";
          }, 5000);
        }

        // Add spin animation for loading spinner
        const style = document.createElement('style');
        style.textContent = `
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);