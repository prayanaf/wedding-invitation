// ===== GLOBAL VARIABLES =====
const weddingDate = new Date('2027-07-17T08:00:00').getTime();

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loading-screen');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const rsvpForm = document.getElementById('rsvpForm');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Initialize all features
    initNavigation();
    initScrollAnimations();
    initCountdown();
    initMusicControl();
    initRSVPForm();
    initSmoothScrolling();
});

// ===== LOADING SCREEN - IMPROVED =====
function hideLoadingScreen() {
    loadingScreen.classList.add('hide');
    loadingScreen.style.visibility = 'hidden';
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    }, 600);
}

// Tambahkan di DOMContentLoaded:
document.addEventListener('DOMContentLoaded', function() {
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    // Loading sequence
    setTimeout(() => {
        hideLoadingScreen();
    }, 2500); // 2.5 detik loading yang smooth
});

// ===== NAVIGATION =====
function initNavigation() {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Timeline items animation
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add(entry.target.classList.contains('fade-in-left') ? 'fade-in-left' : 'fade-in-right');
                }
            }
        });
    }, observerOptions);

    // Observe all sections and elements
    document.querySelectorAll('section, .fade-in-up, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // Stop countdown when time reaches zero
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = 
                '<h3>Hari bahagia telah tiba! <i class="fas fa-heart"></i></h3>';
            clearInterval(countdownInterval);
        }
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
}

// ===== MUSIC CONTROL =====
function initMusicControl() {
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            isPlaying = false;
        } else {
            bgMusic.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });

    // Resume music when user interacts with page
    document.addEventListener('click', () => {
        if (bgMusic.paused && !isPlaying) {
            bgMusic.play().catch(() => {});
        }
    }, { once: true });
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--gold)' : '#e74c3c',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: 'var(--shadow)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// ===== PWA SUPPORT (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Preload critical resources
if ('link' in document.createElement('link')) {
    const preloadLinks = [
        { href: 'assets/images/hero-bg.jpg', as: 'image' }
    ];
    
    preloadLinks.forEach(link => {
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.href = link.href;
        preload.as = link.as;
        document.head.appendChild(preload);
    });
}

/* ========================================
   GALLERY SLIDER
======================================== */

const track = document.querySelector('.gallery-track');
const nextBtn = document.querySelector('.gallery-btn.next');
const prevBtn = document.querySelector('.gallery-btn.prev');

let currentSlide = 0;

function updateSlider() {

    const slideWidth =
        document.querySelector('.gallery-slide').offsetWidth + 24;

    track.style.transform =
        `translateX(-${currentSlide * slideWidth}px)`;
}

nextBtn.addEventListener('click', () => {

    const slides =
        document.querySelectorAll('.gallery-slide');

    if(currentSlide < slides.length - 1){
        currentSlide++;
    } else {
        currentSlide = 0;
    }

    updateSlider();
});

prevBtn.addEventListener('click', () => {

    const slides =
        document.querySelectorAll('.gallery-slide');

    if(currentSlide > 0){
        currentSlide--;
    } else {
        currentSlide = slides.length - 1;
    }

    updateSlider();
});