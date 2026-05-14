// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Update active nav link when clicking
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

setActiveNavLink();

// Form submission handler with EmailJS
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Validate form
        if (!contactForm.checkValidity() === false) {
            event.stopPropagation();
        }

        contactForm.classList.add('was-validated');

        const fromName = document.getElementById('from_name').value.trim();
        const fromEmail = document.getElementById('from_email').value.trim();
        const serviceType = document.getElementById('service_type').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = document.getElementById('submitBtn');
        const formMessage = document.getElementById('formMessage');

        // Additional validation
        if (!fromName || !fromEmail || !serviceType || !message) {
            showFormMessage('Будь ласка, заповніть усі обов\'язкові поля', 'danger');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fromEmail)) {
            showFormMessage('Будь ласка, введіть коректну email адресу', 'danger');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Відправляємо...';

        try {
            // Prepare template parameters
            const templateParams = {
                from_name: fromName,
                from_email: fromEmail,
                phone: document.getElementById('phone').value || 'Не надано',
                company: document.getElementById('company').value || 'Не надано',
                service_type: serviceType,
                message: message
            };

            // Send email via EmailJS
            const response = await emailjs.send('service_td689wg', 'template_z9z6u0s', templateParams);

            if (response.status === 200) {
                showFormMessage('✓ Дякуємо! Ми отримали ваше повідомлення. Ми зв\'яжемося з вами найближчим часом.', 'success');

                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    formMessage.classList.add('d-none');
                }, 3000);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showFormMessage('❌ Помилка відправки. Спробуйте ще раз або зв\'яжіться з нами по телефону.', 'danger');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function showFormMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = text;
    messageDiv.classList.remove('d-none', 'alert-success', 'alert-danger');
    messageDiv.classList.add(`alert-${type}`);
}

// Add floating messenger widget
function createMessengerWidget() {
    const widget = document.createElement('div');
    widget.id = 'messenger-widget';
    widget.innerHTML = `
        <div class="messenger-buttons">
            <a href="https://t.me/SkyLayer3d" target="_blank" class="messenger-btn telegram" title="Telegram">
                <i class="fa fa-telegram"></i>
            </a>
            <a href="https://wa.me/380939950981" target="_blank" class="messenger-btn whatsapp" title="WhatsApp">
                <i class="fa fa-whatsapp"></i>
            </a>
        </div>
    `;
    widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    document.body.appendChild(widget);

    // Add styles for messenger buttons
    const style = document.createElement('style');
    style.textContent = `
        #messenger-widget .messenger-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        #messenger-widget .messenger-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        #messenger-widget .telegram {
            background-color: #2AABEE;
        }

        #messenger-widget .telegram:hover {
            background-color: #1a8ac2;
        }

        #messenger-widget .whatsapp {
            background-color: #25D366;
        }

        #messenger-widget .whatsapp:hover {
            background-color: #1fa851;
        }

        @media (max-width: 768px) {
            #messenger-widget {
                bottom: 15px;
                right: 15px;
            }

            #messenger-widget .messenger-btn {
                width: 45px;
                height: 45px;
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Create widget on page load
document.addEventListener('DOMContentLoaded', createMessengerWidget);

// Animate elements on scroll
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

// Apply animation to cards
document.querySelectorAll('.benefit-card, .service-card, .material-card, .value-card, .stat-card, .advantage-card, .process-step').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add scroll effect to navbar
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    }

    lastScrollTop = scrollTop;
});

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    }, 100);
});

// Count animation for statistics
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('uk-UA');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('uk-UA');
        }
    }, 16);
}

// Trigger counter animation when visible
const numbersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const text = entry.target.textContent;
            const number = text.match(/\d+/)?.[0];
            if (number) {
                animateCounter(entry.target, parseInt(number));
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.big-number').forEach(el => {
    numbersObserver.observe(el);
});

// Collapse navbar on link click (mobile)
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Add hover effects
document.querySelectorAll('a, button').forEach(element => {
    element.style.cursor = 'pointer';
});

console.log('SkyLayer - Website Loaded Successfully');
