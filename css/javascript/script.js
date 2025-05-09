/**
 * Advanced Interactive JavaScript Assignment
 * 
 * This script implements all required features:
 * - Event handling (click, hover, keypress, secret actions)
 * - Interactive elements (color changer, image gallery, tabs)
 * - Advanced form validation with real-time feedback
 * - Theme switching and other premium features
 */

// IIFE to avoid global scope pollution
(function() {
    'use strict';
    
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const clickButton = document.getElementById('clickButton');
    const clickOutput = document.getElementById('clickOutput');
    const hoverBox = document.querySelector('.hover-box');
    const hoverOutput = document.getElementById('hoverOutput');
    const keypressInput = document.getElementById('keypressInput');
    const keypressOutput = document.getElementById('keypressOutput');
    const secretBox = document.querySelector('.secret-box');
    const secretOutput = document.getElementById('secretOutput');
    const colorChanger = document.getElementById('colorChanger');
    const colorHistory = document.getElementById('colorHistory');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const registrationForm = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const emailChecking = document.getElementById('emailChecking');
    const formSuccess = document.getElementById('formSuccess');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    const notification = document.getElementById('notification');
    const animationToggle = document.getElementById('animationToggle');
    const clickCountEl = document.getElementById('clickCount');
    const keypressCountEl = document.getElementById('keypressCount');
    
    // State variables
    let currentSlide = 0;
    let clickCount = 0;
    let keypressCount = 0;
    let colorHistoryArray = [];
    let emailCheckTimeout;
    let isAnimationsEnabled = true;
    
    // Initialize the application
    function init() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize interactive elements
        initImageGallery();
        initTabs();
        
        // Show first slide
        showSlide(currentSlide);
        
        // Initialize console easter egg
        initConsoleEasterEgg();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Click event
        clickButton.addEventListener('click', handleButtonClick);
        
        // Hover events
        hoverBox.addEventListener('mouseenter', () => {
            hoverOutput.textContent = 'Mouse entered the box!';
        });
        
        hoverBox.addEventListener('mouseleave', () => {
            hoverOutput.textContent = 'Mouse left the box!';
        });
        
        // Keypress event
        keypressInput.addEventListener('keypress', (e) => {
            keypressCount++;
            keypressCountEl.textContent = keypressCount;
            keypressOutput.textContent = `Key pressed: ${e.key} (Code: ${e.code})`;
        });
        
        // Secret actions
        secretBox.addEventListener('dblclick', showSecret);
        
        let pressTimer;
        secretBox.addEventListener('mousedown', () => {
            pressTimer = setTimeout(showSecret, 1000);
        });
        
        secretBox.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });
        
        secretBox.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });
        
        // Color changer
        colorChanger.addEventListener('click', changeButtonColor);
        
        // Form validation
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', debounce(validateEmail, 500));
        passwordInput.addEventListener('input', validatePassword);
        registrationForm.addEventListener('submit', handleFormSubmit);
        
        // Animation toggle
        animationToggle.addEventListener('change', toggleAnimations);
    }
    
    // Theme functionality
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        showNotification(`Switched to ${newTheme} mode`);
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Button click handler
    function handleButtonClick() {
        clickCount++;
        clickCountEl.textContent = clickCount;
        
        clickOutput.textContent = `Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}!`;
        
        if (isAnimationsEnabled) {
            clickOutput.classList.add('fade-in');
            setTimeout(() => clickOutput.classList.remove('fade-in'), 500);
        }
        
        // Add micro-interaction to button
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    }
    
    // Secret action handler
    function showSecret() {
        secretOutput.classList.remove('hidden');
        
        if (isAnimationsEnabled) {
            secretOutput.classList.add('fade-in');
        }
        
        setTimeout(() => {
            secretOutput.classList.add('hidden');
            secretOutput.classList.remove('fade-in');
        }, 2000);
        
        showNotification('You discovered a secret!', 'success');
    }
    
    // Color changer functionality
    function changeButtonColor() {
        const colors = [
            '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', 
            '#f72585', '#b5179e', '#7209b7', '#560bad',
            '#3a0ca3', '#480ca8', '#3a86ff', '#8338ec'
        ];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        colorChanger.style.backgroundColor = randomColor;
        colorChanger.style.color = getContrastColor(randomColor);
        
        // Add to color history
        if (!colorHistoryArray.includes(randomColor)) {
            colorHistoryArray.unshift(randomColor);
            if (colorHistoryArray.length > 5) {
                colorHistoryArray.pop();
            }
            updateColorHistory();
        }
        
        showNotification(`Changed to ${randomColor}`, 'info');
    }
    
    function updateColorHistory() {
        colorHistory.innerHTML = '';
        colorHistoryArray.forEach(color => {
            const colorDot = document.createElement('span');
            colorDot.style.backgroundColor = color;
            colorDot.title = color;
            colorDot.addEventListener('click', () => {
                colorChanger.style.backgroundColor = color;
                colorChanger.style.color = getContrastColor(color);
                showNotification(`Selected ${color} from history`, 'info');
            });
            colorHistory.appendChild(colorDot);
        });
    }
    
    function getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white depending on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    // Image gallery functionality
    function initImageGallery() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('.lazy');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        
        // Navigation
        prevBtn.addEventListener('click', () => {
            navigateSlides(-1);
        });
        
        nextBtn.addEventListener('click', () => {
            navigateSlides(1);
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navigateSlides(-1);
            } else if (e.key === 'ArrowRight') {
                navigateSlides(1);
            }
        });
    }
    
    function navigateSlides(direction) {
        const newSlide = (currentSlide + direction + slides.length) % slides.length;
        goToSlide(newSlide);
    }
    
    function goToSlide(newSlide) {
        if (isAnimationsEnabled) {
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].classList.add(directionClass(newSlide > currentSlide ? 'next' : 'prev'));
            
            slides[newSlide].classList.add('active');
            slides[newSlide].classList.remove(directionClass(newSlide > currentSlide ? 'prev' : 'next'));
        } else {
            slides[currentSlide].classList.remove('active');
            slides[newSlide].classList.add('active');
        }
        
        // Update dots
        dots[currentSlide].classList.remove('active');
        dots[newSlide].classList.add('active');
        
        currentSlide = newSlide;
    }
    
    function directionClass(dir) {
        return dir === 'next' ? 'next' : 'prev';
    }
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.classList.toggle('hidden', i !== index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Tabs functionality
    function initTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                if (isAnimationsEnabled) {
                    document.getElementById(tabId).classList.add('fade-in');
                    setTimeout(() => {
                        document.getElementById(tabId).classList.remove('fade-in');
                    }, 500);
                }
            });
        });
    }
    
    // Form validation functionality
    function validateName() {
        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Name is required');
            return false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
            return false;
        } else {
            clearError(nameInput, nameError);
            return true;
        }
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(emailInput, emailError, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Please enter a valid email');
            return false;
        } else {
            // Simulate async email availability check
            emailChecking.classList.remove('hidden');
            clearError(emailInput, emailError);
            
            // Mock API call
            clearTimeout(emailCheckTimeout);
            emailCheckTimeout = setTimeout(() => {
                // Simulate 20% chance email is taken
                if (Math.random() < 0.2 && email !== 'test@example.com') {
                    showError(emailInput, emailError, 'This email is already registered');
                    emailChecking.classList.add('hidden');
                } else {
                    clearError(emailInput, emailError);
                    emailChecking.classList.add('hidden');
                }
            }, 1500);
            
            return true;
        }
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        const lengthValid = password.length >= 8;
        const numberValid = /\d/.test(password);
        const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const uppercaseValid = /[A-Z]/.test(password);
        
        // Update password rules display
        document.getElementById('lengthRule').classList.toggle('valid', lengthValid);
        document.getElementById('numberRule').classList.toggle('valid', numberValid);
        document.getElementById('specialRule').classList.toggle('valid', specialValid);
        document.getElementById('uppercaseRule').classList.toggle('valid', uppercaseValid);
        
        // Calculate password strength
        let strength = 0;
        if (lengthValid) strength++;
        if (numberValid) strength++;
        if (specialValid) strength++;
        if (uppercaseValid) strength++;
        
        const strengthPercent = strength * 25;
        let strengthLabel = '';
        let strengthColor = '';
        
        switch(strength) {
            case 0:
            case 1:
                strengthLabel = 'Weak';
                strengthColor = '#ef233c';
                break;
            case 2:
                strengthLabel = 'Fair';
                strengthColor = '#f77f00';
                break;
            case 3:
                strengthLabel = 'Good';
                strengthColor = '#fcbf49';
                break;
            case 4:
                strengthLabel = 'Strong';
                strengthColor = '#4cc9f0';
                break;
        }
        
        strengthMeter.style.width = `${strengthPercent}%`;
        strengthMeter.style.backgroundColor = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
        
        if (password.trim() === '') {
            showError(passwordInput, passwordError, 'Password is required');
            return false;
        } else if (strength < 2) {
            showError(passwordInput, passwordError, 'Password is too weak');
            return false;
        } else {
            clearError(passwordInput, passwordError);
            return true;
        }
    }
    
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        if (isAnimationsEnabled) {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 400);
        }
    }
    
    function clearError(input, errorElement) {
        errorElement.style.display = 'none';
        input.classList.remove('shake');
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isNameValid && isEmailValid && isPasswordValid) {
            // Form is valid - show success message
            formSuccess.classList.remove('hidden');
            
            if (isAnimationsEnabled) {
                formSuccess.classList.add('fade-in');
            }
            
            // Reset form after 3 seconds
            setTimeout(() => {
                registrationForm.reset();
                formSuccess.classList.add('hidden');
                formSuccess.classList.remove('fade-in');
                
                // Reset password rules display
                document.getElementById('lengthRule').classList.remove('valid');
                document.getElementById('numberRule').classList.remove('valid');
                document.getElementById('specialRule').classList.remove('valid');
                document.getElementById('uppercaseRule').classList.remove('valid');
                
                strengthMeter.style.width = '0%';
                strengthText.textContent = 'Weak';
                
                showNotification('Form submitted successfully!', 'success');
            }, 3000);
        } else {
            showNotification('Please fix the errors in the form', 'error');
        }
    }
    
    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    function showNotification(message, type = 'info') {
        if (!isAnimationsEnabled) return;
        
        notification.textContent = message;
        notification.className = 'notification';
        
        // Set type-specific styles
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4cc9f0';
                notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
                break;
            case 'error':
                notification.style.backgroundColor = '#ef233c';
                notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                break;
            default:
                notification.style.backgroundColor = '#4361ee';
                notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function toggleAnimations() {
        isAnimationsEnabled = this.checked;
        localStorage.setItem('animationsEnabled', this.checked);
        showNotification(`Animations ${this.checked ? 'enabled' : 'disabled'}`);
    }
    
    // Easter egg functionality
    function initConsoleEasterEgg() {
        console.log('%cWelcome to the Interactive Playground!', 'color: #4361ee; font-size: 16px; font-weight: bold;');
        console.log('%cTry typing "help" in the console for a surprise!', 'color: #4cc9f0; font-size: 14px;');
        
        // Override console.log temporarily to detect "help"
        const originalConsoleLog = console.log;
        console.log = function(message) {
            if (typeof message === 'string' && message.toLowerCase() === 'help') {
                showConsoleEasterEgg();
            }
            originalConsoleLog.apply(console, arguments);
        };
    }
    
    function showConsoleEasterEgg() {
        console.log('%c🎉 You found the console easter egg!', 'color: #f72585; font-size: 18px; font-weight: bold;');
        console.log('%cHere are some commands you can try:', 'color: #4895ef; font-size: 14px;');
        console.log('%c- changeTheme() - Toggle between light/dark mode', 'color: #3a86ff;');
        console.log('%c- showSecret() - Reveal the secret message', 'color: #3a86ff;');
        
        // Add global functions
        window.changeTheme = toggleTheme;
        window.showSecret = showSecret;
        
        showNotification('Console easter egg activated! Check the console.', 'success');
    }
    
    // Initialize the app
    init();
})();