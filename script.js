// DOM Elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');

// Sticky Navbar on Scroll
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (backToTopBtn) {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    // Active link highlighting based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle icon between bars and times (X)
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Contact Form Submission (Saving to Database)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        submitBtn.innerText = 'Sending...';
        
        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                submitBtn.innerText = 'Message Sent!';
                submitBtn.style.backgroundColor = '#28a745'; // Green success color
                submitBtn.style.borderColor = '#28a745';
                contactForm.reset();
            } else {
                submitBtn.innerText = 'Error!';
                submitBtn.style.backgroundColor = '#dc3545'; // Red error color
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerText = 'Error!';
            alert('Could not connect to the server.');
        }
        
        // Revert button after 3 seconds
        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.borderColor = '';
        }, 3000);
    });
}

// Auth Modal Logic
const modal = document.getElementById('authModal');
const joinNowBtn = document.getElementById('joinNowBtn');
const mobileJoinBtn = document.getElementById('mobileJoinBtn');
const heroJoinBtn = document.getElementById('heroJoinBtn');
const closeBtn = document.querySelector('.close-modal');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const switchToSignup = document.querySelector('.switch-to-signup');
const switchToLogin = document.querySelector('.switch-to-login');

// Open Modal
function openModal(e) {
    if(e) e.preventDefault();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

if(joinNowBtn) joinNowBtn.addEventListener('click', openModal);
if(mobileJoinBtn) mobileJoinBtn.addEventListener('click', openModal);
if(heroJoinBtn) heroJoinBtn.addEventListener('click', openModal);

// Close Modal
function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

if(closeBtn) closeBtn.addEventListener('click', closeModal);

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
    if (e.target === profileModal) {
        closeProfile();
    }
    if (e.target === paymentModal) {
        closePaymentModal();
    }
    if (e.target === exerciseModal) {
        closeExerciseModal();
    }
    if (typeof dietModal !== 'undefined' && e.target === dietModal) {
        closeDietModal();
    }
});

// Switch Tabs
function switchTab(tabId) {
    // Update buttons
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.tab === tabId) btn.classList.add('active');
    });
    
    // Update forms
    authForms.forEach(form => {
        form.classList.remove('active');
        if(form.id === `${tabId}Form`) form.classList.add('active');
    });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

// Switch links at bottom of forms
if(switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('signup');
    });
}

if(switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('login');
    });
}

// Handle Auth Form Submissions & LocalStorage
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const profileModal = document.getElementById('profileModal');
const profileBtn = document.getElementById('profileBtn');
const mobileProfileBtn = document.getElementById('mobileProfileBtn');
const profileClose = document.querySelector('.profile-close');
const logoutBtn = document.getElementById('logoutBtn');
const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
const modalLogoutBtn = document.getElementById('modalLogoutBtn');

// State Management
let currentUser = JSON.parse(localStorage.getItem('fitcore_currentUser')) || null;

function updateUI() {
    const loggedOutElems = document.querySelectorAll('.logged-out-only');
    const loggedInElems = document.querySelectorAll('.logged-in-only');
    const heroJoinBtn = document.getElementById('heroJoinBtn');
    
    if (currentUser) {
        loggedOutElems.forEach(el => el.style.display = 'none');
        loggedInElems.forEach(el => el.style.display = 'flex');
        if(heroJoinBtn) heroJoinBtn.style.display = 'none';
        
        // Update profile modal data
        document.getElementById('profileName').innerText = currentUser.name;
        document.getElementById('profileEmail').innerText = currentUser.email;
        document.getElementById('profileJoinDate').innerText = currentUser.joinDate || new Date().toLocaleDateString();
    } else {
        loggedOutElems.forEach(el => el.style.display = 'inline-block');
        loggedInElems.forEach(el => el.style.display = 'none');
        if(heroJoinBtn) heroJoinBtn.style.display = 'inline-block';
    }
}

// Initialize UI
updateUI();

// Profile Modal Logic
function openProfile() {
    window.location.href = 'user-dashboard.html';
}

