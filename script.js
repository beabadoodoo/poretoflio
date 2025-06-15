const toggleDarkBtn = document.getElementById('toggle-dark');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const skillItems = document.querySelectorAll('.skill-item');
const heroCanvas = document.getElementById('hero-particles-canvas');
const ctx = heroCanvas.getContext('2d');

let particles = [];
const particleCount = 100;
let animationFrameId;

// Particle class definition
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.opacity = 0; // Start invisible
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        // Fade in
        if (this.opacity < 0.8) {
            this.opacity += 0.01;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Bounce off walls
        if (this.x + this.radius > heroCanvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > heroCanvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
    }
}

// Function to initialize particles
function initParticles() {
    particles = [];
    heroCanvas.width = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;

    const colors = [
        { r: 108, g: 99, b: 255 }, // Primary Purple
        { r: 180, g: 170, b: 255 }, // Lighter Purple
        { r: 200, g: 220, b: 255 }  // Even lighter blue-ish
    ];

    if (document.body.classList.contains('dark')) {
        // Dark mode specific colors (adjust as needed for better contrast)
        colors[0] = { r: 157, g: 136, b: 255 }; // Lighter purple for dark mode
        colors[1] = { r: 100, g: 90, b: 180 };
        colors[2] = { r: 80, g: 70, b: 150 };
    }


    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * (heroCanvas.width - radius * 2) + radius;
        const y = Math.random() * (heroCanvas.height - radius * 2) + radius;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
        };
        particles.push(new Particle(x, y, radius, color, velocity));
    }
}

// Animation loop for particles
function animateParticles() {
    animationFrameId = requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw lines between close particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { // Only draw lines if particles are close
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${Math.min(particles[i].opacity, particles[j].opacity) * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}


// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        toggleDarkBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode'; // Change icon and text
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        toggleDarkBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode'; // Change icon and text
    }
    // Re-initialize particles to apply new colors
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    initParticles();
    animateParticles();
}

// Check for saved theme preference on load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        setTheme('dark');
    } else {
        setTheme('light'); // Default to light mode if no preference or 'light' is saved
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Initialize AOS
    AOS.init({
        once: true,
        duration: 800,
        easing: 'ease-out-quart'
    });

    // Initialize and start particle animation after AOS.init
    initParticles();
    animateParticles();

    // Re-initialize particles on window resize
    window.addEventListener('resize', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        initParticles();
        animateParticles();
    });

    // Skill Progress Animation on Scroll (using IntersectionObserver)
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillIcon = entry.target.querySelector('.skill-icon');
                if (skillIcon) {
                    skillIcon.style.animation = 'skillIconPulse 1s ease-out forwards';
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the item is visible
    });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
});

// Toggle theme on button click
toggleDarkBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark')) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    // Change icon based on active state
    if (mainNav.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});



// Close mobile menu when a nav link is clicked
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Close mobile menu if clicked outside
document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function openVideoPopup() {
  modal.style.display = "flex"; // Use flex to center immediately
  // Add a small delay to allow display property to take effect before transition
  setTimeout(function() {
    modal.classList.add("show");
  }, 10);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.classList.remove("show");
  setTimeout(function() {
    modal.style.display = "none";
  }, 300); // Match CSS transition duration
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.classList.remove("show");
    setTimeout(function() {
      modal.style.display = "none";
    }, 300); // Match CSS transition duration
  }}
