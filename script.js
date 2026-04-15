document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 100
    });

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    }
    
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.innerHTML = '<i class="ri-close-line text-2xl text-slate-700"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-2xl text-slate-700"></i>';
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function() {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-2xl text-slate-700"></i>';
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Animated Counter Numbers
    // ========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-expo)
                const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = Math.floor(easeOutExpo * target);
                
                stat.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
        
        countersAnimated = true;
    }

    // Trigger counter animation when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 500);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('inicio');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // ========================================
    // Contact Form Handler
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (!nombre || !telefono) {
                showNotification('Por favor, completá tu nombre y teléfono', 'error');
                return;
            }
            
            // Build WhatsApp message
            let whatsappMessage = `¡Hola Dra. Miranda!\n\n`;
            whatsappMessage += `Nombre: ${nombre}\n`;
            whatsappMessage += `Teléfono: ${telefono}\n`;
            if (mensaje) {
                whatsappMessage += `Mensaje: ${mensaje}`;
            }
            
            const whatsappUrl = `https://wa.me/543888651475?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            contactForm.reset();
            
            showNotification('¡Redirigiendo a WhatsApp!', 'success');
        });
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="ri-${type === 'success' ? 'check-circle-line' : 'error-warning-line'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: #fff;
            border-radius: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Intersection Observer for Fade Animations
    // ========================================
    const fadeElements = document.querySelectorAll('.service-card, .study-card, .info-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // ========================================
    // Parallax Effect for Hero (subtle)
    // ========================================
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        }, { passive: true });
    }

    // ========================================
    // Preloader (optional enhancement)
    // ========================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ========================================
    // Keyboard Navigation Support
    // ========================================
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile menu
        if (e.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-2xl text-slate-700"></i>';
            document.body.style.overflow = '';
        }
    });

    // ========================================
    // Performance: Throttle scroll events
    // ========================================
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });

    // ========================================
    // Service Cards Hover Effect Enhancement
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ========================================
    // Add ripple effect to buttons
    // ========================================
    const buttons = document.querySelectorAll('.btn-whatsapp, .btn-primary-gradient, .btn-submit');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    console.log('Clínica Miranda V - Landing Page Loaded Successfully');
});