function closeProfile() {
    profileModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

if(profileBtn) profileBtn.addEventListener('click', (e) => { e.preventDefault(); openProfile(); });
if(mobileProfileBtn) mobileProfileBtn.addEventListener('click', (e) => { e.preventDefault(); openProfile(); });
if(profileClose) profileClose.addEventListener('click', closeProfile);

// Signup Logic (Using Backend API)
if(signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Auto login
                currentUser = data.user;
                localStorage.setItem('fitcore_currentUser', JSON.stringify(currentUser));
                
                alert(data.message);
                closeModal();
                updateUI();
                signupForm.reset();
                openProfile();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not connect to the server. Make sure server.js is running.');
        }
    });
}

// Login Logic (Using Backend API)
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentUser = data.user;
                localStorage.setItem('fitcore_currentUser', JSON.stringify(currentUser));
                
                alert(data.message);
                closeModal();
                updateUI();
                loginForm.reset();
                openProfile();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not connect to the server. Make sure server.js is running.');
        }
    });
}

// Logout Logic
function logout(e) {
    if(e) e.preventDefault();
    currentUser = null;
    localStorage.removeItem('fitcore_currentUser');
    updateUI();
    closeProfile();
    alert('Logged out successfully.');
}

if(logoutBtn) logoutBtn.addEventListener('click', logout);
if(mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logout);
if(modalLogoutBtn) modalLogoutBtn.addEventListener('click', logout);

// Payment Gateway Logic
const paymentModal = document.getElementById('paymentModal');
const paymentClose = document.querySelector('.payment-close');
const choosePlanBtns = document.querySelectorAll('.choose-plan-btn');
const paymentForm = document.getElementById('paymentForm');
const checkoutPlanName = document.getElementById('checkoutPlanName');
const checkoutPlanPrice = document.getElementById('checkoutPlanPrice');
const payTabBtns = document.querySelectorAll('.pay-tab-btn');
const payMethodContents = document.querySelectorAll('.pay-method-content');

// Payment Tabs Logic
payTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        payTabBtns.forEach(b => b.classList.remove('active'));
        payMethodContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const targetId = btn.getAttribute('data-paytab');
        document.getElementById(targetId).classList.add('active');
        
        // Change button text based on method
        const payBtn = document.getElementById('payNowBtn');
        if(targetId === 'cod') {
            payBtn.innerHTML = '<i class="fas fa-check" style="margin-right: 8px;"></i> Confirm Booking';
        } else {
            payBtn.innerHTML = '<i class="fas fa-lock" style="margin-right: 8px;"></i> Pay Now';
        }
    });
});

// Open Payment Modal
choosePlanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if user is logged in first
        if (!currentUser) {
            alert('Please login or sign up first to purchase a membership.');
            openModal(); // Open login modal
            return;
        }
        
        // Get plan details from button data attributes
        const planName = btn.getAttribute('data-plan');
        const planPrice = btn.getAttribute('data-price');
        
        // Update checkout UI
        checkoutPlanName.innerText = planName + ' Plan';
        checkoutPlanPrice.innerText = '₹' + planPrice + '.00';
        
        // Show modal
        paymentModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Close Payment Modal
function closePaymentModal() {
    paymentModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    if(paymentForm) paymentForm.reset();
    
    // Reset containers
    const formContainer = document.getElementById('paymentFormContainer');
    const successContainer = document.getElementById('paymentSuccessContainer');
    if(formContainer) formContainer.style.display = 'block';
    if(successContainer) successContainer.style.display = 'none';
}

if(paymentClose) paymentClose.addEventListener('click', closePaymentModal);

// View Profile Button in Success Modal
const viewProfileBtn = document.getElementById('viewProfileBtn');
if(viewProfileBtn) {
    viewProfileBtn.addEventListener('click', () => {
        closePaymentModal();
        openProfile();
    });
}

// Handle Payment Submission
if(paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payBtn = document.getElementById('payNowBtn');
        const originalText = payBtn.innerHTML;
        
        // Get active payment method
        const activeTab = document.querySelector('.pay-tab-btn.active');
        const paymentMethod = activeTab ? activeTab.innerText : 'Unknown';
        
        // Simulate processing UI
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        payBtn.style.opacity = '0.8';
        payBtn.disabled = true;
        
        try {
            // Send transaction to backend
            const response = await fetch('http://localhost:3000/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    userEmail: currentUser.email,
                    planName: checkoutPlanName.innerText,
                    amount: checkoutPlanPrice.innerText,
                    paymentMethod: paymentMethod
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success UI
                payBtn.innerHTML = '<i class="fas fa-check-circle"></i> Payment Successful!';
                payBtn.style.backgroundColor = '#28a745';
                payBtn.style.borderColor = '#28a745';
                payBtn.style.opacity = '1';
                
                // Update user profile locally to show active membership
                if(currentUser) {
                    currentUser.membership = checkoutPlanName.innerText;
                    localStorage.setItem('fitcore_currentUser', JSON.stringify(currentUser));
                    
                    // Update profile modal UI
                    const statusSpan = document.querySelector('.profile-details span');
                    if(statusSpan) {
                        statusSpan.innerText = `Active (${currentUser.membership})`;
                    }
                }
                
                setTimeout(() => {
                    // Hide form, show success container
                    document.getElementById('paymentFormContainer').style.display = 'none';
                    document.getElementById('paymentSuccessContainer').style.display = 'block';
                    
                    // Populate success details using the transaction ID from the database
                    document.getElementById('successTxnId').innerText = data.transactionId || Math.floor(Math.random() * 1000000000);
                    document.getElementById('successPlanName').innerText = checkoutPlanName.innerText;
                    document.getElementById('successAmount').innerText = checkoutPlanPrice.innerText;
                    
                    // Reset button for next time
                    payBtn.innerHTML = originalText;
                    payBtn.style.backgroundColor = '';
                    payBtn.style.borderColor = '';
                    payBtn.disabled = false;
                }, 1000);
            } else {
                throw new Error(data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Error:', error);
            payBtn.innerHTML = '<i class="fas fa-times-circle"></i> Error';
            payBtn.style.backgroundColor = '#dc3545';
            
            setTimeout(() => {
                payBtn.innerHTML = originalText;
                payBtn.style.backgroundColor = '';
                payBtn.disabled = false;
                payBtn.style.opacity = '1';
                alert('Could not process payment. Please try again.');
            }, 2000);
        }
    });
}

// ==========================================
// Exercise Modal Logic
// ==========================================
const exerciseData = {
    'Strength Training': [
        { name: 'Barbell Squats', sets: '4 sets x 8-10 reps', icon: 'fa-dumbbell' },
        { name: 'Deadlifts', sets: '4 sets x 6-8 reps', icon: 'fa-dumbbell' },
        { name: 'Bench Press', sets: '4 sets x 8-10 reps', icon: 'fa-dumbbell' },
        { name: 'Overhead Press', sets: '3 sets x 10-12 reps', icon: 'fa-dumbbell' },
        { name: 'Barbell Rows', sets: '3 sets x 10 reps', icon: 'fa-dumbbell' },
        { name: 'Pull-ups', sets: '3 sets x 8-12 reps', icon: 'fa-dumbbell' }
    ],
    'Cardio Fitness': [
        { name: 'Treadmill Sprints', sets: '20 mins (Intervals)', icon: 'fa-running' },
        { name: 'Jump Rope', sets: '5 sets x 1 min', icon: 'fa-running' },
        { name: 'Burpees', sets: '4 sets x 50 reps', icon: 'fa-running' },
        { name: 'Cycling', sets: '30 mins (Steady)', icon: 'fa-biking' },
        { name: 'Rowing Machine', sets: '15 mins (High Intensity)', icon: 'fa-running' },
        { name: 'Stair Climber', sets: '10 mins', icon: 'fa-running' }
    ],
    'Personal Training': [
        { name: 'Custom Assessment', sets: '1 Session', icon: 'fa-clipboard-list' },
        { name: 'Goal Setting', sets: '1 Session', icon: 'fa-bullseye' },
        { name: 'Form Correction', sets: 'Ongoing', icon: 'fa-user-check' },
        { name: 'Nutrition Plan', sets: 'Weekly Updates', icon: 'fa-apple-alt' },
        { name: 'Progress Tracking', sets: 'Bi-weekly', icon: 'fa-chart-line' }
    ],
    'Yoga & Flexibility': [
        { name: 'Sun Salutations', sets: '5 rounds', icon: 'fa-om' },
        { name: 'Downward Dog', sets: 'Hold 1 min', icon: 'fa-om' },
        { name: 'Warrior Poses', sets: 'Hold 45 sec each', icon: 'fa-om' },
        { name: 'Child\'s Pose', sets: 'Hold 2 mins', icon: 'fa-om' },
        { name: 'Pigeon Pose', sets: 'Hold 2 mins', icon: 'fa-om' },
        { name: 'Corpse Pose (Savasana)', sets: '5-10 mins', icon: 'fa-om' }
    ],
    'CrossFit': [
        { name: 'Box Jumps', sets: '4 sets x 15 reps', icon: 'fa-fire-alt' },
        { name: 'Kettlebell Swings', sets: '4 sets x 20 reps', icon: 'fa-fire-alt' },
        { name: 'Wall Balls', sets: '3 sets x 20 reps', icon: 'fa-fire-alt' },
        { name: 'Battle Ropes', sets: '3 sets x 1 min', icon: 'fa-fire-alt' },
        { name: 'Tire Flips', sets: '3 sets x 10 flips', icon: 'fa-fire-alt' },
        { name: 'Sled Pushes', sets: '3 sets x 20 meters', icon: 'fa-fire-alt' }
    ],
    'Recovery': [
        { name: 'Foam Rolling', sets: '15 mins (Full Body)', icon: 'fa-heartbeat' },
        { name: 'Dynamic Stretching', sets: '10 mins', icon: 'fa-heartbeat' },
        { name: 'Massage Gun', sets: '10 mins (Targeted)', icon: 'fa-heartbeat' },
        { name: 'Ice Bath / Cold Plunge', sets: '5-10 mins', icon: 'fa-heartbeat' },
        { name: 'Sauna', sets: '15 mins', icon: 'fa-heartbeat' },
        { name: 'Light Walking', sets: '10 mins', icon: 'fa-heartbeat' }
    ]
};

const exerciseModal = document.getElementById('exerciseModal');
const exerciseClose = document.querySelector('.exercise-close');

function openExerciseModal(programName) {
    const title = document.getElementById('exerciseModalTitle');
    const list = document.getElementById('exerciseList');
    
    title.innerText = programName + ' Exercises';
    
    const exercises = exerciseData[programName] || [];
    
    if (exercises.length > 0) {
        list.innerHTML = exercises.map(ex => `
            <div style="background: var(--bg-dark); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: rgba(229, 9, 20, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color);">
                    <i class="fas ${ex.icon}"></i>
                </div>
                <div>
                    <h4 style="margin-bottom: 5px; font-size: 1rem;">${ex.name}</h4>
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">${ex.sets}</p>
                </div>
            </div>
        `).join('');
    } else {
        list.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No exercises found for this program.</p>';
    }
    
    exerciseModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeExerciseModal() {
    exerciseModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

if(exerciseClose) exerciseClose.addEventListener('click', closeExerciseModal);

// ==========================================
// Diet Modal Logic
// ==========================================
const dietData = {
    'Weight Loss': [
        { meal: 'Breakfast', food: 'Oats with almond milk, chia seeds, and 1 apple.', calories: '300 kcal', icon: 'fa-sun' },
        { meal: 'Lunch', food: 'Grilled chicken breast, quinoa, and steamed broccoli.', calories: '450 kcal', icon: 'fa-utensils' },
        { meal: 'Snack', food: 'Greek yogurt with a handful of berries.', calories: '150 kcal', icon: 'fa-apple-alt' },
        { meal: 'Dinner', food: 'Baked salmon with mixed green salad and olive oil dressing.', calories: '400 kcal', icon: 'fa-moon' }
    ],
    'Muscle Gain': [
        { meal: 'Breakfast', food: '4 scrambled eggs, 2 slices whole-wheat toast, and a banana.', calories: '550 kcal', icon: 'fa-sun' },
        { meal: 'Lunch', food: 'Large portion of brown rice, beef steak, and sweet potatoes.', calories: '700 kcal', icon: 'fa-utensils' },
        { meal: 'Snack', food: 'Whey protein shake with peanut butter and oats.', calories: '400 kcal', icon: 'fa-apple-alt' },
        { meal: 'Dinner', food: 'Chicken pasta with tomato sauce and mixed veggies.', calories: '650 kcal', icon: 'fa-moon' }
    ],
    'Balanced Diet': [
        { meal: 'Breakfast', food: 'Smoothie bowl with spinach, banana, protein powder, and nuts.', calories: '400 kcal', icon: 'fa-sun' },
        { meal: 'Lunch', food: 'Turkey wrap with whole-grain tortilla, avocado, and lettuce.', calories: '500 kcal', icon: 'fa-utensils' },
        { meal: 'Snack', food: 'Handful of mixed nuts and a piece of dark chocolate.', calories: '200 kcal', icon: 'fa-apple-alt' },
        { meal: 'Dinner', food: 'Tofu stir-fry with bell peppers, zucchini, and soy sauce.', calories: '450 kcal', icon: 'fa-moon' }
    ]
};

const dietModal = document.getElementById('dietModal');
const dietClose = document.querySelector('.diet-close');

function openDietModal(planName) {
    const title = document.getElementById('dietModalTitle');
    const list = document.getElementById('dietList');
    
    title.innerText = planName + ' Plan';
    
    const meals = dietData[planName] || [];
    
    if (meals.length > 0) {
        list.innerHTML = meals.map(m => `
            <div style="background: var(--bg-dark); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px;">
                <div style="width: 50px; height: 50px; background: rgba(229, 9, 20, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: 1.2rem;">
                    <i class="fas ${m.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 5px; font-size: 1.1rem; color: var(--text-light);">${m.meal}</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">${m.food}</p>
                </div>
                <div style="text-align: right; color: var(--primary-color); font-weight: bold; font-size: 0.9rem;">
                    ${m.calories}
                </div>
            </div>
        `).join('');
    } else {
        list.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No diet plan found.</p>';
    }
    
    dietModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDietModal() {
    dietModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

if(dietClose) dietClose.addEventListener('click', closeDietModal);

// ==========================================
// BMI Calculator Logic
// ==========================================
const calculateBmiBtn = document.getElementById('calculateBmiBtn');
if (calculateBmiBtn) {
    calculateBmiBtn.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('bmiWeight').value);
        const heightCm = parseFloat(document.getElementById('bmiHeight').value);
        
        if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
            alert('Please enter valid weight and height.');
            return;
        }
        
        const heightM = heightCm / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(1);
        
        const bmiValue = document.getElementById('bmiValue');
        const bmiStatus = document.getElementById('bmiStatus');
        const bmiMessage = document.getElementById('bmiMessage');
        
        bmiValue.innerText = bmi;
        
        if (bmi < 18.5) {
            bmiStatus.innerText = 'Underweight';
            bmiStatus.style.color = '#ffc107'; // Warning yellow
            bmiMessage.innerText = 'You are underweight. Consider a calorie surplus diet to gain healthy weight.';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            bmiStatus.innerText = 'Normal Weight';
            bmiStatus.style.color = '#28a745'; // Success green
            bmiMessage.innerText = 'Great job! You have a healthy body weight. Keep up the good work with a balanced diet.';
        } else if (bmi >= 25 && bmi <= 29.9) {
            bmiStatus.innerText = 'Overweight';
            bmiStatus.style.color = '#fd7e14'; // Orange
            bmiMessage.innerText = 'You are slightly overweight. A calorie deficit diet and regular cardio can help.';
        } else {
            bmiStatus.innerText = 'Obese';
            bmiStatus.style.color = '#dc3545'; // Danger red
            bmiMessage.innerText = 'You are in the obese category. It is highly recommended to consult a trainer and start a strict fitness program.';
        }
    });
}

// ==========================================
// Scroll Animations (Intersection Observer)
// ==========================================
const fadeSections = document.querySelectorAll('.fade-in-section');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('is-visible');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

fadeSections.forEach(section => {
    appearOnScroll.observe(section);
});